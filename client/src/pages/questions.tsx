import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AddQuestionModal } from "@/components/add-question-modal";
import { EditQuestionModal } from "@/components/edit-question-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Lightbulb, Star, Search, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Question, InsertQuestion } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Questions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { toast } = useToast();

  // Build query URL with parameters
  const queryParams = new URLSearchParams();
  if (typeFilter !== "all") queryParams.append("type", typeFilter);
  if (searchTerm) queryParams.append("search", searchTerm);
  const queryString = queryParams.toString();
  const queryUrl = `/api/questions${queryString ? `?${queryString}` : ""}`;

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: [queryUrl],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertQuestion) => {
      return await apiRequest("POST", "/api/questions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => {
        const key = query.queryKey[0] as string;
        return key?.startsWith("/api/questions");
      }});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add question",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertQuestion> }) => {
      return await apiRequest("PATCH", `/api/questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => {
        const key = query.queryKey[0] as string;
        return key?.startsWith("/api/questions");
      }});
      setShowEditModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => {
        const key = query.queryKey[0] as string;
        return key?.startsWith("/api/questions");
      }});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    },
  });

  const handleAddQuestion = async (data: InsertQuestion) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      setSelectedQuestion(question);
      setShowEditModal(true);
    }
  };

  const handleUpdateQuestion = async (id: string, data: Partial<InsertQuestion>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleCloseEditModal = (open: boolean) => {
    setShowEditModal(open);
    if (!open) {
      setSelectedQuestion(null);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questions Bank</h1>
          <p className="text-muted-foreground mt-1">
            Store and review common interview questions and your answers
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} data-testid="button-add-question">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-type">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="behavioral">Behavioral</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="system_design">System Design</SelectItem>
            <SelectItem value="company_culture">Company Culture</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Lightbulb className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first question to get started"}
          </p>
          <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card
              key={question.id}
              className="p-6 hover-elevate"
              data-testid={`card-question-${question.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold" data-testid="text-question">
                      {question.questionText}
                    </h3>
                    {question.isFavorite && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Badge 
                      variant="outline"
                      className={
                        question.questionType === "behavioral" ? "border-blue-500 text-blue-700 bg-blue-50 capitalize" :
                        question.questionType === "technical" ? "border-green-500 text-green-700 bg-green-50 capitalize" :
                        question.questionType === "system_design" ? "border-purple-500 text-purple-700 bg-purple-50 capitalize" :
                        question.questionType === "experience" ? "border-pink-500 text-pink-700 bg-pink-50 capitalize" :
                        question.questionType === "company_culture" ? "border-indigo-500 text-indigo-700 bg-indigo-50 capitalize" :
                        "border-gray-500 text-gray-700 bg-gray-50 capitalize"
                      }
                    >
                      {question.questionType.replace("_", " ")}
                    </Badge>
                    {question.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`button-menu-${question.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditQuestion(question.id)}
                      data-testid={`menu-edit-${question.id}`}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-destructive focus:text-destructive"
                      data-testid={`menu-delete-${question.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {question.answerText && (
                <div className="bg-secondary/50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-1">Your Answer:</p>
                  <p className="text-sm text-muted-foreground">{question.answerText}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <AddQuestionModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddQuestion}
      />
      <EditQuestionModal
        open={showEditModal}
        onOpenChange={handleCloseEditModal}
        onSubmit={handleUpdateQuestion}
        question={selectedQuestion}
      />
    </div>
  );
}
