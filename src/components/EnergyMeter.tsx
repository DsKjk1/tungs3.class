import { useState } from "react";

interface Source {
  id: string;
  label: string;
  watts: number; // estimated energy share
  note: string;
}

const sources: Source[] = [
  { id: "data", label: "Data Centers", watts: 38, note: "Servers running 24/7 for cloud, streaming, AI." },
  { id: "cool", label: "Cooling Systems", watts: 22, note: "Stops servers melting. Huge silent power hog." },
  { id: "net", label: "Networking", watts: 14, note: "Routers, undersea cables, cell towers — always on." },
  { id: "dev", label: "End Devices", watts: 18, note: "Phones, laptops, TVs — billions of small drains." },
  { id: "mfg", label: "Manufacturing", watts: 8, note: "Factories making the chips you'll throw away." },
];

export function EnergyMeter() {
  const [active, setActive] = useState<string>("data");
  const sel = sources.find((s) => s.id === active)!;
  return (
    <div className="font-mono">
      <div className="mb-2 flex items-center justify-between text-xs text-primary">
        <span>&gt; ENERGY_DRAW.live</span>
        <span className="text-muted-foreground">unit: % of global ICT energy (approx.)</span>
      </div>

      <div className="ascii-frame bg-card/40 p-4">
        <div className="mb-4 grid gap-2">
          {sources.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`group grid grid-cols-[120px_1fr_44px] items-center gap-3 text-left text-xs ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <span className="truncate">{s.label}</span>
                <span className="relative h-3 border border-border bg-background/60">
                  <span
                    className="absolute inset-y-0 left-0 bg-primary glow-soft transition-all duration-500"
                    style={{ width: `${s.watts * 2}%` }}
                  />
                </span>
                <span className="text-right tabular-nums">{s.watts}%</span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border pt-3 text-xs">
          <div className="text-primary">[SELECTED] {sel.label}</div>
          <div className="text-muted-foreground mt-1">{sel.note}</div>
        </div>
      </div>
    </div>
  );
}
