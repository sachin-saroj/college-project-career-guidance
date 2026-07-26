import React, { useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { Button } from '../../components/ui/Button';
import { useCreateSession } from '../../modules/mentor/hooks/useMentor';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PromptSuggestions } from '../../components/mentor/PromptSuggestions';
import { ContextCard } from '../../components/mentor/ContextCard';

const INITIAL_SUGGESTIONS = [
  "What careers match my strengths?",
  "How can I improve my weak areas?",
  "Can you review my top career match?",
  "Help me prepare for an interview."
];

export const MentorHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createSession, isPending } = useCreateSession();
  const [startingPrompt, setStartingPrompt] = useState<string | null>(null);

  const handleStart = (initialMessage?: string) => {
    if (initialMessage) setStartingPrompt(initialMessage);
    
    createSession(initialMessage, {
      onSuccess: (res) => {
        navigate(`/dashboard/mentor/c/${res.data.session._id}`);
      }
    });
  };

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Context Bar - Hiding on small screens for simplicity */}
      <Box sx={{ p: 2, display: { xs: 'none', lg: 'flex' }, gap: 2, overflowX: 'auto', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <ContextCard 
          title="Student Profile" 
          items={[
            { label: 'Highest Qual', value: 'B.Tech Computer Science' },
            { label: 'Experience', value: 'Fresher' }
          ]} 
        />
        <ContextCard 
          title="Top Match" 
          items={[
            { label: 'Career', value: 'Software Engineer' },
            { label: 'Compatibility', value: '92%' }
          ]} 
        />
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Box sx={{ width: 64, height: 64, bgcolor: 'primary.100', color: 'primary.main', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <AutoAwesomeIcon fontSize="large" />
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            How can I help you today?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
            I'm your AI Career Mentor. I know your assessment results and profile. Ask me anything about your career path, interview prep, or skill development.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Button 
            size="large" 
            onClick={() => handleStart()} 
            isLoading={isPending && !startingPrompt}
            sx={{ px: 6, py: 1.5, borderRadius: 8 }}
          >
            Start New Conversation
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Or try one of these suggestions:
          </Typography>
          <PromptSuggestions 
            suggestions={INITIAL_SUGGESTIONS} 
            onSelect={(prompt) => handleStart(prompt)} 
          />
        </Box>
      </Container>
    </Box>
  );
};
