import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, GraduationCap, Map, Briefcase, FileText, IndianRupee, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import type { Resource, ResourceType } from "../../../types/resource";

interface ResourceCardProps {
  resource: Resource;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onClick: (resource: Resource) => void;
}

const getTypeIcon = (type: ResourceType) => {
  switch (type) {
    case "course": return <GraduationCap size={12} className="mr-1.5" />;
    case "scholarship": return <IndianRupee size={12} className="mr-1.5" />;
    case "internship": return <Briefcase size={12} className="mr-1.5" />;
    case "roadmap": return <Map size={12} className="mr-1.5" />;
    case "article": return <FileText size={12} className="mr-1.5" />;
  }
};

export const ResourceCard = ({ resource, isBookmarked, onToggleBookmark, onClick }: ResourceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="h-full flex"
    >
      <Card 
        variant="stone"
        className="h-full flex flex-col hover:border-[#17171c] transition-all cursor-pointer w-full group overflow-hidden border border-[#d9d9dd]"
        onClick={() => onClick(resource)}
      >
        {resource.image && (
          <div className="w-full h-28 bg-[#eeece7] overflow-hidden shrink-0 relative border-b border-[#d9d9dd]">
            <img 
              src={resource.image} 
              alt={resource.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {resource.featured && (
              <div className="absolute top-2 left-2 bg-[#17171c] text-white font-mono text-[9px] uppercase font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <Zap size={10} className="text-coral" /> FEATURED
              </div>
            )}
          </div>
        )}
        
        <CardContent className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-mono text-[10px] uppercase font-semibold tracking-wider inline-flex items-center px-2 py-0.5 rounded bg-white text-ink border border-[#d9d9dd]">
                {getTypeIcon(resource.type)}
                {resource.type}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(resource.id);
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  isBookmarked 
                    ? "bg-[#003c33] text-white" 
                    : "text-slate hover:bg-black/5"
                }`}
              >
                {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              </button>
            </div>

            <h3 className="font-display text-base font-normal text-ink line-clamp-2 mb-1 group-hover:text-[#003c33] transition-colors leading-snug">
              {resource.title}
            </h3>
            <p className="font-mono text-xs text-slate mb-3">{resource.provider}</p>
            
            <p className="text-xs text-slate line-clamp-2 mb-4">
              {resource.description}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {resource.difficulty && (
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-white text-slate rounded border border-[#d9d9dd]">{resource.difficulty}</span>
              )}
              {resource.duration && (
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-white text-slate rounded border border-[#d9d9dd] inline-flex items-center gap-1">
                  <Clock size={10} /> {resource.duration}
                </span>
              )}
              {resource.amount && (
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-[#edfce9] text-[#003c33] rounded border border-[#003c33]/20">
                  {resource.amount}
                </span>
              )}
              {resource.isFree !== undefined && (
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-white text-ink font-semibold rounded border border-[#d9d9dd]">
                  {resource.isFree ? "Free" : "Paid"}
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-[#d9d9dd] mt-auto flex justify-between items-center">
              <div className="flex gap-1 max-w-[60%] overflow-hidden">
                {resource.skills?.slice(0, 2).map(skill => (
                  <span key={skill} className="font-mono text-[10px] text-slate bg-white px-2 py-0.5 rounded border border-[#d9d9dd] truncate">
                    {skill}
                  </span>
                ))}
                {resource.skills && resource.skills.length > 2 && (
                  <span className="font-mono text-[10px] text-slate px-1 py-0.5">+{resource.skills.length - 2}</span>
                )}
              </div>
              
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-xs font-medium text-ink hover:text-[#003c33] inline-flex items-center gap-1"
              >
                ACCESS
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

