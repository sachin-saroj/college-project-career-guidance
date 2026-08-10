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
    <Card variant="stone" hoverEffect className="h-full flex flex-col p-6">
      <CardContent className="p-0 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-ink">
              <Target size={16} />
            </div>
            <h3 className="font-display text-lg font-normal text-ink">Career Match Insight</h3>
          </div>
          <button 
            onClick={() => navigate('/assessment')}
            className="font-mono text-xs text-ink hover:underline flex items-center gap-1"
          >
            All matches <ChevronRight size={12} />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex flex-col gap-3 w-full">
                <div className="h-4 w-3/4 bg-[#d9d9dd] animate-pulse rounded" />
                <div className="h-2 w-full bg-[#d9d9dd] animate-pulse rounded-full" />
              </div>
            ) : matches.length > 0 ? (
              <div className="flex flex-col gap-4 w-full">
                {matches.map((match) => (
                  <div 
                    key={match.id} 
                    className="w-full cursor-pointer bg-white border border-[#d9d9dd] rounded-lg p-4"
                    onClick={() => navigate('/roadmaps')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate block mb-1">
                          RECOMMENDED CAREER
                        </span>
                        <span className="font-display text-xl font-normal text-ink">{match.name}</span>
                      </div>
                      <span className="font-mono text-xs bg-[#edfce9] text-[#003c33] px-2.5 py-1 rounded border border-[#003c33]/15">
                        {match.match}% Compatibility
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#eeece7] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${match.match}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full bg-[#003c33] rounded-full")} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-white border border-[#d9d9dd] rounded-lg">
                <Target size={24} className="text-slate mb-2" />
                <h4 className="font-display text-sm font-medium text-ink mb-1">No Assessment Taken</h4>
                <p className="text-xs text-slate mb-3">Take the career assessment to unlock AI match scoring.</p>
                <button 
                  onClick={() => navigate('/assessment')}
                  className="font-mono text-xs bg-[#17171c] text-white px-3 py-1.5 rounded-full hover:bg-black"
                >
                  Start Assessment
                </button>
              </div>
            )}
          </AnimatePresence>

          {matches.length > 0 && (
            <button 
              onClick={() => navigate('/roadmaps')}
              className="w-full font-mono text-xs text-slate hover:text-ink text-center pt-2 border-t border-[#d9d9dd]"
            >
              EXPLORE CAREER ROADMAP & SKILLS →
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
