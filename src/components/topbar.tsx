import { Link, useNavigate } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Bell, LogOut, User } from 'lucide-react';
import { APP_LOGO_URL, MOCK_DOCTOR_IMAGE_PATH, MOCK_PATIENT_IMAGE_PATH, SOCKET_IO_PATH } from '@/constants';
import { getCurrentUser, logoutUser } from '@/services/auth.service';
import { UserRole } from '@/enums';
import DropdownIcon from './DropdownIcon';
import NotificationDropdown from './notification/NotificationDropdown';
import { getNotificationsByUserId } from '@/services/notification.service';
import { useNotificationStore } from '@/hooks/useNotificationStore.hook';
import { toast } from './ui/use-toast';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Notification } from '@/interfaces/notification';
import SidebarSheet from './SidebarSheet';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(serverUrl, {
  path: SOCKET_IO_PATH,
  withCredentials: true,
  transports: ['websocket']
});

const Topbar = () => {
  const navigate = useNavigate();
  const { notifications, setNotifications, addNotification } = useNotificationStore();

  const handleLogout = () => {
    logoutUser();
    navigate("/auth/login");
  }

  const currentUser = getCurrentUser();

  const getData = async () => {
    if (!currentUser?.id) return;

    try {
      const data = await getNotificationsByUserId(currentUser?.id);
      setNotifications(data);
    }
    catch (e) {
      toast({
        title: "Failed to fetch data",
        description: `${e}`
      })
    }
  }

  useEffect(() => {
    if (!currentUser) return;

    getData();

    // start listening to real-time events for the user
    socket.on(`notification-${currentUser.id}`, (newNotification: Notification) => {
      addNotification(newNotification); // add new notification to store

      // TODO: make it navigatable
      toast({
        title: newNotification.title,
        description: newNotification.message,
      })
    });

    return () => {
      socket.off(`notification-${currentUser.id}`);
    };
  }, []);

  return (
    <>
      <nav className='w-full fixed top-0 z-50 md:h-16 h-10 border-b px-3 flex items-center justify-end backdrop-blur-xl bg-background md:bg-transparent bg-opacity-20'>
        <div className='w-full flex justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <SidebarSheet />
            <Link to="/" className='flex items-center gap-2'>
              <img src={APP_LOGO_URL} alt="" className='size-6 md:size-8' />
              <p className='text-lg md:text-2xl font-extrabold'>PatientCare</p>
            </Link>
          </div>
          <div className='gap-4 hidden md:flex items-center'>
            {/* NAV ITEMS */}
            <DropdownIcon
              icon={Bell}
              content={<NotificationDropdown />}
              number={notifications.filter((notification) => !notification.isRead).length}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='cursor-pointer'>
                  <ProfileAvatar className='size-10' src={getCurrentUser()?.profileImageUrl || MOCK_DOCTOR_IMAGE_PATH} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link to={
                  currentUser?.role === UserRole.PATIENT ? `/profile/${currentUser.id}` : `/dashboard/profile/${currentUser?.id}`
                }>
                  <DropdownMenuItem className='gap-3 cursor-pointer'>
                    <User />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className='gap-3 cursor-pointer' onClick={handleLogout}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Topbar;
