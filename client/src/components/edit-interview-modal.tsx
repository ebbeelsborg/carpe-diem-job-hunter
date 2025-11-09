import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInterviewSchema } from "@shared/schema";
import type { InsertInterview, Application, Interview } from "@shared/schema";
import { z } from "zod";

const formSchema = insertInterviewSchema.omit({
  interviewDate: true,
  durationMinutes: true,
  rating: true,
  platform: true,
}).extend({
  interviewDate: z.string(),
  durationMinutes: z.coerce.number().min(1, "Duration is required"),
  rating: z.coerce.number().min(1).max(5).optional().or(z.literal('')),
  platform: z.string().min(1, "Platform is required"),
});

type FormData = z.infer<typeof formSchema>;

interface EditInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: Partial<InsertInterview>) => Promise<void>;
  applications: Application[];
  interview: Interview | null;
}

export function EditInterviewModal({
  open,
  onOpenChange,
  onSubmit,
  applications,
  interview,
}: EditInterviewModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewType: "phone_screen",
      status: "scheduled",
      interviewDate: new Date().toISOString().split("T")[0],
    },
  });

  const applicationId = watch("applicationId");
  const interviewType = watch("interviewType");
  const status = watch("status");

  useEffect(() => {
    if (open && interview) {
      setValue("applicationId", interview.applicationId);
      setValue("interviewType", interview.interviewType);
      setValue("status", interview.status);
      setValue("interviewDate", new Date(interview.interviewDate).toISOString().split("T")[0]);
      setValue("durationMinutes", interview.durationMinutes || '');
      setValue("platform", interview.platform || '');
      setValue("interviewerNames", interview.interviewerNames || '');
      setValue("prepNotes", interview.prepNotes || '');
      setValue("rating", interview.rating || '');
    }
  }, [open, interview, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: FormData) => {
    if (!interview) return;
    try {
      const submitData: Partial<InsertInterview> = {
        ...data,
        interviewDate: new Date(`${data.interviewDate}T12:00:00`),
        durationMinutes: data.durationMinutes ? Number(data.durationMinutes) : undefined,
        rating: data.rating ? Number(data.rating) : undefined,
      };
      await onSubmit(interview.id, submitData);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="applicationId">Company/Position *</Label>
            <Select
              value={applicationId}
              onValueChange={(value) => setValue("applicationId", value)}
            >
              <SelectTrigger data-testid="select-application">
                <SelectValue placeholder="Select an application" />
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.companyName} - {app.positionTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.applicationId && (
              <p className="text-sm text-destructive">{errors.applicationId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type *</Label>
              <Select
                value={interviewType}
                onValueChange={(value) => setValue("interviewType", value as any)}
              >
                <SelectTrigger data-testid="select-interview-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone_screen">Phone Screen</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="system_design">System Design</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewDate">Interview Date *</Label>
              <Input
                id="interviewDate"
                type="date"
                {...register("interviewDate")}
                data-testid="input-interview-date"
              />
              {errors.interviewDate && (
                <p className="text-sm text-destructive">{errors.interviewDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
              <Input
                id="durationMinutes"
                type="number"
                {...register("durationMinutes")}
                placeholder="e.g., 60"
                data-testid="input-duration"
              />
              {errors.durationMinutes && (
                <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform (URL) *</Label>
              <Input
                id="platform"
                {...register("platform")}
                placeholder="e.g., Zoom, Google Meet"
                data-testid="input-platform"
              />
              {errors.platform && (
                <p className="text-sm text-destructive">{errors.platform.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewerNames">Interviewer(s)</Label>
            <Input
              id="interviewerNames"
              {...register("interviewerNames")}
              placeholder="e.g., John Doe, Jane Smith"
              data-testid="input-interviewers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prepNotes">Preparation Notes</Label>
            <Textarea
              id="prepNotes"
              {...register("prepNotes")}
              placeholder="Topics to review, questions to prepare..."
              rows={3}
              data-testid="textarea-prep-notes"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Update Interview
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
