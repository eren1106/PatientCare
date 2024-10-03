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
  import useChatStore from "../../hooks/useChatStore.hook";
import { sendMessage } from "@/services/chat.service";
import { getCurrentUser } from "@/services/auth.service";
  
  interface ChatBottombarProps {
    isMobile: boolean;
    selectedUserId: string;
  }
  
  export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];
  
  export default function ChatBottombar({
    selectedUserId,
  }: ChatBottombarProps) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const addMessage = useChatStore((state) => state.addMessage);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
    };
  
  
    const handleSend = async () => {
      const userId = getCurrentUser()?.id;
      if (message.trim() && userId) {
        setIsLoading(true);
        
        try {
          const newMessage = await sendMessage({
            fromUserId: userId, // Replace with actual logged-in user ID
            toUserId: selectedUserId,
            message: message.trim(),
          });
          addMessage(newMessage);
          setMessage("");
        } catch (error) {
          console.error("Failed to send message:", error);
          // Optionally show an error message to the user
        } finally {
          setIsLoading(false);
        }
  
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };
  
    const handleThumbsUp = async () => {
      setIsLoading(true);
      try {
        const newMessage = await sendMessage({
          fromUserId: "cm1oprb1d0003psohq8d7ibue", // Replace with actual logged-in user ID
          toUserId: selectedUserId,
          message: "👍",
        });
        addMessage(newMessage);
      } catch (error) {
        console.error("Failed to send thumbs up:", error);
        // Optionally show an error message to the user
      } finally {
        setIsLoading(false);
      }
    };
    
    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  
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
        <div className="flex">
          {/* <Popover>
            <PopoverTrigger asChild>
              <Link
                to="/"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "shrink-0"
                )}
              >
                <PlusCircle size={22} className="text-muted-foreground" />
              </Link>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              className="w-full p-2">
              {message.trim() || isMobile ? (
                <div className="flex gap-2">
                  <Link
                    to="/"
                    
                  >
                    <Mic size={22} className="text-muted-foreground" />
                  </Link>
                  {BottombarIcons.map((icon, index) => (
                    <Link
                      key={index}
                      to="/"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        "shrink-0"
                      )}
                    >
                      <icon.icon size={22} className="text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  to="/"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                    "shrink-0"
                  )}
                >
                  <Mic size={22} className="text-muted-foreground" />
                </Link>
              )}
            </PopoverContent>
          </Popover> */}
          {/* {!message.trim() && !isMobile && (
            <div className="flex">
              {BottombarIcons.map((icon, index) => (
                <Link
                  key={index}
                  to="/"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-9 w-9",
                    "shrink-0"
                  )}
                >
                  <icon.icon size={22} className="text-muted-foreground" />
                </Link>
              ))}
            </div>
          )} */}
        </div>
  
        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative flex items-center justify-center"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: "spring",
                bounce: 0.15,
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