import { Notification } from '@/interfaces/notification';
import { create } from 'zustand';

type NotificationStore = {
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void,
  addNotification: (notification: Notification) => void,
  markNotificationAsRead: (notificationId: string) => void,
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
  markNotificationAsRead: (notificationId: string) => set((state) => ({
    notifications: state.notifications.map(
      (notification) => notification.id === notificationId ? {...notification, isRead: true} : notification
    )
  }))
}));
