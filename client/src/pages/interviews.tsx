import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { InterviewTimeline } from "@/components/interview-timeline";
import { AddInterviewModal } from "@/components/add-interview-modal";
import { EditInterviewModal } from "@/components/edit-interview-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";
import type { Interview, Application, InsertInterview } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Interviews() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const { toast } = useToast();

  const { data: allInterviews = [], isLoading } = useQuery<
    (Interview & { companyName?: string; positionTitle?: string })[]
  >({
    queryKey: ["/api/interviews"],
    queryFn: async () => {
      const response = await fetch("/api/interviews");
      if (!response.ok) throw new Error("Failed to fetch interviews");
      return response.json();
    },
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const response = await fetch("/api/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertInterview) => {
      return await apiRequest("POST", "/api/interviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews/upcoming"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertInterview> }) => {
      return await apiRequest("PATCH", `/api/interviews/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews/upcoming"] });
      setShowEditModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update interview",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/interviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews/upcoming"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete interview",
        variant: "destructive",
      });
    },
  });

  const handleAddInterview = async (data: InsertInterview) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditInterview = (id: string) => {
    const interview = allInterviews.find(i => i.id === id);
    if (interview) {
      setSelectedInterview(interview as Interview);
      setShowEditModal(true);
    }
  };

  const handleUpdateInterview = async (id: string, data: Partial<InsertInterview>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDeleteInterview = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const upcomingInterviews = allInterviews.filter(
    (i) => i.status === "scheduled" && new Date(i.interviewDate) > new Date()
  );

  const completedInterviews = allInterviews.filter((i) => i.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and track your interview appointments
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} data-testid="button-add-interview">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming ({upcomingInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed ({completedInterviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : upcomingInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No upcoming interviews</h3>
              <p className="text-muted-foreground mb-6">
                Schedule an interview from your applications
              </p>
              <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          ) : (
            <InterviewTimeline 
              interviews={upcomingInterviews} 
              onEdit={handleEditInterview}
              onDelete={handleDeleteInterview} 
            />
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : completedInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No completed interviews</h3>
              <p className="text-muted-foreground">
                Your completed interviews will appear here
              </p>
            </div>
          ) : (
            <InterviewTimeline 
              interviews={completedInterviews} 
              onEdit={handleEditInterview}
              onDelete={handleDeleteInterview} 
            />
          )}
        </TabsContent>
      </Tabs>

      <AddInterviewModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddInterview}
        applications={applications}
      />

      <EditInterviewModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSubmit={handleUpdateInterview}
        applications={applications}
        interview={selectedInterview}
      />
    </div>
  );
}
