import { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

interface DialogButtonProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  hasSubmitBtn?: boolean;
  submitBtnText?: string;
}

const DialogButton = ({
  children,
  content,
  title,
  description,
  className,
  variant,
  // hasSubmitBtn=true,
  // submitBtnText="Submit"
}: DialogButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant ?? "outline"} className={className}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {content}
        {/* {
          hasSubmitBtn && (
            <DialogFooter>
              <Button type="submit">{submitBtnText}</Button>
            </DialogFooter>
          )
        } */}
        {/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}

export default DialogButton