import { SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import ProfileAvatar from "../../components/ProfileAvatar";
import { Chats, emitSocketMessage, findNewUserAvailableForChat, sendMessage } from "@/services/chat.service";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import { useEffect, useState } from "react";
import { User } from "@/interfaces/dashboard";
import { useForm } from "react-hook-form";
import useLoading from "@/hooks/useLoading.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCurrentUser } from "@/services/auth.service";
import { Form } from "@/components/ui/form";
import GenericFormField from "@/components/GenericFormField";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required." }),
  selectedUserId: z.string().min(1, { message: "Please select a user." }),
});


interface SidebarProps {
  chats: Chats[];
  onSelectChat: (chat: Chats) => void;
  selectedChat: Chats | null;
  onChatsUpdate: () => void;
}

export function Sidebar({ chats, onSelectChat, selectedChat, onChatsUpdate }: SidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<User[]>([]);
  const { isLoading, withLoading } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      selectedUserId: "",
    },
  });

  useEffect(() => {
    const fetchPatients = async () => {
      if (isModalOpen) {
        try {
          const newPatients = await findNewUserAvailableForChat();
          setPatients(newPatients);
        } catch (error) {
          console.error("Failed to fetch new users:", error);
        }
      }
    };

    fetchPatients();
  }, [isModalOpen]);


  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userId = getCurrentUser()?.id;
    if (userId) {
      await withLoading(async () => {
        try {
          await sendMessage({
            fromUserId: userId,
            toUserId: data.selectedUserId,
            message: data.message.trim(),
          });

          emitSocketMessage({
            fromUserId: userId,
            toUserId: data.selectedUserId,
            message: data.message.trim(),
            createdDatetime: new Date(),
          });

          // Close the modal
          setIsModalOpen(false);

          // Trigger chat update in the parent component (ChatLayout)
          onChatsUpdate();


        } catch (error) {
          console.error("Failed to send message:", error);
        }
      });
    }
  };

  const handleNewChat = () => {
    setIsModalOpen(true);
  };


  return (
    <div className="relative group flex flex-col h-full bg-muted/10 dark:bg-muted/20 gap-4 p-2 data-[collapsed=true]:p-2 ">
      <div className="flex justify-between p-2 items-center">
        <div className="flex gap-2 items-center text-2xl">
          <p className="font-sm">Chats</p>
          <span className="text-zinc-300">({chats.length})</span>
        </div>

        <div>
          <Button onClick={handleNewChat} variant="ghost">
            <SquarePen size={20} />
          </Button>
        </div>
      </div>
      <nav className="grid gap-1 px-2 ">
        {chats.map((chat) => (
          <Button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={cn(
              buttonVariants({
                variant: selectedChat?.id === chat.id ? "ghost" : "secondary",
              }),
              selectedChat?.id === chat.id &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
              "justify-start gap-4 py-10"
            )}
          >
            <ProfileAvatar size="lg" src={chat.profileImageUrl} />
            <div className="flex flex-col max-w-28 items-start">
              <span className="font-bold text-md truncate ">{chat.name}</span>
              <span className="text-zinc-300 text-md truncate ">
                {chat.lastMessage}
              </span>
            </div>
          </Button>
        ))}
      </nav>

      
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogTitle>Send new message</DialogTitle>
        {patients.length > 0 ? (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <GenericFormField
            control={form.control}
            name="selectedUserId"
            label="Select a user to send the message to:"
            type="select"
            placeholder="Select a user"
            options={patients.map(patient => ({
              value: patient.id,
              label: patient.fullname
            }))}
          />
          <GenericFormField
            control={form.control}
            name="message"
            label="Message"
            type="textarea"
            placeholder="Type your message here..."
            minRows={3}
          />
          <Button type="submit" disabled={isLoading}>
            Send Message
          </Button>
        </form>
      </Form>
    ) : (
      <div className="text-center py-4">
        <p className="text-lg font-semibold">No new users available</p>
        <p className="text-sm text-gray-500 mt-2">There are currently no new users to start a chat with.</p>
      </div>
    )}
      </DialogContent>
    </Dialog>
    </div>
  );
}
