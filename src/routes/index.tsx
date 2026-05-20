import { createFileRoute, Link } from "@tanstack/react-router";
import { topics } from "@/lib/topics";
import { Typewriter } from "@/components/atoms";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "TUNG³ — IGCSE Edexcel CS: Issues & Impact" },
      { name: "description", content: "Enter the underground archive: 7 modules covering Issues & Impact for IGCSE Edexcel Computer Science." },
    ],
  }),
});

function Index() {
  return (
    <main className="font-mono">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 lg:pr-[20rem]">
          <div className="text-xs text-primary mb-4 flex items-center gap-2">
            <span className="h-2 w-2 bg-primary glow-soft" />
            <Typewriter text="connection established // welcome, operator." />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight glow-text text-primary flicker">
            TUNG TUNG TUNG
            <br />
            SAHUR CLASS
          </h1>
          <div className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
            <span className="text-foreground">&gt;</span> IGCSE Edexcel Computer Science
            <span className="mx-2 text-primary">::</span>
            Issues &amp; Impact
          </div>

          <div className="mt-6 ascii-frame inline-block bg-card/40 px-3 py-2 text-xs text-muted-foreground">
            <span className="text-primary">[INFO]</span> 7 modules indexed •
            <span className="text-primary"> [WARN]</span> contains questionable jokes •
            <span className="text-primary"> [TIP]</span> click Mr Sahur for wisdom
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <Link to="/topic/environmental-issues" className="border border-primary px-4 py-2 text-primary hover:glow-border transition">
              ▸ ENTER MODULE 01: ENVIRONMENT
            </Link>
            <Link to="/games" className="border border-primary px-4 py-2 text-primary hover:glow-border transition glow-border">
              ◆ HIDDEN ARCADE
            </Link>
            <a href="#modules" className="border border-border px-4 py-2 hover:border-primary hover:text-primary">
              ▾ list all directories
            </a>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-t border-b bg-background/60 overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap py-1 text-[11px] text-primary">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="px-6">
                ◆ E-WASTE: 62Mt / yr ◆ DATA CENTERS: ~1.5% global energy ◆ BATTERY LIFE FALLING ◆ COOKIES TRACKING YOU ◆ ENCRYPT EVERYTHING ◆ TUNG³ ARCHIVE v1.0 ◆
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-12 lg:pr-[20rem]">
        <div className="mb-6 flex items-center gap-3 text-xs text-primary">
          <span>&gt; ls /modules</span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground">{topics.length} entries</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {topics.map((t) => (
            <Link
              key={t.slug}
              to="/topic/$slug"
              params={{ slug: t.slug }}
              className="group ascii-frame block bg-card/40 p-4 transition hover:glow-border hover:bg-card"
            >
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>module_{t.code}</span>
                <span className="group-hover:text-primary">[OPEN ▸]</span>
              </div>
              <div className="mt-2 text-lg text-primary glow-text">{t.title}</div>
              <div className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{t.blurb}</div>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="border px-1.5 py-0.5">{t.short}</span>
                <span className="border px-1.5 py-0.5">.dat</span>
                <span className="border px-1.5 py-0.5">readonly</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Arcade banner */}
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <Link to="/cricket" className="ascii-frame block bg-card/40 p-4 hover:glow-border hover:bg-card transition group">
            <div className="text-[10px] text-muted-foreground">simulation_01 • hidden</div>
            <div className="mt-1 text-xl text-primary glow-text font-display">▸ CRICKET DEFENSE</div>
            <div className="mt-1 text-[11px] text-muted-foreground">Time your swing. Mr Sahur bowls. Perfect timing → slow-mo combos.</div>
          </Link>
          <Link to="/arena" className="ascii-frame block bg-card/40 p-4 hover:glow-border hover:bg-card transition group">
            <div className="text-[10px] text-muted-foreground">simulation_02 • hidden</div>
            <div className="mt-1 text-xl text-primary glow-text font-display">▸ SAHUR SURVIVAL ARENA</div>
            <div className="mt-1 text-[11px] text-muted-foreground">20 waves • 12 weapons • answer to upgrade.</div>
          </Link>
        </div>
      </section>
    </main>
  );
}
