import { useState } from "react";
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
import { Plus, Lightbulb, Star, Search } from "lucide-react";
import type { Question } from "@shared/schema";

export default function Questions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // TODO: remove mock functionality - replace with real data fetching
  const mockQuestions: Question[] = [
    {
      id: "1",
      userId: "user1",
      questionText: "Tell me about a time when you had to deal with a difficult team member",
      answerText: "In my previous role, I worked with a colleague who was resistant to code reviews...",
      questionType: "behavioral",
      isFavorite: true,
      tags: ["teamwork", "conflict-resolution"],
      createdAt: new Date(),
    },
    {
      id: "2",
      userId: "user1",
      questionText: "How would you design a URL shortener?",
      answerText: "I would start by considering the scale requirements...",
      questionType: "system_design",
      isFavorite: true,
      tags: ["scalability", "databases"],
      createdAt: new Date(),
    },
    {
      id: "3",
      userId: "user1",
      questionText: "Implement a function to reverse a linked list",
      answerText: "Here's my approach using iterative method...",
      questionType: "technical",
      isFavorite: false,
      tags: ["data-structures", "algorithms"],
      createdAt: new Date(),
    },
  ];

  const filteredQuestions = mockQuestions.filter((q) => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || q.questionType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questions Bank</h1>
          <p className="text-muted-foreground mt-1">
            Store and review common interview questions and your answers
          </p>
        </div>
        <Button onClick={() => console.log("Add question")} data-testid="button-add-question">
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
          </SelectContent>
        </Select>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Lightbulb className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first question to get started"}
          </p>
          <Button onClick={() => console.log("Add question")} data-testid="button-add-first">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
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
                    <Badge variant="outline">
                      {question.questionType.replace("_", " ")}
                    </Badge>
                    {question.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
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
    </div>
  );
}
