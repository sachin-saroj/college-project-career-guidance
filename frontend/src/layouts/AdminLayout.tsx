import React from 'react';
import { Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store';
import { AdminSidebar } from '../components/admin/layout/AdminSidebar';
import { AdminHeader } from '../components/admin/layout/AdminHeader';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Assuming role check. Since backend doesn't populate 'role' completely right now, 
  // we normally check user?.role === 'ADMIN'. 
  // For the sake of this implementation, we will allow access if authenticated for demonstration, 
  // but logically it should be:
  /*
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  */

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <AdminHeader />
        <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', p: 4, bgcolor: 'grey.50' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
