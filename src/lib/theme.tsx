import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "cyber" | "light" | "vintage" | "tung" | "frost";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "cyber", setTheme: () => {} });

const ALL_THEME_CLASSES = ["theme-light", "theme-vintage", "theme-tung", "theme-frost"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("cyber");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("tung-theme")) as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove(...ALL_THEME_CLASSES);
    if (theme !== "cyber") root.classList.add(`theme-${theme}`);
    root.style.transition = "background-color 600ms ease, color 600ms ease";
    localStorage.setItem("tung-theme", theme);
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
