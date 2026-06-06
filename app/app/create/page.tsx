"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { useAuth } from "@/components/AuthProvider";

interface Field {
  name: string;
  label: string;
  placeholder: string;
  type: "input" | "textarea" | "select";
  required?: boolean;
  rows?: number;
}

const FIELDS: Field[] = [
  { name: "title", label: "📖 Recipe Title", placeholder: "e.g., From CS Grad to AI Engineer in 4 Years", type: "input", required: true },
  { name: "field", label: "🎯 Career Field", placeholder: "Choose a field", type: "select", required: true },
  { name: "duration", label: "⏱️ Time Duration", placeholder: "e.g., 4 years, 6 months", type: "input" },
  { name: "description", label: "📝 Journey Overview", placeholder: "Where did you start and where did it lead?", type: "textarea", rows: 4, required: true },
  { name: "tips", label: "🥣 Ingredients", placeholder: "Skills, degrees, certifications, and tools that mattered most.", type: "textarea", rows: 4, required: true },
  { name: "successes", label: "🎉 Successes & Achievements", placeholder: "What went well? What are you proud of?", type: "textarea", rows: 4, required: true },
  { name: "challenges", label: "😤 Challenges & Failures", placeholder: "What was difficult? What didn't work out?", type: "textarea", rows: 4, required: true },
  { name: "lessons", label: "💡 Key Lessons Learned", placeholder: "What did you learn? What would you do differently?", type: "textarea", rows: 4, required: true },
];

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.name, ""])) as Record<string, string>;

export default function CreatePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<Record<string, string>>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(`/recipe/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Access gating ----
  if (loading) {
    return <div className="px-4 py-24 text-center text-muted">Loading…</div>;
  }

  if (!user) {
    return (
      <Gate
        emoji="🔒"
        title="Sign in to share a recipe"
        body="You need a professional account to publish a career recipe."
        actions={
          <>
            <Link href="/login?next=/create" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
              Log in
            </Link>
            <Link href="/signup" className="btn-ghost rounded-full px-6 py-3 text-sm font-semibold">
              Create an account
            </Link>
          </>
        }
      />
    );
  }

  if (user.role !== "professional") {
    return (
      <Gate
        emoji="🎓"
        title="Professional accounts only"
        body="You're signed in as a student. Recipes are published by professionals — but you can explore every recipe on the platform."
        actions={
          <Link href="/explore" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
            Explore recipes →
          </Link>
        }
      />
    );
  }

  // ---- Professional: show the form ----
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Share your <span className="gradient-text">career recipe</span>
        </h1>
        <p className="mt-3 text-muted">
          Be honest — your story could be the recipe a future professional needs.
        </p>
      </header>

      <form onSubmit={submit} className="card space-y-5 p-6 md:p-8">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label className="mb-1.5 block text-sm font-semibold">
              {f.label}
              {f.required && <span className="text-primary"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={form[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={f.rows ?? 4}
                required={f.required}
                className="cr-input"
              />
            ) : f.type === "select" ? (
              <select
                value={form[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                required={f.required}
                className="cr-input"
              >
                <option value="" disabled>
                  {f.placeholder}
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form[f.name]}
                onChange={(e) => update(f.name, e.target.value)}
                placeholder={f.placeholder}
                required={f.required}
                className="cr-input"
              />
            )}
          </div>
        ))}

        {error && (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "Publishing…" : "Publish recipe"}
        </button>
      </form>
    </div>
  );
}

function Gate({
  emoji,
  title,
  body,
  actions,
}: {
  emoji: string;
  title: string;
  body: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="card p-10 text-center">
        <span className="text-5xl">{emoji}</span>
        <h1 className="mt-5 font-display text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-muted">{body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>
      </div>
    </div>
  );
}
