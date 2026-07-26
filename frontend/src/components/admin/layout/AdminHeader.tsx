import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuthStore } from '../../../modules/auth/store/auth.store';

export const AdminHeader: React.FC = () => {
  const user = useAuthStore(state => state.user);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small">
            <NotificationsIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" fontWeight="bold" lineHeight={1.2}>
                {user?.profile?.personalInfo?.firstName || user?.email?.split('@')[0]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
