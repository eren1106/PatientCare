import { create } from "zustand";
import { Message, Chats } from "../services/chat.service";

interface ChatState {
  chats: Chats[];
  selectedUser: Chats | null;
  messages: Message[];
  setChats: (chats: Chats[]) => void;
  setSelectedUser: (user: Chats | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  updateChatWithNewMessage: (message: Message) => void;
  deleteMessage: (messageId: string) => void;
}

const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedUser: null,
  messages: [],
  setChats: (chats) => set({ chats }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setMessages: (messages) => set({ messages }),
  updateChatWithNewMessage: (message) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === message.fromUserId || chat.id === message.toUserId
        ? { ...chat, lastMessage: message.message, lastMessageTime: message.createdDatetime }
        : chat
    ),
  })),
  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter((message) => message.id !== messageId),
    chats: state.chats.map((chat) => {
      if (chat.messages) {
        return {
          ...chat,
          messages: chat.messages.filter((message) => message.id !== messageId),
        };
      }
      return chat;
    }),
  })),
}));

export default useChatStore;