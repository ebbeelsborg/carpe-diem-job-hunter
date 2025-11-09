import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Application, Interview } from "@shared/schema";
import { statusConfig } from "@/components/status-badge";

type TimeRange = "1day" | "1week" | "1month" | "3months" | "all";

export default function Stats() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1month");

  // Fetch all applications
  const { data: allApplications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  // Fetch all interviews
  const { data: allInterviews = [] } = useQuery<Interview[]>({
    queryKey: ["/api/interviews"],
  });

  // Filter data based on time range
  const { applications, interviews } = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case "1day":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "1week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "all":
        cutoffDate.setFullYear(1970); // Beginning of time
        break;
    }

    const filteredApplications = allApplications.filter(app => 
      new Date(app.applicationDate) >= cutoffDate
    );

    const filteredInterviews = allInterviews.filter(interview => 
      new Date(interview.interviewDate) >= cutoffDate
    );

    return { applications: filteredApplications, interviews: filteredInterviews };
  }, [allApplications, allInterviews, timeRange]);

  // Status breakdown data
  const statusBreakdown = applications.reduce((acc, app) => {
    const status = app.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusBreakdown).map(([status, count]) => ({
    status: statusConfig[status as keyof typeof statusConfig]?.label || status,
    count,
    fill: statusConfig[status as keyof typeof statusConfig]?.hexColor || "#6b7280",
  }));

  // Applications over time (grouped by day based on time range)
  const timelineData = useMemo(() => {
    if (applications.length === 0) {
      return [];
    }

    // Group applications by date
    const applicationsOverTime = applications.reduce((acc, app) => {
      const date = new Date(app.applicationDate);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (timeRange === "all") {
      // For "all time", show daily data from first application to today
      const dates = applications.map(app => new Date(app.applicationDate).getTime());
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date();
      
      // Calculate days between first application and today
      const daysDiff = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const timelineDays = Array.from({ length: daysDiff }, (_, i) => {
        const d = new Date(minDate);
        d.setDate(d.getDate() + i);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      });

      return timelineDays.map(day => ({
        day,
        count: applicationsOverTime[day] || 0,
      }));
    } else {
      // For specific time ranges, show daily data
      const numDays = timeRange === "1day" ? 1 : 
                      timeRange === "1week" ? 7 : 
                      timeRange === "1month" ? 30 : 90;

      // Get days for the selected time range
      const timelineDays = Array.from({ length: numDays }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (numDays - 1 - i));
        return `${d.getMonth() + 1}/${d.getDate()}`;
      });

      return timelineDays.map(day => ({
        day,
        count: applicationsOverTime[day] || 0,
      }));
    }
  }, [applications, timeRange]);

  // Interview type breakdown
  const interviewTypeBreakdown = interviews.reduce((acc, interview) => {
    const type = interview.interviewType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const interviewTypeData = Object.entries(interviewTypeBreakdown).map(([type, count]) => ({
    type: type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    count,
    fill: getInterviewTypeColor(type),
  }));

  // Success metrics
  const totalApplications = applications.length;
  const offersReceived = applications.filter(app => app.status === "offer").length;
  const rejections = applications.filter(app => app.status === "rejected").length;
  const inProgress = applications.filter(app => 
    !["offer", "rejected", "withdrawn"].includes(app.status)
  ).length;
  const successRate = totalApplications > 0 ? ((offersReceived / totalApplications) * 100).toFixed(1) : "0";
  
  // Interview metrics
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === "completed").length;
  const upcomingInterviews = interviews.filter(i => i.status === "scheduled").length;

  // Average response time (days from application to first interview)
  const responseTimes: number[] = [];
  applications.forEach(app => {
    const appInterviews = interviews.filter(i => i.applicationId === app.id);
    if (appInterviews.length > 0) {
      const firstInterview = appInterviews.sort((a, b) => 
        new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime()
      )[0];
      const appDate = new Date(app.applicationDate);
      const interviewDate = new Date(firstInterview.interviewDate);
      const daysDiff = Math.floor((interviewDate.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0) {
        responseTimes.push(daysDiff);
      }
    }
  });
  const avgResponseTime = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
    : 0;

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  const timeRangeLabel = {
    "1day": "Last 24 Hours",
    "1week": "Last Week",
    "1month": "Last Month",
    "3months": "Last 3 Months",
    "all": "All Time"
  }[timeRange];

  const timeRangeChartLabel = {
    "1day": "Daily activity (last 24 hours)",
    "1week": "Daily activity (last 7 days)",
    "1month": "Daily activity (last 30 days)",
    "3months": "Daily activity (last 90 days)",
    "all": "Daily activity (all time)"
  }[timeRange];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analytics of your job search progress
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1day">Last 24 Hours</SelectItem>
            <SelectItem value="1week">Last Week</SelectItem>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {offersReceived} offers from {totalApplications} applications
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Active applications
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime} days</div>
            <p className="text-xs text-muted-foreground">
              Until first interview
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              {completedInterviews} completed, {upcomingInterviews} upcoming
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Application Status Breakdown */}
        <Card className="hover-elevate transition-shadow">
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
            <CardDescription>Distribution of your applications by status</CardDescription>
          </CardHeader>
          <CardContent>
            {statusChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="status" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No applications yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications Over Time */}
        <Card className="hover-elevate transition-shadow">
          <CardHeader>
            <CardTitle>Applications Over Time</CardTitle>
            <CardDescription>{timeRangeChartLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {timelineData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={10}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No application data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interview Type Breakdown */}
        <Card className="hover-elevate transition-shadow">
          <CardHeader>
            <CardTitle>Interview Type Distribution</CardTitle>
            <CardDescription>Breakdown of interviews by type</CardDescription>
          </CardHeader>
          <CardContent>
            {interviewTypeData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={interviewTypeData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.type}: ${entry.count}`}
                  >
                    {interviewTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No interviews yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Success vs Rejection */}
        <Card className="hover-elevate transition-shadow">
          <CardHeader>
            <CardTitle>Outcome Distribution</CardTitle>
            <CardDescription>Breakdown of application outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {totalApplications > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Offers", value: offersReceived, fill: statusConfig.offer.hexColor },
                      { name: "Rejected", value: rejections, fill: statusConfig.rejected.hexColor },
                      { name: "In Progress", value: inProgress, fill: "#3b82f6" },
                      { name: "Withdrawn", value: applications.filter(a => a.status === "withdrawn").length, fill: statusConfig.withdrawn.hexColor },
                    ].filter(item => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No applications yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to get interview type colors
function getInterviewTypeColor(type: string): string {
  const colors: Record<string, string> = {
    phone_screen: "#06b6d4",
    technical: "#22c55e",
    system_design: "#a855f7",
    behavioral: "#3b82f6",
    final: "#ef4444",
    other: "#6b7280",
  };
  return colors[type] || "#6b7280";
}

