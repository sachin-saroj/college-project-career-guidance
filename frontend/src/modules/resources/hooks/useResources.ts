import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceApi } from '../api/resource.api';
import { SearchResourcesParams, BaseResource, ResourceType } from '../types/resource.types';
import toast from 'react-hot-toast';

export const RESOURCES_KEYS = {
  all: ['resources'] as const,
  recommended: () => [...RESOURCES_KEYS.all, 'recommended'] as const,
  search: (params: SearchResourcesParams) => [...RESOURCES_KEYS.all, 'search', params] as const,
  bookmarks: () => [...RESOURCES_KEYS.all, 'bookmarks'] as const,
};

export const useRecommendedResources = () => {
  return useQuery({
    queryKey: RESOURCES_KEYS.recommended(),
    queryFn: () => resourceApi.getRecommended(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchResources = <T extends BaseResource>(type: ResourceType, q?: string) => {
  return useInfiniteQuery({
    queryKey: RESOURCES_KEYS.search({ type, q }),
    queryFn: ({ pageParam = 1 }) => resourceApi.search<T>({ type, q, page: pageParam, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Mock bookmarks hook since backend is missing it
export const useBookmarks = () => {
  return useQuery({
    queryKey: RESOURCES_KEYS.bookmarks(),
    queryFn: () => resourceApi.getBookmarks(),
    staleTime: Infinity,
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type, action }: { id: string, type: ResourceType, action: 'add' | 'remove' }) => 
      resourceApi.toggleBookmark(id, type, action),
    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: RESOURCES_KEYS.bookmarks() });

      const previousBookmarks = queryClient.getQueryData<{ data: string[] }>(RESOURCES_KEYS.bookmarks());

      queryClient.setQueryData<{ data: string[] }>(RESOURCES_KEYS.bookmarks(), (old) => {
        const list = old?.data || [];
        return {
          data: action === 'add' ? [...list, id] : list.filter(bId => bId !== id)
        };
      });

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      if (context?.previousBookmarks) {
        queryClient.setQueryData(RESOURCES_KEYS.bookmarks(), context.previousBookmarks);
      }
      toast.error('Failed to update bookmark');
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: RESOURCES_KEYS.bookmarks() }); // Mocked, so no need to refetch
    }
  });
};
