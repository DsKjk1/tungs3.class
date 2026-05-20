import { Reveal, TerminalBox } from "@/components/atoms";
import { MCQuiz } from "@/components/Quiz";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import type { TopicContent } from "@/content/topics/types";

export function TopicBuilder({ content }: { content: TopicContent }) {
  return (
    <>
      <section className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Reveal>
            <TerminalBox title="briefing.txt">
              <p className="text-sm leading-relaxed text-muted-foreground">{content.hero}</p>
              <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-primary">
                {content.tags.map((t) => (
                  <span key={t} className="border border-primary px-2 py-0.5">{t}</span>
                ))}
              </div>
            </TerminalBox>
          </Reveal>
        </div>
      </section>

      {content.sections.map((s) => (
        <section id={s.id} key={s.id} className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <Reveal>
              <div className="flex items-center gap-3 text-xs text-primary mb-3">
                <span className="border border-primary px-2 py-0.5 glow-border">SECTION_{s.code}</span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-muted-foreground">/{content.slug}/{s.id}.md</span>
              </div>
              <h2 className="text-2xl md:text-3xl text-primary glow-text">{s.title}</h2>
              <p className="mt-3 max-w-3xl text-sm md:text-base text-muted-foreground leading-relaxed">
                {s.explanation}
              </p>
            </Reveal>

            <Reveal>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {s.bullets.map((b, i) => (
                  <div key={i} className="ascii-frame bg-card/30 p-3 text-xs hover:glow-border transition">
                    <div className="text-primary">▸ {b}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-6 grid gap-3">
                {s.paragraphs.map((p, i) => (
                  <div key={i} className="ascii-frame bg-card/20 p-4 text-sm leading-relaxed text-foreground/90">
                    <span className="text-primary mr-2">[{String(i + 1).padStart(2, "0")}]</span>{p}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="mt-8">
                <div className="mb-2 flex items-center gap-2 text-xs text-primary">
                  <span>&gt; quiz_{s.code}.exe</span>
                  <span className="text-muted-foreground">// recall test</span>
                </div>
                <MCQuiz items={s.quiz} />
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Reveal>
            <div className="mb-4 flex items-center gap-3 text-xs text-primary">
              <span className="border border-primary px-2 py-0.5 glow-border">REVISION_DECK</span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground">/{content.slug}/cards.dat</span>
            </div>
            <FlashcardDeck cards={content.flashcards} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
