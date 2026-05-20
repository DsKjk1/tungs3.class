import { Link, useRouterState } from "@tanstack/react-router";
import { useTheme, Theme } from "@/lib/theme";

const themes: { id: Theme; label: string }[] = [
  { id: "cyber", label: "CYBR" },
  { id: "light", label: "LITE" },
  { id: "vintage", label: "VNTG" },
  { id: "tung", label: "TUNG" },
  { id: "frost", label: "FRST" },
];

const links = [
  { to: "/", slug: null, label: "~/HOME" },
  { to: "/topic/$slug", slug: "environmental-issues", label: "ENV" },
  { to: "/topic/$slug", slug: "personal-data", label: "DATA" },
  { to: "/topic/$slug", slug: "legislation", label: "LAW" },
  { to: "/topic/$slug", slug: "artificial-intelligence", label: "AI" },
  { to: "/topic/$slug", slug: "intellectual-property", label: "IP" },
  { to: "/topic/$slug", slug: "threats", label: "THRT" },
  { to: "/topic/$slug", slug: "protecting-systems", label: "PROT" },
  { to: "/games", slug: null, label: "◆ARCADE" },
] as const;

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2 font-mono text-xs">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="border px-2 py-1 glow-border text-primary group-hover:flicker">
            [ TUNG³ ]
          </span>
          <span className="hidden md:inline text-muted-foreground">
            ::/igcse/cs/issues_impact
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const targetPath = l.slug ? `/topic/${l.slug}` : l.to;
            const active = path === targetPath;
            const cls = `px-2 py-1 border border-transparent hover:border-primary hover:text-primary transition ${
              active ? "border-primary text-primary glow-text" : "text-muted-foreground"
            }`;
            return l.slug ? (
              <Link key={targetPath} to="/topic/$slug" params={{ slug: l.slug }} className={cls}>
                {l.label}
              </Link>
            ) : l.to === "/games" ? (
              <Link key={targetPath} to="/games" className={cls}>{l.label}</Link>
            ) : (
              <Link key={targetPath} to="/" className={cls}>{l.label}</Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <span className="text-muted-foreground hidden sm:inline">THEME:</span>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-1.5 py-1 border hover:border-primary hover:text-primary transition text-[10px] ${
                theme === t.id ? "border-primary text-primary glow-text" : "border-border text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:hidden border-t overflow-x-auto">
        <div className="flex gap-1 px-2 py-1 font-mono text-[10px] whitespace-nowrap">
          {links.map((l) => {
            const targetPath = l.slug ? `/topic/${l.slug}` : l.to;
            const active = path === targetPath;
            const cls = `px-2 py-1 border ${active ? "border-primary text-primary" : "border-border text-muted-foreground"}`;
            return l.slug ? (
              <Link key={targetPath} to="/topic/$slug" params={{ slug: l.slug }} className={cls}>{l.label}</Link>
            ) : l.to === "/games" ? (
              <Link key={targetPath} to="/games" className={cls}>{l.label}</Link>
            ) : (
              <Link key={targetPath} to="/" className={cls}>{l.label}</Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
