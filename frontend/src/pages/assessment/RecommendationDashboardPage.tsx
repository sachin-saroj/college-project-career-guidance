import React from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useRecommendations } from '../../modules/assessment/hooks/useAssessment';
import { RecommendationPanel } from '../../components/recommendations/RecommendationPanel';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const RecommendationDashboardPage: React.FC = () => {
  const { data, isLoading, isError } = useRecommendations();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress size={60} sx={{ mb: 4 }} />
        <Typography variant="h6" color="text.secondary">Analyzing your traits...</Typography>
        <Typography variant="body2" color="text.secondary">Our AI is generating your personalized career paths.</Typography>
      </Box>
    );
  }

  if (isError || !data?.data?.recommendation) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" color="error" gutterBottom>
          Recommendations Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          You need to complete the psychometric assessment to view recommendations.
        </Typography>
        <Button component={Link} to="/dashboard/assessment">
          Take Assessment
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Career Intelligence Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Based on your psychometric profile, here are your top matched careers and trait breakdowns.
          </Typography>
        </Box>
        <Button component={Link} to="/dashboard/mentor" color="secondary">
          Discuss with AI Mentor
        </Button>
      </Box>

      <RecommendationPanel recommendation={data.data.recommendation} />
    </Container>
  );
};
