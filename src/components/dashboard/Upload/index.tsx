import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { useSummarization } from '../../../hooks/useSummarization';
import { useSummaryStorage } from '../../../hooks/useSummaryStorage';
import { SummarizationOptions } from '../../../types/ai';
import { PROMPT_TEMPLATES } from '../../../services/ai/promptTemplates';
import MarkdownRenderer from '../../common/MarkdownRenderer';

type FormatType = NonNullable<SummarizationOptions['format']>;

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addSummary } = useSummaryStorage();
  
  // Get the first available template key for default
  const defaultFormat = Object.keys(PROMPT_TEMPLATES)[0] as FormatType;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    file,
    error: uploadError,
    progress,
    isDragging,
    isProcessing,
    extractedContent,
    metadata,
    chunks,
    handleFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearFile,
  } = useFileUpload();

  const {
    summarize,
    availableProviders,
    state: { isLoading, error: summaryError, result },
    reset: resetSummary,
  } = useSummarization();

  // Add error state for summary storage
  const [storageError, setStorageError] = useState<string | null>(null);

  // Type guard for format validation
  const isValidFormat = (format: string): format is FormatType => {
    return format in PROMPT_TEMPLATES;
  };

  // Get the stored format from localStorage or use default
  const getStoredFormat = (): FormatType => {
    const storedFormat = localStorage.getItem('selectedFormat');
    return (storedFormat && isValidFormat(storedFormat)) ? storedFormat : defaultFormat;
  };

  const [summaryOptions, setSummaryOptions] = useState<Partial<SummarizationOptions>>({
    provider: 'openai',
    format: getStoredFormat(),
    maxLength: 500,
    language: 'English',
    temperature: 0.3,
  });

  const [selectedTemplateDescription, setSelectedTemplateDescription] = useState<string>(() => {
    const format = getStoredFormat();
    return PROMPT_TEMPLATES[format].description;
  });

  const handleSummarize = async () => {
    if (!chunks || !file) return;
    
    try {
      // Reset any previous errors
      setStorageError(null);
      
      // Generate the summary and get the result directly
      const summaryResult = await summarize(chunks, summaryOptions);
      
      // Prepare the summary data
      const summaryData = {
        title: file.name,
        content: summaryResult.summary,
        format: summaryOptions.format || 'paragraph',
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          pageCount: metadata?.totalPages,
          provider: summaryResult.provider,
          model: summaryResult.model,
          tokensUsed: summaryResult.tokensUsed,
        },
      };
      
      console.log('Attempting to store summary:', summaryData);
      
      // Store the summary
      await addSummary(summaryData);
      console.log('Summary stored successfully');

      // Navigate to summaries page with correct path
      // navigate('/dashboard/summaries');
    } catch (error) {
      console.error('Failed to generate or store summary:', error);
      setStorageError(error instanceof Error ? error.message : 'An error occurred while processing your request');
    }
  };

  const handleOptionChange = (key: keyof SummarizationOptions, value: any) => {
    setSummaryOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleFormatChange = (format: string) => {
    if (isValidFormat(format)) {
      handleOptionChange('format', format);
      setSelectedTemplateDescription(PROMPT_TEMPLATES[format].description);
      localStorage.setItem('selectedFormat', format);
    }
  };

  const handleClear = () => {
    clearFile();
    resetSummary();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Upload Document
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload your document to get started with AI summarization
          </p>
        </div>

        {/* Upload Area */}
        <div 
          className={`bg-white shadow rounded-lg p-8 ${
            isDragging ? 'border-2 border-dashed border-black bg-gray-50' : 'border-2 border-dashed border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="text-center">
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {isDragging ? 'Drop your file here' : 'Upload your document'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop your PDF document here or click the button below to browse your files. We support PDF files up to 10MB.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileInputChange}
              />
              <button
                type="button"
                onClick={handleButtonClick}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Select File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="h-8 w-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 3a2 2 0 012-2h6a2 2 0 012 2v1h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h3V3zm0 3H4v12h16V6h-3v1a2 2 0 01-2 2H9a2 2 0 01-2-2V6zm2-3v4h6V3H9z" />
                  </svg>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              {/* Progress bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-black bg-gray-200">
                      {isProcessing ? 'Processing' : progress === 100 ? 'Completed' : 'Uploading'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-black">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black transition-all duration-500"
                  />
                </div>
              </div>

              {/* Extracted Content */}
              {extractedContent && metadata && (
                <div className="mt-8 space-y-6">
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900">Document Information</h3>
                    <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total Pages</dt>
                        <dd className="mt-1 text-sm text-gray-900">{metadata.totalPages}</dd>
                      </div>
                      {metadata.title && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Title</dt>
                          <dd className="mt-1 text-sm text-gray-900">{metadata.title}</dd>
                        </div>
                      )}
                      {metadata.author && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Author</dt>
                          <dd className="mt-1 text-sm text-gray-900">{metadata.author}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900">Extracted Content</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Text Chunks</h4>
                        <p className="mt-1 text-sm text-gray-900">{chunks?.length} chunks created</p>
                      </div>
                      {extractedContent.images.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Images</h4>
                          <p className="mt-1 text-sm text-gray-900">{extractedContent.images.length} images extracted</p>
                        </div>
                      )}
                      {extractedContent.tables.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Tables</h4>
                          <p className="mt-1 text-sm text-gray-900">{extractedContent.tables.length} tables detected</p>
                        </div>
                      )}
                      {extractedContent.charts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Charts</h4>
                          <p className="mt-1 text-sm text-gray-900">{extractedContent.charts.length} charts detected</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summarization Options */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900">Summarization Options</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">AI Provider</label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                          value={summaryOptions.provider}
                          onChange={(e) => handleOptionChange('provider', e.target.value)}
                        >
                          {availableProviders.map(provider => (
                            <option key={provider} value={provider}>
                              {provider.charAt(0).toUpperCase() + provider.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Format</label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                          value={summaryOptions.format}
                          onChange={(e) => handleFormatChange(e.target.value)}
                        >
                          {Object.entries(PROMPT_TEMPLATES).map(([key, template]) => (
                            <option key={key} value={key}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                        {/* {selectedTemplateDescription && (
                          <p className="mt-2 text-sm text-gray-500">
                            {selectedTemplateDescription}
                          </p>
                        )} */}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Length (words)</label>
                        <input
                          type="number"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                          value={summaryOptions.maxLength}
                          onChange={(e) => handleOptionChange('maxLength', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Language</label>
                        <input
                          type="text"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                          value={summaryOptions.language}
                          onChange={(e) => handleOptionChange('language', e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSummarize}
                      disabled={isLoading}
                      className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Summary...
                        </>
                      ) : 'Generate Summary'}
                    </button>
                  </div>

                  {/* Summary Result */}
                  {result && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900">Summary</h3>
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <MarkdownRenderer 
                          content={result.summary}
                          className="text-sm text-gray-700"
                        />
                        <div className="mt-4 text-xs text-gray-500">
                          Generated by {result.provider} using {result.model}
                          {result.tokensUsed && ` • ${result.tokensUsed} tokens used`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error messages */}
          {(uploadError || summaryError || storageError) && (
            <div className="mt-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {uploadError || summaryError || storageError}
            </div>
          )}
        </div>

        {/* Upload guidelines */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Upload Guidelines</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                Supported format: PDF only
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                Maximum file size: 10MB
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">
                Text should be clear and legible
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

Upload.displayName = 'Upload';
export default Upload; 