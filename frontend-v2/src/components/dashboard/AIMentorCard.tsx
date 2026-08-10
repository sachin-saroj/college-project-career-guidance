import { ArrowRight, Bot, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QUICK_PROMPTS = [
  "Commerce CA / Banking Strategy",
  "UPSC / Govt Exams Roadmap",
  "Top Scholarships for Underprivileged",
  "Tech & Skilled Trade Pathways",
];

export const AIMentorCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(true);
  const [message, setMessage] = useState("");
  
  const firstName = user ? user.name.split(" ")[0] : "Student";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessage(`Hi ${firstName}! I'm your dedicated CareerSathi AI Advisor. Tap any goal prompt or open the console to start.`);
    }, 600);
    return () => clearTimeout(timer);
  }, [firstName]);

  const handlePromptClick = (promptText: string) => {
    navigate('/mentor', { state: { initialPrompt: promptText } });
  };

  return (
    <Card variant="dark" hoverEffect className="relative overflow-hidden h-full flex flex-col justify-between p-6">
      <CardContent className="p-0 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-white/10 text-white flex items-center justify-center border border-white/20">
              <Bot size={16} />
            </div>
            <h3 className="font-display text-lg font-normal text-white flex items-center gap-1.5">
              AI Mentor Console <Sparkles size={14} className="text-coral" />
            </h3>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded border border-white/10">
            {isTyping ? "ANALYZING..." : "ONLINE"}
          </span>
        </div>
        
        <div className="flex-1 min-h-[56px] flex items-start mb-4">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.div 
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-white/80 font-mono text-xs bg-white/10 px-3 py-2 rounded-md border border-white/10"
              >
                <Loader2 size={14} className="animate-spin text-coral" />
                Initializing Gemini session...
              </motion.div>
            ) : (
              <motion.p 
                key="message"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] text-white/90 leading-relaxed font-normal bg-white/10 px-3.5 py-3 rounded-md border border-white/10"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          {!isTyping && (
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="font-mono text-[10px] bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 px-2.5 py-1 rounded-full transition-all hover:scale-105"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <Button 
            onClick={() => navigate('/mentor')}
            variant="dark-pill" 
            size="sm" 
            className="w-full justify-between mt-1 text-xs font-mono"
          >
            <span>START CONVERSATION →</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
