import React from "react";
import { useOutlets } from "@/context/OutletContext";
import { useNavigate } from "react-router-dom";
import {
  Store,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  Tooltip as RechartsTooltip,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  LineChart,
  Line,
  LabelList,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const radarChartConfig = {
  desktop: {
    label: "Audits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const statusPieConfig = {
  value: {
    label: "Outlets",
  },
  active: {
    label: "Active",
    color: "var(--chart-1)",
  },
  inactive: {
    label: "Inactive",
    color: "var(--chart-2)",
  },
  prospect: {
    label: "Prospect",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const interactiveChartConfig = {
  views: {
    label: "Total Audits",
  },
  active: {
    label: "Active Outlets",
    color: "var(--chart-1)",
  },
  prospect: {
    label: "Prospect Outlets",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const lineChartConfig = {
  desktop: {
    label: "Audits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const Dashboard: React.FC = () => {
  const { outlets } = useOutlets();
  const navigate = useNavigate();

  // Metrics calculations
  const totalOutlets = outlets.length;
  const activeOutlets = outlets.filter((o) => o.status === "Active").length;
  const inactiveOutlets = outlets.filter((o) => o.status === "Inactive").length;
  const prospectOutlets = outlets.filter((o) => o.status === "Prospect").length;

  const overdueOutlets = outlets.filter((o) => daysSince(o.lastVisit) > 21);
  const overdueCount = overdueOutlets.length;



  const statusPieData = React.useMemo(() => [
    { status: "active", value: activeOutlets, fill: "var(--color-active)" },
    { status: "inactive", value: inactiveOutlets, fill: "var(--color-inactive)" },
    { status: "prospect", value: prospectOutlets, fill: "var(--color-prospect)" },
  ], [activeOutlets, inactiveOutlets, prospectOutlets]);

  // State for interactive daily chart
  const [activeChart, setActiveChart] = React.useState<"active" | "prospect">("active");

  // Dynamic daily audits calculation by status
  const interactiveChartData = React.useMemo(() => {
    const dateGroups: Record<string, { active: number; prospect: number }> = {};
    
    outlets.forEach((o) => {
      const dateStr = o.lastVisit;
      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = { active: 0, prospect: 0 };
      }
      if (o.status === "Active") {
        dateGroups[dateStr].active += 1;
      } else if (o.status === "Prospect") {
        dateGroups[dateStr].prospect += 1;
      }
    });

    return Object.entries(dateGroups)
      .map(([date, counts]) => ({
        date,
        active: counts.active,
        prospect: counts.prospect,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [outlets]);

  // Dynamic totals for active vs prospect status audits
  const interactiveTotals = React.useMemo(() => {
    return {
      active: interactiveChartData.reduce((acc, curr) => acc + curr.active, 0),
      prospect: interactiveChartData.reduce((acc, curr) => acc + curr.prospect, 0),
    };
  }, [interactiveChartData]);


  // Dynamic calculation for Radar Chart showing visit counts over the last 6 months
  const radarChartData = React.useMemo(() => {
    const monthsData: {
      month: string;
      monthIndex: number;
      year: number;
      desktop: number;
    }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthShort = d.toLocaleString("en-US", { month: "short" }); // e.g. "Feb"
      monthsData.push({
        month: monthShort,
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        desktop: 0
      });
    }
    
    outlets.forEach((o) => {
      const visitDate = new Date(o.lastVisit);
      const visitMonth = visitDate.getMonth();
      const visitYear = visitDate.getFullYear();
      
      const match = monthsData.find((m) => m.monthIndex === visitMonth && m.year === visitYear);
      if (match) {
        match.desktop += 1;
      }
    });
    
    return monthsData.map((m) => ({
      month: m.month,
      desktop: m.desktop
    }));
  }, [outlets]);

  // Dynamic date range string (e.g. "Feb - Jul 2026")
  const radarDateRange = React.useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startName = start.toLocaleString("en-US", { month: "short" });
    const endName = now.toLocaleString("en-US", { month: "short" });
    return `${startName} - ${endName} ${now.getFullYear()}`;
  }, []);

  // Dynamic audit trend calculations comparing this month vs last month
  const radarTrend = React.useMemo(() => {
    const now = new Date();
    const thisMonthIndex = now.getMonth();
    const thisMonthYear = now.getFullYear();
    
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthIndex = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();
    
    let thisMonthCount = 0;
    let lastMonthCount = 0;
    
    outlets.forEach((o) => {
      const d = new Date(o.lastVisit);
      if (d.getMonth() === thisMonthIndex && d.getFullYear() === thisMonthYear) {
        thisMonthCount++;
      } else if (d.getMonth() === lastMonthIndex && d.getFullYear() === lastMonthYear) {
        lastMonthCount++;
      }
    });
    
    if (lastMonthCount === 0) {
      return thisMonthCount > 0 ? { percent: 100, isUp: true } : { percent: 0, isUp: true };
    }
    
    const diff = thisMonthCount - lastMonthCount;
    const percent = Math.round((Math.abs(diff) / lastMonthCount) * 100);
    return {
      percent,
      isUp: diff >= 0
    };
  }, [outlets]);

  const recentVisits = [...outlets]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-3xl  tracking-tight text-foreground">Dashboard</p>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time analytics and management overview for sales outlets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/outlets")} className="font-semibold gap-1.5 shadow-sm">
            Manage Outlets <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        <Card className="border border-border/40 hover:shadow-md transition-all duration-300">
          <CardContent className="px-4 py-2 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Outlets</span>
              <p className="text-3xl font-bold font-[Outfit] text-foreground">{totalOutlets}</p>
            </div>
            <div className="p-3 text-primary ">
              <Store className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-all duration-300">
          <CardContent className="px-4 py-2 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Outlets</span>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold font-[Outfit] text-foreground">{activeOutlets}</p>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {totalOutlets > 0 ? Math.round((activeOutlets / totalOutlets) * 100) : 0}%
                </span>
              </div>
            </div>
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-all duration-300">
          <CardContent className="px-4 py-2 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Prospects</span>
              <p className="text-3xl font-bold font-[Outfit] text-foreground">{prospectOutlets}</p>
            </div>
           
              <UserCheck className="h-6 w-6" />
           
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-all duration-300 ring-2 ring-destructive/10">
          <CardContent className="px-4 py-2 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-destructive font-semibold uppercase tracking-wider">Overdue Visits</span>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold font-[Outfit] text-destructive">{overdueCount}</p>
                <span className="text-xs text-destructive/80 font-medium">(&gt; 21 days)</span>
              </div>
            </div>
              <Clock className="h-6 w-6 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Status Distribution Pie Chart (Shadcn UI styled with Labels) */}
        <Card className="border border-border/40 lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-base font-semibold font-[Outfit]">Status Breakdown</CardTitle>
            <CardDescription className="text-xs">Active, Inactive, and Prospect outlets.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 min-h-65 flex items-center justify-center">
            {totalOutlets > 0 ? (
              <ChartContainer
                config={statusPieConfig}
                className="mx-auto aspect-square w-full max-h-[220px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={statusPieData}
                    dataKey="value"
                    label
                    nameKey="status"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-xs text-muted-foreground w-full">No data available.</div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-3 text-xs border-t border-border/10 pt-4">
            {/* Custom Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <span className="size-2 rounded-xs bg-[var(--chart-1)]" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <span className="size-2 rounded-xs bg-[var(--chart-2)]" />
                <span>Inactive</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <span className="size-2 rounded-xs bg-[var(--chart-3)]" />
                <span>Prospect</span>
              </div>
            </div>

            {/* Highlighted Segment Progress Bar */}
            <div className="w-full space-y-1.5 pt-1.5 border-t border-border/5">
              <div className="flex items-center justify-between font-bold text-foreground">
                <span>Active Status Rate</span>
                <span>{totalOutlets > 0 ? Math.round((activeOutlets / totalOutlets) * 100) : 0}%</span>
              </div>
              <div className="h-1.5 w-full bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--chart-1)] rounded-full transition-all duration-500" 
                  style={{ width: `${totalOutlets > 0 ? Math.round((activeOutlets / totalOutlets) * 100) : 0}%` }}
                />
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Bar Chart - Interactive (Shadcn UI style) */}
        <Card className="border border-border/40 lg:col-span-3 flex flex-col justify-between py-0">
          <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
              <CardTitle className="text-base font-semibold font-[Outfit]">Daily Audit Volume</CardTitle>
              <CardDescription className="text-xs">
                Interactive daily breakdown of completed audits.
              </CardDescription>
            </div>
            <div className="flex">
              {["active", "prospect"].map((key) => {
                const chart = key as keyof typeof interactiveChartConfig
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-4 transition-colors duration-200"
                    onClick={() => setActiveChart(chart as "active" | "prospect")}
                  >
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                      {interactiveChartConfig[chart].label}
                    </span>
                    <span className="text-lg leading-none font-bold sm:text-2xl font-[Outfit]">
                      {interactiveTotals[key as keyof typeof interactiveTotals].toLocaleString()}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={interactiveChartConfig}
              className="aspect-auto h-[220px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={interactiveChartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />
                <RechartsTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      }}
                    />
                  }
                />
                <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Line Chart - Label (Shadcn UI style) */}
        <Card className="border border-border/40 lg:col-span-3 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold font-[Outfit] flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" /> Audit Volume Trend
            </CardTitle>
            <CardDescription className="text-xs">{radarDateRange}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 min-h-[260px] flex items-center">
            {totalOutlets > 0 ? (
              <ChartContainer config={lineChartConfig} className="w-full h-56">
                <LineChart
                  accessibilityLayer
                  data={radarChartData}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                    bottom: 0
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/10" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground font-bold font-[Outfit]"
                      fontSize={11}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-xs text-muted-foreground w-full">No data available.</div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-[11px] border-t border-border/10 pt-3 mt-3">
            <div className="flex items-center gap-1.5 leading-none font-bold text-foreground">
              {radarTrend.isUp ? "Trending up" : "Trending down"} by {radarTrend.percent}% this month{" "}
              <TrendingUp className={`h-3.5 w-3.5 ${radarTrend.isUp ? "text-emerald-500" : "text-destructive"}`} />
            </div>
            <div className="leading-none text-muted-foreground mt-0.5">
              Showing total visits for the last 6 months
            </div>
          </CardFooter>
        </Card>

        {/* Radar Chart (lg:col-span-2) */}
        <Card className="border border-border/40 lg:col-span-2 flex flex-col justify-between">
          <CardHeader className="items-center">
            <CardTitle className="text-base font-semibold font-[Outfit] flex items-center gap-1.5 justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-primary" /> Performance Overview
            </CardTitle>
            <CardDescription className="text-xs text-center">
              Showing total audit volume for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0 flex-1 flex items-center justify-center">
            <ChartContainer
              config={radarChartConfig}
              className="mx-auto aspect-square w-full max-h-[200px]"
            >
              <RadarChart data={radarChartData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="month" fontSize={10} />
                <PolarGrid className="stroke-border/50 dark:stroke-border/20" />
                <Radar
                  dataKey="desktop"
                  fill="var(--primary)"
                  fillOpacity={0.4}
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                    fill: "var(--primary)",
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-1 text-[11px] border-t border-border/10 pt-3 mt-3">
            <div className="flex items-center gap-1.5 leading-none font-bold text-foreground">
              {radarTrend.isUp ? "Trending up" : "Trending down"} by {radarTrend.percent}% this month{" "}
              <TrendingUp className={`h-3.5 w-3.5 ${radarTrend.isUp ? "text-emerald-500" : "text-destructive"}`} />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground mt-0.5">
              {radarDateRange}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Visits Activity list (Full Width) */}
      <Card className="border border-border/40 w-full flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold font-[Outfit]">Recent Activity</CardTitle>
            <CardDescription className="text-xs">List of outlets visited recently by field representatives.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs font-semibold" onClick={() => navigate("/outlets")}>
            View All Outlets
          </Button>
        </CardHeader>
        <CardContent className="p-0 border-t border-border/30">
          <div className="divide-y divide-border/30">
            {recentVisits.map((outlet) => {
              const overdue = daysSince(outlet.lastVisit) > 21;
              return (
                <div
                  key={outlet.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors duration-200 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center size-9 bg-primary/5 text-primary border border-primary/10 shrink-0 font-[Outfit] font-bold">
                      {outlet.outletName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground truncate max-w-[180px] sm:max-w-xs">{outlet.outletName}</span>
                        <Badge
                          variant={
                            outlet.status === "Active"
                              ? "default"
                              : outlet.status === "Inactive"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-[10px] font-semibold h-4 px-1.5"
                        >
                          {outlet.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-md">
                        {outlet.ownerName} &middot; {outlet.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="text-right flex flex-col sm:items-end">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Last Visit</span>
                      <span className={`text-xs font-bold mt-0.5 ${overdue ? "text-destructive" : "text-foreground"}`}>
                        {formatDate(outlet.lastVisit)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-3 font-semibold bg-background hover:bg-accent/40"
                      onClick={() => navigate(`/outlets?id=${outlet.id}`)}
                    >
                      Inspect
                    </Button>
                  </div>
                </div>
              );
            })}
            {recentVisits.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No outlets found. Add outlets to see activity.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;