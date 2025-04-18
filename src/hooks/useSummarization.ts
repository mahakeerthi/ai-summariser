import { useState, useCallback } from 'react';
import { AIProvider, SummarizationOptions, SummarizationResult } from '../types/ai';
import { AIServiceFactory } from '../services/ai/factory';

interface SummarizationState {
  isLoading: boolean;
  error: string | null;
  result: SummarizationResult | null;
}

interface SummarizationHook {
  summarize: (chunks: string[], options: Partial<SummarizationOptions>) => Promise<SummarizationResult>;
  availableProviders: AIProvider[];
  state: SummarizationState;
  reset: () => void;
}

export const useSummarization = (): SummarizationHook => {
  const [state, setState] = useState<SummarizationState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const factory = AIServiceFactory.getInstance();
  const availableProviders = factory.getAvailableProviders();

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
    });
  }, []);

  const summarize = useCallback(async (
    chunks: string[],
    options: Partial<SummarizationOptions>
  ): Promise<SummarizationResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, result: null }));

      // Use OpenAI as default provider if not specified
      const provider = options.provider || 'openai';
      
      if (!factory.isProviderAvailable(provider)) {
        throw new Error(`AI provider '${provider}' is not available`);
      }

      const service = factory.getService(provider);
      const result = await service.summarize(chunks, {
        provider,
        format: options.format || 'paragraph',
        maxLength: options.maxLength,
        language: options.language,
        temperature: options.temperature,
      });

      // Update state with the result
      setState(prev => ({
        ...prev,
        isLoading: false,
        result,
      }));

      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during summarization',
        result: null,
      }));
      throw error;
    }
  }, []);

  return {
    summarize,
    availableProviders,
    state,
    reset,
  };
}; 