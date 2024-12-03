import { Avatar, AvatarImage } from "../../components/ui/avatar";
import {
  ArrowLeft,
  Info,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { ExpandableChatHeader } from "../../components/ui/chat/expandable-chat";
import useChatStore from "@/hooks/useChatStore.hook";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import ProfileAvatar from "@/components/ProfileAvatar";
import { CallHistory, fetchCallHistory } from "@/services/chat.service";
import { formatDate } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import OutgoingCall from "./call/outgoing-call";
import { ScrollArea } from "@/components/ui/scroll-area";

export const TopbarIcons = [{ icon: Phone }, { icon: Info }];

const CallHistoryItem = ({ call }: { call: CallHistory }) => {
  const isMissedOrRejected =
    call.status === "MISSED" || call.status === "REJECTED";

  const getStatusColor = () =>
    isMissedOrRejected ? "text-red-500" : "text-green-500";

  const getBadgeVariant = () =>
    isMissedOrRejected ? "destructive" : "default";

  const CallIcon = call.type === "Incoming" ? PhoneIncoming : PhoneOutgoing;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 py-2">
      <div className="flex items-center gap-3">
        <CallIcon className={getStatusColor()} />
        <div className="flex flex-col gap-1">
          <p className="font-medium">{call.type}</p>
          <Badge variant={getBadgeVariant()}>{call.status}</Badge>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{formatDuration(call.duration)}</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(call.createdDatetime)}
        </p>
      </div>
    </div>
  );
};

interface ChatProps {
  setShowMobileChat: (show: boolean) => void;
}

export default function ChatTopbar({ setShowMobileChat }: ChatProps) {
  const selectedUsers = useChatStore((state) => state.selectedUser);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [callHistory, setCallHistory] = useState<CallHistory[]>([]);

  const openCallHistorySheet = () => {
    setSheetOpen(true);
  };

  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  const callDialog = () => {
    setIsCallDialogOpen(true);
  };

  useEffect(() => {
    if (sheetOpen && selectedUsers) {
      const fetchHistory = async () => {
        try {
          const history = await fetchCallHistory(selectedUsers.id);
          setCallHistory(history);
        } catch (error) {
          console.error("Failed to fetch call history:", error);
        }
      };
      fetchHistory();
    }
  }, [sheetOpen, selectedUsers]);

  return (
    <ExpandableChatHeader>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMobileChat(false)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <ProfileAvatar
          size="md"
          src={selectedUsers?.profileImageUrl}
          alt={selectedUsers?.name}
        />
          <span className="font-medium">{selectedUsers?.name}</span>
      </div>

      <div className="flex gap-1">
        {TopbarIcons.map((icon, index) => (
          <Button
            key={index}
            onClick={icon.icon === Info ? openCallHistorySheet : callDialog}
            variant="ghost"
          >
            <icon.icon size={20} className="text-muted-foreground" />
          </Button>
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <div className="flex flex-col items-center gap-3 p-5">
              <ProfileAvatar
                src={selectedUsers?.profileImageUrl}
                className="size-24"
              />
              <div className="flex gap-3">
                <p className="w-full text-center font-bold">
                  {selectedUsers?.name}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col h-[calc(100vh-250px)]">
              <h3 className="text-lg font-semibold px-2 mb-2">Call History</h3>
              <ScrollArea className="flex-1 w-full pr-4">
                <div className="space-y-3 px-2">
                  {callHistory.length > 0 ? (
                    callHistory.map((call) => (
                      <CallHistoryItem key={call.id} call={call} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-24">
                      <p className="text-muted-foreground">
                        No call history found
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 p-4">
              <ProfileAvatar
                src={selectedUsers?.profileImageUrl}
                className="size-24"
              />
              <p className="text-lg font-semibold">{selectedUsers?.name}</p>
            </div>
          </DialogHeader>
          <OutgoingCall
            recipientId={selectedUsers?.id || ""}
            onClose={() => setIsCallDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </ExpandableChatHeader>
  );
}
