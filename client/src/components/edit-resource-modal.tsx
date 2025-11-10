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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertResourceSchema } from "@shared/schema";
import type { Resource, InsertResource } from "@shared/schema";
import { useEffect } from "react";

interface EditResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: Partial<InsertResource>) => Promise<void>;
  resource: Resource | null;
}

export function EditResourceModal({
  open,
  onOpenChange,
  onSubmit,
  resource,
}: EditResourceModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InsertResource>({
    resolver: zodResolver(insertResourceSchema),
  });

  const category = watch("category");

  useEffect(() => {
    if (resource) {
      setValue("title", resource.title);
      setValue("url", resource.url || "");
      setValue("category", resource.category);
      setValue("notes", resource.notes || "");
    }
  }, [resource, setValue]);

  const handleFormSubmit = async (data: InsertResource) => {
    if (!resource) return;
    try {
      const updateData: Partial<InsertResource> = {
        title: data.title,
        url: data.url || undefined,
        category: data.category,
        notes: data.notes || undefined,
      };
      await onSubmit(resource.id, updateData);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Resource Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., LeetCode: Two Sum Problem"
              data-testid="input-title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              {...register("url")}
              placeholder="https://..."
              data-testid="input-url"
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algorithms">Coding</SelectItem>
                <SelectItem value="system_design">System Design</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="company_specific">Company Specific</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional notes about this resource..."
              rows={3}
              data-testid="textarea-notes"
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
