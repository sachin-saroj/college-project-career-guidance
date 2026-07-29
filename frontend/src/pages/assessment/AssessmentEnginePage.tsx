import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Container, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAssessmentSession, useSaveAnswer, useSubmitAssessment } from '../../modules/assessment/hooks/useAssessment';
import { ProgressHeader } from '../../components/assessment/ProgressHeader';
import { AssessmentTimer } from '../../components/assessment/AssessmentTimer';
import { QuestionCard } from '../../components/assessment/QuestionCard';
import { LikertScale } from '../../components/assessment/LikertScale';
import { MCQOptions } from '../../components/assessment/MCQOptions';
import { Button } from '../../components/ui/Button';

export const AssessmentEnginePage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useAssessmentSession();
  const { mutate: saveAnswer, isPending: isSaving } = useSaveAnswer();
  const { mutate: submitAssessment, isPending: isSubmitting } = useSubmitAssessment();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const session = data?.data?.session;
  const questions = data?.data?.questions || [];
  
  useEffect(() => {
    if (session && session.currentQuestionIndex !== undefined) {
      setCurrentIndex(session.currentQuestionIndex);
    }
  }, [session, session?.currentQuestionIndex]);

  // Track time spent per question
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session || questions.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="error">No active session found.</Typography>
        <Button onClick={() => navigate('/dashboard/assessment')} sx={{ mt: 2 }}>Back to Assessment</Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = session.answers?.find(a => a.questionId === currentQuestion?._id)?.value;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswerSelect = (value: number) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Optimistic save
    saveAnswer({
      questionId: currentQuestion._id,
      value,
      timeTaken
    });
    
    // Auto-advance if not the last question
    if (!isLastQuestion) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 400);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex(prev => prev + 1);
    else setShowConfirm(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    submitAssessment(undefined, {
      onSuccess: () => navigate('/dashboard/recommendations')
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Career Assessment</Typography>
        <AssessmentTimer startedAt={session.startedAt} maxMinutes={45} />
      </Box>

      <ProgressHeader current={currentIndex + 1} total={questions.length} />

      <QuestionCard text={currentQuestion?.text || ''}>
        {currentQuestion?.type === 'likert' ? (
          <LikertScale value={currentAnswer} onChange={handleAnswerSelect} />
        ) : (
          <MCQOptions 
            options={currentQuestion?.options || []} 
            value={currentAnswer} 
            onChange={handleAnswerSelect} 
          />
        )}
      </QuestionCard>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || isSaving || isSubmitting}
        >
          Previous
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={currentAnswer === undefined || isSaving || isSubmitting}
          isLoading={isSubmitting}
        >
          {isLastQuestion ? 'Submit Assessment' : 'Next'}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Submit Assessment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have answered all questions. Are you ready to submit and view your career recommendations?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setShowConfirm(false)} color="inherit">Review Answers</Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
