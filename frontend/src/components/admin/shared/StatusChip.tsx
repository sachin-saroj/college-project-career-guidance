import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'PUBLISHED':
    case 'HEALTHY':
      color = 'success';
      break;
    case 'SUSPENDED':
    case 'DOWN':
    case 'ARCHIVED':
      color = 'error';
      break;
    case 'DRAFT':
    case 'DEGRADED':
      color = 'warning';
      break;
    case 'USER':
      color = 'info';
      break;
    case 'ADMIN':
      color = 'secondary';
      break;
  }

  return <Chip label={status} color={color} size="small" variant="filled" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />;
};
