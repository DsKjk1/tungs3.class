import { useEffect, useRef, useState } from "react";

export function Typewriter({ text, speed = 35, className = "" }: { text: string; speed?: number; className?: string }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return (
    <span className={className}>
      {out}
      <span className="caret text-primary">▮</span>
    </span>
  );
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && el.classList.add("in")),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function TerminalBox({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`ascii-frame bg-card/60 ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-border px-3 py-1 font-mono text-[11px] text-primary">
          <span>&gt; {title}</span>
          <span className="text-muted-foreground">[●○○]</span>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
