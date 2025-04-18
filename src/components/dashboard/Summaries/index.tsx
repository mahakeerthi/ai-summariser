import React, { useState } from 'react';
import { useSummaryStorage } from '../../../hooks/useSummaryStorage';
import { StoredSummary } from '../../../services/storage/indexedDB';
import MarkdownRenderer from '../../common/MarkdownRenderer';
import DashboardLayout from '../../layout/DashboardLayout';
import SummaryDetail from '../SummaryDetail';

const SummaryCard: React.FC<{
  summary: StoredSummary;
  onDelete: (id: string) => Promise<void>;
  onClick: () => void;
}> = ({ summary, onDelete, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsDeleting(true);
      await onDelete(summary.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get first 150 characters of content for preview
  const contentPreview = summary.content.slice(0, 150) + (summary.content.length > 150 ? '...' : '');

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer transform transition-transform duration-200 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Delete button */}
      <button
        className={`absolute top-2 right-2 p-2 rounded-full bg-red-100 text-red-600 
          transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{summary.title}</h3>
          <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
            {new Date(summary.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="prose line-clamp-3 mb-4 text-gray-600">
          <MarkdownRenderer content={contentPreview} />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">
            {summary.format}
          </span>
          {summary.metadata?.provider && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              {summary.metadata.provider}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Summaries: React.FC = () => {
  const { summaries, isLoading, error, deleteSummary } = useSummaryStorage();
  const [selectedSummary, setSelectedSummary] = useState<StoredSummary | null>(null);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Generated Summaries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your generated summaries
          </p>
        </div>

        {summaries.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No summaries</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload a document to generate your first summary
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.map((summary) => (
              <SummaryCard
                key={summary.id}
                summary={summary}
                onDelete={deleteSummary}
                onClick={() => setSelectedSummary(summary)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedSummary && (
        <SummaryDetail
          summary={selectedSummary}
          onClose={() => setSelectedSummary(null)}
        />
      )}
    </DashboardLayout>
  );
};

Summaries.displayName = 'Summaries';

export default Summaries; 