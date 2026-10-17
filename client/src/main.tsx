import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// The app mounted, so whatever index.html the browser had was good. Release
// the stale-index reload guard set in index.html and take its marker back out
// of the address bar. Doing this on mount rather than on `load` is what stops
// a genuinely missing asset from reloading in a loop: if nothing ever mounts,
// the guard is never cleared and the recovery fires exactly once.
try {
  const key = (window as unknown as { __AGM_STALE_KEY?: string }).__AGM_STALE_KEY;
  if (key) sessionStorage.removeItem(key);
  if (location.search.includes("agm-refresh")) {
    const params = new URLSearchParams(location.search);
    params.delete("agm-refresh");
    const rest = params.toString();
    history.replaceState(null, "", location.pathname + (rest ? `?${rest}` : "") + location.hash);
  }
} catch {
  // Storage or history unavailable (private mode, embedded view): the page is
  // already up, which is the part that matters.
}
