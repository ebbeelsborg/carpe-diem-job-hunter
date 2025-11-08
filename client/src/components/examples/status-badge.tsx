import { StatusBadge } from "../status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="applied" />
      <StatusBadge status="phone_screen" />
      <StatusBadge status="technical" />
      <StatusBadge status="onsite" />
      <StatusBadge status="offer" />
      <StatusBadge status="rejected" />
      <StatusBadge status="withdrawn" />
    </div>
  );
}
