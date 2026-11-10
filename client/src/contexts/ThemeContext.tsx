import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  // A stored choice wins; otherwise follow the device. The same rule runs
  // inline in index.html before first paint, so the page never flashes the
  // wrong theme while React boots.
  const [theme, setTheme] = useState<Theme>(() => {
    if (!switchable) return defaultTheme;
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
      if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
      if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
    } catch {
      /* private mode: fall through to the default */
    }
    return defaultTheme;
  });
  // Only an explicit toggle is remembered, so a reader who never touches the
  // switch keeps following their device when it changes at dusk.
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    if (switchable && chosen) {
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* nothing to persist to */
      }
    }
  }, [theme, switchable, chosen]);

  useEffect(() => {
    if (!switchable || chosen || !window.matchMedia) return;
    try {
      if (localStorage.getItem("theme")) return;
    } catch {
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, [switchable, chosen]);

  const toggleTheme = switchable
    ? () => {
        setChosen(true);
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
