import { useState, useCallback } from 'react';
import { APIKeyConfig } from '../types/api';

interface UseAPIKeysReturn {
  apiKeys: APIKeyConfig;
  isAPIKeyManagerOpen: boolean;
  openAPIKeyManager: () => void;
  closeAPIKeyManager: () => void;
  handleSaveAPIKeys: (keys: APIKeyConfig) => void;
  hasValidAPIKey: (provider: keyof APIKeyConfig) => boolean;
}

export const useAPIKeys = (): UseAPIKeysReturn => {
  const [isAPIKeyManagerOpen, setIsAPIKeyManagerOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<APIKeyConfig>({
    openai: localStorage.getItem('openai_api_key') || '',
    anthropic: localStorage.getItem('anthropic_api_key') || '',
    gemini: localStorage.getItem('gemini_api_key') || '',
  });

  const openAPIKeyManager = useCallback(() => {
    setIsAPIKeyManagerOpen(true);
  }, []);

  const closeAPIKeyManager = useCallback(() => {
    setIsAPIKeyManagerOpen(false);
  }, []);

  const handleSaveAPIKeys = useCallback((keys: APIKeyConfig) => {
    setApiKeys(keys);
    Object.entries(keys).forEach(([provider, key]) => {
      if (key) {
        localStorage.setItem(`${provider}_api_key`, key);
      }
    });
  }, []);

  const hasValidAPIKey = useCallback((provider: keyof APIKeyConfig) => {
    return Boolean(apiKeys[provider]);
  }, [apiKeys]);

  return {
    apiKeys,
    isAPIKeyManagerOpen,
    openAPIKeyManager,
    closeAPIKeyManager,
    handleSaveAPIKeys,
    hasValidAPIKey,
  };
}; 