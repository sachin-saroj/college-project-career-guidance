// Cache invalidation comment
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isContextPanelOpen: boolean;
  createChat: () => string;
  setActiveChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, role: "user" | "ai", content: string, id?: string) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  toggleContextPanel: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      isContextPanelOpen: true,

      createChat: () => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: "New Conversation",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
        }));
        return newChat.id;
      },

      setActiveChat: (id) => set({ activeChatId: id }),

      updateChatTitle: (id, title) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c
          ),
        })),

      deleteChat: (id) =>
        set((state) => {
          const newChats = state.chats.filter((c) => c.id !== id);
          return {
            chats: newChats,
            activeChatId: state.activeChatId === id ? (newChats[0]?.id || null) : state.activeChatId,
          };
        }),

      addMessage: (chatId, role, content, id) =>
        set((state) => ({
          chats: state.chats.map((c) => {
            if (c.id === chatId) {
              // Auto-generate title from first user message
              let title = c.title;
              if (c.messages.length === 0 && role === "user") {
                title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
              }
              return {
                ...c,
                title,
                messages: [
                  ...c.messages,
                  { id: id || crypto.randomUUID(), role, content, createdAt: Date.now() },
                ],
                updatedAt: Date.now(),
              };
            }
            return c;
          }),
        })),

      updateMessage: (chatId, messageId, content) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m
                  ),
                  updatedAt: Date.now(),
                }
              : c
          ),
        })),

      toggleContextPanel: () =>
        set((state) => ({ isContextPanelOpen: !state.isContextPanelOpen })),
    }),
    {
      name: "mentor-storage",
      partialize: (state) => ({
        chats: state.chats,
        activeChatId: state.activeChatId,
        isContextPanelOpen: state.isContextPanelOpen,
      }),
    }
  )
);
