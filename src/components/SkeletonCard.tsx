import { Skeleton } from './ui/skeleton'

const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-60" />
      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-48" />
    </div>
    // <div className='flex gap-3'>
    //   <div className="flex flex-col space-y-3">
    //     <Skeleton className="h-[12rem] w-[22rem] rounded-xl" />
    //     <div className="space-y-2">
    //       <Skeleton className="h-4 w-[22rem]" />
    //       <Skeleton className="h-4 w-[18rem]" />
    //       <Skeleton className="h-4 w-[14rem]" />
    //     </div>
    //   </div>
    //   <div className="flex flex-col space-y-3">
    //     <Skeleton className="h-[12rem] w-[22rem] rounded-xl" />
    //     <div className="space-y-2">
    //       <Skeleton className="h-4 w-[22rem]" />
    //       <Skeleton className="h-4 w-[18rem]" />
    //       <Skeleton className="h-4 w-[14rem]" />
    //     </div>
    //   </div>
    // </div>
  )
}

export default SkeletonCard