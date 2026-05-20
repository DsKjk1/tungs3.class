import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/games")({
  component: GamesHub,
  head: () => ({
    meta: [
      { title: "TUNG³ // ARCADE — Hidden Training Simulations" },
      { name: "description", content: "Two underground arcade simulations: Cricket Defense and Sahur Survival Arena." },
    ],
  }),
});

function GamesHub() {
  return (
    <main className="font-mono lg:pr-[20rem]">
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="text-xs text-primary mb-2">&gt; cd /arcade</div>
          <h1 className="text-3xl md:text-5xl text-primary glow-text font-display">// HIDDEN ARCADE</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Two combat simulations buried inside the TUNG³ archive. Both gate progress behind
            real CS knowledge — answer correctly, then play.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 grid gap-4 md:grid-cols-2">
        <Link to="/cricket" className="ascii-frame block bg-card/40 p-5 hover:glow-border hover:bg-card transition group">
          <div className="text-[10px] text-muted-foreground">simulation_01</div>
          <div className="mt-1 text-2xl text-primary glow-text font-display">FUTURISTIC CRICKET DEFENSE</div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Answer a CS question, then time your swing as Mr Sahur bowls a glowing energy ball.
            Perfect timing = massive launch, slow-mo, combo multiplier.
          </p>
          <div className="mt-3 text-[10px] text-primary group-hover:flicker">▸ ENTER STADIUM</div>
        </Link>
        <Link to="/arena" className="ascii-frame block bg-card/40 p-5 hover:glow-border hover:bg-card transition group">
          <div className="text-[10px] text-muted-foreground">simulation_02</div>
          <div className="mt-1 text-2xl text-primary glow-text font-display">SAHUR SURVIVAL ARENA</div>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            20 waves. 12 weapons across 3 categories. Every wave starts with a question — get it
            right, pick 1 of 3 upgrades. Stack to evolve.
          </p>
          <div className="mt-3 text-[10px] text-primary group-hover:flicker">▸ ENTER ARENA</div>
        </Link>
      </section>
    </main>
  );
}
