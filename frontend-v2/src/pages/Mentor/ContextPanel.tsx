import { useChatStore } from "../../store/useChatStore";
import { User, Brain, Target, Star, FileText } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

export const ContextPanel = () => {
  const { isContextPanelOpen } = useChatStore();

  return (
    <AnimatePresence>
      {isContextPanelOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full border-l bg-white hidden lg:flex flex-col shrink-0 overflow-hidden"
        >
          <div className="p-16 border-b">
            <h3 className="font-semibold text-text-main flex items-center">
              <User size={16} className="mr-8" /> Student Context
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-16 space-y-16 w-[320px]">
            <Card>
              <CardContent className="p-16">
                <div className="flex items-center gap-8 mb-12">
                  <Brain size={16} className="text-brand-primary" />
                  <h4 className="text-small font-semibold text-text-main">Assessment Match</h4>
                </div>
                <div className="text-h4 font-bold text-text-main mb-4">Software Engineer</div>
                <div className="w-full bg-brand-light rounded-full h-8 mb-8">
                  <div className="bg-brand-primary h-8 rounded-full" style={{ width: "92%" }} />
                </div>
                <p className="text-xs text-text-muted">92% match based on your recent assessment.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-16">
                <div className="flex items-center gap-8 mb-12">
                  <Star size={16} className="text-amber-500" />
                  <h4 className="text-small font-semibold text-text-main">Top Skills</h4>
                </div>
                <div className="flex flex-wrap gap-8">
                  <Badge variant="default">Problem Solving</Badge>
                  <Badge variant="default">Logic</Badge>
                  <Badge variant="default">Mathematics</Badge>
                  <Badge variant="default">Programming</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-16">
                <div className="flex items-center gap-8 mb-12">
                  <Target size={16} className="text-status-success" />
                  <h4 className="text-small font-semibold text-text-main">Current Goals</h4>
                </div>
                <ul className="text-small text-text-muted list-disc pl-16 space-y-4">
                  <li>Learn Python programming</li>
                  <li>Find a summer internship</li>
                  <li>Improve communication skills</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-16">
                <div className="flex items-center gap-8 mb-12">
                  <FileText size={16} className="text-blue-500" />
                  <h4 className="text-small font-semibold text-text-main">Resume</h4>
                </div>
                <div className="flex items-center justify-between p-8 bg-background-alt rounded border">
                  <span className="text-small text-text-main truncate">my_resume_v2.pdf</span>
                  <span className="text-xs text-text-muted ml-8 shrink-0">Updated 2d ago</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-text-muted text-center pt-8">
              CareerSathi uses this context to provide personalized guidance.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
