import { createFileRoute, Link } from "@tanstack/react-router";
import { CricketGame } from "@/components/games/CricketGame";

export const Route = createFileRoute("/cricket")({
  component: CricketPage,
  head: () => ({
    meta: [
      { title: "CRICKET DEFENSE // TUNG³ ARCADE" },
      { name: "description", content: "Time your swing in a futuristic cyber stadium. Mr Sahur bowls — you defend." },
    ],
  }),
});

function CricketPage() {
  return (
    <main className="font-mono lg:pr-[20rem]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">~/home</Link>
            <span className="mx-1 text-primary">/</span>
            <Link to="/games" className="hover:text-primary">arcade</Link>
            <span className="mx-1 text-primary">/</span>
            <span className="text-primary">cricket_defense</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-4xl text-primary glow-text font-display">// CRICKET DEFENSE</h1>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-6">
        <CricketGame />
      </section>
    </main>
  );
}
