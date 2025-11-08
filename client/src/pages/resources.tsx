import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ResourceCard } from "@/components/resource-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen } from "lucide-react";
import type { Resource } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Resources() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.append("category", activeTab);
      const response = await fetch(`/api/resources?${params}`);
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, isReviewed }: { id: string; isReviewed: boolean }) => {
      return await apiRequest("PATCH", `/api/resources/${id}`, { isReviewed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resources"] });
      toast({
        title: "Success",
        description: "Resource updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    },
  });

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
        <Button onClick={() => console.log("Add resource")} data-testid="button-add-resource">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          <TabsTrigger value="algorithms" data-testid="tab-algorithms">Algorithms</TabsTrigger>
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
              <Button onClick={() => console.log("Add resource")} data-testid="button-add-first">
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
    </div>
  );
}
