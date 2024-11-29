import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useNotificationStore } from "@/hooks/useNotificationStore.hook"
import { Notification } from "@/interfaces/notification"
import { getCurrentUser } from "@/services/auth.service"
import { markNotificationAsClicked, markNotificationsAsReadByUserId } from "@/services/notification.service"
import { timeAgo } from "@/utils"
import { Dot } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

const NotificationDropdown = () => {
  const user = getCurrentUser();

  const { notifications, markNotificationAsClicked: markNotificationAsClickedInStore, markAllNotificationsAsRead } = useNotificationStore();

  const handleClickNotification = async (notification: Notification) => {
    if(notification.isClicked) return; // no need to call api if already clicked
    
    try {
      await markNotificationAsClicked(notification.id);
      markNotificationAsClickedInStore(notification.id);
    }
    catch (e) {
      console.error(e);
    }
  }

  // const markNotificationsAsRead = async () => {
  //   if(!user) return;
  //   // only call markAllNotificationsAsRead api if got unread notifications
  //   const unReadNotification = notifications.find((notification) => !notification.isRead);
  //   if(unReadNotification) {
  //     await markNotificationsAsReadByUserId(user.id);
  //     markAllNotificationsAsRead();
  //   }
  // }
  // useEffect(() => {
  //   markNotificationsAsRead();
  // }, [])
  

  return (
    <div className="flex flex-col max-h-[30rem] w-screen sm:w-[24rem]">
      <div className="px-3 py-1 flex items-center justify-between h-12">
        <p className="font-medium">Notifications</p>
        {/* <Button variant="textPrimary">
          Mark all as read
        </Button> */}
      </div>
      <Separator className="" />
      <div className="overflow-y-auto">
        {
          notifications.length > 0 ?
            notifications.map((notification) => (
              <Link
                to={notification.redirectUrl ?? window.location.pathname}
                key={notification.id}
                className=""
                onClick={() => handleClickNotification(notification)}
              >
                <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer hover:bg-secondary">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{notification.title}</p>
                    <p>{notification.message}</p>
                    <p className="text-muted-foreground text-sm">{timeAgo(notification.createdDatetime)}</p>
                  </div>
                  {
                    !notification.isClicked && <Dot className="fill-primary text-primary ml-auto" size={50} />
                  }
                </DropdownMenuItem>
              </Link>
            )) : <p className="p-6">You don't have any notification</p>
        }
      </div>
      {/* <Separator />
      <Link to={`/notifications`} className="text-center">
        <DropdownMenuItem className="p-3 text-primary flex justify-center cursor-pointer">
          View Notifications <ChevronRight size={16} className="ml-1" />
        </DropdownMenuItem>
      </Link> */}
    </div>
  )
}

export default NotificationDropdown