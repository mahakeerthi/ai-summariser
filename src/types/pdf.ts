export interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}

export interface PageContent {
  text: string;
  pageNumber: number;
}

export interface PDFMetadata {
  totalPages: number;
  title?: string;
  author?: string;
  creationDate?: string;
}

export interface ExtractedContent {
  text: string[];
  images: string[];
  tables: string[][];
  charts: string[];
} 