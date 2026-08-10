import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Bot, 
  FileText, 
  Map, 
  PlusCircle, 
  X, 
  ArrowRight, 
  Check
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal = ({ isOpen, onClose }: QuickActionModalProps) => {
  const navigate = useNavigate();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("Assessment");
  const [taskDueDate, setTaskDueDate] = useState("Today");
  const [taskSuccessMessage, setTaskSuccessMessage] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setTaskSuccessMessage(true);
    setTimeout(() => {
      setTaskSuccessMessage(false);
      setIsTaskFormOpen(false);
      setTaskTitle("");
      onClose();
    }, 1200);
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-lift border border-[#d9d9dd] overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-0.5 rounded border border-[#003c33]/15 block mb-1 w-fit">
                INSTANT WORKSPACE SHORTCUTS
              </span>
              <h3 className="font-display text-2xl font-normal text-ink">Quick Action Hub</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#eeece7] text-slate hover:text-ink transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Action Grid */}
          {!isTaskFormOpen ? (
            <div className="space-y-4 my-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <button
                  onClick={() => handleNavigate("/assessment")}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d9d9dd] hover:border-[#17171c] hover:bg-[#f7f7f6] transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#17171c] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-normal text-ink group-hover:text-[#003c33] flex items-center gap-1">
                      Take Career Assessment <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-slate text-xs mt-0.5">Discover top career matches based on skills & interest profile.</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate("/mentor")}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d9d9dd] hover:border-[#17171c] hover:bg-[#f7f7f6] transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#003c33] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-normal text-ink group-hover:text-[#003c33] flex items-center gap-1">
                      Ask AI Career Mentor <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-slate text-xs mt-0.5">Instant AI guidance for course selection, exams, and career strategy.</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate("/resume")}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d9d9dd] hover:border-[#17171c] hover:bg-[#f7f7f6] transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#eeece7] text-ink flex items-center justify-center shrink-0 border border-[#d9d9dd] group-hover:scale-105 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-normal text-ink group-hover:text-[#003c33] flex items-center gap-1">
                      Build ATS Resume <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-slate text-xs mt-0.5">Create or edit hiring-ready resumes with AI scoring.</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate("/roadmaps")}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#d9d9dd] hover:border-[#17171c] hover:bg-[#f7f7f6] transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#eeece7] text-ink flex items-center justify-center shrink-0 border border-[#d9d9dd] group-hover:scale-105 transition-transform">
                    <Map size={20} />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-normal text-ink group-hover:text-[#003c33] flex items-center gap-1">
                      Explore Career Roadmaps <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-slate text-xs mt-0.5">Step-by-step pathways for CA, UPSC, Nursing, Trades & Tech.</p>
                  </div>
                </button>

              </div>

              {/* Add Custom Task Trigger Banner */}
              <div className="p-4 bg-[#f7f7f6] rounded-xl border border-[#d9d9dd] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlusCircle size={20} className="text-[#003c33]" />
                  <div>
                    <h4 className="font-display text-sm font-normal text-ink">Add Custom Dashboard Task</h4>
                    <p className="font-mono text-[11px] text-slate">Set custom goal reminders on your student dashboard.</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsTaskFormOpen(true)} className="font-mono text-xs">
                  CREATE TASK +
                </Button>
              </div>
            </div>
          ) : (
            /* Inline Custom Task Form */
            <form onSubmit={handleCreateTask} className="space-y-4 my-6">
              {taskSuccessMessage ? (
                <div className="p-4 bg-[#edfce9] text-[#003c33] rounded-xl border border-[#003c33]/20 flex items-center gap-3 font-mono text-xs">
                  <Check size={18} />
                  <span>Task created successfully!</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-mono text-xs uppercase text-slate mb-1 block">Task Title *</label>
                    <Input 
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Complete NSP Scholarship Application"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-xs uppercase text-slate mb-1 block">Category</label>
                      <select 
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                      >
                        <option value="Assessment">Assessment</option>
                        <option value="Resume">Resume</option>
                        <option value="Scholarship">Scholarship</option>
                        <option value="Learning">Learning</option>
                        <option value="General">General</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono text-xs uppercase text-slate mb-1 block">Due Date</label>
                      <select 
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-[#f7f7f6] border border-[#d9d9dd] focus:border-[#17171c] focus:outline-none font-sans text-xs text-ink"
                      >
                        <option value="Today">Today</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="This Week">This Week</option>
                        <option value="Next Week">Next Week</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsTaskFormOpen(false)}
                      className="font-mono text-xs"
                    >
                      BACK TO SHORTCUTS
                    </Button>
                    <Button type="submit" size="sm" className="font-mono text-xs">
                      SAVE TASK →
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between font-mono text-[11px] text-slate">
            <span>CAREERSATHI AI PLATFORM</span>
            <button onClick={onClose} className="hover:text-ink">CLOSE SHORTCUTS</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
