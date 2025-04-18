import { useState, useCallback } from 'react';
import { PDFProcessor } from '../services/pdfProcessor';
import { ExtractedContent, PDFMetadata } from '../types/pdf';

interface FileUploadState {
  file: File | null;
  error: string | null;
  progress: number;
  isDragging: boolean;
  isProcessing: boolean;
  extractedContent: ExtractedContent | null;
  metadata: PDFMetadata | null;
  chunks: string[] | null;
}

export const useFileUpload = () => {
  const [state, setState] = useState<FileUploadState>({
    file: null,
    error: null,
    progress: 0,
    isDragging: false,
    isProcessing: false,
    extractedContent: null,
    metadata: null,
    chunks: null,
  });

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.includes('pdf')) {
      return 'Only PDF files are allowed';
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const processFile = async (file: File) => {
    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      const result = await PDFProcessor.processPDF(file);
      console.log("pdf processing result",result);
      setState(prev => ({
        ...prev,
        extractedContent: result.extractedContent,
        metadata: result.metadata,
        chunks: result.chunks,
        isProcessing: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error processing PDF file. Please try again.',
        isProcessing: false,
      }));
      console.error('PDF processing error:', error);
    }
  };

  const handleFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setState(prev => ({ ...prev, error, file: null }));
      return;
    }

    setState(prev => ({ ...prev, file, error: null }));

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setState(prev => ({ ...prev, progress }));
      if (progress >= 100) {
        clearInterval(interval);
        // Process the file after upload is complete
        processFile(file);
      }
    }, 500);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setState({
      file: null,
      error: null,
      progress: 0,
      isDragging: false,
      isProcessing: false,
      extractedContent: null,
      metadata: null,
      chunks: null,
    });
  }, []);

  return {
    ...state,
    handleFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearFile,
  };
}; 