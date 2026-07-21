import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-muted/60', className)}
      {...props}
    />
  );
}

function PlaceCardSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      <Skeleton className="h-24 w-24 flex-shrink-0 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function SignalSkeleton() {
  return (
    <div className="flex gap-3 p-4">
      <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

export { Skeleton, PlaceCardSkeleton, SignalSkeleton, EventCardSkeleton };