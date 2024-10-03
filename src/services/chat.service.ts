// chat.service.ts
import { apiCaller } from "@/utils";
import io from 'socket.io-client';
import { getCurrentUser } from "./auth.service";

let socket: any;

export const initializeSocket = (userId: string) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  socket = io(VITE_API_URL, {
    path: '/api/socket.io',
    withCredentials: true
  });
  
  
  socket.on('connect', () => {
    console.log('Connected to socket');
    socket.emit('join', userId);
  });

  socket.on('newMessage', (message: Message) => {
    // Handle incoming messages
    // You'll need to update your state management here
    console.log('New message received:', message);
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};



export const fetchAllChatsForUser = async (userId: string): Promise<Chats[]> => {
  try {
    const res = await apiCaller.get(`/chat/all/${userId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch chat history");
  }
};

export const fetchChatMessages = async (toUserId: string): Promise<Message[]> => {
  try {
    const fromUserId = getCurrentUser()?.id;
    const res = await apiCaller.get(`/chat/messages/${fromUserId}/${toUserId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch chat messages");
  }
};

export const sendMessage = async (message: SendMessage): Promise<Message> => {
  try {
    const res = await apiCaller.post(`/chat/send`, message);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to send message");
  }
};
export interface Message {
  message: string;
  fromUserId: string;
  fromUserName : string
}

export interface Chats {
  id: string;
  name : string; 
  profileImageUrl: string;
  lastMessage : string;
  lastMessageTime : Date;
}

export interface SendMessage {
  fromUserId: string;
  toUserId: string;
  message: string;
}
