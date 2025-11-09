import { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema } from "@shared/schema";
import type { Application, InsertApplication } from "@shared/schema";
import { z } from "zod";

const formSchema = insertApplicationSchema.omit({
  applicationDate: true,
  salaryMin: true,
  salaryMax: true,
}).extend({
  applicationDate: z.string(),
  salaryMin: z.coerce.number().optional().or(z.literal('')),
  salaryMax: z.coerce.number().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface ApplicationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: Partial<InsertApplication>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  application: Application | null;
}

export function ApplicationDetailsModal({
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  application,
}: ApplicationDetailsModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (application && open) {
      setValue("companyName", application.companyName);
      setValue("positionTitle", application.positionTitle);
      setValue("status", application.status);
      setValue("applicationDate", new Date(application.applicationDate).toISOString().split("T")[0]);
      setValue("jobUrl", application.jobUrl || "");
      setValue("logoUrl", application.logoUrl || "");
      setValue("location", application.location || "");
      setValue("isRemote", application.isRemote);
      setValue("notes", application.notes || "");
      setValue("salaryMin", application.salaryMin || "");
      setValue("salaryMax", application.salaryMax || "");
    } else if (!open) {
      reset();
    }
  }, [application, open, setValue, reset]);

  const handleFormSubmit = async (data: FormData) => {
    if (!application) return;
    
    try {
      const submitData: Partial<InsertApplication> = {
        companyName: data.companyName,
        positionTitle: data.positionTitle,
        status: data.status,
        applicationDate: new Date(data.applicationDate),
        jobUrl: data.jobUrl || undefined,
        logoUrl: data.logoUrl || undefined,
        location: data.location || undefined,
        isRemote: data.isRemote || false,
        notes: data.notes || undefined,
        salaryMin: data.salaryMin && typeof data.salaryMin === 'number' ? data.salaryMin : undefined,
        salaryMax: data.salaryMax && typeof data.salaryMax === 'number' ? data.salaryMax : undefined,
      };
      await onUpdate(application.id, submitData);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleDelete = async () => {
    if (!application || !onDelete) return;
    
    if (window.confirm(`Are you sure you want to delete the application for ${application.companyName}?`)) {
      try {
        await onDelete(application.id);
        onOpenChange(false);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!application ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading application details...
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                {...register("companyName")}
                placeholder="e.g., Google"
                data-testid="input-company-name"
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionTitle">Position Title *</Label>
              <Input
                id="positionTitle"
                {...register("positionTitle")}
                placeholder="e.g., Senior Software Engineer"
                data-testid="input-position-title"
              />
              {errors.positionTitle && (
                <p className="text-sm text-destructive">{errors.positionTitle.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="phone_screen">Phone Screen</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="final">Final Round</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Application Date</Label>
              <Input
                id="applicationDate"
                type="date"
                {...register("applicationDate")}
                data-testid="input-application-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., San Francisco, CA"
              data-testid="input-location"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isRemote"
              checked={watch("isRemote") || false}
              onCheckedChange={(checked) => setValue("isRemote", checked)}
              data-testid="switch-remote"
            />
            <Label htmlFor="isRemote">Remote Position</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                {...register("salaryMin")}
                placeholder="e.g., 120000"
                data-testid="input-salary-min"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                {...register("salaryMax")}
                placeholder="e.g., 180000"
                data-testid="input-salary-max"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job Posting URL</Label>
            <Input
              id="jobUrl"
              type="url"
              {...register("jobUrl")}
              placeholder="https://..."
              data-testid="input-job-url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional notes about this application..."
              rows={4}
              data-testid="textarea-notes"
            />
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  data-testid="button-delete"
                >
                  Delete Application
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save">
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
