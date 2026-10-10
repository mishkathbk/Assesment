import { Suspense } from "react";
import DashboardSkeleton from "./components/DashboardSkeleton";
import LeadDashboard from "./components/LeadDashboard";

export default function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <LeadDashboard />
    </Suspense>
  );
}
