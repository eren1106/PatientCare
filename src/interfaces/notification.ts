export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  redirectUrl?: string | null;
  createdDatetime: Date;
};