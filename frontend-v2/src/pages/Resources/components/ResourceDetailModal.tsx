import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Bookmark, BookmarkCheck, Calendar, Clock, MapPin, IndianRupee, Zap, Tag } from "lucide-react";
import type { Resource } from "../../../types/resource";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

interface ResourceDetailModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

export const ResourceDetailModal = ({ resource, isOpen, onClose, isBookmarked, onToggleBookmark }: ResourceDetailModalProps) => {
  if (!resource) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header / Image Cover */}
            <div className="h-160 sm:h-200 w-full bg-brand-light relative shrink-0">
              {resource.image ? (
                <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-10">
                  <Zap size={64} className="text-brand-primary" />
                </div>
              )}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-16 right-16 p-8 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-24 md:p-32 overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-start gap-16 mb-8">
                <Badge variant="default" className="uppercase tracking-wider text-[10px]">
                  {resource.type}
                </Badge>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-text-main leading-tight mb-8">
                {resource.title}
              </h2>
              
              <div className="text-text-muted text-sm font-medium mb-24 flex items-center gap-8">
                <span>By {resource.provider}</span>
                {resource.isFree !== undefined && (
                  <>
                    <span>•</span>
                    <span className="text-brand-primary bg-brand-light px-8 py-2 rounded-full text-xs">
                      {resource.isFree ? "Free" : "Paid"}
                    </span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-32 p-16 bg-gray-50 rounded-xl border border-border">
                {resource.duration && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-4 flex items-center gap-4">
                      <Clock size={12} /> Duration
                    </p>
                    <p className="text-sm font-medium">{resource.duration}</p>
                  </div>
                )}
                {resource.difficulty && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-4 flex items-center gap-4">
                      <Zap size={12} /> Difficulty
                    </p>
                    <p className="text-sm font-medium">{resource.difficulty}</p>
                  </div>
                )}
                {resource.location && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-4 flex items-center gap-4">
                      <MapPin size={12} /> Location
                    </p>
                    <p className="text-sm font-medium">{resource.location}</p>
                  </div>
                )}
                {resource.amount && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-4 flex items-center gap-4">
                      <IndianRupee size={12} /> Amount
                    </p>
                    <p className="text-sm font-medium">{resource.amount}</p>
                  </div>
                )}
                {resource.deadline && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-4 flex items-center gap-4">
                      <Calendar size={12} /> Deadline
                    </p>
                    <p className="text-sm font-medium">{resource.deadline}</p>
                  </div>
                )}
              </div>

              <div className="mb-32">
                <h4 className="text-sm font-bold text-text-main mb-8">About this {resource.type}</h4>
                <p className="text-text-main/80 text-sm leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {resource.skills && resource.skills.length > 0 && (
                <div className="mb-32">
                  <h4 className="text-sm font-bold text-text-main mb-12 flex items-center gap-6">
                    <Tag size={16} /> Skills you'll gain
                  </h4>
                  <div className="flex flex-wrap gap-8">
                    {resource.skills.map((skill) => (
                      <Badge key={skill} variant="default" className="text-text-muted bg-white border-border">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-24 border-t border-border bg-gray-50 flex items-center gap-16 shrink-0">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onToggleBookmark(resource.id)}
                className={`flex-1 md:flex-none ${isBookmarked ? "border-brand-primary text-brand-primary bg-brand-light" : ""}`}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck size={18} className="mr-8 fill-current" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={18} className="mr-8" />
                    Save for Later
                  </>
                )}
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                className="flex-1"
                onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
              >
                View {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                <ExternalLink size={18} className="ml-8" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
