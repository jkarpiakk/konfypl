import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { 
  Calendar, 
  Users, 
  Eye, 
  MousePointerClick, 
  CalendarPlus,
  Share2,
  TrendingUp,
  Activity,
} from "lucide-react";
import { SPECIALIZATION_LABELS } from "@/lib/constants";
import type { Specialization } from "@/lib/types";

interface OverviewData {
  totalEvents: number;
  upcomingEvents: number;
  totalUsers: number;
  totalPageViews: number;
  totalClicks: number;
  totalCalendarAdds: number;
  totalShares: number;
}

interface SpecializationData {
  name: string;
  count: number;
}

interface EventTypeData {
  byFormat: { name: string; value: number }[];
  byPrice: { name: string; value: number }[];
  withEducationalPoints: number;
}

interface EngagementData {
  date: string;
  pageViews: number;
  clicks: number;
  calendarAdds: number;
}

interface TopEvent {
  id: number;
  title: string;
  pageViews: number;
  clicks: number;
}

const COLORS = ["#2ED3B7", "#25B9A1", "#1D9A86", "#167B6B", "#0F5C50", "#FCD34D", "#FBBF24", "#F59E0B"];

function StatCard({ title, value, icon: Icon, subtitle }: { 
  title: string; 
  value: number | string; 
  icon: typeof Calendar;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1" data-testid={`stat-${title.toLowerCase().replace(/\s/g, "-")}`}>
              {typeof value === "number" ? value.toLocaleString("pl-PL") : value}
            </p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-xl bg-[#E6FAF7]">
            <Icon className="w-5 h-5 text-[#2ED3B7]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const { data: overview, isLoading: loadingOverview } = useQuery<OverviewData>({
    queryKey: ["/api/analytics/overview"],
  });

  const { data: specializations, isLoading: loadingSpecs } = useQuery<SpecializationData[]>({
    queryKey: ["/api/analytics/specializations"],
  });

  const { data: eventTypes, isLoading: loadingTypes } = useQuery<EventTypeData>({
    queryKey: ["/api/analytics/event-types"],
  });

  const { data: engagement, isLoading: loadingEngagement } = useQuery<EngagementData[]>({
    queryKey: ["/api/analytics/engagement"],
  });

  const { data: topEvents, isLoading: loadingTopEvents } = useQuery<TopEvent[]>({
    queryKey: ["/api/analytics/top-events"],
  });

  const specChartData = specializations?.slice(0, 8).map(s => ({
    name: SPECIALIZATION_LABELS[s.name as Specialization] || s.name,
    count: s.count,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F172A] font-heading" data-testid="text-analytics-title">
            Panel Analityczny
          </h1>
          <p className="text-muted-foreground mt-2">
            Statystyki i trendy platformy Konfy.pl
          </p>
        </div>

        {loadingOverview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : overview ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Wszystkie wydarzenia" 
              value={overview.totalEvents} 
              icon={Calendar}
              subtitle={`${overview.upcomingEvents} nadchodzacych`}
            />
            <StatCard 
              title="Uzytkownicy" 
              value={overview.totalUsers} 
              icon={Users}
            />
            <StatCard 
              title="Wyswietlenia" 
              value={overview.totalPageViews} 
              icon={Eye}
            />
            <StatCard 
              title="Klikniecia w linki" 
              value={overview.totalClicks} 
              icon={MousePointerClick}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2ED3B7]" />
                Popularne specjalizacje
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSpecs ? (
                <Skeleton className="h-64" />
              ) : specChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={specChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#64748B" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#64748B" 
                      fontSize={11}
                      width={120}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#2ED3B7" radius={[0, 4, 4, 0]} name="Liczba wydarzen" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Brak danych
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#2ED3B7]" />
                Typ wydarzen
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTypes ? (
                <Skeleton className="h-64" />
              ) : eventTypes ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-center mb-2">Format</p>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie
                          data={eventTypes.byFormat}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {eventTypes.byFormat.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                      {eventTypes.byFormat.map((entry, i) => (
                        <div key={entry.name} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span>{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-center mb-2">Cena</p>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie
                          data={eventTypes.byPrice}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {eventTypes.byPrice.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 text-xs">
                      {eventTypes.byPrice.map((entry, i) => (
                        <div key={entry.name} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[(i + 2) % COLORS.length] }} />
                          <span>{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Brak danych
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#2ED3B7]" />
              Aktywnosc uzytkownikow (ostatnie 30 dni)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEngagement ? (
              <Skeleton className="h-64" />
            ) : engagement && engagement.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagement} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748B" 
                    fontSize={11}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}.${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("pl-PL");
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pageViews" 
                    stroke="#2ED3B7" 
                    strokeWidth={2}
                    dot={false}
                    name="Wyswietlenia"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    dot={false}
                    name="Klikniecia"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calendarAdds" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={false}
                    name="Dodania do kalendarza"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Brak danych o aktywnosci
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#2ED3B7]" />
              Najpopularniejsze wydarzenia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTopEvents ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : topEvents && topEvents.length > 0 ? (
              <div className="space-y-3">
                {topEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                    data-testid={`top-event-${event.id}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2ED3B7]/10 flex items-center justify-center text-[#2ED3B7] font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{event.title}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {event.pageViews}
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="w-4 h-4" />
                        {event.clicks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Brak danych o popularnosci wydarzen
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
