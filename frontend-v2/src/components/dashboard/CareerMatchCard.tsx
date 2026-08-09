import { Target, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CareerMatchCard = ({ recommendation }: { recommendation?: any }) => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  
  const matches = recommendation ? [
    { id: 1, name: recommendation.topMatch, match: recommendation.matchScore }
  ] : [];


  return (
    <Card hoverEffect className="h-full flex flex-col group">
      <CardContent className="p-24 pb-32 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-8">
            <div className="text-brand-primary">
              <Target size={18} />
            </div>
            <h3 className="font-bold text-[18px] text-text-main">Top Career Matches</h3>
          </div>
          <button 
            onClick={() => navigate('/assessment')}
            className="text-small font-semibold text-brand-primary hover:text-brand-accent transition-colors flex items-center group-hover:underline"
          >
            View All <ChevronRight size={14} className="ml-2 group-hover:translate-x-4 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-16">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-16 w-full"
              >
                {[1, 2].map((i) => (
                  <div key={i} className="w-full flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-12">
                        <div className="h-24 w-24 rounded-full bg-gray-100 animate-pulse" />
                        <div className="h-16 w-32 bg-gray-100 animate-pulse rounded" />
                      </div>
                      <div className="h-16 w-16 bg-gray-100 animate-pulse rounded" />
                    </div>
                    <div className="w-full h-[6px] bg-gray-100 animate-pulse rounded-full" />
                  </div>
                ))}
              </motion.div>
            ) : matches.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-16 w-full"
              >
                {matches.map((match) => (
                  <motion.div 
                    key={match.id} 
                    className="w-full group/row cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/roadmaps')}
                  >
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-12">
                        <div className="h-24 w-24 rounded-full bg-brand-light flex items-center justify-center text-[11px] font-bold text-brand-primary group-hover/row:bg-brand-primary group-hover/row:text-white transition-colors">
                          {match.id}
                        </div>
                        <span className="text-body font-medium text-text-main group-hover/row:text-brand-primary transition-colors">{match.name}</span>
                      </div>
                      <span className="text-small font-semibold text-status-success">{match.match}% Match</span>
                    </div>
                    <div className="w-full h-[6px] bg-brand-light rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${match.match}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          match.match >= 90 ? "bg-status-success" : "bg-status-success/70"
                        )} 
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center px-16"
              >
                <div className="h-48 w-48 bg-brand-light/50 rounded-full flex items-center justify-center mb-12">
                  <Target size={20} className="text-brand-primary/50" />
                </div>
                <p className="text-small text-text-muted mb-12">Take an assessment to see your career matches.</p>
                <button onClick={() => navigate('/assessment')} className="text-xs font-semibold text-brand-primary hover:underline">Start Assessment</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
