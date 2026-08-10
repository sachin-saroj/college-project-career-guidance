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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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

  // Simple rule-based recommendations
  const recommendedResources = allResources.filter(r => r.featured && !bookmarkIds.includes(r.id)).slice(0, 3);

  const catalogResources = activeCategory === "All" && !debouncedQuery && recommendedResources.length > 0
    ? filteredResources.filter(r => !recommendedResources.some(rec => rec.id === r.id))
    : filteredResources;

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <TopNavbar />
        
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-2 w-fit">
                KNOWLEDGE & OPPORTUNITY HUB
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-normal text-ink tracking-tight mb-2">
                Curated Knowledge & Opportunities
              </h1>
              <p className="text-slate text-sm max-w-2xl leading-relaxed">
                Discover verified courses, scholarships, internships, and skill roadmaps tailored for career advancement.
              </p>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="flex flex-col gap-4 mb-8 sticky top-0 bg-white/95 backdrop-blur-md z-10 py-4 border-b border-[#e5e7eb]">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, skills, providers..."
                  className="w-full h-10 pl-10 pr-4 rounded-md bg-white border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none transition-all font-sans text-xs text-ink placeholder:text-slate"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      if (category === "Roadmaps") {
                        navigate("/roadmaps");
                      } else {
                        setActiveCategory(category);
                      }
                    }}
                    className={`px-3.5 py-1 rounded-full font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap border ${
                      activeCategory === category
                        ? "bg-[#17171c] text-white border-[#17171c]"
                        : "bg-[#eeece7]/60 hover:bg-[#eeece7] text-slate hover:text-ink border-[#d9d9dd]"
                    }`}
                  >
                    {category === "Saved" && <Bookmark size={12} className="inline mr-1.5" />}
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations */}
            {activeCategory === "All" && !debouncedQuery && recommendedResources.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-lg font-normal text-ink mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#003c33]" />
                  FEATURED RECOMMENDATIONS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="mb-8">
              <h2 className="font-display text-lg font-normal text-ink mb-4">
                {activeCategory === "All" && !debouncedQuery ? (recommendedResources.length > 0 ? "Catalog Resources" : "All Catalog Resources") : 
                 activeCategory === "Saved" ? "Bookmarked Resources" : 
                 debouncedQuery ? `Search Results for "${debouncedQuery}"` :
                 activeCategory}
              </h2>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[320px] bg-[#eeece7] animate-pulse rounded-[22px]" />
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[#eeece7]/40 rounded-[22px] border border-dashed border-[#d9d9dd]">
                  <FolderX size={40} className="text-red-500/60 mb-3" />
                  <p className="font-display text-base text-ink mb-2">Failed to load catalog resources.</p>
                  <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['resources'] })}>
                    Retry Request
                  </Button>
                </div>
              ) : catalogResources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[#eeece7]/40 rounded-[22px] border border-dashed border-[#d9d9dd]">
                  <FolderX size={40} className="text-slate/40 mb-3" />
                  <p className="font-display text-base text-ink mb-1">
                    {activeCategory === "Saved" 
                      ? "No bookmarked resources in your account."
                      : "No resources found matching criteria."}
                  </p>
                  <p className="font-mono text-xs text-slate">Try clearing your filters or search keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catalogResources.map(resource => (
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

