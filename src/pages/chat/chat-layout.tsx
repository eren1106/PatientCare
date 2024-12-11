
import { useCallback, useEffect, useState} from "react";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat";
import { Chats, fetchAllChatsForUser, unregisterMessageHandler, registerMessageHandler} from "@/services/chat.service";
import { getCurrentUser } from "@/services/auth.service";
import useChatStore from "@/hooks/useChatStore.hook";
import { ArrowLeft } from 'lucide-react'; 
import { useMessageStore } from '@/stores/messageStore';
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";



interface ChatLayoutProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export function ChatLayout({

}: ChatLayoutProps) {
  const incrementCount = useMessageStore((state) => state.incrementCount);
  const resetCount = useMessageStore((state) => state.resetCount);
  const location = useLocation();

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
    const handleNewMessage = (event: CustomEvent) => {
      const message = event.detail;
      addMessage(message);
      updateChatWithNewMessage(message);
      loadChats();
    };

    window.addEventListener('new-message', handleNewMessage as EventListener);
    
    return () => {
      window.removeEventListener('new-message', handleNewMessage as EventListener);
    };
  }, [addMessage, updateChatWithNewMessage, loadChats]);

  useEffect(() => {
    if (location.pathname.includes('/chat')) {
      resetCount();
    }
  }, [location, resetCount]);

  useEffect(() => {
    loadChats();
  }, []);

  

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
    <Card className="flex justify-between w-full">

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
      

    </Card>
  );
}

