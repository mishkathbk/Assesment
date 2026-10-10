import SkeletonRow from "./SkeletonRow";
import { SKELETON_ROW_COUNT } from "@/app/lib/constants";

export default function DashboardSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-3 pb-6 sm:px-6" aria-busy="true">
      <div className="mb-3 space-y-2 py-1">
        <span className="block h-8 w-28 animate-pulse rounded-lg bg-line" />
        <span className="block h-4 w-20 animate-pulse rounded bg-line/70" />
      </div>
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="h-16 border-b border-line" />
        <ul className="divide-y divide-line">
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </ul>
      </section>
    </main>
  );
}
