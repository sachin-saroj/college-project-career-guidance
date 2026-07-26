import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { usePortfolio, useUpdatePortfolio } from '../../modules/resume/hooks/useResume';
import { Portfolio } from '../../modules/resume/types/resume.types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const PortfolioBuilderPage: React.FC = () => {
  const { data: portfolioRes, isLoading } = usePortfolio();
  const { mutate: updatePortfolio, isPending: isUpdating } = useUpdatePortfolio();

  const { register, handleSubmit, reset } = useForm<Portfolio>();

  useEffect(() => {
    if (portfolioRes?.data) {
      reset(portfolioRes.data);
    }
  }, [portfolioRes, reset]);

  const onSubmit = (data: Portfolio) => {
    updatePortfolio(data);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: 1000, mx: 'auto', overflowY: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Portfolio Builder</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Configure your public profile and portfolio link. (Note: Portfolio API routes are currently mocked pending backend implementation).
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Basic Information</Typography>
              
              <Input 
                label="Professional Tagline" 
                fullWidth 
                sx={{ mb: 3 }}
                {...register('tagline')} 
              />
              
              <Input 
                label="About Me" 
                multiline 
                rows={6} 
                fullWidth 
                sx={{ mb: 3 }}
                {...register('about')} 
              />

              <Input 
                label="Theme" 
                fullWidth 
                sx={{ mb: 3 }}
                {...register('theme')} 
                placeholder="e.g. dark, light, minimal"
              />

              <Button type="submit" variant="contained" fullWidth disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', bgcolor: 'grey.50' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Public URL</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your portfolio will be available at:
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                https://careersathi.org/p/your-username
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
