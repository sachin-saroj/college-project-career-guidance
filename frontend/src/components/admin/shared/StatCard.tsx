import React from 'react';
import { Card, CardContent, Typography, Box, SvgIconProps } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'primary.main' }) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            bgcolor: `${color}15`, // adds 15% opacity to the hex/rgb
            color: color, 
            borderRadius: 2, 
            width: 56, 
            height: 56, 
            mr: 3 
          }}
        >
          {React.cloneElement(icon, { fontSize: 'large' })}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="bold" textTransform="uppercase" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
