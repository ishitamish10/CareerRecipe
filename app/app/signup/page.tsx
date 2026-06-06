"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { Role } from "@/lib/types";

const ROLES: { value: Role; emoji: string; title: string; blurb: string }[] = [
  {
    value: "student",
    emoji: "🎓",
    title: "Aspiring / Student",
    blurb: "Explore career recipes, save journeys, and learn from professionals.",
  },
  {
    value: "professional",
    emoji: "🧑‍🍳",
    title: "Professional",
    blurb: "Share your career path and mentor the next generation.",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(k: keyof typeof form, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup({ ...form, role });
      router.push(role === "professional" ? "/create" : "/explore");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Create your <span className="gradient-text">account</span>
        </h1>
        <p className="mt-3 text-muted">Choose how you want to use CareerRecipe.</p>
      </div>

      <form onSubmit={submit} className="card p-6 md:p-8">
        {/* Role selector */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLES.map((r) => {
            const active = role === r.value;
            return (
              <button
                type="button"
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_var(--primary)]"
                    : "border-glass-border bg-glass hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{r.emoji}</span>
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      active ? "border-primary bg-primary" : "border-muted"
                    }`}
                  />
                </div>
                <h3 className="mt-2 font-semibold">{r.title}</h3>
                <p className="mt-1 text-xs text-muted">{r.blurb}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <Field label={role === "professional" ? "Display name" : "Name"}>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Jordan Lee"
              required
              className="cr-input"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              required
              className="cr-input"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="cr-input"
            />
          </Field>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "Creating account…" : `Create ${role} account`}
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
