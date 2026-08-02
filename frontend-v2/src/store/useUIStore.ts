import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCommandMenuOpen: boolean;
  setCommandMenuOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      isCommandMenuOpen: false,
      setCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen }),
    }),
    {
      name: 'ui-storage', // Key for localStorage
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }), // Only persist sidebar state
    }
  )
);
