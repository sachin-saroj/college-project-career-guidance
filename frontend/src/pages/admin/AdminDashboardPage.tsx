import React from 'react';
import { Box, Typography, Grid, CircularProgress, Paper, Divider } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GetAppIcon from '@mui/icons-material/GetApp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { useDashboardStats } from '../../modules/admin/hooks/useAdmin';
import { StatCard } from '../../components/admin/shared/StatCard';
import { StatusChip } from '../../components/admin/shared/StatusChip';

export const AdminDashboardPage: React.FC = () => {
  const { data: statsRes, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = statsRes?.data;

  if (!stats) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">System Status:</Typography>
          <StatusChip status={stats.systemHealth} />
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={<PeopleAltIcon />} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Users" value={stats.activeUsers.toLocaleString()} icon={<CheckCircleIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="AI Conversations" value={stats.aiConversations.toLocaleString()} icon={<PsychologyIcon />} color="#9c27b0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Assessments" value={stats.assessmentsCompleted.toLocaleString()} icon={<LibraryBooksIcon />} color="#ed6c02" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%', minHeight: 300 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Platform Activity (Mocked)</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">Analytics Chart Placeholder</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StatCard title="Resources Viewed" value={stats.resourcesViewed.toLocaleString()} icon={<LibraryBooksIcon />} color="#0288d1" />
            </Grid>
            <Grid item xs={12}>
              <StatCard title="Resume Exports" value={stats.resumeExports.toLocaleString()} icon={<GetAppIcon />} color="#c62828" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
