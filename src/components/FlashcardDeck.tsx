import { useEffect, useState, useMemo } from "react";

export interface DeckCard {
  category: string;
  front: string;
  back: string;
}

export function FlashcardDeck({ cards }: { cards: DeckCard[] }) {
  const categories = useMemo(() => ["ALL", ...Array.from(new Set(cards.map((c) => c.category)))], [cards]);
  const [filter, setFilter] = useState("ALL");
  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => cards.map((c, i) => ({ ...c, _i: i })).filter((c) => filter === "ALL" || c.category === filter),
    [cards, filter],
  );

  useEffect(() => {
    setOrder(filtered.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  }, [filter, cards]);

  if (filtered.length === 0) return null;
  const card = filtered[order[pos] ?? 0];
  const key = `${card.category}:${card.front}`;
  const isKnown = known.has(key);

  const shuffle = () => {
    const a = [...order];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
    setPos(0);
    setFlipped(false);
  };
  const next = () => { setFlipped(false); setPos((p) => (p + 1) % filtered.length); };
  const prev = () => { setFlipped(false); setPos((p) => (p - 1 + filtered.length) % filtered.length); };
  const toggleKnown = () => {
    const n = new Set(known);
    if (n.has(key)) n.delete(key); else n.add(key);
    setKnown(n);
  };

  const knownInFilter = filtered.filter((c) => known.has(`${c.category}:${c.front}`)).length;
  const pct = Math.round((knownInFilter / filtered.length) * 100);

  return (
    <div className="font-mono">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className="text-primary">&gt; DECK</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`border px-2 py-0.5 transition ${
              filter === c ? "border-primary text-primary glow-soft" : "border-border text-muted-foreground hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="ml-auto text-muted-foreground">{pos + 1}/{filtered.length} • known {knownInFilter} ({pct}%)</span>
      </div>

      <div className="mb-2 h-1 w-full bg-border overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative h-64 cursor-pointer select-none [perspective:1200px]"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
        >
          <div className="absolute inset-0 ascii-frame bg-card glow-border flex items-center justify-center p-6 text-center text-lg [backface-visibility:hidden]">
            <div>
              <div className="mb-2 text-[10px] text-primary">[{card.category}] FRONT</div>
              <div className="text-xl">{card.front}</div>
              <div className="mt-3 text-[10px] text-muted-foreground">click to flip</div>
            </div>
          </div>
          <div className="absolute inset-0 ascii-frame bg-card glow-border flex items-center justify-center p-6 text-center text-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div>
              <div className="mb-2 text-[10px] text-primary">[{card.category}] ANSWER</div>
              <div className="text-muted-foreground leading-relaxed">{card.back}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
        <button onClick={prev} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">◀ PREV</button>
        <button onClick={() => setFlipped((f) => !f)} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">FLIP</button>
        <button onClick={toggleKnown} className={`border px-3 py-1 transition ${isKnown ? "border-success text-success" : "border-border hover:border-primary hover:text-primary"}`}>
          {isKnown ? "✓ KNOWN" : "MARK KNOWN"}
        </button>
        <button onClick={next} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">NEXT ▶</button>
      </div>
      <div className="mt-2 text-right">
        <button onClick={shuffle} className="text-[11px] text-muted-foreground hover:text-primary">↻ shuffle deck</button>
      </div>
    </div>
  );
}
