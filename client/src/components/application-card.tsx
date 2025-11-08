import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { MapPin, DollarSign, Calendar as CalendarIcon, Building2 } from "lucide-react";
import { format } from "date-fns";
import type { Application } from "@shared/schema";

interface ApplicationCardProps {
  application: Application;
  onScheduleInterview?: (applicationId: string) => void;
  onViewDetails?: (applicationId: string) => void;
}

const statusColors: Record<string, string> = {
  applied: "border-l-blue-500",
  phone_screen: "border-l-purple-500",
  technical: "border-l-orange-500",
  onsite: "border-l-yellow-500",
  final: "border-l-yellow-500",
  offer: "border-l-green-500",
  rejected: "border-l-red-500",
  withdrawn: "border-l-gray-400",
};

export function ApplicationCard({
  application,
  onScheduleInterview,
  onViewDetails,
}: ApplicationCardProps) {
  const statusColor = statusColors[application.status] || "border-l-gray-400";

  return (
    <Card
      className={`p-6 border-l-4 ${statusColor} hover-elevate transition-shadow`}
      data-testid={`card-application-${application.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold" data-testid="text-company-name">
              {application.companyName}
            </h3>
            <p className="text-base text-muted-foreground">
              {application.positionTitle}
            </p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="space-y-2 mb-4">
        {application.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{application.location}</span>
            {application.isRemote && (
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                Remote
              </span>
            )}
          </div>
        )}
        {(application.salaryMin || application.salaryMax) && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            <span>
              {application.salaryMin && `$${application.salaryMin.toLocaleString()}`}
              {application.salaryMin && application.salaryMax && " - "}
              {application.salaryMax && `$${application.salaryMax.toLocaleString()}`}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>Applied {format(new Date(application.applicationDate), "MMM d, yyyy")}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(application.id)}
          data-testid="button-view-details"
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onScheduleInterview?.(application.id)}
          data-testid="button-schedule-interview"
        >
          Schedule Interview
        </Button>
      </div>
    </Card>
  );
}
