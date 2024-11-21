import { Skeleton } from './ui/skeleton'

const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* <Skeleton className="h-4 w-60" />
      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-48" /> */}
      <Skeleton className="h-4 w-2/5 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-3/4 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-5/6 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-4/6 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-7/12 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-2/5 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-3/4 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-5/6 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-4/6 bg-muted-foreground/10" />
      <Skeleton className="h-4 w-7/12 bg-muted-foreground/10" />
    </div>
  )
}

export default SkeletonCard