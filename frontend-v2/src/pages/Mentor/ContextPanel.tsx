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
          className="h-full border-l border-[#d9d9dd] bg-[#f7f7f6] text-ink hidden lg:flex flex-col shrink-0 overflow-hidden"
        >
          <div className="p-4 border-b border-[#d9d9dd] flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate flex items-center gap-2">
              <User size={14} className="text-[#003c33]" /> STUDENT CONTEXT PIPELINE
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 w-[300px]">
            <div className="bg-white border border-[#d9d9dd] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-[#003c33]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate">TOP MATCH</span>
              </div>
              <div className="font-display text-lg text-ink mb-2">{topMatchTitle}</div>
              <div className="w-full bg-[#eeece7] rounded-full h-1.5 mb-2">
                <div className="bg-[#003c33] h-1.5 rounded-full" style={{ width: `${matchScore}%` }} />
              </div>
              <span className="font-mono text-[10px] text-slate">{matchScore}% compatibility match score</span>
            </div>

            <div className="bg-white border border-[#d9d9dd] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-amber-500" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate">ASSESSED SKILLS</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="border-[#d9d9dd] text-ink text-[10px] bg-[#eeece7]">{skill}</Badge>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#d9d9dd] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-[#003c33]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate">ACTIVE GOALS</span>
              </div>
              <ul className="text-xs text-ink space-y-2 font-sans list-disc pl-4">
                <li>{user?.careerGoal ? `Target: ${user.careerGoal}` : "Complete assessment to lock primary goal"}</li>
                <li>Build portfolio & practical projects</li>
                <li>Apply for relevant internships</li>
              </ul>
            </div>

            <div className="bg-white border border-[#d9d9dd] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-sky-600" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate">INDEXED RESUME</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#f7f7f6] rounded border border-[#d9d9dd] font-mono text-xs">
                <span className="text-ink truncate">{user?.resumeText ? "User_Resume_Indexed.pdf" : "No Resume Uploaded"}</span>
                <span className="text-[10px] text-slate ml-2 shrink-0">{user?.resumeText ? "INDEXED" : "PENDING"}</span>
              </div>
            </div>

            <p className="font-mono text-[10px] text-slate text-center pt-2 uppercase">
              RAG CONTEXT INJECTED INTO MENTOR MODEL
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
