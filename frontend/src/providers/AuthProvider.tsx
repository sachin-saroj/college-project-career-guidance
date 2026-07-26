import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useCurrentUser } from '../modules/auth/hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const logout = useAuthStore((state) => state.logout);
  
  const [isInitializing, setIsInitializing] = useState(!!token); // Only initialize if we have a token

  // Fetch the current user data from the backend to validate the token
  const { data, isError, isLoading } = useCurrentUser();

  useEffect(() => {
    if (token) {
      if (data?.data?.user) {
        // Token is valid, hydrate the store with fresh user data
        setCredentials(data.data.user, token);
        setIsInitializing(false);
      } else if (isError) {
        // Token is invalid or expired
        logout();
        setIsInitializing(false);
      }
    } else {
      setIsInitializing(false);
    }
  }, [data, isError, token, setCredentials, logout]);

  // While validating the token on first load, show a full screen loader
  if (isInitializing || (token && isLoading)) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">Verifying session...</Typography>
      </Box>
    );
  }

  return <>{children}</>;
};
