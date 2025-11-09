import { useState } from "react";
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
import type { InsertApplication } from "@shared/schema";
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

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertApplication) => Promise<void>;
}

export function AddApplicationModal({
  open,
  onOpenChange,
  onSubmit,
}: AddApplicationModalProps) {
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
      status: "applied",
      isRemote: false,
      applicationDate: new Date().toISOString().split("T")[0],
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      const submitData: InsertApplication = {
        companyName: data.companyName,
        positionTitle: data.positionTitle,
        status: data.status,
        applicationDate: new Date(data.applicationDate),
        jobUrl: data.jobUrl || undefined,
        location: data.location || undefined,
        isRemote: data.isRemote || false,
        notes: data.notes || undefined,
        salaryMin: data.salaryMin && typeof data.salaryMin === 'number' ? data.salaryMin : undefined,
        salaryMax: data.salaryMax && typeof data.salaryMax === 'number' ? data.salaryMax : undefined,
      };
      await onSubmit(submitData);
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
          <DialogTitle>Add New Application</DialogTitle>
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
                value={watch("status") || "applied"}
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
                placeholder="e.g., 160000"
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
              data-testid="input-notes"
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
              Add Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
