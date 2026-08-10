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

  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (questions.length === 0) {
    return <div className="py-20 text-center font-mono text-sm text-slate">Loading diagnostic questions...</div>;
  }
  
  const question = questions[currentQuestionIndex];

  if (!question) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <p className="font-mono text-sm text-slate">Assessment session state invalid.</p>
        <Button onClick={resetAssessment} variant="outline">Restart Assessment</Button>
      </div>
    );
  }
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
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
    <div className="flex flex-col max-w-3xl mx-auto h-full min-h-[540px] py-4">
      {/* Header & Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-slate">
              QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
            </span>
          </div>
          <div className="font-mono text-xs text-slate">
            TIME REMAINING: {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="w-full h-1.5 bg-[#eeece7] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#17171c] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
            <Card variant="canvas" className="border border-[#e5e7eb] p-6 md:p-8">
              <CardContent className="p-0">
                <h3 className="font-display text-2xl md:text-3xl font-normal text-ink mb-8 leading-snug tracking-tight">
                  {question.text}
                </h3>

                <div className={cn(
                  "grid gap-3",
                  question.type === "likert" ? "grid-cols-1 sm:grid-cols-5" : "grid-cols-1"
                )}>
                  {question.options.map((option: string, idx: number) => {
                    const isSelected = currentAnswer === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => setAnswer(question.id, option)}
                        className={cn(
                          "p-4 rounded-md border text-left transition-all duration-150 flex items-center justify-between",
                          isSelected 
                            ? "border-[#17171c] bg-[#17171c] text-white font-medium shadow-none" 
                            : "border-[#d9d9dd] bg-white text-ink hover:border-[#17171c] hover:bg-[#f7f7f6]"
                        )}
                      >
                        <span className="text-[14px]">
                          {option}
                        </span>
                        {isSelected && (
                          <span className="font-mono text-xs text-white">✓</span>
                        )}
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
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#e5e7eb]">
        <Button 
          variant="outline" 
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 text-xs"
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!currentAnswer}
          className="px-8 text-xs"
        >
          {currentQuestionIndex === totalQuestions - 1 ? "Submit Assessment →" : "Next Question →"}
        </Button>
      </div>
    </div>
  );
};

