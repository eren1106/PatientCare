import {
    FileImage,
    Paperclip,
    SendHorizontal,
    ThumbsUp,
  } from "lucide-react";
  import React, { useRef, useState } from "react";
  import { Button } from "../../components/ui/button";
  import { AnimatePresence, motion } from "framer-motion";
  import { EmojiPicker } from "../../components/emoji-picker";
  import { ChatInput } from "../../components/ui/chat/chat-input";
import { emitSocketMessage, sendMessage } from "@/services/chat.service";
import { getCurrentUser } from "@/services/auth.service";
  
  interface ChatBottombarProps {

    selectedUserId: string;
  }
  
  export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];
  
  export default function ChatBottombar({
    selectedUserId,
  }: ChatBottombarProps) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    
  
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
    }
    
    
      
  
  
    const handleSend = async () => {
      const userId = getCurrentUser()?.id;
      if (message.trim() && userId) {
        setIsLoading(true);
        
        try {
          await sendMessage({
            fromUserId: userId,
            toUserId: selectedUserId,
            message: message.trim(),
          });

          emitSocketMessage({
            fromUserId: userId,
            toUserId: selectedUserId,
            message: message.trim(),
            createdDatetime: new Date(),
          });
          setMessage("");
        } catch (error) {
          console.error("Failed to send message:", error);
         
        } finally {
          setIsLoading(false);
        }
  
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
  
    const handleThumbsUp = async () => {
      const userId = getCurrentUser()?.id;
      setIsLoading(true);
      try {
        if (!userId) return;
        await sendMessage({
          fromUserId: userId, 
          toUserId: selectedUserId,
          message: "👍",
        });

        emitSocketMessage({
          fromUserId: userId,
          toUserId: selectedUserId,
          message: "👍",
          createdDatetime: new Date(),
        });
      } catch (error) {
        console.error("Failed to send thumbs up:", error);
        // Optionally show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };
    

  
    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
  
      if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        setMessage((prev) => prev + "\n");
      }
    };

  
  
  
    return (
      <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
  
        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative flex items-center justify-center"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.1 },
              layout: {
                type: "spring",
                bounce: 0.1,
              },
            }}
          >


            <ChatInput
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="rounded-full"
            />
            <div className="absolute right-6 ">
              <EmojiPicker onChange={(value) => {
                setMessage(message + value)
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }} />
            </div>

          </motion.div>
  
          {message.trim() ? (
            <Button
              className="h-9 w-9 shrink-0"
              onClick={handleSend}
              disabled={isLoading}
              variant="ghost"
              size="icon"
            >
              <SendHorizontal size={22} className="text-muted-foreground" />
            </Button>
          ) : (
            <Button
              className="h-9 w-9 shrink-0"
              onClick={handleThumbsUp}
              disabled={isLoading}
              variant="ghost"
              size="icon"
            >
              <ThumbsUp size={22} className="text-muted-foreground" />
            </Button>
          )}
        </AnimatePresence>
      </div>
    );
  }