import Link from "next/link";
import { listRoadmaps } from "@/lib/store";
import { CATEGORIES } from "@/lib/categories";
import { RecipeCard } from "@/components/RecipeCard";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    emoji: "🧑‍🍳",
    title: "Professionals share their recipe",
    body: "Education, certifications, projects, mistakes, and wins — shared honestly.",
  },
  {
    emoji: "🔎",
    title: "Students explore the recipes",
    body: "Browse real journeys across AI, software, medicine, cybersecurity, and more.",
  },
  {
    emoji: "🥣",
    title: "Follow the ingredients",
    body: "Skills, degrees, tools, timelines, and the common mistakes to avoid.",
  },
];

export default async function HomePage() {
  const roadmaps = await listRoadmaps();
  const featured = roadmaps.slice(0, 4);
  const totalHelpful = roadmaps.reduce((s, r) => s + r.helpful, 0);

  const stats = [
    { value: `${roadmaps.length}+`, label: "Career recipes" },
    { value: `${CATEGORIES.length}`, label: "Fields covered" },
    { value: `${totalHelpful}+`, label: "Helpful votes" },
    { value: "100%", label: "Real journeys" },
  ];

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center md:py-32">
          <Reveal>
            <span className="chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Learn from professionals worldwide
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Discover the <span className="gradient-text">recipe</span> for your
              dream career
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
              Every successful career has a recipe — the ingredients, the steps, and the
              lessons learned. Explore real journeys shared by real professionals.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/explore" className="btn-primary rounded-full px-7 py-3.5 text-sm font-semibold">
                Explore recipes →
              </Link>
              <Link href="/signup" className="btn-ghost rounded-full px-7 py-3.5 text-sm font-semibold">
                Share your journey
              </Link>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={320}>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="card card-hover p-5">
                  <div className="font-display text-3xl font-bold gradient-text">{s.value}</div>
                  <div className="mt-1 text-xs text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Categories (bento) ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Explore career fields</h2>
            <p className="mt-3 text-muted">Pick a field and discover the recipes behind it.</p>
          </div>
        </Reveal>

        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c, i) => {
            // Bento: make the first and fourth tiles span two columns.
            const big = i === 0 || i === 3;
            return (
              <Reveal
                key={c.slug}
                delay={i * 60}
                className={big ? "col-span-2 row-span-1" : "col-span-1"}
              >
                <Link
                  href={`/explore?field=${encodeURIComponent(c.name)}`}
                  className="card card-hover group relative block h-full overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 transition duration-500 group-hover:scale-110 group-hover:opacity-55"
                    style={{ backgroundImage: `url(${c.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${c.accent} opacity-30`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <span className="text-xl">{c.emoji}</span> {c.name}
                    </h3>
                    {big && <p className="mt-1 text-sm text-muted">{c.blurb}</p>}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">How CareerRecipe works</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="card card-hover h-full p-7 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-3xl ring-1 ring-glass-border">
                  {s.emoji}
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                  Step {i + 1}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Featured recipes ---------------- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold md:text-4xl">Fresh from the kitchen</h2>
                <p className="mt-3 text-muted">The latest recipes shared by the community.</p>
              </div>
              <Link href="/explore" className="btn-ghost hidden rounded-full px-4 py-2 text-sm font-medium sm:inline-flex">
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((r, i) => (
              <Reveal key={r.id} delay={i * 70}>
                <RecipeCard roadmap={r} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- Dual CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="card relative overflow-hidden p-10 text-center md:p-16">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-2/10 to-accent/20" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold md:text-4xl">Join CareerRecipe today</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                Whether you&apos;re charting your path or paying it forward — there&apos;s a
                place for you.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/signup" className="btn-primary rounded-full px-7 py-3.5 text-sm font-semibold">
                  🎓 Join as a student
                </Link>
                <Link href="/signup" className="btn-ghost rounded-full px-7 py-3.5 text-sm font-semibold">
                  🧑‍🍳 Join as a professional
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
