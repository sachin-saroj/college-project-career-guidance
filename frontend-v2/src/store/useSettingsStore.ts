import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: ThemeMode;
  emailNotifications: boolean;
  careerRecommendations: boolean;
  newResourceAlerts: boolean;
  assessmentReminders: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleEmailNotifications: () => void;
  toggleCareerRecommendations: () => void;
  toggleNewResourceAlerts: () => void;
  toggleAssessmentReminders: () => void;
}

const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else if (theme === 'light') {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  } else {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isSystemDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      emailNotifications: true,
      careerRecommendations: true,
      newResourceAlerts: true,
      assessmentReminders: true,
      setTheme: (theme) => {
        applyThemeToDocument(theme);
        set({ theme });
      },
      toggleEmailNotifications: () => set((state) => ({ emailNotifications: !state.emailNotifications })),
      toggleCareerRecommendations: () => set((state) => ({ careerRecommendations: !state.careerRecommendations })),
      toggleNewResourceAlerts: () => set((state) => ({ newResourceAlerts: !state.newResourceAlerts })),
      toggleAssessmentReminders: () => set((state) => ({ assessmentReminders: !state.assessmentReminders })),
    }),
    {
      name: 'careersathi-settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDocument(state.theme);
        }
      },
    }
  )
);

// Listen to system theme changes if set to 'system'
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useSettingsStore.getState().theme;
    if (currentTheme === 'system') {
      applyThemeToDocument('system');
    }
  });
}
