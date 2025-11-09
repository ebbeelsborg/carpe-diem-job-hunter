import { useState } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar as CalendarIcon, Building2, MoreVertical, Pencil, CalendarPlus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Application } from "@shared/schema";
import { getCompanyLogoUrl } from "@/lib/logo";

interface ApplicationCardProps {
  application: Application;
  onScheduleInterview?: (applicationId: string) => void;
  onViewDetails?: (applicationId: string) => void;
  onEdit?: (applicationId: string) => void;
  onDelete?: (applicationId: string) => void;
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
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const [logoError, setLogoError] = useState(false);
  const statusColor = statusColors[application.status] || "border-l-gray-400";
  const logoUrl = getCompanyLogoUrl(application.jobUrl, application.companyName);

  return (
    <Card
      className={`p-6 border-l-4 ${statusColor} hover-elevate transition-shadow cursor-pointer`}
      onClick={() => onViewDetails?.(application.id)}
      data-testid={`card-application-${application.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
            {!logoError ? (
              <img
                src={logoUrl}
                alt={`${application.companyName} logo`}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
                data-testid="img-company-logo"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
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
        <div className="flex items-center gap-2">
          <StatusBadge status={application.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                data-testid={`button-menu-${application.id}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(application.id);
                  }}
                  data-testid={`menu-edit-${application.id}`}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onScheduleInterview && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onScheduleInterview(application.id);
                  }}
                  data-testid={`menu-schedule-${application.id}`}
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Schedule Interview
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(application.id);
                  }}
                  className="text-destructive focus:text-destructive"
                  data-testid={`menu-delete-${application.id}`}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2">
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
    </Card>
  );
}
