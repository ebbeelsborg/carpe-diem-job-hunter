import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, BookOpen } from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceCardProps {
  resource: Resource;
  onToggleReviewed?: (id: string, isReviewed: boolean) => void;
}

const categoryLabels: Record<string, string> = {
  algorithms: "Algorithms",
  system_design: "System Design",
  behavioral: "Behavioral",
  company_specific: "Company Specific",
  resume: "Resume",
  other: "Other",
};

const categoryColors: Record<string, string> = {
  algorithms: "bg-blue-50 text-blue-700 border-blue-200",
  system_design: "bg-purple-50 text-purple-700 border-purple-200",
  behavioral: "bg-green-50 text-green-700 border-green-200",
  company_specific: "bg-orange-50 text-orange-700 border-orange-200",
  resume: "bg-yellow-50 text-yellow-700 border-yellow-200",
  other: "bg-gray-50 text-gray-700 border-gray-200",
};

export function ResourceCard({ resource, onToggleReviewed }: ResourceCardProps) {
  return (
    <Card className="p-4 hover-elevate" data-testid={`card-resource-${resource.id}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold truncate" data-testid="text-resource-title">
              {resource.title}
            </h4>
            <Badge className={categoryColors[resource.category]}>
              {categoryLabels[resource.category]}
            </Badge>
          </div>
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1 mb-2"
              data-testid="link-resource-url"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="truncate">{resource.url}</span>
            </a>
          )}
          {resource.notes && (
            <p className="text-sm text-muted-foreground mb-3">{resource.notes}</p>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`reviewed-${resource.id}`}
              checked={resource.isReviewed || false}
              onCheckedChange={(checked) =>
                onToggleReviewed?.(resource.id, checked as boolean)
              }
              data-testid="checkbox-reviewed"
            />
            <label
              htmlFor={`reviewed-${resource.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as reviewed
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
