import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export type AssessmentStep = "landing" | "questions" | "processing" | "results";

interface AssessmentState {
  step: AssessmentStep;
  currentQuestionIndex: number;
  questions: any[];
  answers: Record<string, string>;
  result: any | null;
  setStep: (step: AssessmentStep) => void;
  fetchQuestions: () => Promise<void>;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitAssessment: () => Promise<void>;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      step: "landing",
      currentQuestionIndex: 0,
      questions: [],
      answers: {},
      result: null,
      setStep: (step) => set({ step }),
      fetchQuestions: async () => {
        try {
          const response = await api.get("/assessment");
          set({ questions: response.data.questions });
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
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),
      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        })),
      submitAssessment: async () => {
        set({ step: "processing" });
        try {
          const { answers } = useAssessmentStore.getState();
          const response = await api.post("/assessment/submit", {
            answers: Object.values(answers),
          });
          set({ step: "results", result: response.data });
        } catch (error) {
          console.error("Failed to submit assessment:", error);
          set({ step: "questions" }); // revert on error
        }
      },
      resetAssessment: () =>
        set({
          step: "landing",
          currentQuestionIndex: 0,
          answers: {},
          result: null,
          questions: [],
        }),
    }),
    {
      name: "assessment-storage",
      // Optional: partialize if we don't want to save processing state across reloads
      partialize: (state) => {
        if (state.step === "processing") {
          return { ...state, step: "questions" };
        }
        return state;
      },
    }
  )
);
