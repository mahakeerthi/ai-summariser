export interface APIKeyConfig {
  openai: string;
  anthropic?: string;
  gemini?: string;
}

export interface APIKeyValidationResult {
  isValid: boolean;
  error?: string;
}

export interface APIKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: APIKeyConfig) => void;
} 