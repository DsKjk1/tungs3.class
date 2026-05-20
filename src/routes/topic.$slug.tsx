import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { topics } from "@/lib/topics";
import { TopicBuilder } from "@/components/TopicPageBuilder";
import { getTopicContent } from "@/content/topics";

export const Route = createFileRoute("/topic/$slug")({
  component: TopicPage,
  loader: ({ params }) => {
    const t = topics.find((x) => x.slug === params.slug);
    if (!t) throw notFound();
    return { topic: t };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.topic.title} — TUNG³` },
          { name: "description", content: loaderData.topic.blurb },
          { property: "og:title", content: `${loaderData.topic.title} — TUNG³` },
          { property: "og:description", content: loaderData.topic.blurb },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl p-10 font-mono">
      <div className="ascii-frame p-6 text-center">
        <div className="text-destructive">404 // module not found</div>
        <Link to="/" className="mt-4 inline-block border px-3 py-1 text-primary">◀ /home</Link>
      </div>
    </div>
  ),
});

function TopicPage() {
  const { topic } = Route.useLoaderData();
  const content = getTopicContent(topic.slug);

  return (
    <main className="font-mono lg:pr-[20rem]">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">~/home</Link>
            <span className="mx-1 text-primary">/</span>
            <span>modules</span>
            <span className="mx-1 text-primary">/</span>
            <span className="text-primary">{topic.slug}</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-5xl text-primary glow-text">
            [{topic.code}] {topic.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{topic.blurb}</p>
        </div>
      </header>

      {content ? (
        <TopicBuilder content={content} />
      ) : (
        <section className="mx-auto max-w-3xl px-4 py-12 font-mono">
          <div className="ascii-frame p-6 text-center text-muted-foreground">
            Module content not yet indexed.
          </div>
        </section>
      )}
    </main>
  );
}
