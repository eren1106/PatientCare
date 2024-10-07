
import { useEffect, useState } from "react";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat";
import { Chats, initializeSocket, disconnectSocket, fetchAllChatsForUser, unregisterMessageHandler, registerMessageHandler } from "@/services/chat.service";
import { getCurrentUser } from "@/services/auth.service";


interface ChatLayoutProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export function ChatLayout({

}: ChatLayoutProps) {
  const [chats, setChats] = useState<Chats[]>([]);
  const [selectedUser, setSelectedUser] = useState<Chats| null>(null);



  useEffect(() => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    initializeSocket(userId);

    const loadChats = async () => {
      const fetchedChats = await fetchAllChatsForUser(userId);
      setChats(fetchedChats);
      if (fetchedChats.length > 0) {
        setSelectedUser(fetchedChats[0]);
      }
    };
    loadChats();

    registerMessageHandler((message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === message.fromUserId || chat.id === message.toUserId
            ? { ...chat, lastMessage: message.message }
            : chat
        )
      );
      if (selectedUser && (selectedUser.id === message.fromUserId || selectedUser.id === message.toUserId)) {
        setSelectedUser((prevUser) => ({
          ...prevUser!,
          messages: [...(prevUser?.messages || []), message],
        }));
      }
    });

    return () => {
      unregisterMessageHandler();
      disconnectSocket();
    };
  }, []);

  const handleSelectChat = (chat: Chats) => {
    setSelectedUser(chat);
  };
  
  return (
    <div className="flex justify-between h-full items-stretch w-full">
      <div className="w-2/5">
      <Sidebar
          chats={chats}
          onSelectChat={handleSelectChat}
          selectedChat={selectedUser}
        />
      </div>

      <div className="w-3/5 border rounded-md min-h-full">
      {selectedUser && (
          <Chat
            selectedUser={selectedUser}
          />
        )}
      </div>
      
    </div>
  );
}

