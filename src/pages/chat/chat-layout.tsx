
import { useCallback, useEffect} from "react";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat";
import { Chats, initializeSocket, disconnectSocket, fetchAllChatsForUser, unregisterMessageHandler, registerMessageHandler} from "@/services/chat.service";
import { getCurrentUser } from "@/services/auth.service";
import useChatStore from "@/hooks/useChatStore.hook";


interface ChatLayoutProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export function ChatLayout({

}: ChatLayoutProps) {
  const { chats, selectedUser, setChats, setSelectedUser, addMessage, updateChatWithNewMessage } = useChatStore();
 
  const loadChats = useCallback(async () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    const fetchedChats = await fetchAllChatsForUser(userId);
    setChats(fetchedChats);
    if (fetchedChats.length > 0 && !selectedUser) {
      setSelectedUser(fetchedChats[0]);
    }
  }, [setChats, setSelectedUser, selectedUser]);

  useEffect(() => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    initializeSocket(userId);

    loadChats();

    registerMessageHandler((message) => {
      addMessage(message);
      updateChatWithNewMessage(message);
    });

    return () => {
      unregisterMessageHandler();
      disconnectSocket();
    };
  }, [loadChats, addMessage, updateChatWithNewMessage]);

  const handleSelectChat = (chat: Chats) => {
    setSelectedUser(chat);
  };

  const handleChatsUpdate = () => {
    loadChats();
  };
  
  return (
    <div className="flex justify-between   w-full">
      <div className="w-2/5">
      <Sidebar
          chats={chats}
          onSelectChat={handleSelectChat}
          selectedChat={selectedUser}
          onChatsUpdate={handleChatsUpdate}
        />
      </div>

      <div className="w-3/5 border rounded-md ">
      {selectedUser && (
          <Chat
            selectedUser={selectedUser}
          />
        )}
      </div>
      
    </div>
  );
}

