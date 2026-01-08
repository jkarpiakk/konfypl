import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Globe,
  Rss,
  AlertCircle,
  Clock,
  Settings,
  FileText,
  Database,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  Shield,
  User,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { KonfyLogo } from "@/components/KonfyLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { SPECIALIZATIONS, SPECIALIZATION_LABELS } from "@/lib/constants";
import type { Event, Source, Specialization } from "@/lib/types";

function EventsTable({
  events,
  isLoading,
  showApproval,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: {
  events: Event[];
  isLoading: boolean;
  showApproval?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Brak wydarzeń do wyświetlenia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Tytuł</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Specjalizacja</TableHead>
            <TableHead>Status</TableHead>
            {showApproval && <TableHead>AI</TableHead>}
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="line-clamp-1">{event.title}</span>
                  {event.isAiAdded && (
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(event.startDate), "d MMM yyyy", { locale: pl })}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {event.specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {SPECIALIZATION_LABELS[spec as Specialization]?.slice(0, 8) || spec}
                    </Badge>
                  ))}
                  {event.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.specializations.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={event.status === "published" ? "default" : "secondary"}
                >
                  {event.status === "published" ? "Opublikowane" : "Oczekujące"}
                </Badge>
              </TableCell>
              {showApproval && (
                <TableCell>
                  {event.aiConfidence && (
                    <Badge variant="outline">{event.aiConfidence}%</Badge>
                  )}
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {showApproval && event.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onApprove?.(event.id)}
                        className="text-green-600 hover:text-green-700"
                        data-testid={`button-approve-${event.id}`}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReject?.(event.id)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-reject-${event.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(event)}
                    data-testid={`button-edit-${event.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(event.id)}
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-delete-${event.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SourcesTable({
  sources,
  isLoading,
  onEdit,
  onDelete,
  onScan,
}: {
  sources: Source[];
  isLoading: boolean;
  onEdit?: (source: Source) => void;
  onDelete?: (id: number) => void;
  onScan?: (id: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Brak źródeł do wyświetlenia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Ostatnie sprawdzenie</TableHead>
            <TableHead>Znalezione wydarzenia</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id} data-testid={`row-source-${source.id}`}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {source.type === "rss" ? (
                    <Rss className="w-4 h-4 text-orange-500" />
                  ) : (
                    <Globe className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="line-clamp-1">{source.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {source.type === "rss" ? "RSS" : "Website"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {source.lastChecked
                  ? format(new Date(source.lastChecked), "d MMM, HH:mm", { locale: pl })
                  : "Nigdy"
                }
              </TableCell>
              <TableCell>{source.eventsFound}</TableCell>
              <TableCell>
                <Badge
                  variant={source.status === "active" ? "default" : "secondary"}
                >
                  {source.status === "active" ? "Aktywne" : "Nieaktywne"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onScan?.(source.id)}
                    data-testid={`button-scan-${source.id}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(source.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(source)}
                    data-testid={`button-edit-source-${source.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(source.id)}
                    className="text-destructive hover:text-destructive"
                    data-testid={`button-delete-source-${source.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface UserData {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  specializations: string[];
  isAdmin: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

function UsersTable({
  users,
  isLoading,
}: {
  users: UserData[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Brak użytkowników</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Użytkownik</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specjalizacje</TableHead>
            <TableHead>Rola</TableHead>
            <TableHead>Data rejestracji</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#2ED3B7]/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#2ED3B7]" />
                    </div>
                  )}
                  <span>
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "Brak nazwy"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email || "Brak"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {(user.specializations || []).slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {SPECIALIZATION_LABELS[spec as Specialization]?.slice(0, 10) || spec}
                    </Badge>
                  ))}
                  {(user.specializations || []).length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{user.specializations.length - 2}
                    </Badge>
                  )}
                  {(!user.specializations || user.specializations.length === 0) && (
                    <span className="text-xs text-muted-foreground">Brak</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {user.isAdmin ? (
                  <Badge className="bg-[#2ED3B7] text-[#0F172A]">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="secondary">Użytkownik</Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.createdAt
                  ? format(new Date(user.createdAt), "d MMM yyyy", { locale: pl })
                  : "Nieznana"
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminLoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({ 
          title: "Błąd logowania", 
          description: data.error || "Nieprawidłowy email lub hasło",
          variant: "destructive" 
        });
        return;
      }
      
      toast({ title: "Zalogowano pomyślnie" });
      onLoginSuccess();
    } catch {
      toast({ 
        title: "Błąd połączenia", 
        description: "Nie można połączyć się z serwerem",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <KonfyLogo size="lg" />
          </div>
          <CardTitle className="text-2xl font-heading text-[#0F172A]">
            Panel administracyjny
          </CardTitle>
          <CardDescription>
            Zaloguj się, aby zarządzać wydarzeniami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@konfy.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  data-testid="input-admin-email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Wprowadź hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  data-testid="input-admin-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#2ED3B7] hover:bg-[#25B9A1] text-[#0F172A]"
              disabled={isLoading}
              data-testid="button-admin-login"
            >
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [isImportingSource, setIsImportingSource] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null);
  const [deleteSourceId, setDeleteSourceId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin/session", { credentials: "include" });
      const data = await response.json();
      setIsAuthenticated(data.authenticated && data.isAdmin);
      if (data.email) setAdminEmail(data.email);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
      setIsAuthenticated(false);
      setAdminEmail("");
      toast({ title: "Wylogowano" });
    } catch {
      toast({ title: "Błąd", description: "Nie udało się wylogować", variant: "destructive" });
    }
  };

  const { data: pendingEvents = [], isLoading: loadingPending } = useQuery<Event[]>({
    queryKey: ["/api/events", { status: "pending" }],
    enabled: isAuthenticated === true,
  });

  const { data: allEvents = [], isLoading: loadingAll } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: isAuthenticated === true,
  });

  const { data: sources = [], isLoading: loadingSources } = useQuery<Source[]>({
    queryKey: ["/api/sources"],
    enabled: isAuthenticated === true,
  });

  const { data: usersList = [], isLoading: loadingUsers } = useQuery<UserData[]>({
    queryKey: ["/api/users"],
    enabled: isAuthenticated === true,
  });

  const approveEvent = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/events/${id}`, { status: "published" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Wydarzenie zatwierdzone", description: "Wydarzenie zostało opublikowane" });
    },
  });

  const rejectEvent = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Wydarzenie odrzucone", description: "Wydarzenie zostało usunięte" });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setDeleteEventId(null);
      toast({ title: "Wydarzenie usunięte" });
    },
  });

  const deleteSource = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/sources/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      setDeleteSourceId(null);
      toast({ title: "Źródło usunięte" });
    },
  });

  const scanSource = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/sources/${id}/scan`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Skanowanie rozpoczęte", description: "Sprawdzam źródło w tle" });
    },
    onError: () => {
      toast({ title: "Błąd", description: "Nie udało się rozpocząć skanowania", variant: "destructive" });
    },
  });

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2ED3B7] mx-auto mb-4" />
          <p className="text-[#64748B]">Sprawdzanie sesji...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={() => { setIsAuthenticated(true); checkSession(); }} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-2 text-[#0F172A]">
              <Settings className="w-7 h-7 text-[#2ED3B7]" />
              Panel administracyjny
            </h1>
            <p className="text-[#64748B]">
              Zarządzaj wydarzeniami i źródłami danych
            </p>
          </div>
          <div className="flex items-center gap-3">
            {adminEmail && (
              <span className="text-sm text-[#64748B] hidden sm:block">
                {adminEmail}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4" />
              Wyloguj
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Oczekujące</CardDescription>
              <CardTitle className="text-3xl" data-testid="stat-pending">
                {pendingEvents.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Wydarzenia do zatwierdzenia
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Opublikowane</CardDescription>
              <CardTitle className="text-3xl" data-testid="stat-published">
                {allEvents.filter((e) => e.status === "published").length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Widoczne publicznie
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Źródła</CardDescription>
              <CardTitle className="text-3xl" data-testid="stat-sources">
                {sources.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Monitorowane strony
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2" data-testid="tab-pending">
                <AlertCircle className="w-4 h-4" />
                Oczekujące
                {pendingEvents.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {pendingEvents.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2" data-testid="tab-all">
                <FileText className="w-4 h-4" />
                Wszystkie
              </TabsTrigger>
              <TabsTrigger value="sources" className="gap-2" data-testid="tab-sources">
                <Database className="w-4 h-4" />
                Źródła
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
                <Users className="w-4 h-4" />
                Użytkownicy
                <Badge variant="secondary" className="ml-1">
                  {usersList.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {(activeTab === "pending" || activeTab === "all") && (
                <Button onClick={() => setIsAddingEvent(true)} data-testid="button-add-event">
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj wydarzenie
                </Button>
              )}
              {activeTab === "sources" && (
                <>
                  <Button variant="outline" onClick={() => setIsImportingSource(true)} data-testid="button-import-sources">
                    <Upload className="w-4 h-4 mr-2" />
                    Importuj CSV
                  </Button>
                  <Button onClick={() => setIsAddingSource(true)} data-testid="button-add-source">
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj źródło
                  </Button>
                </>
              )}
            </div>
          </div>

          <TabsContent value="pending">
            <EventsTable
              events={pendingEvents}
              isLoading={loadingPending}
              showApproval
              onApprove={(id) => approveEvent.mutate(id)}
              onReject={(id) => rejectEvent.mutate(id)}
              onEdit={setEditingEvent}
              onDelete={setDeleteEventId}
            />
          </TabsContent>

          <TabsContent value="all">
            <EventsTable
              events={allEvents}
              isLoading={loadingAll}
              onEdit={setEditingEvent}
              onDelete={setDeleteEventId}
            />
          </TabsContent>

          <TabsContent value="sources">
            <SourcesTable
              sources={sources}
              isLoading={loadingSources}
              onEdit={setEditingSource}
              onDelete={setDeleteSourceId}
              onScan={(id) => scanSource.mutate(id)}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTable
              users={usersList}
              isLoading={loadingUsers}
            />
          </TabsContent>
        </Tabs>
      </main>

      <EventFormDialog
        open={isAddingEvent || !!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingEvent(false);
            setEditingEvent(null);
          }
        }}
        event={editingEvent}
      />

      <SourceFormDialog
        open={isAddingSource || !!editingSource}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingSource(false);
            setEditingSource(null);
          }
        }}
        source={editingSource}
      />

      <ImportSourcesDialog
        open={isImportingSource}
        onOpenChange={setIsImportingSource}
      />

      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć wydarzenie?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Wydarzenie zostanie trwale usunięte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEventId && deleteEvent.mutate(deleteEventId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteSourceId} onOpenChange={() => setDeleteSourceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć źródło?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta akcja jest nieodwracalna. Źródło zostanie trwale usunięte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSourceId && deleteSource.mutate(deleteSourceId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EventFormDialog({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    specializations: [] as string[],
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    organizer: "",
    hasEducationalPoints: false,
    educationalPoints: "",
    price: "unknown",
    sourceUrl: "",
    status: "published",
  });

  useState(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        specializations: event.specializations,
        startDate: event.startDate,
        endDate: event.endDate || "",
        location: event.location || "",
        isOnline: event.isOnline,
        organizer: event.organizer || "",
        hasEducationalPoints: event.hasEducationalPoints,
        educationalPoints: event.educationalPoints?.toString() || "",
        price: event.price,
        sourceUrl: event.sourceUrl || "",
        status: event.status,
      });
    }
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      const payload = {
        ...data,
        educationalPoints: data.educationalPoints ? parseInt(data.educationalPoints) : null,
        endDate: data.endDate || null,
      };
      if (event) {
        return apiRequest("PATCH", `/api/events/${event.id}`, payload);
      }
      return apiRequest("POST", "/api/events", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onOpenChange(false);
      toast({ title: event ? "Wydarzenie zaktualizowane" : "Wydarzenie dodane" });
    },
    onError: () => {
      toast({ title: "Błąd", description: "Nie udało się zapisać wydarzenia", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleSpecChange = (spec: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      specializations: checked
        ? [...prev.specializations, spec]
        : prev.specializations.filter((s) => s !== spec),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? "Edytuj wydarzenie" : "Dodaj wydarzenie"}
          </DialogTitle>
          <DialogDescription>
            {event ? "Zaktualizuj szczegóły wydarzenia" : "Dodaj nowe wydarzenie ręcznie"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tytuł *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              required
              data-testid="input-event-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              data-testid="input-event-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data rozpoczęcia *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                required
                data-testid="input-event-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Data zakończenia</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                data-testid="input-event-end-date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Specjalizacje *</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec} className="flex items-center gap-2">
                  <Checkbox
                    id={`form-spec-${spec}`}
                    checked={formData.specializations.includes(spec)}
                    onCheckedChange={(checked) => handleSpecChange(spec, !!checked)}
                  />
                  <Label htmlFor={`form-spec-${spec}`} className="text-sm cursor-pointer">
                    {SPECIALIZATION_LABELS[spec]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isOnline"
                checked={formData.isOnline}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, isOnline: !!checked }))}
              />
              <Label htmlFor="isOnline" className="cursor-pointer">Wydarzenie online</Label>
            </div>
          </div>

          {!formData.isOnline && (
            <div className="space-y-2">
              <Label htmlFor="location">Lokalizacja</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                placeholder="np. Warszawa"
                data-testid="input-event-location"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="organizer">Organizator</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => setFormData((p) => ({ ...p, organizer: e.target.value }))}
              data-testid="input-event-organizer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Cena</Label>
              <Select
                value={formData.price}
                onValueChange={(value) => setFormData((p) => ({ ...p, price: value }))}
              >
                <SelectTrigger data-testid="select-event-price">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Bezpłatne</SelectItem>
                  <SelectItem value="paid">Płatne</SelectItem>
                  <SelectItem value="unknown">Nieznana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((p) => ({ ...p, status: value }))}
              >
                <SelectTrigger data-testid="select-event-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Opublikowane</SelectItem>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasPoints"
                checked={formData.hasEducationalPoints}
                onCheckedChange={(checked) => setFormData((p) => ({ ...p, hasEducationalPoints: !!checked }))}
              />
              <Label htmlFor="hasPoints" className="cursor-pointer">Punkty edukacyjne</Label>
            </div>
            {formData.hasEducationalPoints && (
              <Input
                type="number"
                placeholder="Liczba punktów"
                value={formData.educationalPoints}
                onChange={(e) => setFormData((p) => ({ ...p, educationalPoints: e.target.value }))}
                className="w-32"
                data-testid="input-event-points"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">Link do źródła</Label>
            <Input
              id="sourceUrl"
              type="url"
              value={formData.sourceUrl}
              onChange={(e) => setFormData((p) => ({ ...p, sourceUrl: e.target.value }))}
              placeholder="https://..."
              data-testid="input-event-source-url"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-event">
              {mutation.isPending ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SourceFormDialog({
  open,
  onOpenChange,
  source,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: Source | null;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    type: "website",
    checkFrequencyHours: "48",
    status: "active",
  });

  useState(() => {
    if (source) {
      setFormData({
        name: source.name,
        url: source.url,
        type: source.type,
        checkFrequencyHours: source.checkFrequencyHours.toString(),
        status: source.status,
      });
    }
  });

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => {
      const payload = {
        ...data,
        checkFrequencyHours: parseInt(data.checkFrequencyHours),
      };
      if (source) {
        return apiRequest("PATCH", `/api/sources/${source.id}`, payload);
      }
      return apiRequest("POST", "/api/sources", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      onOpenChange(false);
      toast({ title: source ? "Źródło zaktualizowane" : "Źródło dodane" });
    },
    onError: () => {
      toast({ title: "Błąd", description: "Nie udało się zapisać źródła", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {source ? "Edytuj źródło" : "Dodaj źródło"}
          </DialogTitle>
          <DialogDescription>
            {source ? "Zaktualizuj szczegóły źródła" : "Dodaj nowe źródło do monitorowania"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="np. Polskie Towarzystwo Kardiologiczne"
              data-testid="input-source-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
              required
              placeholder="https://..."
              data-testid="input-source-url"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((p) => ({ ...p, type: value }))}
              >
                <SelectTrigger data-testid="select-source-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="rss">RSS Feed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Częstotliwość (h)</Label>
              <Select
                value={formData.checkFrequencyHours}
                onValueChange={(value) => setFormData((p) => ({ ...p, checkFrequencyHours: value }))}
              >
                <SelectTrigger data-testid="select-source-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 godziny</SelectItem>
                  <SelectItem value="48">48 godzin</SelectItem>
                  <SelectItem value="72">72 godziny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((p) => ({ ...p, status: value }))}
            >
              <SelectTrigger data-testid="select-source-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktywne</SelectItem>
                <SelectItem value="inactive">Nieaktywne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit" disabled={mutation.isPending} data-testid="button-save-source">
              {mutation.isPending ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImportSourcesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{
    inserted: number;
    duplicates: number;
    errors: { row: number; error: string }[];
  } | null>(null);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/sources/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Import failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setImportResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      toast({ 
        title: "Import zakończony", 
        description: `Dodano ${data.inserted} źródeł, ${data.duplicates} duplikatów` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Błąd importu", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      mutation.mutate(file);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    onOpenChange(false);
  };

  const downloadTemplate = () => {
    const template = "name,url,type,checkFrequencyHours\nPolskie Towarzystwo Kardiologiczne,https://ptkardio.pl/wydarzenia,website,48\nMedExpress RSS,https://medexpress.pl/rss/wydarzenia,rss,24";
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "szablon_zrodla.csv";
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Importuj źródła z CSV
          </DialogTitle>
          <DialogDescription>
            Prześlij plik CSV z listą źródeł do monitorowania
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Format pliku CSV</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={downloadTemplate}
                className="gap-2"
                data-testid="button-download-template"
              >
                <Download className="w-4 h-4" />
                Pobierz szablon
              </Button>
            </div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono">
              name,url,type,checkFrequencyHours
            </div>
            <p className="text-xs text-muted-foreground">
              Kolumny: <strong>name</strong> (nazwa), <strong>url</strong> (adres), <strong>type</strong> (website/rss), <strong>checkFrequencyHours</strong> (24/48/72)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csvFile">Wybierz plik CSV</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              data-testid="input-import-file"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Wybrano: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          {importResult && (
            <Card className={importResult.errors.length > 0 ? "border-amber-200" : "border-green-200"}>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-medium">
                      Dodane: {importResult.inserted}
                    </span>
                    <span className="text-amber-600 font-medium">
                      Duplikaty: {importResult.duplicates}
                    </span>
                    {importResult.errors.length > 0 && (
                      <span className="text-red-600 font-medium">
                        Błędy: {importResult.errors.length}
                      </span>
                    )}
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="text-sm space-y-1 mt-2 max-h-32 overflow-y-auto">
                      {importResult.errors.slice(0, 10).map((err, i) => (
                        <p key={i} className="text-red-600 text-xs">
                          Wiersz {err.row}: {err.error}
                        </p>
                      ))}
                      {importResult.errors.length > 10 && (
                        <p className="text-muted-foreground text-xs">
                          ...i {importResult.errors.length - 10} więcej błędów
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {importResult ? "Zamknij" : "Anuluj"}
            </Button>
            {!importResult && (
              <Button 
                type="submit" 
                disabled={!file || mutation.isPending}
                data-testid="button-import-submit"
              >
                {mutation.isPending ? "Importowanie..." : "Importuj"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
