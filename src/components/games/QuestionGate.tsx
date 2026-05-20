import { useEffect, useState } from "react";
import type { Question } from "@/lib/questions";

interface Props {
  question: Question;
  onCorrect: () => void;
  /** If true, must keep retrying until correct. If false, single attempt then onCorrect anyway. */
  mustGetCorrect?: boolean;
  onWrong?: () => void;
  title?: string;
}

export function QuestionGate({ question, onCorrect, mustGetCorrect = true, onWrong, title = "ACCESS_CHECK" }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setPicked(null);
    setRevealed(false);
  }, [question]);

  const correct = picked === question.answer;

  return (
    <div className="ascii-frame bg-card/95 p-5 max-w-xl w-full glow-border">
      <div className="flex items-center justify-between text-[11px] text-primary mb-3">
        <span>&gt; {title}</span>
        <span className="text-muted-foreground">// answer to proceed</span>
      </div>
      <div className="text-lg text-primary glow-text mb-4">{question.q}</div>
      <div className="grid gap-2">
        {question.options.map((opt, i) => {
          const isPicked = picked === i;
          const showCorrect = revealed && i === question.answer;
          const showWrong = revealed && isPicked && i !== question.answer;
          return (
            <button
              key={i}
              disabled={revealed && correct}
              onClick={() => {
                setPicked(i);
                setRevealed(true);
                if (i === question.answer) {
                  setTimeout(onCorrect, 700);
                } else {
                  onWrong?.();
                  if (!mustGetCorrect) setTimeout(onCorrect, 1200);
                }
              }}
              className={`text-left border px-3 py-2 text-sm transition hover:border-primary hover:text-primary ${
                showCorrect ? "border-success text-success glow-border" :
                showWrong ? "border-destructive text-destructive" :
                "border-border text-foreground"
              }`}
            >
              <span className="text-primary mr-2">[{String.fromCharCode(65 + i)}]</span>{opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className={`mt-4 text-xs ${correct ? "text-success" : "text-destructive"}`}>
          {correct ? "▸ ACCESS GRANTED // " : "▸ TRY AGAIN // "}
          <span className="text-muted-foreground">{question.why}</span>
        </div>
      )}
    </div>
  );
}
