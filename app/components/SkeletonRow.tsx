export default function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 px-5 py-4">
      <span className="h-10 w-10 animate-pulse rounded-full bg-line" />
      <div className="flex-1 space-y-2">
        <span className="block h-3 w-1/3 animate-pulse rounded bg-line" />
        <span className="block h-3 w-1/2 animate-pulse rounded bg-line/70" />
      </div>
    </li>
  );
}
