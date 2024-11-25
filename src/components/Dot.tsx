import { cn } from "@/lib/utils";

interface DotProps {
  className?: string;
}

const Dot = ({className}: DotProps) => {
  return (
    <span className={cn("rounded-full size-1 bg-muted-foreground", className)}></span>
  )
}

export default Dot