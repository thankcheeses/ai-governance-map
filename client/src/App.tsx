import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import MapWorkspace from "./pages/MapWorkspace";

// GitHub Pages serves this project site from /<repo>/, so the client router has to
// strip that prefix before matching. Derived from Vite's `base` (import.meta.env.BASE_URL)
// rather than hardcoded, so routing follows automatically if the base ever changes.
// With the base applied the effective location at the site root is "/", identical to
// what it was when served from the domain root — existing route patterns are unchanged.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  return (
    <Switch>
      {/* The map is the application. The scrolling register keeps every
          non-geographic view — a standard has no borders — one click away. */}
      <Route path="/" component={MapWorkspace} />
      <Route path="/register" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={routerBase}>
            <AppRoutes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
