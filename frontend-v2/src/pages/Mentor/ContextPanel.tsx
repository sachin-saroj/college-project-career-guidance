import { useChatStore } from "../../store/useChatStore";
import { useAuth } from "../../context/AuthContext";
import { User, Brain, Target, Star, FileText } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

export const ContextPanel = () => {
  const { isContextPanelOpen } = useChatStore();
  const { user } = useAuth();

  const rec = user?.lastRecommendations;
  const skillsList = rec?.skills || (user?.skills ? user.skills.split(',').map(s => s.trim()) : ["Problem Solving", "Communication", "Logic"]);
  const topMatchTitle = rec?.topMatch || user?.careerGoal || "Career Discovery Pending";
  const matchScore = rec?.matchScore || 85;

  return (
    <AnimatePresence>
      {isContextPanelOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full border-l border-white/10 bg-[#17171c] text-white hidden lg:flex flex-col shrink-0 overflow-hidden"
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/80 flex items-center gap-2">
              <User size={14} className="text-coral" /> STUDENT CONTEXT PIPELINE
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 w-[300px]">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-coral" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">TOP MATCH</span>
              </div>
              <div className="font-display text-lg text-white mb-2">{topMatchTitle}</div>
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                <div className="bg-[#003c33] border border-[#003c33] h-1.5 rounded-full" style={{ width: `${matchScore}%` }} />
              </div>
              <span className="font-mono text-[10px] text-white/50">{matchScore}% compatibility match score</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-amber-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">ASSESSED SKILLS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-white/20 text-white text-[10px]">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-[#edfce9]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">ACTIVE GOALS</span>
              </div>
              <ul className="text-xs text-white/80 space-y-2 font-sans list-disc pl-4">
                <li>{user?.careerGoal ? `Target: ${user.careerGoal}` : "Complete assessment to lock primary goal"}</li>
                <li>Build portfolio & practical projects</li>
                <li>Apply for relevant internships</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-sky-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">INDEXED RESUME</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10 font-mono text-xs">
                <span className="text-white/90 truncate">{user?.resumeText ? "User_Resume_Indexed.pdf" : "No Resume Uploaded"}</span>
                <span className="text-[10px] text-white/40 ml-2 shrink-0">{user?.resumeText ? "INDEXED" : "PENDING"}</span>
              </div>
            </div>

            <p className="font-mono text-[10px] text-white/30 text-center pt-2 uppercase">
              RAG CONTEXT INJECTED INTO MENTOR MODEL
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


