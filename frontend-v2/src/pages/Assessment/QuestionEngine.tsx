import { useState, useEffect } from "react";
import { useAssessmentStore } from "../../store/useAssessmentStore";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

export const QuestionEngine = () => {
  const { 
    currentQuestionIndex, 
    questions,
    fetchQuestions,
    answers, 
    setAnswer, 
    nextQuestion, 
    prevQuestion, 
    submitAssessment,
    resetAssessment
  } = useAssessmentStore();

  useEffect(() => {
    if (questions.length === 0) {
      fetchQuestions();
    }
  }, [questions.length, fetchQuestions]);

  // Optional simple timer (15 mins)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (questions.length === 0) {
    return <div className="p-40 text-center">Loading questions...</div>;
  }
  
  const question = questions[currentQuestionIndex];

  if (!question) {
    return (
      <div className="p-40 text-center flex flex-col items-center gap-16">
        <p>Something went wrong with your assessment state.</p>
        <Button onClick={resetAssessment}>Restart Assessment</Button>
      </div>
    );
  }
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;
  
  const currentAnswer = answers[question.id];



  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    } else {
      submitAssessment();
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto h-full min-h-[600px]">
      {/* Header & Progress */}
      <div className="mb-40">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-h4 font-bold text-text-main">
              Question {currentQuestionIndex + 1} <span className="text-text-muted font-normal">/ {totalQuestions}</span>
            </h2>
          </div>
          <div className="text-small font-medium text-text-muted">
            {formatTime(timeLeft)} remaining
          </div>
        </div>
        
        <div className="w-full h-8 bg-brand-light rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-32 md:p-48">
                <h3 className="text-h3 font-medium text-text-main mb-40 leading-snug">
                  {question.text}
                </h3>

                <div className={cn(
                  "grid gap-16",
                  question.type === "likert" ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1"
                )}>
                  {question.options.map((option: string, idx: number) => {
                    const isSelected = currentAnswer === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => setAnswer(question.id, option)}
                        className={cn(
                          "p-24 rounded-xl border text-left transition-all duration-200",
                          isSelected 
                            ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20" 
                            : "border-border hover:border-brand-primary/50 hover:bg-background-alt",
                          question.type === "likert" ? "text-center md:flex md:flex-col md:items-center md:justify-center md:h-full" : "w-full"
                        )}
                      >
                        <div className={cn(
                          "w-24 h-24 rounded-full border mb-16 mx-auto transition-colors",
                          isSelected ? "border-8 border-brand-primary" : "border-border",
                          question.type !== "likert" && "hidden"
                        )} />
                        <span className={cn(
                          "text-body",
                          isSelected ? "font-semibold text-brand-primary" : "text-text-main"
                        )}>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between mt-40">
        <Button 
          variant="outline" 
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-32"
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!currentAnswer}
          className="px-40"
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};
