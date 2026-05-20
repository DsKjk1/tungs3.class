import { createFileRoute, Link } from "@tanstack/react-router";
import { ArenaGame } from "@/components/games/ArenaGame";

export const Route = createFileRoute("/arena")({
  component: ArenaPage,
  head: () => ({
    meta: [
      { title: "SAHUR SURVIVAL ARENA // TUNG³ ARCADE" },
      { name: "description", content: "20-wave arena survival. Answer to upgrade. Survive Mr Sahur hordes." },
    ],
  }),
});

function ArenaPage() {
  return (
    <main className="font-mono lg:pr-[20rem]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">~/home</Link>
            <span className="mx-1 text-primary">/</span>
            <Link to="/games" className="hover:text-primary">arcade</Link>
            <span className="mx-1 text-primary">/</span>
            <span className="text-primary">survival_arena</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-4xl text-primary glow-text font-display">// SURVIVAL ARENA</h1>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-6">
        <ArenaGame />
      </section>
    </main>
  );
}
