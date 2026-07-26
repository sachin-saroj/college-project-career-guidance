import React from 'react';
import { Box, Typography, Grid, CircularProgress, Container } from '@mui/material';
import { useDashboard, useProfileCompletion } from '../../modules/profile/hooks/useProfile';
import { useAuthStore } from '../../store/auth.store';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProfileCompletionCard } from '../../components/dashboard/ProfileCompletionCard';
import { QuickActionCard } from '../../components/dashboard/QuickActionCard';

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DescriptionIcon from '@mui/icons-material/Description';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import SearchIcon from '@mui/icons-material/Search';

export const DashboardOverviewPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboard();
  const { data: completionData, isLoading: isCompletionLoading } = useProfileCompletion();

  if (isDashboardLoading || isCompletionLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = dashboardData?.data?.stats || {
    assessmentsTaken: 0,
    savedResources: 0,
    resumesGenerated: 0,
    aiMentorSessions: 0,
  };

  const completion = completionData?.data || {
    isComplete: false,
    percentage: 0,
    missingFields: [],
  };

  return (
    <Container maxWidth="xl" disableGutters>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of your career journey today.
        </Typography>
      </Box>

      {/* Top Section: Stats & Profile Completion */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left: Quick Stats Grid */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StatCard title="Assessments Taken" value={stats.assessmentsTaken} icon={<AssignmentIcon />} color="primary" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard title="Saved Resources" value={stats.savedResources} icon={<BookmarkIcon />} color="secondary" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard title="Resumes Generated" value={stats.resumesGenerated} icon={<DescriptionIcon />} color="success" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard title="AI Mentor Sessions" value={stats.aiMentorSessions} icon={<SmartToyIcon />} color="info" />
            </Grid>
          </Grid>
        </Grid>

        {/* Right: Profile Completion */}
        <Grid item xs={12} lg={4}>
          <ProfileCompletionCard 
            isComplete={completion.isComplete}
            percentage={completion.percentage}
            missingFields={completion.missingFields}
          />
        </Grid>
      </Grid>

      {/* Bottom Section: Quick Actions */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard 
            title="Take Assessment" 
            description="Discover your strengths and get career recommendations."
            icon={<PlayCircleOutlineIcon />}
            to="/dashboard/assessment"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard 
            title="AI Career Mentor" 
            description="Chat with our intelligent mentor for guidance."
            icon={<SmartToyIcon />}
            to="/dashboard/mentor"
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard 
            title="Build Resume" 
            description="Create an ATS-friendly resume in minutes."
            icon={<ContactPageIcon />}
            to="/dashboard/resume"
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard 
            title="Explore Resources" 
            description="Find courses, scholarships, and jobs."
            icon={<SearchIcon />}
            to="/dashboard/resources"
            color="info.main"
          />
        </Grid>
      </Grid>
    </Container>
  );
};
