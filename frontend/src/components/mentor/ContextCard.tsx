import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ContextCardProps {
  title: string;
  items: { label: string; value: string | React.ReactNode }[];
}

export const ContextCard: React.FC<ContextCardProps> = ({ title, items }) => {
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        bgcolor: 'grey.50',
        borderRadius: 2,
        minWidth: 250,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <InfoOutlinedIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item, idx) => (
          <Box key={idx}>
            <Typography variant="caption" color="text.secondary" display="block">
              {item.label}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
