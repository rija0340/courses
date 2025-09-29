import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);

const CodeBlock = ({ children, language = 'javascript', showLineNumbers = false, highlightLines = '' }) => {
  // Ensure children is a string
  const codeString = typeof children === 'string' ? children : String(children);

  // Function to get line styles with highlighting
  const getLineProps = ({ lineNumber }) => {
    const baseStyle = { wordBreak: 'break-word', whiteSpace: 'pre-wrap' };
    
    if (highlightLines) {
      const highlightedLines = parseHighlightLines(highlightLines);
      if (highlightedLines.includes(lineNumber)) {
        return { 
          style: { 
            ...baseStyle, 
            backgroundColor: 'rgba(255, 255, 0, 0.1)', // Subtle yellow highlight
            borderLeft: '3px solid #ffcc00' // Yellow border for highlighted lines
          } 
        };
      }
    }
    
    return { style: baseStyle };
  };

  // Function to parse highlight string like "3,5-7" into array of line numbers
  const parseHighlightLines = (highlightString) => {
    if (!highlightString) return [];
    
    const ranges = highlightString.split(',');
    const lineNumbers = [];
    
    ranges.forEach(range => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          lineNumbers.push(i);
        }
      } else {
        lineNumbers.push(Number(range));
      }
    });
    
    return lineNumbers;
  };

  return (
    <div className="my-3 sm:my-4 w-full overflow-x-hidden">
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        showLineNumbers={showLineNumbers}
        wrapLongLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontFamily: "'Fira Code', 'Fira Mono', Consolas, monospace"
        }}
        lineProps={getLineProps}
        {...(showLineNumbers && { 
          startingLineNumber: 1,
          lineNumberStyle: { userSelect: 'none', color: '#9CA3AF', paddingRight: '1rem' }
        })}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;