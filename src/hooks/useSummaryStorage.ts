import { useState, useEffect, useCallback } from 'react';
import { summaryStorage, StoredSummary } from '../services/storage/indexedDB';

interface UseSummaryStorageReturn {
  summaries: StoredSummary[];
  isLoading: boolean;
  error: Error | null;
  addSummary: (summary: Omit<StoredSummary, 'id' | 'createdAt'>) => Promise<void>;
  deleteSummary: (id: string) => Promise<void>;
  refreshSummaries: () => Promise<void>;
}

export const useSummaryStorage = (): UseSummaryStorageReturn => {
  const [summaries, setSummaries] = useState<StoredSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshSummaries = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedSummaries = await summaryStorage.getAllSummaries();
      setSummaries(fetchedSummaries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch summaries'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSummary = useCallback(async (summary: Omit<StoredSummary, 'id' | 'createdAt'>) => {
    try {
      await summaryStorage.addSummary(summary);
      await refreshSummaries();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add summary'));
      throw err;
    }
  }, [refreshSummaries]);

  const deleteSummary = useCallback(async (id: string) => {
    try {
      await summaryStorage.deleteSummary(id);
      await refreshSummaries();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete summary'));
      throw err;
    }
  }, [refreshSummaries]);

  useEffect(() => {
    refreshSummaries();
  }, [refreshSummaries]);

  return {
    summaries,
    isLoading,
    error,
    addSummary,
    deleteSummary,
    refreshSummaries,
  };
}; 