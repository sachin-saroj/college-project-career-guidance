import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Database, Sparkles } from "lucide-react";

const steps = [
  { id: 1, text: "ANALYZING RESPONSES...", icon: Brain },
  { id: 2, text: "COMPUTING CAREER COMPATIBILITY...", icon: Search },
  { id: 3, text: "MAPPING REQUIRED SKILLSETS...", icon: Database },
  { id: 4, text: "GENERATING AI CAREER ROADMAP...", icon: Sparkles },
];

export const Processing = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] max-w-md mx-auto py-12">
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        <motion.div 
          className="absolute inset-0 rounded-full border border-[#17171c]/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-16 h-16 bg-[#17171c] rounded-full flex items-center justify-center text-white z-10"
          >
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon size={24} />;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-2.5 py-1 rounded mb-3 border border-[#003c33]/15">
        GEMINI AI DIAGNOSTIC
      </span>

      <AnimatePresence mode="wait">
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="font-mono text-sm font-semibold text-ink text-center tracking-wider"
        >
          {steps[currentStep].text}
        </motion.h2>
      </AnimatePresence>
      
      <p className="text-xs text-slate mt-2 text-center max-w-xs">
        Evaluating responses against national labor market demands & skill taxonomies.
      </p>
    </div>
  );
};

