import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { Navbar } from "@/components/Navbar";
import { MrSahur } from "@/components/MrSahur";
import { Atmosphere } from "@/components/Atmosphere";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="ascii-frame max-w-md p-6 text-center glow-border">
        <h1 className="text-5xl text-primary glow-text">ERR 404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          // file not found in the archive
        </p>
        <Link to="/" className="mt-5 inline-block border border-primary px-3 py-1 text-primary hover:glow-border">
          ◀ return to /home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="ascii-frame max-w-md p-6 text-center">
        <h1 className="text-xl text-destructive">SEGFAULT</h1>
        <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 border border-primary px-3 py-1 text-primary hover:glow-border"
        >
          retry()
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TUNG TUNG TUNG SAHUR CLASS — IGCSE Edexcel CS: Issues & Impact" },
      { name: "description", content: "Interactive underground archive for IGCSE Edexcel Computer Science: Issues & Impact." },
      { property: "og:title", content: "TUNG³ — IGCSE CS Issues & Impact" },
      { property: "og:description", content: "Explore the secret CS archive: environmental issues, data, AI, security." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="scanlines min-h-screen bg-background text-foreground relative">
          <Atmosphere />
          <Navbar />
          <div className="relative z-10">
            <Outlet />
          </div>
          <MrSahur />
          <footer className="border-t mt-16 py-6 text-center font-mono text-[11px] text-muted-foreground">
            ── TUNG³ ARCHIVE // last_sync: {new Date().getFullYear()} // est. by SAHUR_CLASS ──
          </footer>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
