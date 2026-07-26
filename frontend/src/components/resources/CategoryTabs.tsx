import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { ResourceType } from '../../modules/resources/types/resource.types';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface CategoryTabsProps {
  value: ResourceType | 'for-you';
  onChange: (value: ResourceType | 'for-you') => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ value, onChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 10 }}>
      <Tabs 
        value={value} 
        onChange={(_, val) => onChange(val)} 
        variant="scrollable" 
        scrollButtons="auto"
        sx={{ px: 2 }}
      >
        <Tab 
          icon={<AutoAwesomeIcon fontSize="small" />} 
          iconPosition="start" 
          label="For You" 
          value="for-you" 
          sx={{ minHeight: 64, fontWeight: 'bold' }} 
        />
        <Tab label="Courses" value="course" sx={{ minHeight: 64 }} />
        <Tab label="Scholarships" value="scholarship" sx={{ minHeight: 64 }} />
        <Tab label="Internships" value="internship" sx={{ minHeight: 64 }} />
        <Tab label="Articles" value="article" sx={{ minHeight: 64 }} />
        <Tab label="Roadmaps" value="roadmap" sx={{ minHeight: 64 }} />
      </Tabs>
    </Box>
  );
};
