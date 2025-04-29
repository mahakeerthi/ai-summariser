import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSummaryStorage } from '../../../hooks/useSummaryStorage';
import { StoredSummary } from '../../../services/storage/indexedDB';
import MarkdownRenderer from '../../common/MarkdownRenderer';
import DashboardLayout from '../../layout/DashboardLayout';

const SummaryCard: React.FC<{
  summary: StoredSummary;
  onDelete: (id: string) => Promise<void>;
}> = ({ summary, onDelete }) => {
  const navigate = useNavigate();
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

  const handleViewSummary = () => {
    navigate(`/dashboard/summaries/${summary.id}`);
  };

  // Get first 150 characters of content for preview
  const contentPreview = summary.content.slice(0, 150) + (summary.content.length > 150 ? '...' : '');

  // Format date in a more readable way
  const formattedDate = new Date(summary.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Get file extension
  const fileExtension = summary.metadata?.fileName 
    ? summary.metadata.fileName.split('.').pop()?.toUpperCase() || 'PDF'
    : 'PDF';

  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden relative cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewSummary}
    >
      {/* Document type indicator */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500 font-medium">
          {fileExtension}
        </span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {/* Delete button */}
      <button
        className={`absolute top-2 right-2 p-2 rounded-full bg-red-100 text-red-600 
          transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'} z-10`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-snug mb-3">{summary.title}</h3>

        {/* Content preview */}
        <div className="prose prose-xs line-clamp-3 mb-3 text-gray-600 max-w-none">
          <MarkdownRenderer content={contentPreview} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {summary.metadata?.provider && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                {summary.metadata.provider}
              </span>
            )}
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {summary.format}
            </span>
          </div>
          
          <button 
            className="text-gray-800 hover:text-black text-xs font-medium flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSummary();
            }}
          >
            Read more
            <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const Summaries: React.FC = () => {
  const navigate = useNavigate();
  const { summaries, isLoading, error, deleteSummary } = useSummaryStorage();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
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
          <h1 className="text-lg font-medium text-gray-900">
            Generated Summaries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your AI-generated document summaries
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {summaries.map((summary) => (
              <SummaryCard
                key={summary.id}
                summary={summary}
                onDelete={deleteSummary}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

Summaries.displayName = 'Summaries';

export default Summaries; 