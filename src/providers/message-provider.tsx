import { useEffect } from 'react';
import { useMessageStore } from '@/stores/messageStore';
import { getCurrentUser } from '@/services/auth.service';
import { 
  initializeSocket, 
  registerMessageHandler, 
  unregisterMessageHandler, 
  disconnectSocket 
} from '@/services/chat.service';

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const incrementCount = useMessageStore((state) => state.incrementCount);

  useEffect(() => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    initializeSocket(userId);

    registerMessageHandler((message) => {
      // Dispatch custom event for chat updates
      window.dispatchEvent(new CustomEvent('new-message', { detail: message }));
      
      if (message.toUserId === userId) {
        incrementCount();
      }
    });

    return () => {
      //unregisterMessageHandler();
      //disconnectSocket();
    };
  }, [incrementCount]);

  return <>{children}</>;
};