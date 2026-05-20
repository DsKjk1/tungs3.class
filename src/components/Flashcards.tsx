import { useState } from "react";

export interface Card {
  front: string;
  back: string;
}

export function Flashcards({ cards }: { cards: Card[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const next = () => { setFlipped(false); setI((p) => (p + 1) % cards.length); };
  const prev = () => { setFlipped(false); setI((p) => (p - 1 + cards.length) % cards.length); };
  const c = cards[i];
  return (
    <div className="font-mono">
      <div className="mb-2 flex items-center justify-between text-xs text-primary">
        <span>&gt; FLASHCARD_DECK [{i + 1}/{cards.length}]</span>
        <span className="text-muted-foreground">CLASSIFIED // STUDY USE ONLY</span>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative h-56 cursor-pointer select-none [perspective:1200px]"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div className="absolute inset-0 ascii-frame bg-card glow-border flex items-center justify-center p-6 text-center text-lg [backface-visibility:hidden]">
            <div>
              <div className="mb-2 text-[10px] text-primary">FRONT // KEYWORD</div>
              <div>{c.front}</div>
            </div>
          </div>
          <div className="absolute inset-0 ascii-frame bg-card glow-border flex items-center justify-center p-6 text-center text-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div>
              <div className="mb-2 text-[10px] text-primary">BACK // ANSWER</div>
              <div className="text-muted-foreground leading-relaxed">{c.back}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <button onClick={prev} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">◀ PREV</button>
        <button onClick={() => setFlipped((f) => !f)} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">FLIP</button>
        <button onClick={next} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">NEXT ▶</button>
      </div>
    </div>
  );
}
