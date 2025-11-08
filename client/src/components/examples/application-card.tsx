import { ApplicationCard } from "../application-card";
import type { Application } from "@shared/schema";

const mockApplication: Application = {
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
};

export default function ApplicationCardExample() {
  return (
    <div className="max-w-md">
      <ApplicationCard
        application={mockApplication}
        onScheduleInterview={(id) => console.log("Schedule interview for", id)}
        onViewDetails={(id) => console.log("View details for", id)}
      />
    </div>
  );
}
