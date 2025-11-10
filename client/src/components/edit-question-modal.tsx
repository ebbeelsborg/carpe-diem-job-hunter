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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionSchema } from "@shared/schema";
import type { Question, InsertQuestion } from "@shared/schema";

interface EditQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, data: Partial<InsertQuestion>) => Promise<void>;
  question: Question | null;
}

export function EditQuestionModal({
  open,
  onOpenChange,
  onSubmit,
  question,
}: EditQuestionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<InsertQuestion>({
    resolver: zodResolver(insertQuestionSchema),
    defaultValues: {
      isFavorite: false,
    },
  });

  const questionType = watch("questionType");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (question) {
      setValue("questionText", question.questionText);
      setValue("questionType", question.questionType);
      setValue("answerText", question.answerText || "");
      setValue("isFavorite", question.isFavorite || false);
      setTagsInput(question.tags?.join(", ") || "");
    }
  }, [question, setValue]);

  const handleFormSubmit = async (data: InsertQuestion) => {
    if (!question) return;
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const updateData: Partial<InsertQuestion> = {
        questionText: data.questionText,
        questionType: data.questionType,
        answerText: data.answerText || undefined,
        isFavorite: data.isFavorite || false,
        tags: tags.length > 0 ? tags : undefined,
      };
      await onSubmit(question.id, updateData);
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
          <DialogTitle>Edit Question</DialogTitle>
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

          <div className="flex items-center space-x-2">
            <Controller
              name="isFavorite"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isFavorite"
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  data-testid="checkbox-favorite"
                />
              )}
            />
            <label
              htmlFor="isFavorite"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as favorite
            </label>
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
