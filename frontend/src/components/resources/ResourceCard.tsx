import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, Chip, Skeleton } from '@mui/material';
import { BookmarkButton } from './BookmarkButton';
import { ResourceType, Course, Scholarship, Internship, Article, Roadmap } from '../../modules/resources/types/resource.types';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ResourceCardProps {
  resource: any; // Type-casted based on type prop below
  type: ResourceType;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, type }) => {
  
  const renderMetadata = () => {
    switch (type) {
      case 'course': {
        const c = resource as Course;
        return (
          <>
            <Chip size="small" label={c.platform} />
            <Chip size="small" label={c.difficulty} variant="outlined" />
            <Chip size="small" label={c.cost} color={c.cost === 'Free' ? 'success' : 'default'} />
          </>
        );
      }
      case 'scholarship': {
        const s = resource as Scholarship;
        return (
          <>
            <Chip size="small" label={`$${s.amount}`} color="success" />
            <Chip size="small" label={`Deadline: ${new Date(s.deadline).toLocaleDateString()}`} variant="outlined" />
            <Chip size="small" label={s.status} color={s.status === 'Open' ? 'primary' : 'default'} />
          </>
        );
      }
      case 'internship': {
        const i = resource as Internship;
        return (
          <>
            <Chip size="small" label={i.company} />
            <Chip size="small" label={i.type} variant="outlined" />
            <Chip size="small" label={i.stipend} />
          </>
        );
      }
      case 'article': {
        const a = resource as Article;
        return (
          <>
            <Chip size="small" label={a.author} />
            <Chip size="small" label={`${a.readTimeMinutes} min read`} variant="outlined" />
          </>
        );
      }
      case 'roadmap': {
        const r = resource as Roadmap;
        return (
          <>
            <Chip size="small" label={`${r.steps?.length || 0} Steps`} color="primary" />
          </>
        );
      }
      default: return null;
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', transition: '0.2s', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            {type}
          </Typography>
          <BookmarkButton resourceId={resource._id} type={type} />
        </Box>
        
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {resource.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {resource.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
          {renderMetadata()}
        </Box>
      </CardContent>
      
      <CardActions sx={{ borderTop: 1, borderColor: 'divider', px: 2, py: 1.5 }}>
        <Typography 
          component="a" 
          href={resource.url} 
          target="_blank"
          rel="noopener noreferrer"
          variant="button" 
          color="primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}
        >
          View Resource <OpenInNewIcon sx={{ fontSize: 16 }} />
        </Typography>
      </CardActions>
    </Card>
  );
};

export const ResourceCardSkeleton = () => (
  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Skeleton width={60} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1, width: '80%' }} />
      <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton width={60} height={24} sx={{ borderRadius: 1 }} />
        <Skeleton width={80} height={24} sx={{ borderRadius: 1 }} />
      </Box>
    </CardContent>
    <CardActions sx={{ borderTop: 1, borderColor: 'divider', px: 2, py: 1.5 }}>
      <Skeleton width={100} height={24} />
    </CardActions>
  </Card>
);
