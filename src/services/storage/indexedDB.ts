import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SummaryDBSchema extends DBSchema {
  summaries: {
    key: string;
    value: StoredSummary;
    indexes: { 'by-date': Date };
  };
}

export interface StoredSummary {
  id: string;
  title: string;
  content: string;
  format: string;
  createdAt: Date;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    pageCount?: number;
    provider?: string;
    model?: string;
    tokensUsed?: number;
  };
}

class SummaryStorageService {
  private db: IDBPDatabase<SummaryDBSchema> | null = null;
  private static instance: SummaryStorageService;

  private constructor() {}

  public static getInstance(): SummaryStorageService {
    if (!SummaryStorageService.instance) {
      SummaryStorageService.instance = new SummaryStorageService();
    }
    return SummaryStorageService.instance;
  }

  private async getDB() {
    if (!this.db) {
      try {
        this.db = await openDB<SummaryDBSchema>('ai-summarizer', 1, {
          upgrade(db) {
            // Check if store exists before creating
            if (!db.objectStoreNames.contains('summaries')) {
              const store = db.createObjectStore('summaries', {
                keyPath: 'id',
              });
              store.createIndex('by-date', 'createdAt');
            }
          },
        });
        console.log('IndexedDB connection established successfully');
      } catch (error) {
        console.error('Failed to open IndexedDB:', error);
        throw new Error('Failed to initialize database');
      }
    }
    return this.db;
  }

  async addSummary(summary: Omit<StoredSummary, 'id' | 'createdAt'>): Promise<StoredSummary> {
    try {
      const db = await this.getDB();
      const id = crypto.randomUUID();
      const createdAt = new Date();
      
      const storedSummary: StoredSummary = {
        ...summary,
        id,
        createdAt,
      };

      console.log('Attempting to store summary:', storedSummary);
      
      await db.add('summaries', storedSummary);
      console.log('Summary stored successfully');
      
      // Verify storage
      const stored = await this.getSummary(id);
      if (!stored) {
        throw new Error('Summary was not stored properly');
      }
      
      return storedSummary;
    } catch (error) {
      console.error('Failed to add summary:', error);
      throw error;
    }
  }

  async getAllSummaries(): Promise<StoredSummary[]> {
    try {
      const db = await this.getDB();
      const summaries = await db.getAllFromIndex('summaries', 'by-date');
      console.log('Retrieved summaries:', summaries);
      return summaries;
    } catch (error) {
      console.error('Failed to get summaries:', error);
      throw error;
    }
  }

  async deleteSummary(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await db.delete('summaries', id);
      console.log('Summary deleted successfully:', id);
    } catch (error) {
      console.error('Failed to delete summary:', error);
      throw error;
    }
  }

  async getSummary(id: string): Promise<StoredSummary | undefined> {
    try {
      const db = await this.getDB();
      const summary = await db.get('summaries', id);
      console.log('Retrieved summary:', summary);
      return summary;
    } catch (error) {
      console.error('Failed to get summary:', error);
      throw error;
    }
  }
}

export const summaryStorage = SummaryStorageService.getInstance(); 