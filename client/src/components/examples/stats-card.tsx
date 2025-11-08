import { StatsCard } from "../stats-card";
import { Briefcase, Calendar, TrendingUp, CheckCircle } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Total Applications" value={24} icon={Briefcase} />
      <StatsCard title="Upcoming Interviews" value={3} icon={Calendar} />
      <StatsCard title="In Progress" value={12} icon={TrendingUp} />
      <StatsCard title="Offers" value={2} icon={CheckCircle} />
    </div>
  );
}
