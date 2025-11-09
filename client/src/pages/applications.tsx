import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ApplicationCard } from "@/components/application-card";
import { AddApplicationModal } from "@/components/add-application-modal";
import { AddInterviewModal } from "@/components/add-interview-modal";
import { ApplicationDetailsModal } from "@/components/application-details-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Briefcase } from "lucide-react";
import type { Application, InsertApplication, InsertInterview } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Applications() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications", statusFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      const response = await fetch(`/api/applications?${params}`);
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
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

  const interviewMutation = useMutation({
    mutationFn: async (data: InsertInterview) => {
      return await apiRequest("POST", "/api/interviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      setShowInterviewModal(false);
      toast({
        title: "Success",
        description: "Interview scheduled successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule interview",
        variant: "destructive",
      });
    },
  });

  const handleScheduleInterview = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setShowInterviewModal(true);
  };

  const handleAddInterview = async (data: InsertInterview) => {
    await interviewMutation.mutateAsync(data);
  };

  const handleViewDetails = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (app) {
      setSelectedApplication(app);
      setShowDetailsModal(true);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertApplication> }) => {
      return await apiRequest("PATCH", `/api/applications/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/stats"] });
      toast({
        title: "Success",
        description: "Application updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications/stats"] });
      toast({
        title: "Success",
        description: "Application deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      });
    },
  });

  const handleUpdateApplication = async (id: string, data: Partial<InsertApplication>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDeleteApplication = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your job applications
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} data-testid="button-add-application">
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or position..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
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

      {isLoading ? (
        <div className="flex justify-center py-24">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first application to get started"}
          </p>
          <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Application
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onScheduleInterview={handleScheduleInterview}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <AddApplicationModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddApplication}
      />

      <AddInterviewModal
        open={showInterviewModal}
        onOpenChange={setShowInterviewModal}
        onSubmit={handleAddInterview}
        applications={applications}
        preselectedApplicationId={selectedApplicationId}
      />

      <ApplicationDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onUpdate={handleUpdateApplication}
        onDelete={handleDeleteApplication}
        application={selectedApplication}
      />
    </div>
  );
}
