import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import useChatStore from "../../hooks/useChatStore.hook";
import { Chats,  fetchChatMessages } from "@/services/chat.service";
import { useEffect } from "react";


interface ChatProps {
  selectedUser: Chats;
}

export function Chat({ selectedUser }: ChatProps) {
  const setMessages = useChatStore((state) => state.setMessages);


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchChatMessages(selectedUser.id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    loadMessages();
  }, [selectedUser.id, setMessages]);

  return (
    <div className="flex flex-col justify-between w-full ">
      <ChatTopbar />
        <ChatList
          selectedUser={selectedUser}
        />
    </div>
  );
}

