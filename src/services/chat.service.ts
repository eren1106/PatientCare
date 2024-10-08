import { apiCaller } from "@/utils";
import { io, Socket } from 'socket.io-client';
import { getCurrentUser } from "./auth.service";
import { User  } from "@/interfaces/dashboard";
let socket: Socket | null = null;
let onNewMessage: ((message: Message) => void) | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:3000"   , {
      path: '/api/socket.io',
      withCredentials: true,
      transports: ['websocket'] 
    });

    socket.on('connect', () => {
      console.log('Connected:', socket?.id);
      socket?.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on('newMessage', (message: Message) => {
      if (onNewMessage) onNewMessage(message);
      console.log("new message", message);
    });
  }
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};

export const emitSocketMessage = (message: SendMessage) => {
  socket?.emit('sendMessage', message);
};

export const registerMessageHandler = (callback: (message: Message) => void) => {
  onNewMessage = callback;
};

export const unregisterMessageHandler = () => {
  onNewMessage = null;
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

export const findNewUserAvailableForChat = async (): Promise<User[]> => {
  try {
    const userId = getCurrentUser()?.id;
    const res = await apiCaller.get(`/chat/newconversation/${userId}`);
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
  id: string;
  message: string;
  fromUserId: string;
  fromUserName : string
  toUserId: string;
  toUserName: string;
  createdDatetime: Date;
}

export interface Chats {
  id: string;
  name : string; 
  profileImageUrl: string;
  lastMessage : string;
  lastMessageTime : Date;
  messages?: Message[];
}

export interface SendMessage {
  fromUserId: string;
  toUserId: string;
  message: string;
  createdDatetime?: Date;
}

