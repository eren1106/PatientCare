import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleTimestamp, ChatBubble } from "../../components/ui/chat/chat-bubble";
import { ChatMessageList } from "../../components/ui/chat/chat-message-list";
import { ScrollArea } from "../../components/ui/scroll-area";
import ChatBottombar from "./chat-bottombar";
import { Chats, Message } from "@/services/chat.service";
import useChatStore from "@/hooks/useChatStore.hook";
import { getCurrentUser } from "@/services/auth.service";


interface ChatListProps {
  selectedUser: Chats;
}

const getMessageVariant = (fromUserId: string, selectedUserId: string) =>
  fromUserId !== selectedUserId ? "sent" : "received";

export function ChatList({ selectedUser }: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((state) => state.messages);

  const currentUser = getCurrentUser();
  
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    

    <div className="flex-grow w-full flex flex-col ">
      {/* TODO : Make this dynamic */}
      <ScrollArea className="h-[600px]">
      <ChatMessageList
        ref={messagesContainerRef}
      >
        
        <AnimatePresence>
          {messages.map((message, index) => {
            const variant = getMessageVariant(message.fromUserId, selectedUser.id);
            const isCurrentUserMessage = message.fromUserId === currentUser?.id;
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: index * 0.05 + 0.2,
                  },
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                className="flex flex-col gap-2 p-4"
              >
                {/* Usage of ChatBubble component */}
                <ChatBubble variant={variant}>
                <ChatBubbleAvatar src={isCurrentUserMessage ? currentUser?.profileImageUrl ?? undefined : selectedUser.profileImageUrl ?? undefined}  />
                    <ChatBubbleMessage variant={variant}>
                      {message.message}
                      {/* {message.createdDatetime && (
                        <ChatBubbleTimestamp timestamp={new Date(message.createdDatetime).toLocaleTimeString()} />
                      )} */}
                    </ChatBubbleMessage>
                  </ChatBubble>
              </motion.div>
            );
          })}
        </AnimatePresence>

      </ChatMessageList>
      </ScrollArea>
      <ChatBottombar selectedUserId={selectedUser.id} />
    </div>
    
  );
}
