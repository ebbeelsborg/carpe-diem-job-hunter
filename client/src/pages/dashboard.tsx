import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import { InterviewTimeline } from "@/components/interview-timeline";
import { ApplicationCard } from "@/components/application-card";
import { AddApplicationModal } from "@/components/add-application-modal";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, TrendingUp, CheckCircle, Plus } from "lucide-react";
import type { Application, Interview, InsertApplication } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  const { data: stats } = useQuery<{ total: number; byStatus: Record<string, number> }>({
    queryKey: ["/api/applications/stats"],
  });

  const { data: upcomingInterviews = [] } = useQuery<
    (Interview & { companyName?: string; positionTitle?: string })[]
  >({
    queryKey: ["/api/interviews/upcoming"],
    queryFn: async () => {
      const response = await fetch("/api/interviews/upcoming?limit=5");
      if (!response.ok) throw new Error("Failed to fetch interviews");
      return response.json();
    },
  });

  const { data: recentApplications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications", "recent"],
    queryFn: async () => {
      const response = await fetch("/api/applications");
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      return data.slice(0, 2);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      return await apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/stats"] });
      toast({
        title: "Success",
        description: "Application added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add application",
        variant: "destructive",
      });
    },
  });

  const handleAddApplication = async (data: InsertApplication) => {
    return new Promise((resolve, reject) => {
      createMutation.mutate(data, {
        onSuccess: () => {
          setShowAddModal(false);
          resolve(undefined);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const inProgressCount =
    (stats?.byStatus?.phone_screen || 0) +
    (stats?.byStatus?.technical || 0) +
    (stats?.byStatus?.onsite || 0) +
    (stats?.byStatus?.final || 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your job applications and interview progress
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} data-testid="button-add-application">
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats?.total || 0}
          icon={Briefcase}
          testId="stat-total"
        />
        <StatsCard
          title="Upcoming Interviews"
          value={upcomingInterviews.length}
          icon={Calendar}
          testId="stat-interviews"
        />
        <StatsCard
          title="In Progress"
          value={inProgressCount}
          icon={TrendingUp}
          testId="stat-progress"
        />
        <StatsCard
          title="Offers"
          value={stats?.byStatus?.offer || 0}
          icon={CheckCircle}
          testId="stat-offers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
          <InterviewTimeline interviews={upcomingInterviews} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="mt-4"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onScheduleInterview={(id) => console.log("Schedule interview for", id)}
                  onViewDetails={(id) => console.log("View details for", id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddApplicationModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddApplication}
      />
    </div>
  );
}
