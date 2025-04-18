import * as pdfjs from 'pdfjs-dist';
import { TextItem, PageContent } from '../types/pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ExtractedContent {
  text: string[];
  images: string[];
  tables: string[][];
  charts: string[];
}

interface ProcessedPDF {
  chunks: string[];
  metadata: {
    totalPages: number;
    title?: string;
    author?: string;
    creationDate?: string;
  };
  extractedContent: ExtractedContent;
}

export class PDFProcessor {
  private static readonly CHUNK_SIZE = 5000; // Adjust based on your LLM's context window
  private static readonly CHUNK_OVERLAP = 200; // Overlap between chunks to maintain context

  /**
   * Process a PDF file and extract its content
   */
  public static async processPDF(file: File): Promise<ProcessedPDF> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const metadata = await pdf.getMetadata();
    const numPages = pdf.numPages;
    const extractedContent: ExtractedContent = {
      text: [],
      images: [],
      tables: [],
      charts: [],
    };

    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await this.extractPageContent(page);
      
      // Extract text content
      extractedContent.text.push(content.text);
      
      // Extract images
      const images = await this.extractImages(page);
      extractedContent.images.push(...images);
      
      // Extract tables (using text pattern recognition)
      const tables = this.detectTables(content.text);
      if (tables.length > 0) {
        extractedContent.tables.push(...tables);
      }
      
      // Detect potential charts (based on SVG or canvas elements)
      const charts = this.detectCharts(content.text);
      if (charts.length > 0) {
        extractedContent.charts.push(...charts);
      }
    }

    // Create chunks from the extracted text
    const chunks = this.createChunks(extractedContent.text.join(' '));

    return {
      chunks,
      metadata: {
        totalPages: numPages,
        title: metadata.info?.Title,
        author: metadata.info?.Author,
        creationDate: metadata.info?.CreationDate,
      },
      extractedContent,
    };
  }

  /**
   * Extract content from a single page
   */
  private static async extractPageContent(page: any): Promise<PageContent> {
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item: TextItem) => item.str)
      .join(' ');

    return {
      text,
      pageNumber: page.pageNumber,
    };
  }

  /**
   * Extract images from a page
   */
  private static async extractImages(page: any): Promise<string[]> {
    const operatorList = await page.getOperatorList();
    const images: string[] = [];

    for (const op of operatorList.fnArray) {
      if (op === pdfjs.OPS.paintImageXObject) {
        const imageData = await this.getImageData(page, op);
        if (imageData) {
          images.push(imageData);
        }
      }
    }

    return images;
  }

  /**
   * Get image data from a page operation
   */
  private static async getImageData(page: any, op: any): Promise<string> {
    // Implementation depends on PDF.js capabilities
    // This is a simplified version
    return ''; // Placeholder for actual image data
  }

  /**
   * Detect tables in text content using pattern recognition
   */
  private static detectTables(text: string): string[][] {
    const tables: string[][] = [];
    // Implement table detection logic
    // Look for patterns like:
    // - Regular spacing
    // - Column headers
    // - Grid-like structure
    return tables;
  }

  /**
   * Detect charts in text/vector content
   */
  private static detectCharts(text: string): string[] {
    const charts: string[] = [];
    // Implement chart detection logic
    // Look for:
    // - SVG elements
    // - Canvas elements
    // - Chart-like text patterns
    return charts;
  }

  /**
   * Create overlapping chunks from text content
   */
  private static createChunks(text: string): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length > this.CHUNK_SIZE) {
        // Save current chunk
        chunks.push(currentChunk.join(' '));
        
        // Start new chunk with overlap
        const overlapStart = Math.max(0, currentChunk.length - this.CHUNK_OVERLAP);
        currentChunk = currentChunk.slice(overlapStart);
        currentLength = currentChunk.join(' ').length;
      }
      
      currentChunk.push(word);
      currentLength += word.length + 1; // +1 for space
    }

    // Add the last chunk if not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  }
} 