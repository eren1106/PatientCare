import { ReactNode } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";

interface DropdownTriggerProps {
  children: ReactNode;
  title?: string;
  content: ReactNode;
  contentClassName?: string;
}

const DropdownTrigger = ({
  children,
  title,
  content,
  contentClassName,
}: DropdownTriggerProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-min">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("", contentClassName)}>
        {title && (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownTrigger