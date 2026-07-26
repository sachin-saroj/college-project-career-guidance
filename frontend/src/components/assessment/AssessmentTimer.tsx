import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface AssessmentTimerProps {
  startedAt: string;
  maxMinutes?: number;
}

export const AssessmentTimer: React.FC<AssessmentTimerProps> = ({ startedAt, maxMinutes = 45 }) => {
  const [elapsed, setElapsed] = useState(0); // seconds

  useEffect(() => {
    const start = new Date(startedAt).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startedAt]);

  const maxSeconds = maxMinutes * 60;
  const remaining = Math.max(0, maxSeconds - elapsed);
  
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const isWarning = remaining < 300; // less than 5 minutes

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: isWarning ? 'error.main' : 'text.secondary' }}>
      <AccessTimeIcon fontSize="small" />
      <Typography variant="body2" fontWeight="bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>
    </Box>
  );
};
