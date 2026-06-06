"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { Roadmap } from "@/lib/types";
import { RecipeCard } from "@/components/RecipeCard";

export function ExploreClient() {
  const searchParams = useSearchParams();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [field, setField] = useState<string>(searchParams.get("field") ?? "All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/roadmaps")
      .then((r) => r.json())
      .then((data: Roadmap[]) => {
        if (!cancelled) setRoadmaps(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roadmaps.filter((r) => {
      const matchesField = field === "All" || r.field.toLowerCase() === field.toLowerCase();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.field.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchesField && matchesQuery;
    });
  }, [roadmaps, query, field]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold">Explore recipes</h1>
        <p className="mt-2 text-muted">
          Browse real career journeys. Filter by field or search for anything.
        </p>
      </header>

      {/* Search */}
      <div className="relative mb-5">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          🔎
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, field, or keyword…"
          className="cr-input !rounded-full !py-3 !pl-11"
        />
      </div>

      {/* Field filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={field === "All"} onClick={() => setField("All")}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.slug} active={field === c.name} onClick={() => setField(c.name)}>
            {c.emoji} {c.name}
          </Chip>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-20 text-center">
          <span className="text-4xl">🍽️</span>
          <h3 className="mt-4 font-display text-xl font-semibold">No recipes yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Nothing matches your filters. Try a different field — or be the first to
            share a recipe here.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted">
            {filtered.length} recipe{filtered.length === 1 ? "" : "s"} found
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <RecipeCard key={r.id} roadmap={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-transparent bg-gradient-to-r from-primary to-primary-2 text-white shadow-lg"
          : "border-glass-border bg-glass text-muted hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
