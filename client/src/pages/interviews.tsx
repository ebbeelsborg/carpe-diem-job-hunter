import { InterviewTimeline } from "@/components/interview-timeline";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar } from "lucide-react";
import type { Interview } from "@shared/schema";

export default function Interviews() {
  // TODO: remove mock functionality - replace with real data fetching
  const mockInterviews: (Interview & { companyName?: string; positionTitle?: string })[] = [
    {
      id: "1",
      applicationId: "app1",
      interviewType: "phone_screen",
      interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      durationMinutes: 30,
      interviewerNames: "Sarah Johnson",
      platform: "Google Meet",
      status: "scheduled",
      prepNotes: null,
      interviewNotes: null,
      questionsAsked: null,
      rating: null,
      followUpActions: null,
      createdAt: new Date(),
      companyName: "TechCorp",
      positionTitle: "Senior Frontend Engineer",
    },
    {
      id: "2",
      applicationId: "app2",
      interviewType: "technical",
      interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      interviewerNames: "Mike Chen",
      platform: "Zoom",
      status: "scheduled",
      prepNotes: null,
      interviewNotes: null,
      questionsAsked: null,
      rating: null,
      followUpActions: null,
      createdAt: new Date(),
      companyName: "DataFlow Inc",
      positionTitle: "Full Stack Developer",
    },
    {
      id: "3",
      applicationId: "app3",
      interviewType: "behavioral",
      interviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      durationMinutes: 45,
      interviewerNames: "Alex Rivera",
      platform: "On-site",
      status: "completed",
      prepNotes: null,
      interviewNotes: "Went well, asked about team dynamics",
      questionsAsked: null,
      rating: 4,
      followUpActions: null,
      createdAt: new Date(),
      companyName: "CloudScale",
      positionTitle: "DevOps Engineer",
    },
  ];

  const upcomingInterviews = mockInterviews.filter(
    (i) => i.status === "scheduled" && new Date(i.interviewDate) > new Date()
  );

  const completedInterviews = mockInterviews.filter((i) => i.status === "completed");

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
          {upcomingInterviews.length === 0 ? (
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
          {completedInterviews.length === 0 ? (
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
