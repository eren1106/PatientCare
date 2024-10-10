import { Avatar, AvatarImage } from '../../components/ui/avatar'
import { Info, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../../components/ui/button';
import { ExpandableChatHeader } from '../../components/ui/chat/expandable-chat';
import useChatStore from '@/hooks/useChatStore.hook';



export const TopbarIcons = [{ icon: Phone }, { icon: Info }];


export default function ChatTopbar() {

  const selectedUsers = useChatStore((state) => state.selectedUser);
  
  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={selectedUsers?.profileImageUrl}
            alt={selectedUsers?.name}
            width={6}
            height={6}
            className="w-10 h-10 "
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUsers?.name}</span>
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div className='flex gap-1'>
        {TopbarIcons.map((icon, index) => (
          <Link
            key={index}
            to="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
            )}
          >
            <icon.icon size={20} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </ExpandableChatHeader>
  )
}