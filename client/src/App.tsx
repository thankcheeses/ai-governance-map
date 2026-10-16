import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import MapWorkspace from "./pages/MapWorkspace";
import { Redirect } from "wouter";

// GitHub Pages serves this project site from /<repo>/, so the client router has to
// strip that prefix before matching. Derived from Vite's `base` (import.meta.env.BASE_URL)
// rather than hardcoded, so routing follows automatically if the base ever changes.
// With the base applied the effective location at the site root is "/", identical to
// what it was when served from the domain root — existing route patterns are unchanged.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  return (
    <Switch>
      {/* One shell, one look. /register was a second page with its own design, so
          toggling into it felt like landing in a different app; every governance
          view now opens as a panel inside the map. Old links still resolve. */}
      <Route path="/" component={MapWorkspace} />
      <Route path="/register">{() => <Redirect to="/" />}</Route>
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
