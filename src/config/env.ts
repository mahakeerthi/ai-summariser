export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '4000', 10),
  },
  // Add other AI providers here
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-opus-20240229',
  },
  // Add more providers as needed
} as const;

// Validate required environment variables
const validateEnvVariables = () => {
  const required = ['VITE_OPENAI_API_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateEnvVariables(); 