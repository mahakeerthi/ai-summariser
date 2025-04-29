import { APIKeyValidationResult } from '../types/api';

export const validateOpenAIKey = async (apiKey: string): Promise<APIKeyValidationResult> => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        isValid: false,
        error: 'Invalid OpenAI API key',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate OpenAI API key',
    };
  }
};

export const validateAnthropicKey = async (apiKey: string): Promise<APIKeyValidationResult> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test' }],
        model: 'claude-3-opus-20240229',
        max_tokens: 1,
      }),
    });

    if (!response.ok) {
      return {
        isValid: false,
        error: 'Invalid Anthropic API key',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate Anthropic API key',
    };
  }
};

export const validateGeminiKey = async (apiKey: string): Promise<APIKeyValidationResult> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);

    if (!response.ok) {
      return {
        isValid: false,
        error: 'Invalid Google Gemini API key',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate Google Gemini API key',
    };
  }
}; 