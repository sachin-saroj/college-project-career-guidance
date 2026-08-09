import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { BrainCircuit, Clock, HelpCircle, Target } from "lucide-react";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { motion } from "framer-motion";

export const Landing = () => {
  const { setStep } = useAssessmentStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center max-w-3xl mx-auto h-full"
    >
      <div className="text-center mb-40">
        <div className="inline-flex items-center justify-center w-64 h-64 rounded-full bg-brand-light text-brand-primary mb-24">
          <BrainCircuit size={32} />
        </div>
        <h1 className="text-h2 font-bold text-text-main mb-16">
          Career Personality Assessment
        </h1>
        <p className="text-h4 text-text-muted font-normal">
          Discover careers that match your unique skills, personality, and goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-24 w-full mb-40">
        <Card>
          <CardContent className="p-24 flex flex-col items-center text-center">
            <HelpCircle className="text-brand-primary mb-16" size={24} />
            <h3 className="text-body font-semibold text-text-main mb-4">10 Questions</h3>
            <p className="text-small text-text-muted">No right or wrong answers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-24 flex flex-col items-center text-center">
            <Clock className="text-status-warning mb-16" size={24} />
            <h3 className="text-body font-semibold text-text-main mb-4">5 Minutes</h3>
            <p className="text-small text-text-muted">Quick and comprehensive</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-24 flex flex-col items-center text-center">
            <Target className="text-status-success mb-16" size={24} />
            <h3 className="text-body font-semibold text-text-main mb-4">AI Powered</h3>
            <p className="text-small text-text-muted">Personalized insights</p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full mb-40 bg-background-alt border-none shadow-none">
        <CardContent className="p-32">
          <h3 className="text-h4 font-semibold text-text-main mb-16">Instructions</h3>
          <ul className="list-disc pl-24 space-y-8 text-body text-text-muted">
            <li>Read each question carefully and answer honestly.</li>
            <li>Go with your first instinct—don't overthink it.</li>
            <li>Your progress is auto-saved. You can close and resume anytime.</li>
            <li>The AI will analyze your responses to find the best career matches.</li>
          </ul>
        </CardContent>
      </Card>

      <Button 
        size="lg" 
        className="w-full md:w-auto px-64 h-56 text-body font-semibold"
        onClick={() => setStep("questions")}
      >
        Start Assessment
      </Button>
    </motion.div>
  );
};
