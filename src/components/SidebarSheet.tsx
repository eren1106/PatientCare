import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Sidebar from './sidebar'

const SidebarSheet = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" className='block md:hidden p-0' onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className='p-0 pt-3 min-w-[--sidebar-width]'>
        <div className='overflow-y-auto'>
          <Sidebar onNavItemClicked={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SidebarSheet