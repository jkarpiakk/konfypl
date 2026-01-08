import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EventDetail from "@/pages/EventDetail";
import CalendarPage from "@/pages/CalendarPage";
import Admin from "@/pages/Admin";
import SpecializationHub from "@/pages/SpecializationHub";
import PillarPage from "@/pages/PillarPage";
import PromotePage from "@/pages/PromotePage";
import AddEventPage from "@/pages/AddEventPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/event/:id" component={EventDetail} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/promuj" component={PromotePage} />
      <Route path="/dodaj-wydarzenie" component={AddEventPage} />
      <Route path="/polityka-prywatnosci" component={PrivacyPolicy} />
      <Route path="/regulamin" component={Terms} />
      
      <Route path="/konferencje-medyczne">
        {() => <PillarPage pageType="conferences" />}
      </Route>
      <Route path="/webinary-medyczne">
        {() => <PillarPage pageType="webinars" />}
      </Route>
      <Route path="/szkolenia-medyczne">
        {() => <PillarPage pageType="trainings" />}
      </Route>
      <Route path="/kalendarz-konferencji-medycznych">
        {() => <PillarPage pageType="calendar" />}
      </Route>
      
      <Route path="/kardiologia" component={SpecializationHub} />
      <Route path="/medycyna-rodzinna" component={SpecializationHub} />
      <Route path="/interna" component={SpecializationHub} />
      <Route path="/anestezjologia" component={SpecializationHub} />
      <Route path="/chirurgia" component={SpecializationHub} />
      <Route path="/ortopedia" component={SpecializationHub} />
      <Route path="/ginekologia" component={SpecializationHub} />
      <Route path="/pediatria" component={SpecializationHub} />
      <Route path="/neurologia" component={SpecializationHub} />
      <Route path="/psychiatria" component={SpecializationHub} />
      <Route path="/radiologia" component={SpecializationHub} />
      <Route path="/medycyna-ratunkowa" component={SpecializationHub} />
      <Route path="/diagnostyka-laboratoryjna" component={SpecializationHub} />
      <Route path="/interdyscyplinarne" component={SpecializationHub} />
      
      <Route path="/:slug" component={SpecializationHub} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
