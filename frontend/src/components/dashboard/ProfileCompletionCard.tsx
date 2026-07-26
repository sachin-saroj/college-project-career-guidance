import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { DashboardWidget } from './DashboardWidget';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

interface ProfileCompletionCardProps {
  isComplete: boolean;
  percentage: number;
  missingFields: string[];
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  isComplete,
  percentage,
  missingFields
}) => {
  return (
    <DashboardWidget 
      title="Profile Completion" 
      action={
        <Button component={Link} to="/dashboard/profile/edit" variant="outlined" size="small">
          {isComplete ? 'Edit Profile' : 'Complete Profile'}
        </Button>
      }
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color={percentage === 100 ? 'success.main' : 'primary.main'}>
          {percentage}%
        </Typography>
        {isComplete && <Chip label="Complete" color="success" size="small" />}
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        color={percentage === 100 ? 'success' : 'primary'}
        sx={{ height: 8, borderRadius: 4, mb: 3 }}
      />

      {!isComplete && missingFields.length > 0 && (
        <Box>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Missing Information:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {missingFields.slice(0, 5).map((field) => (
              <Chip key={field} label={field} size="small" variant="outlined" color="warning" />
            ))}
            {missingFields.length > 5 && (
              <Chip label={`+${missingFields.length - 5} more`} size="small" variant="outlined" />
            )}
          </Box>
        </Box>
      )}

      {isComplete && (
        <Typography variant="body2" color="text.secondary">
          Great job! Your profile is fully complete. This helps us recommend the best career paths and resources for you.
        </Typography>
      )}
    </DashboardWidget>
  );
};
