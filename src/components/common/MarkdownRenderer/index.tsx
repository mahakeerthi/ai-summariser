import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const components: Components = {
    code: ({ inline, className, children, ...props }: CodeComponentProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline ? (
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={language}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`bg-gray-100 text-gray-800 px-1 rounded ${className}`} {...props}>
          {children}
        </code>
      );
    },
    // Add specific styles for different markdown elements
    p: ({ children }) => <p className="text-gray-800">{children}</p>,
    h1: ({ children }) => <h1 className="text-gray-900 font-bold text-2xl">{children}</h1>,
    h2: ({ children }) => <h2 className="text-gray-900 font-bold text-xl">{children}</h2>,
    h3: ({ children }) => <h3 className="text-gray-900 font-bold text-lg">{children}</h3>,
    h4: ({ children }) => <h4 className="text-gray-900 font-bold">{children}</h4>,
    ul: ({ children }) => <ul className="text-gray-800 list-disc ml-4">{children}</ul>,
    ol: ({ children }) => <ol className="text-gray-800 list-decimal ml-4">{children}</ol>,
    li: ({ children }) => <li className="text-gray-800">{children}</li>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-200 pl-4 text-gray-700 italic">{children}</blockquote>,
    a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
    em: ({ children }) => <em className="text-gray-800 italic">{children}</em>,
    strong: ({ children }) => <strong className="text-gray-900 font-bold">{children}</strong>,
  };

  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer; 