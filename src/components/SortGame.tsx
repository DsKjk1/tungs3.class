import { useMemo, useState } from "react";

export interface SortItem {
  id: string;
  label: string;
  category: string;
}

/**
 * Click an item, then click a bin to drop it.
 * Works on touch + keyboard, no native HTML5 DnD pain.
 */
export function SortGame({
  items,
  bins,
  prompt,
}: {
  items: SortItem[];
  bins: { id: string; label: string }[];
  prompt: string;
}) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const remaining = items.filter((i) => !placed[i.id]);
  const done = remaining.length === 0;

  const score = useMemo(
    () => Object.entries(placed).filter(([id, bin]) => items.find((i) => i.id === id)?.category === bin).length,
    [placed, items]
  );

  const drop = (binId: string) => {
    if (!selected) return;
    setPlaced((p) => ({ ...p, [selected]: binId }));
    setSelected(null);
  };

  const reset = () => { setPlaced({}); setSelected(null); };

  return (
    <div className="font-mono text-sm">
      <div className="mb-2 text-primary">&gt; {prompt}</div>

      <div className="mb-3 flex flex-wrap gap-2 ascii-frame bg-card/40 p-3 min-h-[60px]">
        {remaining.length === 0 && <span className="text-muted-foreground text-xs">// inbox empty</span>}
        {remaining.map((i) => (
          <button
            key={i.id}
            onClick={() => setSelected(i.id === selected ? null : i.id)}
            className={`border px-2 py-1 text-xs ${
              selected === i.id ? "border-primary text-primary glow-border" : "border-border hover:border-primary"
            }`}
          >
            {i.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bins.map((b) => {
          const here = Object.entries(placed).filter(([, v]) => v === b.id);
          return (
            <button
              key={b.id}
              onClick={() => drop(b.id)}
              className={`ascii-frame bg-card/30 p-3 text-left min-h-[110px] transition ${
                selected ? "border-primary glow-soft" : ""
              }`}
            >
              <div className="mb-2 text-xs text-primary">[BIN] {b.label}</div>
              <div className="flex flex-wrap gap-1">
                {here.map(([id]) => {
                  const it = items.find((x) => x.id === id)!;
                  const ok = it.category === b.id;
                  return (
                    <span
                      key={id}
                      className={`border px-2 py-1 text-[11px] ${
                        ok ? "border-success text-success" : "border-destructive text-destructive"
                      }`}
                    >
                      {it.label}
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {done && (
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className={score === items.length ? "text-success glow-text" : "text-primary"}>
            ✓ RESULT: {score}/{items.length} sorted correctly
          </span>
          <button onClick={reset} className="border border-border px-3 py-1 hover:border-primary hover:text-primary">RESET</button>
        </div>
      )}
    </div>
  );
}
