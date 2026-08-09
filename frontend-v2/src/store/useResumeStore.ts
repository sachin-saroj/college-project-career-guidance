import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeType } from "../schema/resumeSchema";

interface ResumeState {
  resumes: ResumeType[];
  activeResumeId: string | null;
  isSaving: boolean;
  atsScore: {
    score: number;
    missingSkills: string[];
    formattingIssues: string[];
    suggestions: string[];
  } | null;
  addResume: (resume: ResumeType) => void;
  updateResume: (id: string, updates: Partial<ResumeType>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  setActiveResume: (id: string | null) => void;
  setSaving: (saving: boolean) => void;
  setAtsScore: (score: any) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      activeResumeId: null,
      isSaving: false,
      atsScore: null,
      
      addResume: (resume) => 
        set((state) => ({ resumes: [...state.resumes, resume] })),
        
      updateResume: (id, updates) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...updates, lastModified: new Date().toISOString() } : r
          ),
        })),
        
      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          activeResumeId: state.activeResumeId === id ? null : state.activeResumeId,
        })),
        
      duplicateResume: (id) => {
        const state = get();
        const resumeToCopy = state.resumes.find(r => r.id === id);
        if (resumeToCopy) {
          const newResume = {
            ...resumeToCopy,
            id: crypto.randomUUID(),
            title: `${resumeToCopy.title} (Copy)`,
            lastModified: new Date().toISOString()
          };
          set({ resumes: [...state.resumes, newResume] });
        }
      },
      
      setActiveResume: (id) => set({ activeResumeId: id }),
      setSaving: (saving) => set({ isSaving: saving }),
      setAtsScore: (score) => set({ atsScore: score }),
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({ resumes: state.resumes }), // Only persist resumes
    }
  )
);
