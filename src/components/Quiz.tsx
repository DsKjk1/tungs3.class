import { useState } from "react";

export interface MCQ {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export function MCQuiz({ items }: { items: MCQ[] }) {
  return (
    <div className="space-y-4">
      {items.map((it, idx) => (
        <MCQItem key={idx} item={it} index={idx} />
      ))}
    </div>
  );
}

function MCQItem({ item, index }: { item: MCQ; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === item.answer;
  return (
    <div className="ascii-frame bg-card/40 p-3 font-mono text-sm">
      <div className="mb-2 text-primary">[Q{String(index + 1).padStart(2, "0")}] {item.q}</div>
      <div className="grid gap-1">
        {item.options.map((o, i) => {
          const state =
            picked === null
              ? "border-border hover:border-primary hover:text-primary"
              : i === item.answer
              ? "border-success text-success glow-soft"
              : i === picked
              ? "border-destructive text-destructive"
              : "border-border opacity-60";
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`text-left border px-2 py-1 transition ${state}`}
            >
              <span className="text-muted-foreground">[{String.fromCharCode(65 + i)}]</span> {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className={`mt-2 text-xs ${correct ? "text-success" : "text-destructive"}`}>
          {correct ? "✓ ACCESS GRANTED. " : "✗ DENIED. "}
          <span className="text-muted-foreground">{item.why}</span>
        </div>
      )}
    </div>
  );
}

export function TrueFalse({ statement, answer, why }: { statement: string; answer: boolean; why: string }) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const correct = picked === answer;
  return (
    <div className="ascii-frame bg-card/40 p-3 font-mono text-sm">
      <div className="mb-2 text-primary">[T/F] {statement}</div>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            disabled={picked !== null}
            onClick={() => setPicked(v)}
            className={`border px-3 py-1 ${
              picked === null
                ? "border-border hover:border-primary hover:text-primary"
                : v === answer
                ? "border-success text-success"
                : v === picked
                ? "border-destructive text-destructive"
                : "border-border opacity-50"
            }`}
          >
            {v ? "TRUE" : "FALSE"}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className={`mt-2 text-xs ${correct ? "text-success" : "text-destructive"}`}>
          {correct ? "✓ correct. " : "✗ not quite. "}
          <span className="text-muted-foreground">{why}</span>
        </div>
      )}
    </div>
  );
}
