import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSearchResources } from '../../modules/resources/hooks/useResources';
import { ResourceGrid } from '../../components/resources/ResourceGrid';
import { ResourceType } from '../../modules/resources/types/resource.types';

export const CategoryPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const type = (searchParams.get('type') as ResourceType) || 'course';
  const q = searchParams.get('q') || undefined;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useSearchResources(type, q);

  // Flatten the infinite pages into a single array
  const resources = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.data.results);
  }, [data]);

  return (
    <Box>
      {q && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Showing results for "{q}" in {type}s
        </Typography>
      )}

      <ResourceGrid 
        resources={resources}
        type={type}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        emptyMessage={`No ${type}s found ${q ? 'matching your search.' : 'at this time.'}`}
      />
    </Box>
  );
};
