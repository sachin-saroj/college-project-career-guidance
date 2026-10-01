import { useChatStore } from "../../store/useChatStore";
import { useAuth } from "../../context/AuthContext";
import { User, Brain, Target, Star, FileText, X } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface ContextPanelProps {
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const ContextPanel = ({ isMobileDrawer, onCloseMobile }: ContextPanelProps) => {
  const { isContextPanelOpen } = useChatStore();
  const { user } = useAuth();

  const rec = user?.lastRecommendations;
  const skillsList = rec?.skills || (user?.skills ? user.skills.split(',').map(s => s.trim()) : ["Problem Solving", "Communication", "Logic"]);
  const topMatchTitle = rec?.topMatch || user?.careerGoal || "Career Discovery Pending";
  const matchScore = rec?.matchScore || 85;

  const content = (
    <div className={cn(
      "h-full border-l border-[#d9d9dd] bg-[#f7f7f6] text-ink flex flex-col shrink-0 overflow-hidden",
      isMobileDrawer ? "w-full" : "w-[300px]"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-[#d9d9dd] flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-wider text-slate flex items-center gap-2">
          <User size={14} className="text-[#003c33]" /> STUDENT PROFILE CONTEXT
        </h3>
        {isMobileDrawer && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg hover:bg-[#eeece7] text-slate hover:text-ink transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Top Career Recommendation */}
        <div className="bg-white border border-[#d9d9dd] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-[#003c33]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate">TOP MATCH</span>
          </div>
          <div className="font-display text-base font-semibold text-ink mb-2">{topMatchTitle}</div>
          <div className="w-full bg-[#eeece7] rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-[#003c33] h-full rounded-full transition-all duration-500" style={{ width: `${matchScore}%` }} />
          </div>
          <span className="font-mono text-[10px] text-slate">{matchScore}% compatibility match score</span>
        </div>

        {/* Assessed Skills */}
        <div className="bg-white border border-[#d9d9dd] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-amber-500" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate">KEY SKILLS</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skillsList.map((skill: string, idx: number) => (
              <Badge key={idx} variant="outline" className="border-[#d9d9dd] text-ink text-[11px] bg-[#eeece7]">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Career Goal */}
        <div className="bg-white border border-[#d9d9dd] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-[#003c33]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate">ACTIVE GOAL</span>
          </div>
          <p className="text-xs text-ink leading-relaxed">
            {user?.careerGoal || "Take the AI Assessment to lock in tailored guidance."}
          </p>
        </div>

        {/* Resume status */}
        <div className="bg-white border border-[#d9d9dd] rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#003c33]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate">RESUME CONTEXT</span>
          </div>
          <p className="text-xs text-ink">
            {user?.resumeText ? "✓ Resume text connected to AI context" : "Upload your resume in Resume Builder to enhance AI responses"}
          </p>
        </div>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return content;
  }

  return (
    <AnimatePresence>
      {isContextPanelOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="hidden lg:flex h-full shrink-0 overflow-hidden"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
