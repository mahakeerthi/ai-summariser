import React from 'react';
import { StoredSummary } from '../../../services/storage/indexedDB';
import MarkdownRenderer from '../../common/MarkdownRenderer';

interface SummaryDetailProps {
  summary: StoredSummary;
  onClose: () => void;
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ summary, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">{summary.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span>{new Date(summary.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="px-2 py-1 bg-gray-100 rounded">{summary.format}</span>
            {summary.metadata?.provider && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {summary.metadata.provider}
                </span>
              </>
            )}
            {summary.metadata?.tokensUsed && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {summary.metadata.tokensUsed} tokens
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            <MarkdownRenderer content={summary.content} />
          </div>
        </div>
      </div>
    </div>
  );
};

SummaryDetail.displayName = 'SummaryDetail';

export default SummaryDetail; 