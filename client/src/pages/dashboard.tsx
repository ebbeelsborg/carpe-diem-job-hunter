import { useState } from "react";
import { StatsCard } from "@/components/stats-card";
import { InterviewTimeline } from "@/components/interview-timeline";
import { ApplicationCard } from "@/components/application-card";
import { AddApplicationModal } from "@/components/add-application-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Calendar, TrendingUp, CheckCircle, Plus } from "lucide-react";
import type { Application, Interview, InsertApplication } from "@shared/schema";

export default function Dashboard() {
  const [showAddModal, setShowAddModal] = useState(false);

  // TODO: remove mock functionality - replace with real data fetching
  const mockApplications: Application[] = [
    {
      id: "1",
      userId: "user1",
      companyName: "TechCorp",
      positionTitle: "Senior Frontend Engineer",
      jobUrl: null,
      logoUrl: null,
      status: "phone_screen",
      salaryMin: 120000,
      salaryMax: 160000,
      location: "San Francisco, CA",
      isRemote: true,
      applicationDate: new Date("2024-01-15"),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      userId: "user1",
      companyName: "DataFlow Inc",
      positionTitle: "Full Stack Developer",
      jobUrl: null,
      logoUrl: null,
      status: "technical",
      salaryMin: 130000,
      salaryMax: 170000,
      location: "Remote",
      isRemote: true,
      applicationDate: new Date("2024-01-20"),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

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
  ];

  const handleAddApplication = (data: InsertApplication) => {
    console.log("Adding application:", data);
    // TODO: remove mock functionality - implement actual API call
  };

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
        <StatsCard title="Total Applications" value={24} icon={Briefcase} testId="stat-total" />
        <StatsCard title="Upcoming Interviews" value={3} icon={Calendar} testId="stat-interviews" />
        <StatsCard title="In Progress" value={12} icon={TrendingUp} testId="stat-progress" />
        <StatsCard title="Offers" value={2} icon={CheckCircle} testId="stat-offers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
          <InterviewTimeline interviews={mockInterviews} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {mockApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onScheduleInterview={(id) => console.log("Schedule interview for", id)}
                onViewDetails={(id) => console.log("View details for", id)}
              />
            ))}
          </div>
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
