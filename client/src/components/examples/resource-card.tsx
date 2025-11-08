import { ResourceCard } from "../resource-card";
import type { Resource } from "@shared/schema";

const mockResource: Resource = {
  id: "1",
  userId: "user1",
  title: "LeetCode Top Interview Questions",
  url: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/",
  category: "algorithms",
  notes: "Focus on arrays and strings first",
  isReviewed: false,
  linkedApplicationId: null,
  createdAt: new Date(),
};

export default function ResourceCardExample() {
  return (
    <div className="max-w-md">
      <ResourceCard
        resource={mockResource}
        onToggleReviewed={(id, isReviewed) =>
          console.log("Toggle reviewed:", id, isReviewed)
        }
      />
    </div>
  );
}
