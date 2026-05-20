import { Link } from "@tanstack/react-router";
import type { TopicMeta } from "@/lib/topics";

export function TopicStub({ topic }: { topic: TopicMeta }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 font-mono">
      <div className="ascii-frame bg-card/40 p-6">
        <div className="text-xs text-primary">&gt; cat module_{topic.code}.txt</div>
        <h2 className="mt-2 text-xl text-primary">{topic.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{topic.blurb}</p>
        <div className="mt-6 border-t border-border pt-4 text-xs">
          <div className="text-primary">[STATUS]</div>
          <p className="mt-1 text-muted-foreground">
            Module under construction. The full interactive build for this section is queued in the archive.
            For the complete deep-dive experience, see the
            {" "}
            <Link to="/topic/$slug" params={{ slug: "environmental-issues" }} className="text-primary underline">
              Environmental Issues
            </Link>{" "}
            module.
          </p>
        </div>
        <div className="mt-4 grid gap-2 text-[11px] text-muted-foreground">
          <div className="border border-border p-2">▸ planned: interactive scenarios</div>
          <div className="border border-border p-2">▸ planned: drag-and-drop quizzes</div>
          <div className="border border-border p-2">▸ planned: flashcard deck</div>
        </div>
      </div>
    </section>
  );
}
