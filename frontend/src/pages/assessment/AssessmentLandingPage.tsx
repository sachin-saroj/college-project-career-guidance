import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAssessmentSession, useStartAssessment } from '../../modules/assessment/hooks/useAssessment';
import { useNavigate } from 'react-router-dom';
import TimerIcon from '@mui/icons-material/Timer';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const AssessmentLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessionData, isLoading: isLoadingSession } = useAssessmentSession();
  const { mutate: startAssessment, isPending: isStarting } = useStartAssessment();

  const handleStartOrResume = () => {
    if (sessionData?.data?.session?.status === 'in_progress') {
      navigate('/dashboard/assessment/take');
    } else {
      startAssessment(undefined, {
        onSuccess: () => navigate('/dashboard/assessment/take'),
      });
    }
  };

  if (isLoadingSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const session = sessionData?.data?.session;
  const isInProgress = session?.status === 'in_progress';
  const isCompleted = session?.status === 'completed';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Psychometric Career Assessment
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Discover the careers that best align with your unique personality, strengths, and interests. Our AI-driven assessment analyzes your traits to provide highly accurate career recommendations.
      </Typography>

      <Card sx={{ my: 4 }}>
        <List>
          <ListItem>
            <ListItemIcon><TimerIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Estimated Time" secondary="Approx. 15-20 minutes" />
          </ListItem>
          <ListItem>
            <ListItemIcon><FormatListNumberedIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Format" secondary="50+ questions (Multiple Choice & Likert Scale)" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Auto-Save" secondary="Your progress is saved automatically. You can resume at any time." />
          </ListItem>
        </List>
      </Card>

      <Box sx={{ p: 3, bgcolor: 'primary.50', borderRadius: 2, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary.900" gutterBottom>
          Instructions
        </Typography>
        <Typography variant="body2" color="primary.800">
          - There are no right or wrong answers. Be as honest as possible. <br/>
          - Go with your first instinct rather than overthinking. <br/>
          - Ensure you have a quiet environment to focus.
        </Typography>
      </Box>

      {isCompleted ? (
        <Box textAlign="center">
          <Typography variant="h6" color="success.main" gutterBottom>
            Assessment Completed!
          </Typography>
          <Button onClick={() => navigate('/dashboard/recommendations')} size="large">
            View Your Recommendations
          </Button>
        </Box>
      ) : (
        <Box textAlign="center">
          {isInProgress && (
            <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
              You have an assessment in progress (Question {session.currentQuestionIndex + 1}).
            </Typography>
          )}
          <Button 
            size="large" 
            onClick={handleStartOrResume} 
            isLoading={isStarting}
            sx={{ px: 6, py: 1.5 }}
          >
            {isInProgress ? 'Resume Assessment' : 'Start Assessment'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
