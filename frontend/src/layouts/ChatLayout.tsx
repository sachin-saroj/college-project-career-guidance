import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ChatSidebar } from '../components/mentor/ChatSidebar';

export const ChatLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', m: -3 }}>
      {/* Sidebar for Desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>
        <ChatSidebar />
      </Box>

      {/* Main Chat Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
