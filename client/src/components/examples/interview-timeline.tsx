import { InterviewTimeline } from "../interview-timeline";
import type { Interview } from "@shared/schema";

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

export default function InterviewTimelineExample() {
  return (
    <div className="max-w-2xl">
      <InterviewTimeline interviews={mockInterviews} />
    </div>
  );
}
