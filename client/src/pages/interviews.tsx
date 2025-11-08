import { useQuery } from "@tanstack/react-query";
import { InterviewTimeline } from "@/components/interview-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import type { Interview } from "@shared/schema";

export default function Interviews() {
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
            </div>
          ) : (
            <InterviewTimeline interviews={upcomingInterviews} />
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
            <InterviewTimeline interviews={completedInterviews} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
