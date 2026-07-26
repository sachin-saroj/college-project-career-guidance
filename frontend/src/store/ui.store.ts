import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarOpen: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    }),
    {
      name: 'careersathi-ui-storage',
      // Only persist the dark mode preference, not the sidebar state
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);
