import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Calendar, Clock, Video, Trash2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { Interview } from "@shared/schema";

interface InterviewTimelineProps {
  interviews: (Interview & { companyName?: string; positionTitle?: string })[];
  onDelete?: (id: string) => void;
}

const interviewTypeLabels: Record<string, string> = {
  phone_screen: "Phone Screen",
  technical: "Technical",
  system_design: "System Design",
  behavioral: "Behavioral",
  final: "Final Round",
  other: "Interview",
};

export function InterviewTimeline({ interviews, onDelete }: InterviewTimelineProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
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
                    <Badge variant="outline">
                      {interviewTypeLabels[interview.interviewType]}
                    </Badge>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(interview.id)}
                        data-testid={`button-delete-${interview.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(new Date(interview.interviewDate), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                    <span className="text-xs">
                      ({formatDistanceToNow(new Date(interview.interviewDate), { addSuffix: true })})
                    </span>
                  </div>
                  {interview.platform && (
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>{interview.platform}</span>
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
