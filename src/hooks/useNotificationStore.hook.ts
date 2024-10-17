import { Notification } from '@/interfaces/notification';
import { create } from 'zustand';

type NotificationStore = {
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void,
  addNotification: (notification: Notification) => void,
  markAllNotificationsAsRead: () => void,
  markNotificationAsClicked: (notificationId: string) => void,
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications: Notification[]) => set({ notifications }),
  markAllNotificationsAsRead: () => set((state) => {
    const updatedNotifications = state.notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    return ({
      notifications: updatedNotifications
    });
  }),
  addNotification: (notification: Notification) => set((state) => ({
    notifications: [
      notification,
      ...state.notifications,
    ]
  })),
  markNotificationAsClicked: (notificationId: string) => set((state) => ({
    notifications: state.notifications.map(
      (notification) => notification.id === notificationId ? {...notification, isClicked: true} : notification
    )
  }))
}));
