import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, IconButton, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useConversation, useChat } from '../../modules/mentor/hooks/useMentor';
import { MessageBubble } from '../../components/mentor/MessageBubble';
import { TypingIndicator } from '../../components/mentor/TypingIndicator';
import { Input } from '../../components/ui/Input';
import SendIcon from '@mui/icons-material/Send';

export const ChatInterfacePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, isLoading } = useConversation(sessionId || '');
  const { mutate: sendMessage, isPending } = useChat(sessionId || '');
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const session = data?.data?.session;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isPending]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isPending || !sessionId) return;
    
    sendMessage({ sessionId, message: input });
    setInput('');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      
      {/* Chat History Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        <Container maxWidth="md">
          {session?.messages.map((msg, idx) => (
            <MessageBubble 
              key={msg._id || idx} 
              role={msg.role} 
              content={msg.content} 
              isTemp={msg._id?.startsWith('temp-')}
            />
          ))}
          {isPending && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TypingIndicator />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="md">
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Input
                fullWidth
                placeholder="Ask your mentor anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPending}
                sx={{ mb: 0 }}
              />
            </Box>
            <IconButton 
              color="primary" 
              type="submit" 
              disabled={!input.trim() || isPending}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, p: 1.5 }}
            >
              <SendIcon />
            </IconButton>
          </form>
        </Container>
      </Box>
    </Box>
  );
};
