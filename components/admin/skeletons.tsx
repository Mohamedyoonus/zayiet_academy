import Skeleton from "@/components/ui/skeleton";

// Placeholders shown the moment an admin page is opened, shaped like the page
// they stand in for, so nothing jumps when the real content arrives.

export function HeaderSkeleton({ withButton = false }: { withButton?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-[70vw]" />
      </div>
      {withButton && <Skeleton className="h-10 w-32 rounded-full" />}
    </div>
  );
}

// Same proportions as the Enrollments/Collaborations table columns
const COLUMN_WIDTHS = ["14%", "11%", "14%", "12%", "17%", "13%", "15%", "4%"];

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm">
      <div className="flex border-b border-charcoal-100 bg-ivory-100 py-3.5">
        {COLUMN_WIDTHS.map((width, i) => (
          <div key={i} className="shrink-0 px-3" style={{ width }}>
            <Skeleton className="h-3 w-3/4 bg-charcoal-200/60" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex items-start border-b border-charcoal-100 py-4 last:border-b-0">
          {COLUMN_WIDTHS.map((width, i) => (
            <div key={i} className="shrink-0 space-y-1.5 px-3" style={{ width }}>
              <Skeleton className="h-3.5 w-full" />
              {i < 4 && <Skeleton className="h-3 w-2/3" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


export function FormSkeleton({ imageAspect = "aspect-[4/3]" }: { imageAspect?: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
      <div className="space-y-5 rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm sm:p-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className={i === 2 ? "h-20 rounded-xl" : "h-10 rounded-xl"} />
          </div>
        ))}
      </div>
      <div className="space-y-5">
        <div className="rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm sm:p-5">
          <Skeleton className="mb-3 h-3.5 w-16" />
          <Skeleton className={`${imageAspect} rounded-xl`} />
          <Skeleton className="mt-3 h-10 w-36 rounded-full" />
        </div>
        <div className="rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm sm:p-5">
          <Skeleton className="h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CourseCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm">
          <Skeleton className="aspect-[16/9] rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GallerySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-charcoal-100 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:p-5">
        <div className="space-y-2 sm:w-72">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm">
            <Skeleton className="aspect-[4/5] rounded-none" />
            <div className="space-y-2 p-2.5 sm:p-3">
              <Skeleton className="h-9 rounded-xl" />
              <Skeleton className="h-9 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
