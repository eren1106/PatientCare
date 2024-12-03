import { create } from 'zustand';

interface MessageStore {
  unreadCount: number;
  incrementCount: () => void;
  resetCount: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  unreadCount: 0,
  incrementCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetCount: () => set({ unreadCount: 0 }),
}));