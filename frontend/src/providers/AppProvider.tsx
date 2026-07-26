import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { lightTheme, darkTheme } from '../theme';
import { useUiStore } from '../store/ui.store';

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in v5)
      retry: 1, // Only retry failed requests once
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const isDarkMode = useUiStore((state) => state.isDarkMode);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {/* CssBaseline normalizes CSS across browsers and applies the theme background */}
        <CssBaseline />
        <Toaster position="top-right" />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
