import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, Typography, Box } from '@mui/material';

export interface CardProps extends MuiCardProps {
  title?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  action, 
  noPadding = false,
  ...props 
}) => {
  return (
    <MuiCard {...props}>
      {(title || action) && (
        <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title && (
            <Typography variant="h6" component="h2" fontWeight="600">
              {title}
            </Typography>
          )}
          {action && <Box>{action}</Box>}
        </Box>
      )}
      <CardContent sx={{ p: noPadding ? 0 : 2, '&:last-child': { pb: noPadding ? 0 : 2 } }}>
        {children}
      </CardContent>
    </MuiCard>
  );
};
