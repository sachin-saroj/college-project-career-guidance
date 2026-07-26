import React from 'react';
import { Box, Typography, Avatar, IconButton, Tooltip } from '@mui/material';
import { MessageRole } from '../../modules/mentor/types/mentor.types';
import { MarkdownRenderer } from './MarkdownRenderer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import toast from 'react-hot-toast';

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  isTemp?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, isTemp }) => {
  const isUser = role === 'user';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied!');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3, 
        opacity: isTemp ? 0.6 : 1,
        flexDirection: isUser ? 'row-reverse' : 'row'
      }}
    >
      <Avatar sx={{ 
        bgcolor: isUser ? 'primary.main' : 'secondary.main',
        width: 36, 
        height: 36
      }}>
        {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
      </Avatar>

      <Box sx={{ 
        maxWidth: '75%', 
        position: 'relative',
        '&:hover .copy-btn': { opacity: 1 }
      }}>
        <Box sx={{ 
          bgcolor: isUser ? 'primary.50' : 'background.paper',
          border: '1px solid',
          borderColor: isUser ? 'primary.100' : 'divider',
          borderRadius: 3,
          borderTopRightRadius: isUser ? 0 : 3,
          borderTopLeftRadius: isUser ? 3 : 0,
          p: 2,
          boxShadow: 1
        }}>
          <MarkdownRenderer content={content} />
        </Box>
        
        {!isUser && (
          <Tooltip title="Copy message" placement="right">
            <IconButton 
              className="copy-btn"
              size="small" 
              onClick={handleCopy}
              sx={{ 
                position: 'absolute', 
                top: 0, 
                right: -40, 
                opacity: 0, 
                transition: 'opacity 0.2s' 
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
