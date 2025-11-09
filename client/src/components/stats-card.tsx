import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  testId?: string;
  color?: 'green' | 'yellow' | 'red' | 'blue';
}

export function StatsCard({ title, value, icon: Icon, testId, color }: StatsCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
  };

  const iconColorClasses = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };

  return (
    <Card className={`p-6 hover-elevate transition-shadow ${color ? colorClasses[color] : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2" data-testid={testId}>
            {value}
          </p>
        </div>
        <Icon className={`h-5 w-5 ${color ? iconColorClasses[color] : 'text-muted-foreground'}`} />
      </div>
    </Card>
  );
}
