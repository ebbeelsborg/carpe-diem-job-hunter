import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/dashboard";
import Applications from "@/pages/applications";
import Interviews from "@/pages/interviews";
import Resources from "@/pages/resources";
import Questions from "@/pages/questions";
import Stats from "@/pages/stats";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/applications">
        {() => (
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/interviews">
        {() => (
          <ProtectedRoute>
            <Interviews />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/resources">
        {() => (
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/questions">
        {() => (
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/stats">
        {() => (
          <ProtectedRoute>
            <Stats />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const isAuthPage = location === '/login' || location === '/signup';

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (isAuthPage) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-sm text-primary hover:underline"
                  data-testid="button-signout"
                >
                  Sign out
                </button>
              </div>
            )}
          </header>
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto p-6 lg:p-8">
              <Router />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <AppLayout />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
