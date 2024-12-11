// message-provider.tsx
import { useEffect, useRef } from 'react';
import { useMessageStore } from '@/stores/messageStore';
import { getCurrentUser } from '@/services/auth.service';
import { 
  initializeSocket, 
  registerMessageHandler, 
  unregisterMessageHandler, 
  disconnectSocket 
} from '@/services/chat.service';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const incrementCount = useMessageStore((state) => state.incrementCount);
  const retryCount = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const initializeConnection = async (userId: string) => {
    try {
      await initializeSocket(userId);
      retryCount.current = 0; // Reset retry count on successful connection

      registerMessageHandler((message) => {
        window.dispatchEvent(new CustomEvent('new-message', { detail: message }));
        if (message.toUserId === userId) {
          incrementCount();
        }
      });
    } catch (error) {
      console.error('Socket connection failed:', error);
      
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current++;
        timeoutRef.current = setTimeout(() => {
          console.log(`Retrying connection... Attempt ${retryCount.current}`);
          initializeConnection(userId);
        }, RETRY_DELAY);
      } else {
        console.error('Max retries reached. Please refresh the page.');
      }
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