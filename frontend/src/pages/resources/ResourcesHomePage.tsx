import React from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Chip } from '@mui/material';
import { useRecommendedResources } from '../../modules/resources/hooks/useResources';
import { ResourceCard, ResourceCardSkeleton } from '../../components/resources/ResourceCard';
import { ResourceType } from '../../modules/resources/types/resource.types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const HorizontalScrollSection: React.FC<{ title: string; items: any[]; type: ResourceType; onSeeAll: () => void }> = ({ title, items, type, onSeeAll }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Button endIcon={<ArrowForwardIcon />} size="small" onClick={onSeeAll}>See All</Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 8 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 4 } }}>
        {items.map(item => (
          <Box key={item._id} sx={{ minWidth: 320, maxWidth: 320, flexShrink: 0 }}>
            <ResourceCard resource={item} type={type} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const ResourcesHomePage: React.FC = () => {
  const { data, isLoading, error } = useRecommendedResources();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={3}>Personalized for You</Typography>
        <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden' }}>
          {[1,2,3].map(i => <Box key={i} sx={{ minWidth: 320 }}><ResourceCardSkeleton /></Box>)}
        </Box>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="warning">
        Please complete your career assessment to unlock personalized recommendations.
      </Alert>
    );
  }

  const { resources, topCareers } = data.data;

  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.900', color: 'white', p: 4, borderRadius: 4, mb: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">Your Top Career Matches</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {topCareers.map(id => (
            <Chip key={id} label={id} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} />
          ))}
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 600 }}>
          We've curated the following resources based on your assessment results, targeted towards your top career matches and socioeconomic profile.
        </Typography>
      </Box>

      <HorizontalScrollSection 
        title="Recommended Scholarships" 
        items={resources.scholarships} 
        type="scholarship" 
        onSeeAll={() => navigate('/dashboard/resources/c?type=scholarship')} 
      />
      
      <HorizontalScrollSection 
        title="Courses for your Career Track" 
        items={resources.courses} 
        type="course" 
        onSeeAll={() => navigate('/dashboard/resources/c?type=course')} 
      />
      
      <HorizontalScrollSection 
        title="Open Internships" 
        items={resources.internships} 
        type="internship" 
        onSeeAll={() => navigate('/dashboard/resources/c?type=internship')} 
      />
      
      <HorizontalScrollSection 
        title="Career Roadmaps" 
        items={resources.roadmaps} 
        type="roadmap" 
        onSeeAll={() => navigate('/dashboard/resources/c?type=roadmap')} 
      />
      
      <HorizontalScrollSection 
        title="Articles & Guides" 
        items={resources.articles} 
        type="article" 
        onSeeAll={() => navigate('/dashboard/resources/c?type=article')} 
      />
    </Box>
  );
};
