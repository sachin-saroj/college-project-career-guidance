import React from 'react';
import { Box, Grid, Typography, Alert } from '@mui/material';
import { Recommendation } from '../../modules/assessment/types/assessment.types';
import { RadarChartCard } from './RadarChartCard';
import { CareerCard } from './CareerCard';
import { StrengthCard } from './StrengthCard';

interface RecommendationPanelProps {
  recommendation: Recommendation;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ recommendation }) => {
  if (!recommendation) return <Alert severity="warning">No recommendation data found.</Alert>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Top Career Matches
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recommendation.recommendedCareers.map((career, i) => (
          <Grid item xs={12} md={4} key={career.careerId || i}>
            <CareerCard 
              title={career.title} 
              matchPercentage={career.matchPercentage} 
              reasoning={career.reasoning} 
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RadarChartCard data={recommendation.traits} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <StrengthCard strengths={recommendation.strengths} type="strength" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <StrengthCard strengths={recommendation.improvementAreas} type="improvement" />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
