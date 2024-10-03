import { Link } from "react-router-dom";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import ProfileAvatar from "../../components/ProfileAvatar";
import { Chats } from "@/services/chat.service";

interface SidebarProps {
  chats: Chats[];
  onSelectChat: (chat: Chats) => void;
  selectedChat: Chats | null;
  isMobile: boolean;
}

export function Sidebar({ chats, onSelectChat, selectedChat, isMobile }: SidebarProps) {
  return (
    <div
      className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 "
    >

        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-sm">Chats</p>
            <span className="text-zinc-300">({chats.length})</span>
          </div>

          <div>
            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <MoreHorizontal size={20} />
            </Link>

            <Link
              to="/"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div>
        </div>

        <nav className="grid gap-1 px-2 ">
        {chats.map((chat) => (
          <Button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={cn(
              buttonVariants({ variant: selectedChat?.id === chat.id ? "ghost" : "secondary" }),
              selectedChat?.id === chat.id &&
              "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
              "justify-start gap-4 py-10"
            )}
          >
            <ProfileAvatar size='lg' src={chat.profileImageUrl} />
            <div className="flex flex-col max-w-28 items-start">
              <span className="font-bold text-md truncate ">{chat.name}</span>
              <span className="text-zinc-300 text-md truncate ">
                {chat.lastMessage}
              </span>
            </div>
          </Button>
        ))}
      </nav>
    </div>
  );
}