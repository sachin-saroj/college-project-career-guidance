import React from 'react';
import { Box, Toolbar, AppBar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Outlet } from 'react-router-dom';
import { useUiStore } from '../store/ui.store';

export const DashboardLayout: React.FC = () => {
  const { isDarkMode, toggleTheme, toggleSidebar } = useUiStore();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CareerSathi
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10, bgcolor: 'background.default' }}>
        {/* Renders nested routes like /dashboard/resume */}
        <Outlet />
      </Box>
    </Box>
  );
};
