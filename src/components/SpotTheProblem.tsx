import { useState } from "react";

interface Spot {
  id: string;
  x: number;
  y: number;
  problem: string;
}

const spots: Spot[] = [
  { id: "br", x: 78, y: 18, problem: "Brightness maxed out — wastes battery & power." },
  { id: "tabs", x: 22, y: 32, problem: "27 browser tabs open — RAM and CPU hogs." },
  { id: "charge", x: 65, y: 70, problem: "Phone left plugged in overnight — energy waste." },
  { id: "old", x: 12, y: 78, problem: "Working laptop in the bin — should be recycled, not trashed." },
];

export function SpotTheProblem() {
  const [found, setFound] = useState<string[]>([]);
  const [active, setActive] = useState<Spot | null>(null);
  return (
    <div className="font-mono">
      <div className="mb-2 flex items-center justify-between text-xs text-primary">
        <span>&gt; SPOT_THE_WASTE.scan</span>
        <span className="text-muted-foreground">found {found.length}/{spots.length}</span>
      </div>
      <div className="ascii-frame bg-card/40 p-2">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-grid bg-background">
          {/* Schematic "room" */}
          <div className="absolute inset-4 border border-border opacity-40" />
          <div className="absolute left-[10%] top-[60%] h-[28%] w-[24%] border border-border" />
          <div className="absolute left-[60%] top-[10%] h-[35%] w-[30%] border border-border" />
          <div className="absolute left-[18%] top-[20%] h-[20%] w-[18%] border border-border" />

          {spots.map((s) => {
            const isFound = found.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (!isFound) setFound((p) => [...p, s.id]);
                  setActive(s);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                  isFound ? "text-success" : "text-primary"
                }`}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label="Investigate"
              >
                <span className={`block h-5 w-5 border ${isFound ? "border-success" : "border-primary"} glow-border`}>
                  <span className="block h-full w-full animate-ping bg-current opacity-30" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-2 ascii-frame bg-card/40 p-2 text-xs min-h-[44px]">
        {active ? (
          <span><span className="text-primary">[PROBLEM]</span> {active.problem}</span>
        ) : (
          <span className="text-muted-foreground">// click the blinking nodes to investigate energy waste</span>
        )}
      </div>
    </div>
  );
}
