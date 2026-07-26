import React from 'react';
import { Box, Typography, CardActionArea } from '@mui/material';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon, to, color = 'primary.main' }) => {
  return (
    <Card noPadding sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardActionArea component={Link} to={to} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'action.hover',
            color: color,
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
