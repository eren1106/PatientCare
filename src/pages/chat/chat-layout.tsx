
import { useEffect, useState } from "react";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat";
import { Chats, initializeSocket, disconnectSocket, fetchAllChatsForUser } from "@/services/chat.service";
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
  const [isMobile, setIsMobile] = useState(false);



  // Fetch all chats for the user
  useEffect(() => {
    const userId = getCurrentUser()?.id;
    const initializeChat = async () => {
      try {
        if (userId) {
          initializeSocket(userId);
        const fetchedChats = await fetchAllChatsForUser(userId);
          setChats(fetchedChats);
          console.log(chats);
          if (fetchedChats.length > 0) {
            setSelectedUser(fetchedChats[0]);
          }
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initializeChat();

    // Cleanup
    return () => {
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
          isMobile={isMobile}
        />
      </div>

      <div className="w-3/5 border rounded-md min-h-full">
      {selectedUser && (
          <Chat
            selectedUser={selectedUser}
            isMobile={isMobile}
          />
        )}
      </div>
      
    </div>
  );
}

