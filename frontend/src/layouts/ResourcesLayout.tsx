import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CategoryTabs } from '../components/resources/CategoryTabs';
import { SearchBar } from '../components/resources/SearchBar';
import { ResourceType } from '../modules/resources/types/resource.types';

export const ResourcesLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Determine current active tab based on URL path or query params
  // If path is /dashboard/resources exact, it's 'for-you'
  // If path is /dashboard/resources/c, it reads the ?type param
  const currentPath = location.pathname;
  let activeTab: ResourceType | 'for-you' = 'for-you';
  
  if (currentPath.endsWith('/c')) {
    activeTab = (searchParams.get('type') as ResourceType) || 'course';
  }

  const handleTabChange = (val: ResourceType | 'for-you') => {
    if (val === 'for-you') {
      navigate('/dashboard/resources');
    } else {
      // Preserve search query if it exists
      const q = searchParams.get('q');
      const queryStr = q ? `?type=${val}&q=${encodeURIComponent(q)}` : `?type=${val}`;
      navigate(`/dashboard/resources/c${queryStr}`);
    }
  };

  const handleSearch = (q: string) => {
    if (activeTab === 'for-you') {
      // Redirect to course search if they search from "For You"
      navigate(`/dashboard/resources/c?type=course&q=${encodeURIComponent(q)}`);
    } else {
      const typeStr = `?type=${activeTab}`;
      const queryStr = q ? `${typeStr}&q=${encodeURIComponent(q)}` : typeStr;
      navigate(`/dashboard/resources/c${queryStr}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">Resources & Opportunities</Typography>
            <Typography variant="body1" color="text.secondary">
              Discover courses, scholarships, and career roadmaps tailored to your profile.
            </Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 300 } }}>
            <SearchBar 
              value={searchParams.get('q') || ''} 
              onChange={handleSearch} 
              placeholder={`Search ${activeTab === 'for-you' ? 'resources' : activeTab + 's'}...`}
            />
          </Box>
        </Box>
      </Container>

      <CategoryTabs value={activeTab} onChange={handleTabChange} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'grey.50', pt: 4, pb: 8 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
