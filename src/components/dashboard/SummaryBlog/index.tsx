import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoredSummary } from '../../../services/storage/indexedDB';
import { useSummaryStorage } from '../../../hooks/useSummaryStorage';
import MarkdownRenderer from '../../common/MarkdownRenderer';
import DashboardLayout from '../../layout/DashboardLayout';

const SummaryBlog: React.FC = () => {
  const { summaryId } = useParams<{ summaryId: string }>();
  const navigate = useNavigate();
  const { getSummary } = useSummaryStorage();
  const [summary, setSummary] = useState<StoredSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        if (!summaryId) {
          throw new Error('Summary ID is required');
        }
        
        const summaryData = await getSummary(summaryId);
        if (!summaryData) {
          throw new Error('Summary not found');
        }
        
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch summary'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [summaryId, getSummary]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !summary) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error?.message || 'Summary not found'}</span>
            <div className="flex justify-center mt-4">
              <button
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded"
                onClick={() => navigate('/dashboard/summaries')}
              >
                Back to Summaries
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <article className="bg-white shadow rounded-lg overflow-hidden">
          {/* Blog Header */}
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={() => navigate('/dashboard/summaries')}
              className="text-gray-800 hover:text-black flex items-center mb-4"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Summaries
            </button>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">{summary.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
              <span>{new Date(summary.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="px-2 py-1 bg-gray-100 rounded">
                {summary.format}
              </span>
              
              {summary.metadata?.provider && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {summary.metadata.provider}
                  </span>
                </>
              )}
            </div>
            
            {summary.metadata?.fileName && (
              <div className="text-sm text-gray-500">
                Source: {summary.metadata.fileName}
                {summary.metadata.pageCount && ` (${summary.metadata.pageCount} pages)`}
              </div>
            )}
          </div>
          
          {/* Blog Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <MarkdownRenderer content={summary.content} />
            </div>
            
            {/* Full Report Button (placeholder for future functionality) */}
            <div className="mt-8 border-t border-gray-200 pt-6 flex justify-center">
              <button 
                className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={true}
                title="Full report viewing will be available in a future update"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Full Report
                <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded">Coming Soon</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </DashboardLayout>
  );
};

SummaryBlog.displayName = 'SummaryBlog';

export default SummaryBlog; 