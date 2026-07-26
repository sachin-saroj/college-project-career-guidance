import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import { Card } from '../ui/Card';

interface StrengthCardProps {
  strengths: string[];
  type?: 'strength' | 'improvement';
}

export const StrengthCard: React.FC<StrengthCardProps> = ({ strengths, type = 'strength' }) => {
  const isStrength = type === 'strength';
  
  return (
    <Card title={isStrength ? "Key Strengths" : "Areas for Growth"} sx={{ height: '100%' }}>
      <List dense disablePadding>
        {strengths.map((item, index) => (
          <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: isStrength ? 'success.main' : 'warning.main' }}>
              {isStrength ? <CheckCircleOutlineIcon fontSize="small" /> : <EmojiObjectsOutlinedIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText 
              primary={item} 
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} 
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
