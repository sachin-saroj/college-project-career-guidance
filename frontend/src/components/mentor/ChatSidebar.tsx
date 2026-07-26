import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useConversationHistory } from '../../modules/mentor/hooks/useMentor';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ChatSidebar: React.FC = () => {
  const { data, isLoading } = useConversationHistory();
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const sessions = data?.data?.sessions || [];

  return (
    <Box sx={{ width: 280, height: '100%', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2 }}>
        <Button 
          fullWidth 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/dashboard/mentor')}
          variant={!sessionId ? 'contained' : 'outlined'}
        >
          New Chat
        </Button>
      </Box>
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1, display: 'block', fontWeight: 'bold' }}>
          Recent Conversations
        </Typography>
        
        {isLoading ? (
          <Box textAlign="center" py={2}><CircularProgress size={24} /></Box>
        ) : sessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
            No past conversations.
          </Typography>
        ) : (
          <List dense>
            {sessions.map((session) => (
              <ListItem key={session._id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  selected={sessionId === session._id}
                  onClick={() => navigate(`/dashboard/mentor/c/${session._id}`)}
                  sx={{ borderRadius: 1 }}
                >
                  <ChatBubbleOutlineIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} />
                  <ListItemText 
                    primary={session.title || 'Career Chat'} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      noWrap: true,
                      fontWeight: sessionId === session._id ? 'bold' : 'regular'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};
