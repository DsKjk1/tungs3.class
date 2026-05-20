import { useState } from "react";

interface Step {
  year: string;
  title: string;
  body: string;
}

const steps: Step[] = [
  { year: "T-0", title: "Launch Day", body: "Brand-new model. Marketing convinces you the old one is obsolete." },
  { year: "+6mo", title: "Software Update", body: "Update lands. Old phones suddenly feel slow. Coincidence? Probably not." },
  { year: "+12mo", title: "Battery Decay", body: "Battery life drops. Replacement is 'too expensive', upgrade looks cheaper." },
  { year: "+18mo", title: "Next Model", body: "New flagship drops. Adverts everywhere. FOMO engaged." },
  { year: "+24mo", title: "Replacement", body: "User upgrades. Old device → drawer → eventually landfill." },
];

export function ReplacementTimeline() {
  const [i, setI] = useState(0);
  return (
    <div className="font-mono">
      <div className="mb-2 text-xs text-primary">&gt; OBSOLESCENCE_TIMELINE.log</div>
      <div className="ascii-frame bg-card/40 p-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className="flex flex-col items-center gap-1 text-[10px] min-w-[64px]"
            >
              <span
                className={`h-3 w-3 border ${
                  idx <= i ? "bg-primary border-primary glow-soft" : "border-border bg-background"
                }`}
              />
              <span className={idx === i ? "text-primary" : "text-muted-foreground"}>{s.year}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 h-px w-full bg-border" />
        <div className="mt-3 text-sm">
          <div className="text-primary">{steps[i].title}</div>
          <div className="text-muted-foreground mt-1">{steps[i].body}</div>
        </div>
      </div>
    </div>
  );
}
