import { ModeToggle } from './mode-toggle';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = () => {
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
            <ModeToggle />
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
