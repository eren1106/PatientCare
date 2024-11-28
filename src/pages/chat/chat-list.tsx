import { useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubble,
} from "../../components/ui/chat/chat-bubble";
import { ChatMessageList } from "../../components/ui/chat/chat-message-list";
import { ScrollArea } from "../../components/ui/scroll-area";
import ChatBottombar from "./chat-bottombar";
import { Chats } from "@/services/chat.service";
import useChatStore from "@/hooks/useChatStore.hook";
import { getCurrentUser } from "@/services/auth.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteMessage,
  emitSocketDeleteMessage,
  registerMessageDeletedHandler,
  unregisterMessageDeletedHandler,
} from "@/services/chat.service";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/ProfileAvatar";

interface ChatListProps {
  selectedUser: Chats;
}

const getMessageVariant = (fromUserId: string, selectedUserId: string) =>
  fromUserId !== selectedUserId ? "sent" : "received";

export function ChatList({ selectedUser }: ChatListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = useChatStore((state) => state.messages);
  const deleteMessageFromStore = useChatStore((state) => state.deleteMessage);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      emitSocketDeleteMessage(messageId, currentUser?.id!, selectedUser.id);
      deleteMessageFromStore(messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  useEffect(() => {
    registerMessageDeletedHandler((messageId) => {
      deleteMessageFromStore(messageId);
    });

    return () => {
      unregisterMessageDeletedHandler();
    };
  }, [deleteMessageFromStore]);

  const currentUser = getCurrentUser();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex-grow w-full flex flex-col ">
      <ScrollArea
        className="h-[calc(100vh-220px)] sm:h-[calc(100vh-240px)] md:h-[calc(100vh-260px)]"
        ref={scrollAreaRef}
      >
        <ChatMessageList>
          <AnimatePresence>
            {/* <ScrollArea className="h-[600px]"> */}
            {messages.map((message, index) => {
              const variant = getMessageVariant(
                message.fromUserId,
                selectedUser.id
              );
              const isCurrentUserMessage =
                message.fromUserId === currentUser?.id;
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
                      duration: index * 0.05 + 0.1,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="flex flex-col gap-2 p-2 sm:p-4" // Reduced padding on mobile
                >
                  {isCurrentUserMessage ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ChatBubble
                            variant={variant}
                            className="max-w-[85vw] sm:max-w-[65%]"
                          >
                            {" "}
                            {/* Control bubble width */}
                            <ProfileAvatar
                              size="md"
                              src={currentUser.profileImageUrl ?? ""}
                            />
                            <ChatBubbleMessage
                              variant={variant}
                              className="break-words whitespace-pre-wrap"
                            >
                              {message.message}
                              {message.createdDatetime && (
                                <ChatBubbleTimestamp
                                  timestamp={new Date(message.createdDatetime)
                                    .toLocaleString("en-GB", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                      hour12: false,
                                    })
                                    .replace(",", "")}
                                />
                              )}
                            </ChatBubbleMessage>
                          </ChatBubble>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            Unsend
                          </Button>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <ChatBubble
                      variant={variant}
                      className="max-w-[85vw] sm:max-w-[65%]"
                    >
                      <ProfileAvatar
                        size="md"
                        src={selectedUser.profileImageUrl ?? ""}
                      />
                      <ChatBubbleMessage
                        variant={variant}
                        className="break-words whitespace-pre-wrap"
                      >
                        {message.message}
                        {message.createdDatetime && (
                          <ChatBubbleTimestamp
                            timestamp={new Date(message.createdDatetime)
                              .toLocaleString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour12: false,
                              })
                              .replace(",", "")}
                          />
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  )}
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
