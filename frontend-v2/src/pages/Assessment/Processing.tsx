import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Database, Sparkles } from "lucide-react";

const steps = [
  { id: 1, text: "Analyzing Personality...", icon: Brain },
  { id: 2, text: "Matching Careers...", icon: Search },
  { id: 3, text: "Finding Skills...", icon: Database },
  { id: 4, text: "Preparing Report...", icon: Sparkles },
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
    }, 900); // changes every 0.9s (total ~3.6s for 4 steps, matching the 4000ms delay in store)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[600px] max-w-md mx-auto">
      <div className="relative w-120 h-120 mb-40 flex items-center justify-center">
        {/* Pulsing background rings */}
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-brand-light"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute inset-8 rounded-full border-4 border-brand-primary/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Dynamic Icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-80 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-primary/30 z-10"
          >
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon size={40} />;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-h3 font-bold text-text-main text-center"
        >
          {steps[currentStep].text}
        </motion.h2>
      </AnimatePresence>
      
      <p className="text-body text-text-muted mt-16 text-center max-w-xs">
        Our AI is crunching the data to find your optimal career paths.
      </p>
    </div>
  );
};
