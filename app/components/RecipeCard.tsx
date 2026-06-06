import Link from "next/link";
import type { Roadmap } from "@/lib/types";
import { categoryForField } from "@/lib/categories";

export function RecipeCard({ roadmap }: { roadmap: Roadmap }) {
  const category = categoryForField(roadmap.field);

  return (
    <Link
      href={`/recipe/${roadmap.id}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${category?.accent ?? "from-primary to-accent"}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">{category?.emoji ?? "🍽️"}</span>
          <span className="chip rounded-full px-3 py-1 text-xs font-medium text-muted">
            {roadmap.field}
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug transition group-hover:text-primary">
          {roadmap.title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{roadmap.description}</p>

        {roadmap.authorName && (
          <p className="mt-3 text-xs text-muted">by {roadmap.authorName}</p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-glass-border pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">⏱️ {roadmap.duration || "—"}</span>
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1">❤️ {roadmap.helpful}</span>
            <span className="inline-flex items-center gap-1">💬 {roadmap.commentsCount}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
