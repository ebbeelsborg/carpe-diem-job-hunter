import { Badge } from "@/components/ui/badge";

type ApplicationStatus =
  | "applied"
  | "phone_screen"
  | "technical"
  | "onsite"
  | "final"
  | "offer"
  | "rejected"
  | "withdrawn";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string; hexColor: string }
> = {
  applied: {
    label: "Applied",
    className: "bg-gray-50 text-gray-700 border-gray-200",
    hexColor: "#6b7280",
  },
  phone_screen: {
    label: "Phone Screen",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
    hexColor: "#06b6d4",
  },
  technical: {
    label: "Technical",
    className: "bg-green-50 text-green-700 border-green-200",
    hexColor: "#22c55e",
  },
  onsite: {
    label: "Onsite",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    hexColor: "#a855f7",
  },
  final: {
    label: "Final",
    className: "bg-red-50 text-red-700 border-red-200",
    hexColor: "#ef4444",
  },
  offer: {
    label: "Offer",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hexColor: "#10b981",
  },
  rejected: {
    label: "Rejected",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    hexColor: "#f97316",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    hexColor: "#f59e0b",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge className={config.className} data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}

// Export for use in charts
export { statusConfig };
