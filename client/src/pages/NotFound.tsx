import { Compass } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md card-elevated p-8 text-center">
        <Compass className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="mt-1 text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Nothing lives at this address. Every view in the register opens from the map.
        </p>
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Back to the map
        </button>
      </div>
    </div>
  );
}
