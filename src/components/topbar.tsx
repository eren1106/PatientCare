// import { ModeToggle } from './mode-toggle';
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
// import { Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { MOCK_DOCTOR_IMAGE_PATH, MOCK_PATIENT_ID, MOCK_PATIENT_IMAGE_PATH, USER_SESSION_KEY } from '@/constants';
import { User as UserModel } from '@/interfaces/user';
import { getCurrentUser } from '@/services/auth.service';
import { UserRole } from '@/enums';

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem(USER_SESSION_KEY);
    navigate("/login");
  }

  const userData = getCurrentUser();
  return (
    <>
      <nav className='w-full fixed top-0 z-50 md:h-16 h-10 border-b px-3 flex items-center justify-end backdrop-blur-xl bg-background md:bg-transparent bg-opacity-20'>
        <div className='w-full flex justify-between items-center'>
          <Link to="/" className='flex items-center gap-2'>
            {/* <img src={APP_LOGO} alt="" className='size-6 md:size-8' /> */}
            <p className='text-lg md:text-2xl font-extrabold'>PatientCare</p>
          </Link>
          <div className='gap-4 hidden md:flex'>
            {/* NAV ITEM */}
            {/* <ModeToggle /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='cursor-pointer'>
                  <ProfileAvatar className='size-12' src={userData?.role === UserRole.PATIENT ? MOCK_PATIENT_IMAGE_PATH : MOCK_DOCTOR_IMAGE_PATH} />
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
        {/* <Sheet>
          <SheetTrigger className='flex md:hidden' asChild>
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col items-center gap-4 p-4">
              <ModeToggle />
            </div>
          </SheetContent>
        </Sheet> */}
      </nav>

    </>
  );
}

export default Topbar;
