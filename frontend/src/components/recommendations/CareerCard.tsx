import React from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import { Card } from '../ui/Card';
import WorkIcon from '@mui/icons-material/Work';

interface CareerCardProps {
  title: string;
  matchPercentage: number;
  reasoning: string;
}

export const CareerCard: React.FC<CareerCardProps> = ({ title, matchPercentage, reasoning }) => {
  const getColor = (percent: number) => {
    if (percent >= 85) return 'success.main';
    if (percent >= 70) return 'warning.main';
    return 'error.main';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main' }}>
            <WorkIcon />
          </Box>
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </Box>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress 
            variant="determinate" 
            value={matchPercentage} 
            size={50} 
            thickness={5}
            sx={{ color: getColor(matchPercentage) }} 
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary" fontWeight="bold">
              {Math.round(matchPercentage)}%
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
        {reasoning}
      </Typography>
      <Box sx={{ mt: 'auto' }}>
        <Chip label={`${matchPercentage}% Match`} size="small" sx={{ bgcolor: `${getColor(matchPercentage)}15`, color: getColor(matchPercentage), fontWeight: 'bold' }} />
      </Box>
    </Card>
  );
};
