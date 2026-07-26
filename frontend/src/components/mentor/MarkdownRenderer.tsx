import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, Typography } from '@mui/material';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ content }) => {
  return (
    <Box sx={{ 
      '& p': { mt: 0, mb: 1.5, '&:last-of-type': { mb: 0 } },
      '& ul, & ol': { mt: 0, mb: 1.5, pl: 3 },
      '& li': { mb: 0.5 },
      '& a': { color: 'primary.main', textDecoration: 'underline' },
      '& code': { 
        bgcolor: 'action.hover', 
        px: 0.5, 
        py: 0.25, 
        borderRadius: 1,
        fontFamily: 'monospace',
        fontSize: '0.875rem'
      }
    }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={vscDarkPlus}
                customStyle={{ borderRadius: 8, margin: '16px 0' }}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
          h1: ({node, ...props}) => <Typography variant="h5" fontWeight="bold" gutterBottom {...props} />,
          h2: ({node, ...props}) => <Typography variant="h6" fontWeight="bold" gutterBottom {...props} />,
          h3: ({node, ...props}) => <Typography variant="subtitle1" fontWeight="bold" gutterBottom {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';
