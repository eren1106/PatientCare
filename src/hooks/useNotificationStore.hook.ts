import { Notification } from '@/interfaces/notification';
import { create } from 'zustand'

type NotificationStore = {
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void,
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications: Notification[]) => set({ notifications }),
}));