import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import sahurImg from "@/assets/mr-sahur.png";

const generic = [
  "E-waste is stacking up faster than unfinished homework.",
  "Data centers are basically giant hungry metal brains.",
  "Turning your brightness down saves power AND your eyes.",
  "Planned obsolescence? Fancy words for 'buy another one.'",
  "Mining for rare earth metals isn't exactly Minecraft.",
  "I've got 99 problems but a cache miss ain't one.",
  "There are 10 types of people: those who get binary and those who don't.",
  "Why did the dev go broke? They used up all their cache.",
  "Press F to pay respects to the polar ice caps.",
  "Sleep mode: for your laptop AND your study sessions.",
  "If at first you don't succeed, call it version 1.0.",
  "Old phones never die. They just go to landfills.",
  "Recycling: turning trash into next year's iPhone.",
  "I run on electricity and existential dread.",
  "404: motivation not found. Try Ctrl+R.",
];

const byTopic: Record<string, string[]> = {
  "environmental-issues": [
    "Mining one phone uses more water than your morning shower for a year.",
    "Streaming a 4K video burns more energy than charging your phone for a week.",
    "A data center never sleeps — kinda like you during exam week.",
    "Throwing your phone in the bin? That's a felony in some places.",
    "The cloud is just someone else's very, very hot computer.",
  ],
  "personal-data": [
    "Your data is the new oil — and you're giving it away free.",
    "Cookies aren't always tasty.",
    "Privacy policy: 47 pages of 'we sell your data lol'.",
  ],
  "legislation": [
    "Read the Computer Misuse Act before you 'just try' anything.",
    "GDPR: the four letters that scared every website into popups.",
  ],
  "artificial-intelligence": [
    "AI won't take your job. Someone using AI will.",
    "I asked an AI for a joke. It returned 'undefined'.",
  ],
  "intellectual-property": [
    "Copy + paste isn't research, it's copyright infringement.",
    "Open-source: free as in puppy, not as in beer.",
  ],
  "threats": [
    "Phishing: when someone tries to hook you with bait.",
    "Strong passwords are like underwear: change often, don't share.",
  ],
  "protecting-systems": [
    "Two-factor auth is the seatbelt of the internet.",
    "Backups: the only thing you regret NOT having.",
  ],
};

function getTopicKey(path: string): string | null {
  const m = path.match(/^\/topic\/([^/]+)/);
  return m ? m[1] : null;
}

export function MrSahur() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string>("Click me. I'll wait.");
  const [hint, setHint] = useState(true);
  const timer = useRef<number | null>(null);

  // Hide hint after 6s
  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 6000);
    return () => window.clearTimeout(t);
  }, []);

  const speak = () => {
    const key = getTopicKey(path);
    const pool = [...(key && byTopic[key] ? byTopic[key] : []), ...generic];
    const next = pool[Math.floor(Math.random() * pool.length)];
    setMsg(next);
    setOpen(true);
    setHint(false);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 6000);
  };

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden md:flex items-end">
      <div className="pointer-events-auto relative mr-2 mb-4 flex flex-col items-end">
        {open && (
          <div className="mb-2 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="ascii-frame bg-popover/95 px-3 py-2 text-xs text-popover-foreground glow-border">
              <div className="mb-1 flex items-center justify-between gap-3 border-b border-border pb-1 text-[10px] text-primary">
                <span>MR_SAHUR.exe</span>
                <button onClick={() => setOpen(false)} className="hover:text-destructive">[X]</button>
              </div>
              <p className="leading-relaxed">{msg}</p>
              <div className="mt-1 text-[10px] text-muted-foreground">&gt; click again for more</div>
            </div>
          </div>
        )}
        {hint && !open && (
          <div className="mb-1 mr-1 animate-pulse text-[10px] text-primary glow-text">
            ◀ click me
          </div>
        )}
        <button
          onClick={speak}
          aria-label="Talk to Mr Sahur"
          className="bob block hover:scale-[1.03] transition-transform"
        >
          <img
            src={sahurImg}
            alt="Mr Sahur — guide mascot"
            width={160}
            height={320}
            className="h-[40vh] max-h-[420px] w-auto drop-shadow-[0_0_18px_color-mix(in_oklab,var(--glow)_40%,transparent)]"
          />
        </button>
      </div>
    </div>
  );
}
