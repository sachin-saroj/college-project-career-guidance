import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Bookmark, FolderX, Sparkles } from "lucide-react";

import { resourceService } from "../../services/resourceService";
import type { Resource } from "../../types/resource";
import { TopNavbar } from "../../components/layout/TopNavbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { ResourceCard } from "./components/ResourceCard";
import { ResourceDetailModal } from "./components/ResourceDetailModal";
import { Button } from "../../components/ui/Button";

const CATEGORIES = ["All", "Courses", "Scholarships", "Internships", "Roadmaps", "Articles", "Saved"];

export const ResourcesHub = ({ defaultCategory = "All" }: { defaultCategory?: string }) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Read search from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
      setDebouncedQuery(q);
    }
  }, [location.search]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      
      const params = new URLSearchParams(location.search);
      if (searchQuery) {
        params.set("q", searchQuery);
      } else {
        params.delete("q");
      }
      navigate({ search: params.toString() }, { replace: true });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, navigate, location.search]);

  // Fetch resources
  const { data, isLoading, error } = useQuery({
    queryKey: ['resources', debouncedQuery],
    queryFn: () => debouncedQuery ? resourceService.searchResources(debouncedQuery) : resourceService.getAllResources(),
  });

  const allResources = data?.resources || [];
  
  // Try to use bookmarkIds if returned in getAllResources (which it is), or default to empty
  const bookmarkIds = (data as any)?.bookmarkIds || []; 

  const toggleBookmarkMutation = useMutation({
    mutationFn: (resourceId: number) => {
      const isBookmarked = bookmarkIds.includes(resourceId);
      return isBookmarked ? resourceService.removeBookmark(resourceId) : resourceService.addBookmark(resourceId);
    },
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['resources'] });
      const previousData = queryClient.getQueryData(['resources', debouncedQuery]);
      
      // Optimistic update
      queryClient.setQueryData(['resources', debouncedQuery], (old: any) => {
        if (!old) return old;
        const oldBookmarks = old.bookmarkIds || [];
        const newBookmarks = oldBookmarks.includes(resourceId) 
          ? oldBookmarks.filter((id: number) => id !== resourceId)
          : [...oldBookmarks, resourceId];
        return { ...old, bookmarkIds: newBookmarks };
      });

      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['resources', debouncedQuery], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  const handleToggleBookmark = (id: number) => {
    toggleBookmarkMutation.mutate(id);
  };

  // Filter resources based on active category
  const filteredResources = allResources.filter(r => {
    if (activeCategory === "Saved") return bookmarkIds.includes(r.id);
    if (activeCategory === "All") return true;
    return r.category === activeCategory;
  });

  // Simple rule-based recommendations (just an example layer)
  const recommendedResources = allResources.filter(r => r.featured && !bookmarkIds.includes(r.id)).slice(0, 3);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-y-auto px-16 sm:px-32 py-32 pb-64">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-32">
              <h1 className="text-3xl font-bold text-text-main mb-8">
                Resources that help you move forward.
              </h1>
              <p className="text-text-muted text-base max-w-2xl leading-relaxed">
                Discover curated courses, scholarships, internships, and roadmaps to guide your career journey.
              </p>
            </div>

            {/* Search and Tabs */}
            <div className="flex flex-col gap-24 mb-32 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-16 -mt-16 border-b border-border/50">
              <div className="relative max-w-md">
                <Search className="absolute left-16 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, skills, providers..."
                  className="w-full h-48 pl-48 pr-16 rounded-input bg-white border border-border focus:border-brand-primary/50 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-16 overflow-x-auto scrollbar-hide pb-4">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-16 py-8 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-text-main text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-text-muted hover:text-text-main"
                    }`}
                  >
                    {category === "Saved" && <Bookmark size={14} className="inline mr-6" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations (Only show on 'All' tab if no search) */}
            {activeCategory === "All" && !debouncedQuery && recommendedResources.length > 0 && (
              <div className="mb-48">
                <h2 className="text-lg font-bold text-text-main mb-16 flex items-center gap-8">
                  <Sparkles size={20} className="text-brand-primary" />
                  Recommended for you
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                  {recommendedResources.map(resource => (
                    <ResourceCard
                      key={`rec-${resource.id}`}
                      resource={resource}
                      isBookmarked={bookmarkIds.includes(resource.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onClick={setSelectedResource}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div className="mb-16">
              <h2 className="text-lg font-bold text-text-main mb-16">
                {activeCategory === "All" && !debouncedQuery ? "All Resources" : 
                 activeCategory === "Saved" ? "Saved Resources" : 
                 debouncedQuery ? `Search Results for "${debouncedQuery}"` :
                 activeCategory}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[350px] bg-gray-100 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-64 bg-gray-50 rounded-2xl border border-dashed border-border">
                  <FolderX size={48} className="text-status-danger/50 mb-16" />
                  <p className="text-text-main font-medium mb-8">We couldn't load resources right now.</p>
                  <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['resources'] })}>
                    Try Again
                  </Button>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-64 bg-gray-50 rounded-2xl border border-dashed border-border">
                  <FolderX size={48} className="text-text-muted/50 mb-16" />
                  <p className="text-text-main font-medium mb-8">
                    {activeCategory === "Saved" 
                      ? "You haven't saved any resources yet."
                      : "No resources found matching your criteria."}
                  </p>
                  <p className="text-sm text-text-muted">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
                  {filteredResources.map(resource => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isBookmarked={bookmarkIds.includes(resource.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onClick={setSelectedResource}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <ResourceDetailModal 
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        isBookmarked={selectedResource ? bookmarkIds.includes(selectedResource.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
};
