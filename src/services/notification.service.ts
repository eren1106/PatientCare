import { Notification } from "@/interfaces/notification";
import { apiRequest } from "@/utils/apiRequest";

export const getNotificationsByUserId = async (id: string): Promise<Notification[]> => {
  try {
    const res = await apiRequest.get(`notifications/user/${id}`);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    await apiRequest.put(`notifications/${id}/mark-as-read`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};