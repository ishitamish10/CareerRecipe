import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoadmap } from "@/lib/store";
import { categoryForField } from "@/lib/categories";
import { HelpfulButton } from "@/components/HelpfulButton";
import { CommentsSection } from "@/components/CommentsSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const roadmap = await getRoadmap(id);
  if (!roadmap) return { title: "Recipe not found — CareerRecipe" };
  return {
    title: `${roadmap.title} — CareerRecipe`,
    description: roadmap.description.slice(0, 160),
  };
}

const SECTIONS = [
  { key: "tips", emoji: "🥣", title: "Ingredients", hint: "Skills, tools & must-haves" },
  { key: "successes", emoji: "🎉", title: "Successes & wins", hint: "What went well" },
  { key: "challenges", emoji: "😤", title: "Challenges & failures", hint: "What was hard" },
  { key: "lessons", emoji: "💡", title: "Key lessons", hint: "What they'd do differently" },
] as const;

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roadmap = await getRoadmap(id);
  if (!roadmap) notFound();

  const category = categoryForField(roadmap.field);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/explore" className="text-sm text-muted hover:text-foreground">
        ← Back to explore
      </Link>

      {/* Header */}
      <header className="card mt-4 overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${category?.accent ?? "from-primary to-accent"}`} />
        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-muted">
              {category?.emoji ?? "🍽️"} {roadmap.field}
            </span>
            {roadmap.duration && (
              <span className="chip rounded-full px-3 py-1 text-xs font-medium text-muted">
                ⏱️ {roadmap.duration}
              </span>
            )}
            {roadmap.authorName && (
              <span className="chip rounded-full px-3 py-1 text-xs font-medium text-muted">
                🧑‍🍳 by {roadmap.authorName}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">{roadmap.title}</h1>
          <p className="mt-4 whitespace-pre-wrap text-muted">{roadmap.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <HelpfulButton roadmapId={roadmap.id} initial={roadmap.helpful} />
          </div>
        </div>
      </header>

      {/* Recipe sections */}
      <div className="mt-6 space-y-5">
        {SECTIONS.map((s) => {
          const value = roadmap[s.key];
          if (!value) return null;
          return (
            <section key={s.key} className="card p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <h2 className="font-display text-xl font-semibold">{s.title}</h2>
                  <p className="text-xs text-muted">{s.hint}</p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-relaxed text-foreground/90">
                {value}
              </p>
            </section>
          );
        })}
      </div>

      {/* Comments */}
      <div className="mt-6">
        <CommentsSection roadmapId={roadmap.id} />
      </div>
    </div>
  );
}
