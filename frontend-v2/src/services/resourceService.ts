import api from "../utils/api";
import type { Resource, ResourceResponse, SingleResourceResponse } from "../types/resource";

export const resourceService = {
  // Get all resources and user bookmarks
  getAllResources: async (): Promise<ResourceResponse> => {
    const response = await api.get('/resources');
    return response.data;
  },

  // Search resources
  searchResources: async (query: string): Promise<{ resources: Resource[] }> => {
    const response = await api.get('/resources/search', {
      params: { q: query }
    });
    return response.data;
  },

  // Get a single resource
  getResourceById: async (id: number): Promise<SingleResourceResponse> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Get bookmarked resources
  getBookmarks: async (): Promise<ResourceResponse> => {
    const response = await api.get('/resources/bookmarks');
    return response.data;
  },

  // Add bookmark
  addBookmark: async (resourceId: number): Promise<{ bookmarkIds: number[] }> => {
    const response = await api.post('/resources/bookmarks', { resourceId });
    return response.data;
  },

  // Remove bookmark
  removeBookmark: async (resourceId: number): Promise<{ bookmarkIds: number[] }> => {
    const response = await api.delete(`/resources/bookmarks/${resourceId}`);
    return response.data;
  }
};
