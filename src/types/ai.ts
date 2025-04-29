export type AIProvider = 'openai' | 'anthropic' | 'google';

export interface PromptOption {
  label: string;
  value: string;
  description?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  customizable: boolean;
  isSystemTemplate: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  category?: string;
  options?: PromptOption[];
  defaultOptions?: PromptOption[];
}

export interface CustomPromptOptions {
  template?: string;
  variables?: Record<string, string>;
}

export interface SummarizationOptions {
  provider: string;
  format?: string;
  maxLength?: number;
  language?: string;
  temperature?: number;
  apiKey?: string;
  template?: string;
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