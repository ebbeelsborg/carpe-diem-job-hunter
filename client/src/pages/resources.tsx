import { useState } from "react";
import { ResourceCard } from "@/components/resource-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen } from "lucide-react";
import type { Resource } from "@shared/schema";

export default function Resources() {
  const [activeTab, setActiveTab] = useState("all");

  // TODO: remove mock functionality - replace with real data fetching
  const mockResources: Resource[] = [
    {
      id: "1",
      userId: "user1",
      title: "LeetCode Top Interview Questions",
      url: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/",
      category: "algorithms",
      notes: "Focus on arrays and strings first",
      isReviewed: false,
      linkedApplicationId: null,
      createdAt: new Date(),
    },
    {
      id: "2",
      userId: "user1",
      title: "System Design Primer",
      url: "https://github.com/donnemartin/system-design-primer",
      category: "system_design",
      notes: "Great resource for understanding scalability",
      isReviewed: true,
      linkedApplicationId: null,
      createdAt: new Date(),
    },
    {
      id: "3",
      userId: "user1",
      title: "STAR Method Guide",
      url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique",
      category: "behavioral",
      notes: "Practice behavioral questions using this framework",
      isReviewed: false,
      linkedApplicationId: null,
      createdAt: new Date(),
    },
    {
      id: "4",
      userId: "user1",
      title: "Google Interview Tips",
      url: "https://careers.google.com/how-we-hire/",
      category: "company_specific",
      notes: null,
      isReviewed: false,
      linkedApplicationId: "1",
      createdAt: new Date(),
    },
  ];

  const filteredResources = activeTab === "all"
    ? mockResources
    : mockResources.filter((r) => r.category === activeTab);

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
          {filteredResources.length === 0 ? (
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
                  onToggleReviewed={(id, isReviewed) =>
                    console.log("Toggle reviewed:", id, isReviewed)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
