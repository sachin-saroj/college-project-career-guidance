import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  careerRecommendations: boolean;
  newResourceAlerts: boolean;
  assessmentReminders: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleEmailNotifications: () => void;
  toggleCareerRecommendations: () => void;
  toggleNewResourceAlerts: () => void;
  toggleAssessmentReminders: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      emailNotifications: true,
      careerRecommendations: true,
      newResourceAlerts: true,
      assessmentReminders: true,
      setTheme: (theme) => set({ theme }),
      toggleEmailNotifications: () => set((state) => ({ emailNotifications: !state.emailNotifications })),
      toggleCareerRecommendations: () => set((state) => ({ careerRecommendations: !state.careerRecommendations })),
      toggleNewResourceAlerts: () => set((state) => ({ newResourceAlerts: !state.newResourceAlerts })),
      toggleAssessmentReminders: () => set((state) => ({ assessmentReminders: !state.assessmentReminders })),
    }),
    {
      name: 'careersathi-settings',
    }
  )
);
