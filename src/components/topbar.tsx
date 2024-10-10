import { Link, useNavigate } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Bell, LogOut, User } from 'lucide-react';
import { APP_LOGO_URL, MOCK_DOCTOR_IMAGE_PATH, MOCK_PATIENT_IMAGE_PATH } from '@/constants';
import { getCurrentUser, logoutUser } from '@/services/auth.service';
import { UserRole } from '@/enums';
import DropdownIcon from './DropdownIcon';
import NotificationDropdown from './notification/NotificationDropdown';
import { getNotificationsByUserId } from '@/services/notification.service';
import { useNotificationStore } from '@/hooks/useNotificationStore.hook';
import { toast } from './ui/use-toast';
import { useEffect } from 'react';

const Topbar = () => {
  const navigate = useNavigate();
  const { notifications, setNotifications } = useNotificationStore();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  }

  const userData = getCurrentUser();

  const getData = async () => {
    if(!userData?.id) return;

    try {
      const data = await getNotificationsByUserId(userData?.id);
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
    getData();
  }, []);

  return (
    <>
      <nav className='w-full fixed top-0 z-50 md:h-16 h-10 border-b px-3 flex items-center justify-end backdrop-blur-xl bg-background md:bg-transparent bg-opacity-20'>
        <div className='w-full flex justify-between items-center'>
          <Link to="/" className='flex items-center gap-2'>
            <img src={APP_LOGO_URL} alt="" className='size-6 md:size-8' />
            <p className='text-lg md:text-2xl font-extrabold'>PatientCare</p>
          </Link>
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
                  <ProfileAvatar className='size-10' src={userData?.role === UserRole.PATIENT ? MOCK_PATIENT_IMAGE_PATH : MOCK_DOCTOR_IMAGE_PATH} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link to={
                  userData?.role === UserRole.PATIENT ? `/profile/${userData.id}` : `/dashboard/profile/${userData?.id}`
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
