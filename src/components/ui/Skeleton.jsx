export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-line dark:border-slate-line p-5 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-8 w-full rounded-lg mt-2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-line dark:border-slate-line">
      <div className="skeleton h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-1/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="rounded-2xl border border-line dark:border-slate-line p-5 space-y-3">
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-7 w-1/3 rounded" />
    </div>
  );
}
