import React, { useState } from 'react';
import { useAPIKeys } from '../../../hooks/useAPIKeys';
import APIKeyManager from '../../common/APIKeyManager';

interface SummaryGeneratorProps {
  text: string;
  onSummaryGenerated: (summary: string) => void;
}

const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ text, onSummaryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    apiKeys,
    isAPIKeyManagerOpen,
    openAPIKeyManager,
    closeAPIKeyManager,
    handleSaveAPIKeys,
    hasValidAPIKey,
  } = useAPIKeys();

  const handleGenerateSummary = async () => {
    // Check if we have a valid API key for the selected provider
    if (!hasValidAPIKey('openai')) {
      openAPIKeyManager();
      return;
    }

    setIsGenerating(true);
    try {
      // Your API call logic here using the apiKeys.openai
      // const summary = await generateSummary(text, apiKeys.openai);
      // onSummaryGenerated(summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerateSummary}
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate Summary'}
      </button>

      <APIKeyManager
        isOpen={isAPIKeyManagerOpen}
        onClose={closeAPIKeyManager}
        onSave={handleSaveAPIKeys}
      />
    </div>
  );
};

SummaryGenerator.displayName = 'SummaryGenerator';

export default SummaryGenerator; 