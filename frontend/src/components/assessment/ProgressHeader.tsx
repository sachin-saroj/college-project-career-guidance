import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface ProgressHeaderProps {
  current: number;
  total: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Question {current} of {total}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}% Completed
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
          }
        }} 
      />
    </Box>
  );
};
