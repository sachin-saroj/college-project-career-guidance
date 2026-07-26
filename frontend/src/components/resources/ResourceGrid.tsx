import React, { useEffect } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { ResourceCard, ResourceCardSkeleton } from './ResourceCard';
import { ResourceType } from '../../modules/resources/types/resource.types';
import InboxIcon from '@mui/icons-material/Inbox';

interface ResourceGridProps {
  resources: any[];
  type: ResourceType;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  emptyMessage?: string;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  type,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  emptyMessage = "No resources found."
}) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && resources.length === 0) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <ResourceCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!isLoading && resources.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, opacity: 0.7 }}>
        <InboxIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource._id}>
            <ResourceCard resource={resource} type={type} />
          </Grid>
        ))}
      </Grid>
      
      {/* Invisible element to trigger intersection observer for infinite scroll */}
      <Box ref={ref} sx={{ height: 20, mt: 4, display: 'flex', justifyContent: 'center' }}>
        {isFetchingNextPage && <CircularProgress size={24} />}
      </Box>
    </Box>
  );
};
