import { Notification } from '@/interfaces/notification';
import { create } from 'zustand';

type NotificationStore = {
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void,
  addNotification: (notification: Notification) => void // change here
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications: Notification[]) => set({ notifications }),
  addNotification: (notification: Notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      notification,
    ]
  })),
}));
