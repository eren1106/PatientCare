export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  isClicked: boolean;
  redirectUrl?: string | null;
  createdDatetime: Date;
};