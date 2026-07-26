import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const BuilderLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CareerSathi Builder
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', bgcolor: 'grey.100' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
