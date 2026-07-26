import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface QuestionCardProps {
  text: string;
  children: React.ReactNode;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ text, children }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 3, md: 5 }, 
        borderRadius: 4,
        minHeight: 350,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h5" fontWeight="medium" sx={{ mb: 4, lineHeight: 1.5 }}>
        {text}
      </Typography>
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </Box>
    </Paper>
  );
};
