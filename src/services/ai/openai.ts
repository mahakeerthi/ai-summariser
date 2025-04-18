import OpenAI from 'openai';
import { marked } from 'marked';
import { AIService, SummarizationOptions, SummarizationResult } from '../../types/ai';
import { config } from '../../config/env';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { PROMPT_TEMPLATES } from './promptTemplates';

export class OpenAIService implements AIService {
  private client: OpenAI;
  private static instance: OpenAIService;

  private constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
      dangerouslyAllowBrowser: true // Enable browser usage - Note: This is not recommended for production
    });

    // Configure marked options
    marked.setOptions({
      headerIds: false,
      mangle: false,
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public isAvailable(): boolean {
    return !!config.openai.apiKey;
  }

  public getProvider() {
    return 'openai' as const;
  }

  private cleanMarkdownText(text: string): string {
    // First convert markdown to HTML
    const html = marked(text);
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get text content (this removes HTML tags)
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Additional cleanup
    cleanText = cleanText
      // Remove multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Trim whitespace
      .trim();
    
    return cleanText;
  }

  public async summarize(chunks: string[], options: SummarizationOptions): Promise<SummarizationResult> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key is not configured');
    }

    const formatInstruction = this.getFormatInstruction(options.format, options.promptTemplate);
    const languageInstruction = options.language ? `Provide the summary in ${options.language}.` : '';
    const lengthInstruction = options.maxLength ? `Keep the summary under ${options.maxLength} words.` : '';

    // Process chunks sequentially to maintain context
    let fullSummary = '';
    let totalTokens = 0;

    for (let i = 0; i < chunks.length; i++) {
      const isFirstChunk = i === 0;
      const isLastChunk = i === chunks.length - 1;
      const chunk = chunks[i];

      const systemPrompt = `You are an expert at summarizing documents. ${formatInstruction} ${languageInstruction} ${lengthInstruction} Use markdown formatting for better readability, including headers, lists, and emphasis where appropriate.`;
      
      const userPrompt = isFirstChunk
        ? `Summarize the following text:\n\n${chunk}`
        : `Continue summarizing with this additional context:\n\n${chunk}`;

      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ];

      if (!isFirstChunk) {
        messages.push({
          role: 'assistant',
          content: `Previous summary so far:\n${fullSummary}`,
        });
      }

      const completion = await this.client.chat.completions.create({
        model: config.openai.model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: config.openai.maxTokens,
      });

      const chunkSummary = completion.choices[0]?.message?.content || '';
      totalTokens += completion.usage?.total_tokens || 0;

      if (isFirstChunk) {
        fullSummary = chunkSummary;
      } else if (isLastChunk) {
        // For the last chunk, ask for a final coherent summary
        const finalMessages: ChatCompletionMessageParam[] = [
          { role: 'system', content: `${systemPrompt} Provide a final coherent summary.` },
          { role: 'user', content: `Based on all the previous summaries and this final part, provide a coherent final summary:\n\nPrevious summaries:\n${fullSummary}\n\nFinal part summary:\n${chunkSummary}` },
        ];

        const finalCompletion = await this.client.chat.completions.create({
          model: config.openai.model,
          messages: finalMessages,
          temperature: options.temperature ?? 0.3,
          max_tokens: config.openai.maxTokens,
        });

        fullSummary = finalCompletion.choices[0]?.message?.content || '';
        totalTokens += finalCompletion.usage?.total_tokens || 0;
      } else {
        fullSummary = chunkSummary;
      }
    }

    return {
      summary: fullSummary, // Return the raw markdown
      provider: this.getProvider(),
      model: config.openai.model,
      tokensUsed: totalTokens,
    };
  }

  private getFormatInstruction(format?: string, customOptions?: SummarizationOptions['promptTemplate']): string {
    // If custom template is provided, use it
    if (customOptions?.template) {
      let template = customOptions.template;
      
      // Replace variables in the template if provided
      if (customOptions.variables) {
        Object.entries(customOptions.variables).forEach(([key, value]) => {
          template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
      }
      
      return template;
    }

    // Use predefined templates
    const templateKey = format || 'paragraph';
    const template = PROMPT_TEMPLATES[templateKey];
    
    if (!template) {
      console.warn(`Template '${templateKey}' not found, falling back to paragraph format`);
      return PROMPT_TEMPLATES.paragraph.template;
    }

    return template.template;
  }
} 