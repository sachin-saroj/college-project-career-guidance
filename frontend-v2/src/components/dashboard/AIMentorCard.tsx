import { ArrowRight, Bot, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QUICK_PROMPTS = [
  "Suggest tech careers",
  "Review my resume",
];

export const AIMentorCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTyping, setIsTyping] = useState(true);
  const [message, setMessage] = useState("");
  
  const firstName = user ? user.name.split(" ")[0] : "Guest";

  useEffect(() => {
    // Simulate AI "thinking" then typing out a response
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessage(`Hi ${firstName}! I'm here to help you choose the right career path.`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [firstName]);

  return (
    <Card hoverEffect className="relative overflow-hidden bg-white h-full flex flex-col justify-between group">
      <CardContent className="p-24 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-8">
            <div className="h-32 w-32 rounded-full bg-brand-light text-brand-primary flex items-center justify-center relative">
              <Bot size={18} />
              {isTyping && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary"></span>
                </span>
              )}
            </div>
            <h3 className="font-bold text-[18px] text-text-main flex items-center gap-2">
              AI Mentor <Sparkles size={14} className="text-status-warning" />
            </h3>
          </div>
        </div>
        
        <div className="flex-1 min-h-[60px] flex items-start mb-16">
          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.div 
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-text-muted text-sm font-medium bg-gray-50 px-12 py-8 rounded-lg rounded-tl-none w-fit border border-border"
              >
                <Loader2 size={14} className="animate-spin mr-2" />
                Thinking...
              </motion.div>
            ) : (
              <motion.p 
                key="message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-body text-text-main leading-relaxed font-medium bg-brand-light/30 px-16 py-12 rounded-lg rounded-tl-none w-[85%] border border-brand-primary/10"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-8 mt-auto">
          {!isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-8"
            >
              {QUICK_PROMPTS.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => navigate('/mentor')}
                  className="text-xs bg-gray-50 hover:bg-gray-100 text-text-muted hover:text-text-main border border-border px-10 py-6 rounded-full transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}

          <Button 
            onClick={() => navigate('/mentor')}
            variant="outline" 
            size="sm" 
            className="w-full mt-4 gap-8 rounded-full border-brand-primary/20 hover:bg-brand-light text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all"
          >
            Open Chat
            <ArrowRight size={16} />
          </Button>
        </div>

      </CardContent>

      {/* Decorative Background */}
      <div className="absolute right-0 bottom-0 w-[45%] h-[80%] pointer-events-none flex items-end justify-end p-8 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/5 rounded-tl-full opacity-80 scale-150 transform translate-x-1/4 translate-y-1/4 group-hover:scale-[1.75] transition-transform duration-700 ease-out" />
          <Bot size={120} className="absolute -bottom-8 -right-8 text-brand-primary opacity-[0.03] group-hover:opacity-[0.05] group-hover:-translate-y-4 group-hover:-translate-x-4 transition-all duration-700 ease-out" />
      </div>
    </Card>
  );
};
