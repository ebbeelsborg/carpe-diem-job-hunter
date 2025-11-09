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
  { label: string; className: string }
> = {
  applied: {
    label: "Applied",
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },
  phone_screen: {
    label: "Phone Screen",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  technical: {
    label: "Technical",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  onsite: {
    label: "Onsite",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  final: {
    label: "Final",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  offer: {
    label: "Offer",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-gray-50 text-gray-700 border-gray-200",
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
