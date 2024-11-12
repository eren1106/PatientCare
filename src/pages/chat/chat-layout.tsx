
import { useCallback, useEffect, useState} from "react";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat";
import { Chats, initializeSocket, disconnectSocket, fetchAllChatsForUser, unregisterMessageHandler, registerMessageHandler} from "@/services/chat.service";
import { getCurrentUser } from "@/services/auth.service";
import useChatStore from "@/hooks/useChatStore.hook";
import { ArrowLeft } from 'lucide-react'; 



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
    if (fetchedChats.length > 0) {
      setSelectedUser(fetchedChats[0]);
    }
  }, [setChats, setSelectedUser]);

  useEffect(() => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    initializeSocket(userId);

    loadChats();

    registerMessageHandler((message) => {
      addMessage(message);
      updateChatWithNewMessage(message);
      loadChats();
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

  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleMobileSelectChat = (chat : Chats) => {
    handleSelectChat(chat);
    setShowMobileChat(true);
  };



  return (
    <div className="flex justify-between w-full">
      {chats.length === 0 ? (
        <div className="w-full text-center py-4">
          <p className="text-lg font-semibold">No users available</p>
          <p className="text-sm text-gray-500 mt-2">There are currently no users to chat with.</p>
        </div>
      ) : (
        <div className="flex w-full">
      <div className={`${showMobileChat ? 'hidden sm:block' : 'w-full'} sm:w-2/5`}>
        <Sidebar
          chats={chats}
          onSelectChat={handleMobileSelectChat}
          selectedChat={selectedUser}
          onChatsUpdate={handleChatsUpdate}
        />
      </div>

      <div className={`${!showMobileChat ? 'hidden sm:block' : 'w-full block animate-slide-in'} sm:w-3/5 border rounded-md`}>
      {selectedUser && (
        <Chat 
          selectedUser={selectedUser} 
           setShowMobileChat={setShowMobileChat}
        />
      )}
    </div>
    </div>
      )}

    </div>
  );
}

