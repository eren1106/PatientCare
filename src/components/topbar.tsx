// import { ModeToggle } from './mode-toggle';
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
// import { Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { MOCK_PATIENT_ID, MOCK_PATIENT_IMAGE_PATH } from '@/constants';

const Topbar = () => {
  // const navigate = useNavigate();
  // const handleNavigateToProfile = () => {
  //   navigate
  // }

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
                  <ProfileAvatar className='size-12' src={MOCK_PATIENT_IMAGE_PATH} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link to={`/profile/${MOCK_PATIENT_ID}`}>
                  <DropdownMenuItem className='gap-3 cursor-pointer'>
                    <User />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className='gap-3 cursor-pointer'>
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
