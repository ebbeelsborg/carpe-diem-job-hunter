import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, Video, Trash2, Pencil, User, Building2, ExternalLink, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Interview } from "@shared/schema";
import { formatDateTimeInUserTz } from "@/lib/timezone";
import { getCompanyLogoUrl } from "@/lib/logo";

interface InterviewTimelineProps {
  interviews: (Interview & { companyName?: string; positionTitle?: string; jobUrl?: string })[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewApplication?: (applicationId: string) => void;
}

const interviewTypeLabels: Record<string, string> = {
  phone_screen: "Phone Screen",
  technical: "Technical",
  system_design: "System Design",
  behavioral: "Behavioral",
  final: "Final Round",
  other: "Interview",
};

export function InterviewTimeline({ interviews, onDelete, onEdit, onViewApplication }: InterviewTimelineProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      // Try with https:// prefix for URLs without protocol
      try {
        new URL(`https://${url}`);
        return true;
      } catch {
        return false;
      }
    }
  };

  const getValidUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch {
      // Add https:// prefix for URLs without protocol
      return `https://${url}`;
    }
  };

  const handleDeleteClick = (id: string) => {
    setInterviewToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (interviewToDelete && onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(interviewToDelete);
      } catch (error) {
        console.error("Failed to delete interview:", error);
      } finally {
        setIsDeleting(false);
        setDeleteDialogOpen(false);
        setInterviewToDelete(null);
      }
    }
  };

  if (interviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold mb-1">No Upcoming Interviews</h3>
        <p className="text-sm text-muted-foreground">
          Schedule your first interview to see it here
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {interviews.map((interview, index) => (
          <Card
            key={interview.id}
            className="p-4 hover-elevate"
            data-testid={`card-interview-${interview.id}`}
          >
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                  {!logoErrors[interview.id] && interview.companyName ? (
                    <img
                      src={getCompanyLogoUrl(interview.jobUrl, interview.companyName)}
                      alt={`${interview.companyName} logo`}
                      className="w-full h-full object-contain"
                      onError={() => setLogoErrors(prev => ({ ...prev, [interview.id]: true }))}
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                {index < interviews.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold" data-testid="text-company">
                      {interview.companyName || "Company Name"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {interview.positionTitle || "Position"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        interview.interviewType === "phone_screen" ? "border-cyan-500 text-cyan-700 bg-cyan-50" :
                        interview.interviewType === "technical" ? "border-green-500 text-green-700 bg-green-50" :
                        interview.interviewType === "system_design" ? "border-purple-500 text-purple-700 bg-purple-50" :
                        interview.interviewType === "behavioral" ? "border-blue-500 text-blue-700 bg-blue-50" :
                        interview.interviewType === "final" ? "border-red-500 text-red-700 bg-red-50" :
                        "border-gray-500 text-gray-700 bg-gray-50"
                      }
                    >
                      {interviewTypeLabels[interview.interviewType]}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-menu-${interview.id}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit(interview.id)}
                            data-testid={`menu-edit-${interview.id}`}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onViewApplication && (
                          <DropdownMenuItem
                            onClick={() => onViewApplication(interview.applicationId)}
                            data-testid={`menu-view-application-${interview.id}`}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Application
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(interview.id)}
                            className="text-destructive focus:text-destructive"
                            data-testid={`menu-delete-${interview.id}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDateTimeInUserTz(interview.interviewDate, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    <span className="text-xs">
                      ({formatDistanceToNow(new Date(interview.interviewDate), { addSuffix: true })})
                    </span>
                  </div>
                  {interview.platform && (
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {isValidUrl(interview.platform) ? (
                        <a
                          href={getValidUrl(interview.platform)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {interview.platform}
                        </a>
                      ) : (
                        <span>{interview.platform}</span>
                      )}
                    </div>
                  )}
                  {interview.interviewerNames && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{interview.interviewerNames}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this interview? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              data-testid="button-delete"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
