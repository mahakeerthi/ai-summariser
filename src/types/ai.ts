export type AIProvider = 'openai' | 'anthropic' | 'google';

export interface PromptTemplate {
  name: string;
  description: string;
  template: string;
  customizable?: boolean;
}

export interface CustomPromptOptions {
  template?: string;
  variables?: Record<string, string>;
}

export interface SummarizationOptions {
  provider: AIProvider;
  maxLength?: number;
  format?: 'financial' | 'academic' | 'technical' | 'paragraph';
  language?: string;
  temperature?: number;
  promptTemplate?: CustomPromptOptions;
}

export interface SummarizationResult {
  summary: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
}

export interface AIServiceError {
  message: string;
  code: string;
  provider: AIProvider;
}

export interface AIService {
  summarize(chunks: string[], options: SummarizationOptions): Promise<SummarizationResult>;
  isAvailable(): boolean;
  getProvider(): AIProvider;
} 