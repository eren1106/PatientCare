import { Skeleton } from './ui/skeleton'

const SkeletonCard = () => {
  return (
    <div className='flex gap-3'>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[12rem] w-[22rem] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[22rem]" />
          <Skeleton className="h-4 w-[18rem]" />
          <Skeleton className="h-4 w-[14rem]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[12rem] w-[22rem] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[22rem]" />
          <Skeleton className="h-4 w-[18rem]" />
          <Skeleton className="h-4 w-[14rem]" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard