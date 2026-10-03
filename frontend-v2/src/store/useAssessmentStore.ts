import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";
import { fallbackAssessmentQuestions } from "../data/assessmentQuestions";

export type AssessmentStep = "landing" | "questions" | "processing" | "results";

interface AssessmentState {
  step: AssessmentStep;
  currentQuestionIndex: number;
  questions: any[];
  answers: Record<string, string>;
  result: any | null;
  setStep: (step: AssessmentStep) => void;
  setResult: (result: any) => void;
  fetchQuestions: () => Promise<void>;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitAssessment: () => Promise<void>;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      step: "landing",
      currentQuestionIndex: 0,
      questions: fallbackAssessmentQuestions,
      answers: {},
      result: null,
      setStep: (step) => set({ step }),
      setResult: (result) => set({ result }),
      fetchQuestions: async () => {
        try {
          const response = await api.get("/assessment");
          if (response.data && Array.isArray(response.data.questions)) {
            set({ questions: response.data.questions });
          }
        } catch (error) {
          console.error("Failed to fetch questions", error);
        }
      },
      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer,
          },
        })),
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(state.questions.length - 1, state.currentQuestionIndex + 1),
        })),
      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        })),
      submitAssessment: async () => {
        set({ step: "processing" });
        const startTime = Date.now();
        try {
          const { answers, questions } = get();
          // Extract answers in question order Q1..Q10
          const orderedAnswers = questions.length > 0 
            ? questions.map((q) => answers[q.id] || "Neutral")
            : Object.values(answers);

          const response = await api.post("/assessment/submit", {
            answers: orderedAnswers,
          });

          // Ensure at least 1.5s in processing so animation displays smoothly
          const elapsed = Date.now() - startTime;
          if (elapsed < 1500) {
            await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed));
          }

          set({ step: "results", result: response.data });
        } catch (error) {
          console.error("Failed to submit assessment:", error);
          set({ step: "questions" });
        }
      },
      resetAssessment: () =>
        set({
          step: "landing",
          currentQuestionIndex: 0,
          answers: {},
          result: null,
        }),
    }),
    {
      name: "assessment-storage",
      partialize: (state) => {
        if (state.step === "processing") {
          return { ...state, step: "questions" };
        }
        return state;
      },
    }
  )
);
