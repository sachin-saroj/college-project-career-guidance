import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import TimerOffIcon from '@mui/icons-material/TimerOff';

export const SessionExpiredPage: React.FC = () => {
  return (
    <Card noPadding sx={{ p: 4, textAlign: 'center' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <TimerOffIcon color="warning" sx={{ fontSize: 64 }} />
      </Box>
      
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Session Expired
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        For your security, your session has timed out due to inactivity or an expired token. Please log in again to continue.
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Button component={Link} to="/login" variant="contained" fullWidth size="large">
          Back to Login
        </Button>
      </Box>
    </Card>
  );
};
