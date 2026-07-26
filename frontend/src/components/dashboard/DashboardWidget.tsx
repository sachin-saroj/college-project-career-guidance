import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { Card } from '../ui/Card';

interface DashboardWidgetProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = React.memo(({ title, action, children }) => {
  return (
    <Card
      title={title}
      action={action}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Divider sx={{ mb: 2, mt: 1 }} />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Card>
  );
});
