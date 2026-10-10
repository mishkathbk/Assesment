import { Suspense } from "react";
import LeadDashboard from "./components/LeadDashboard";

export default function Home() {
  return (
    <Suspense>
      <LeadDashboard />
    </Suspense>
  );
}
