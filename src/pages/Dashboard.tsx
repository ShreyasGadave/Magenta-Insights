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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Utility function to calculate days since last visit
function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

// Utility to format date for display
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

  // Chart 1: Status Distribution
  const statusData = [
    { name: "Active", value: activeOutlets, color: "var(--color-emerald-500, #10b981)" },
    { name: "Inactive", value: inactiveOutlets, color: "var(--color-neutral-400, #9ca3af)" },
    { name: "Prospect", value: prospectOutlets, color: "var(--color-amber-500, #f59e0b)" },
  ];

  // Chart 2: Visit Recency Distribution
  // Categories: Current (< 7 days), Due soon (7-14 days), Attention needed (15-21 days), Overdue (> 21 days)
  const recencyStats = {
    current: 0,
    soon: 0,
    attention: 0,
    overdue: 0,
  };

  outlets.forEach((o) => {
    const days = daysSince(o.lastVisit);
    if (days <= 7) recencyStats.current += 1;
    else if (days <= 14) recencyStats.soon += 1;
    else if (days <= 21) recencyStats.attention += 1;
    else recencyStats.overdue += 1;
  });

  const recencyData = [
    { name: "< 7 Days", count: recencyStats.current, fill: "#10b981" },
    { name: "7-14 Days", count: recencyStats.soon, fill: "#3b82f6" },
    { name: "15-21 Days", count: recencyStats.attention, fill: "#f59e0b" },
    { name: "> 21 Days (Overdue)", count: recencyStats.overdue, fill: "#ef4444" },
  ];

  // Recent Visits: Sort outlets by lastVisit date descending and take top 5
  const recentVisits = [...outlets]
    .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-neutral-50 dark:bg-background/20 min-h-[calc(100vh-3.5rem)]">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-[Outfit] tracking-tight text-foreground">Dashboard</h1>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/40 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Outlets</span>
              <p className="text-3xl font-bold font-[Outfit] text-foreground">{totalOutlets}</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Store className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
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
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Prospects</span>
              <p className="text-3xl font-bold font-[Outfit] text-foreground">{prospectOutlets}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-all duration-300 ring-2 ring-destructive/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-destructive font-semibold uppercase tracking-wider">Overdue Visits</span>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold font-[Outfit] text-destructive">{overdueCount}</p>
                <span className="text-xs text-destructive/80 font-medium">(&gt; 21 days)</span>
              </div>
            </div>
            <div className="p-3 bg-destructive/10 text-destructive rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="border border-border/40 lg:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold font-[Outfit]">Status Breakdown</CardTitle>
            <CardDescription className="text-xs">Proportion of Active, Inactive, and Prospect outlets.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center min-h-[260px]">
            {totalOutlets > 0 ? (
              <div className="w-full h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold font-[Outfit] text-foreground">{totalOutlets}</span>
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">Outlets</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground">No data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Visit Recency Bar Chart */}
        <Card className="border border-border/40 lg:col-span-3 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold font-[Outfit]">Visit Recency</CardTitle>
            <CardDescription className="text-xs">Outlets categorized by time since their last check-in.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[260px] flex items-center">
            {totalOutlets > 0 ? (
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={recencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      contentStyle={{
                        background: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {recencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-xs text-muted-foreground w-full">No data available.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits Activity list */}
      <Card className="border border-border/40">
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
                    <div className="flex items-center justify-center size-9 rounded-xl bg-primary/5 text-primary border border-primary/10 shrink-0 font-[Outfit] font-bold">
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
                      className="text-xs h-8 px-3 font-semibold rounded-lg bg-background hover:bg-accent/40"
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