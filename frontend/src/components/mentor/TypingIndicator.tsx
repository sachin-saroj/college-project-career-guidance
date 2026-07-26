import React from 'react';
import { Box } from '@mui/material';

export const TypingIndicator: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 2, width: 'fit-content' }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            bgcolor: 'primary.main',
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: `${i * 0.16}s`,
            '@keyframes bounce': {
              '0%, 80%, 100%': { transform: 'scale(0)' },
              '40%': { transform: 'scale(1)' }
            }
          }}
        />
      ))}
    </Box>
  );
};
