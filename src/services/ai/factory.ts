import { AIProvider, AIService } from '../../types/ai';
import { OpenAIService } from './openai';

export class AIServiceFactory {
  private static instance: AIServiceFactory;
  private services: Map<AIProvider, AIService>;

  private constructor() {
    this.services = new Map();
    this.registerServices();
  }

  public static getInstance(): AIServiceFactory {
    if (!AIServiceFactory.instance) {
      AIServiceFactory.instance = new AIServiceFactory();
    }
    return AIServiceFactory.instance;
  }

  private registerServices() {
    // Register OpenAI service
    const openaiService = OpenAIService.getInstance();
    if (openaiService.isAvailable()) {
      this.services.set('openai', openaiService);
    }

    // Register other AI services here
    // Example:
    // const anthropicService = AnthropicService.getInstance();
    // if (anthropicService.isAvailable()) {
    //   this.services.set('anthropic', anthropicService);
    // }
  }

  public getService(provider: AIProvider): AIService {
    const service = this.services.get(provider);
    if (!service) {
      throw new Error(`AI service provider '${provider}' is not available`);
    }
    return service;
  }

  public getAvailableProviders(): AIProvider[] {
    return Array.from(this.services.keys());
  }

  public isProviderAvailable(provider: AIProvider): boolean {
    return this.services.has(provider);
  }
} 