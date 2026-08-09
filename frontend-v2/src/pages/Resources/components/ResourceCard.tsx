import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, GraduationCap, Map, Briefcase, FileText, IndianRupee, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { Resource, ResourceType } from "../../../types/resource";

interface ResourceCardProps {
  resource: Resource;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onClick: (resource: Resource) => void;
}

const getTypeIcon = (type: ResourceType) => {
  switch (type) {
    case "course": return <GraduationCap size={14} className="mr-4" />;
    case "scholarship": return <IndianRupee size={14} className="mr-4" />;
    case "internship": return <Briefcase size={14} className="mr-4" />;
    case "roadmap": return <Map size={14} className="mr-4" />;
    case "article": return <FileText size={14} className="mr-4" />;
  }
};

const getTypeColor = (type: ResourceType) => {
  switch (type) {
    case "course": return "bg-blue-50 text-blue-700 border-blue-200";
    case "scholarship": return "bg-green-50 text-green-700 border-green-200";
    case "internship": return "bg-purple-50 text-brand-primary border-purple-200";
    case "roadmap": return "bg-orange-50 text-orange-700 border-orange-200";
    case "article": return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const ResourceCard = ({ resource, isBookmarked, onToggleBookmark, onClick }: ResourceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full flex"
    >
      <Card 
        className="h-full flex flex-col hover:shadow-lift transition-shadow cursor-pointer w-full group overflow-hidden border-border/50"
        onClick={() => onClick(resource)}
      >
        {resource.image && (
          <div className="w-full h-120 bg-gray-100 overflow-hidden shrink-0 relative">
            <img 
              src={resource.image} 
              alt={resource.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {resource.featured && (
              <div className="absolute top-8 left-8 bg-brand-primary text-white text-[10px] font-bold px-8 py-2 rounded-full flex items-center gap-4">
                <Zap size={10} /> FEATURED
              </div>
            )}
          </div>
        )}
        
        <CardContent className="p-20 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-12">
            <Badge variant="default" className={`capitalize flex items-center text-[10px] ${getTypeColor(resource.type)}`}>
              {getTypeIcon(resource.type)}
              {resource.type}
            </Badge>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(resource.id);
              }}
              className={`p-6 rounded-full transition-colors ${
                isBookmarked 
                  ? "bg-brand-primary/10 text-brand-primary" 
                  : "text-text-muted hover:bg-gray-100"
              }`}
            >
              {isBookmarked ? <BookmarkCheck size={16} className="fill-brand-primary" /> : <Bookmark size={16} />}
            </button>
          </div>

          <h3 className="text-body font-semibold text-text-main line-clamp-2 mb-4 leading-tight group-hover:text-brand-primary transition-colors">
            {resource.title}
          </h3>
          <p className="text-xs text-text-muted mb-12">{resource.provider}</p>
          
          <p className="text-sm text-text-main line-clamp-2 mb-16 flex-1">
            {resource.description}
          </p>

          <div className="flex flex-wrap gap-8 mb-16">
            {resource.difficulty && (
              <Badge variant="default" className="text-[10px] bg-gray-50">{resource.difficulty}</Badge>
            )}
            {resource.duration && (
              <Badge variant="default" className="text-[10px] bg-gray-50 flex items-center gap-4">
                <Clock size={10} /> {resource.duration}
              </Badge>
            )}
            {resource.amount && (
              <Badge variant="default" className="text-[10px] bg-green-50 text-green-700">
                {resource.amount}
              </Badge>
            )}
            {resource.isFree !== undefined && (
              <Badge variant="default" className="text-[10px] bg-brand-light text-brand-primary">
                {resource.isFree ? "Free" : "Paid"}
              </Badge>
            )}
          </div>

          <div className="pt-16 border-t border-border mt-auto flex justify-between items-center">
            <div className="flex gap-4 max-w-[60%] overflow-hidden">
              {resource.skills?.slice(0, 2).map(skill => (
                <span key={skill} className="text-[10px] text-text-muted bg-gray-50 px-6 py-2 rounded border border-border/50 truncate">
                  {skill}
                </span>
              ))}
              {resource.skills && resource.skills.length > 2 && (
                <span className="text-[10px] text-text-muted px-6 py-2">+{resource.skills.length - 2}</span>
              )}
            </div>
            
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-medium text-brand-primary hover:text-brand-primary/80 flex items-center gap-4"
            >
              View 
              <ExternalLink size={12} />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
