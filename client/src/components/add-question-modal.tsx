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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionSchema } from "@shared/schema";
import type { InsertQuestion } from "@shared/schema";

interface AddQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InsertQuestion) => Promise<void>;
}

export function AddQuestionModal({
  open,
  onOpenChange,
  onSubmit,
}: AddQuestionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InsertQuestion>({
    resolver: zodResolver(insertQuestionSchema),
    defaultValues: {
      questionType: "behavioral",
      isFavorite: false,
    },
  });

  const questionType = watch("questionType");

  const [tagsInput, setTagsInput] = useState("");

  const handleFormSubmit = async (data: InsertQuestion) => {
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const submitData = {
        ...data,
        tags: tags.length > 0 ? tags : undefined,
      };
      await onSubmit(submitData);
      reset();
      setTagsInput("");
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Interview Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="questionText">Question *</Label>
            <Textarea
              id="questionText"
              {...register("questionText")}
              placeholder="e.g., Tell me about a time when you had to resolve a conflict with a team member..."
              rows={3}
              data-testid="textarea-question"
            />
            {errors.questionText && (
              <p className="text-sm text-destructive">{errors.questionText.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionType">Question Type *</Label>
            <Select
              value={questionType}
              onValueChange={(value) => setValue("questionType", value as any)}
            >
              <SelectTrigger data-testid="select-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="system_design">System Design</SelectItem>
                <SelectItem value="company_culture">Company Culture</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
            {errors.questionType && (
              <p className="text-sm text-destructive">{errors.questionType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="answerText">Your Answer</Label>
            <Textarea
              id="answerText"
              {...register("answerText")}
              placeholder="Write your prepared answer here..."
              rows={6}
              data-testid="textarea-answer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., leadership, conflict resolution"
              data-testid="input-tags"
            />
            <p className="text-sm text-muted-foreground">
              Add tags to organize your questions (optional)
            </p>
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
              Add Question
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
