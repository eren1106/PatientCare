// message-provider.tsx
import { useEffect, useRef, useState } from 'react';
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
  const timeoutRef = useRef<NodeJS.Timeout>();

  const initializeConnection = async (userId: string) => {
    try {
      await initializeSocket(userId);

      registerMessageHandler((message) => {
        window.dispatchEvent(new CustomEvent('new-message', { detail: message }));
        if (message.toUserId === userId) {
          incrementCount();
        }
      });
    } catch (error) {
      console.error('Socket connection failed:', error);
    }
  };

  useEffect(() => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;

    initializeConnection(userId);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      unregisterMessageHandler();
      disconnectSocket();
    };
  }, [incrementCount]);

  return <>{children}</>;
};