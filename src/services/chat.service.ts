import { apiCaller } from "@/utils";
import { io, Socket } from 'socket.io-client';
import { getCurrentUser } from "./auth.service";
import { User  } from "@/interfaces/dashboard";
import { SOCKET_IO_PATH } from "@/constants";
let socket: Socket | null = null;

let onNewMessage: ((message: Message) => void) | null = null;
let onMessageDeleted: ((messageId: string) => void) | null = null;

const SOCKET_SERVER_URL = "http://localhost:3000";

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL   , {
      path: SOCKET_IO_PATH,
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

    socket.on('messageDeleted', (messageId: string) => {
      onMessageDeleted?.(messageId);
      console.log("Message deleted", messageId);
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

export const emitSocketDeleteMessage = (messageId: string, fromUserId: string, toUserId: string) => {
  socket?.emit('deleteMessage', { messageId, fromUserId, toUserId });
};

export const registerMessageHandler = (callback: (message: Message) => void) => {
  onNewMessage = callback;
};

export const unregisterMessageHandler = () => {
  onNewMessage = null;
};


export const registerMessageDeletedHandler = (callback: (messageId: string) => void) => {
  onMessageDeleted = callback;
};

export const unregisterMessageDeletedHandler = () => {
  onMessageDeleted = null;
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

export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    await apiCaller.delete(`/chat/message/${messageId}`);
  
  } catch (e) {
    console.error(e);
    throw new Error("Failed to delete message");
  }
};

export const fetchCallHistory = async (toUserId: string): Promise<CallHistory[]> => {
  try {
    const fromUserId = getCurrentUser()?.id;
    const res = await apiCaller.get(`/chat/callHistory/${fromUserId}/${toUserId}`);
    return res.data.data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch call history");
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

export interface CallHistory {
  id: string;
  type: 'Incoming' | 'Outgoing';
  status: 'ACCEPTED' | 'MISSED' | 'REJECTED';
  createdDatetime: string;
  duration: number;
}

