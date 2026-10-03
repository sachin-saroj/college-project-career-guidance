import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { BrainCircuit, Clock, HelpCircle, Target, ArrowRight } from "lucide-react";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export const Landing = () => {
  const { setStep, result } = useAssessmentStore();
  const { user } = useAuth();

  const hasExisting = Boolean(result || user?.lastRecommendations);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col items-center justify-center max-w-3xl mx-auto py-8"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#003c33] bg-[#edfce9] px-3 py-1 rounded-full mb-4 border border-[#003c33]/15">
          <BrainCircuit size={14} /> ASSESSMENT MODULE • AI MATCHING
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-normal text-ink tracking-tight mb-3">
          Discover your optimal career trajectory.
        </h1>
        <p className="text-slate text-base md:text-lg max-w-xl mx-auto">
          Evaluate your strengths, interests, and working preferences with our intelligent 10-question diagnostic engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
        <Card variant="stone" className="p-5 text-center">
          <HelpCircle className="text-ink mx-auto mb-3" size={20} />
          <h3 className="font-display text-base font-normal text-ink mb-1">10 Questions</h3>
          <p className="font-mono text-xs text-slate">Intuitive multiple choice & likert scales</p>
        </Card>
        
        <Card variant="stone" className="p-5 text-center">
          <Clock className="text-ink mx-auto mb-3" size={20} />
          <h3 className="font-display text-base font-normal text-ink mb-1">~5 Minutes</h3>
          <p className="font-mono text-xs text-slate">Fast, in-depth psychometric analysis</p>
        </Card>
        
        <Card variant="stone" className="p-5 text-center">
          <Target className="text-ink mx-auto mb-3" size={20} />
          <h3 className="font-display text-base font-normal text-ink mb-1">Gemini AI Model</h3>
          <p className="font-mono text-xs text-slate">6-trait radar & milestone roadmap</p>
        </Card>
      </div>

      <Card variant="canvas" className="w-full mb-8 border border-[#e5e7eb]">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-normal text-ink mb-3">Evaluation Guidelines</h3>
          <ul className="space-y-2 text-sm text-slate list-disc pl-5">
            <li>Answer based on your genuine preferences and natural problem-solving strengths.</li>
            <li>Go with your first instinct—don't overthink individual scenarios.</li>
            <li>Your 10 responses generate a real-time compatibility score, 6-dimensional trait radar, and custom milestone roadmap.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center">
        <Button 
          size="lg" 
          className="w-full sm:w-auto px-10 h-12 text-sm flex items-center justify-center gap-2"
          onClick={() => setStep("questions")}
        >
          {hasExisting ? "Retake Diagnostic (10 Questions)" : "Begin 10-Question Assessment"} <ArrowRight size={15} />
        </Button>

        {hasExisting && (
          <Button 
            variant="outline"
            size="lg" 
            className="w-full sm:w-auto px-8 h-12 text-sm"
            onClick={() => setStep("results")}
          >
            View Latest Report →
          </Button>
        )}
      </div>
    </motion.div>
  );
};
