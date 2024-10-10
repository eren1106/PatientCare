import { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { cn } from '@/lib/utils';

interface DynamicDialogTriggerProps {
  children?: ReactNode;
  content: ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  hasClose?: boolean;
  closeClassName?: string;
}

const DynamicDialogTrigger = ({
  children,
  content,
  title,
  description,
  open,
  onOpenChange,
  contentClassName,
  hasClose = true,
  closeClassName,
}: DynamicDialogTriggerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {
        children && (
          <DialogTrigger asChild>
            <div>
              {children}
            </div>
          </DialogTrigger>
        )
      }
      <DialogContent
        className={cn("", contentClassName)}
        hasClose={hasClose}
        closeClassName={closeClassName}
      >
        {
          (title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {
                description && (
                  <DialogDescription>
                    {description}
                  </DialogDescription>
                )
              }
            </DialogHeader>
          )
        }
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default DynamicDialogTrigger