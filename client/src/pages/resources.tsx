import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResourceCard } from "@/components/resource-card";
import { AddResourceModal } from "@/components/add-resource-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen } from "lucide-react";
import type { Resource, InsertResource } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Resources() {
  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  // Build query URL with parameters
  const queryParams = new URLSearchParams();
  if (activeTab !== "all") queryParams.append("category", activeTab);
  const queryString = queryParams.toString();
  const queryUrl = `/api/resources${queryString ? `?${queryString}` : ""}`;

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: [queryUrl],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertResource) => {
      return await apiRequest("POST", "/api/resources", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, isReviewed }: { id: string; isReviewed: boolean }) => {
      return await apiRequest("PATCH", `/api/resources/${id}`, { isReviewed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  const handleAddResource = async (data: InsertResource) => {
    await createMutation.mutateAsync(data);
  };

  const handleToggleReviewed = (id: string, isReviewed: boolean) => {
    updateMutation.mutate({ id, isReviewed });
  };

  const filteredResources = resources;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Save and organize your interview preparation materials
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} data-testid="button-add-resource">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="algorithms" data-testid="tab-algorithms">Coding</TabsTrigger>
          <TabsTrigger value="system_design" data-testid="tab-system-design">System Design</TabsTrigger>
          <TabsTrigger value="behavioral" data-testid="tab-behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="company_specific" data-testid="tab-company">Company Specific</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                Add your first resource to get started
              </p>
              <Button onClick={() => setShowAddModal(true)} data-testid="button-add-first">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onToggleReviewed={handleToggleReviewed}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddResourceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddResource}
      />
    </div>
  );
}
