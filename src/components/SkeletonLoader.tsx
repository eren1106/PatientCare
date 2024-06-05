import { Skeleton } from "./ui/skeleton";

const SkeletonLoader = () => {
  const rows = 5; // Number of skeleton rows

  return (
    <section>
      <div className="flex gap-5 items-center mt-2">
        <Skeleton className="h-8 w-1/5 rounded" />
        <Skeleton className="h-8 w-1/5 rounded" />
        <Skeleton className="h-8 w-1/5 rounded" />
        <Skeleton className="h-8 w-1/5 rounded" />
        <Skeleton className="h-8 w-1/5 rounded" />
      </div>
    </section>
  );
};

export default SkeletonLoader;
