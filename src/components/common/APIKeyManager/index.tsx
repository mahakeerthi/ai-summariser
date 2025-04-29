import React, { useState, useCallback } from 'react';
import { APIKeyConfig, APIKeyManagerProps } from '../../../types/api';
import { validateOpenAIKey, validateAnthropicKey, validateGeminiKey } from '../../../utils/apiKeyValidation';

interface APIKeyInfo {
  label: string;
  getKeyLink: string;
  placeholder: string;
}

const API_KEY_INFO: Record<keyof APIKeyConfig, APIKeyInfo> = {
  openai: {
    label: 'OpenAI API Key',
    getKeyLink: 'https://platform.openai.com/account/api-keys',
    placeholder: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
  },
  anthropic: {
    label: 'Anthropic API Key',
    getKeyLink: 'https://console.anthropic.com/account/keys',
    placeholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx',
  },
  gemini: {
    label: 'Google Gemini API Key',
    getKeyLink: 'https://makersuite.google.com/app/apikey',
    placeholder: 'AIxxxxxxxxxxxxxxxxxxxxxxxx',
  },
};

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKeys, setApiKeys] = useState<APIKeyConfig>({
    openai: localStorage.getItem('openai_api_key') || '',
    anthropic: localStorage.getItem('anthropic_api_key') || '',
    gemini: localStorage.getItem('gemini_api_key') || '',
  });

  const [validationStatus, setValidationStatus] = useState({
    openai: { isValid: false, error: '' },
    anthropic: { isValid: false, error: '' },
    gemini: { isValid: false, error: '' },
  });

  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (provider: keyof APIKeyConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeys(prev => ({ ...prev, [provider]: e.target.value }));
    setValidationStatus(prev => ({
      ...prev,
      [provider]: { isValid: false, error: '' },
    }));
  };

  const validateKey = useCallback(async (provider: keyof APIKeyConfig) => {
    setIsValidating(true);
    const key = apiKeys[provider];
    let result;

    switch (provider) {
      case 'openai':
        result = await validateOpenAIKey(key as string);
        break;
      case 'anthropic':
        result = await validateAnthropicKey(key as string);
        break;
      case 'gemini':
        result = await validateGeminiKey(key as string);
        break;
    }

    setValidationStatus(prev => ({
      ...prev,
      [provider]: result,
    }));
    setIsValidating(false);

    if (result.isValid) {
      localStorage.setItem(`${provider}_api_key`, key as string);
    }

    return result.isValid;
  }, [apiKeys]);

  const handleSave = () => {
    // Only save keys that have been validated successfully
    const validatedKeys = Object.entries(validationStatus).reduce((acc, [provider, status]) => {
      if (status.isValid) {
        acc[provider as keyof APIKeyConfig] = apiKeys[provider as keyof APIKeyConfig];
      }
      return acc;
    }, {} as Partial<APIKeyConfig>);

    onSave(validatedKeys as APIKeyConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Manage your API keys
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your API keys are stored locally in your browser and are never sent anywhere else.
          You only need to provide keys for the AI services you want to use.
        </p>

        {Object.entries(API_KEY_INFO).map(([provider, info]) => (
          <div key={provider} className="mb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {info.label}
                </label>
                <a
                  href={info.getKeyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                >
                  (Get API key here)
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeys[provider as keyof APIKeyConfig]}
                  onChange={handleInputChange(provider as keyof APIKeyConfig)}
                  className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={info.placeholder}
                />
                <button
                  onClick={() => validateKey(provider as keyof APIKeyConfig)}
                  disabled={isValidating || !apiKeys[provider as keyof APIKeyConfig]}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Validate
                </button>
              </div>
              {validationStatus[provider as keyof APIKeyConfig].error && (
                <p className="mt-1 text-sm text-red-600">
                  {validationStatus[provider as keyof APIKeyConfig].error}
                </p>
              )}
              {validationStatus[provider as keyof APIKeyConfig].isValid && (
                <p className="mt-1 text-sm text-green-600">API key is valid!</p>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isValidating}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

APIKeyManager.displayName = 'APIKeyManager';

export default APIKeyManager; 