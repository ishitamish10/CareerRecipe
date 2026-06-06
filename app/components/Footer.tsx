import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-glass-border">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-sm text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-lg font-bold md:justify-start">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary via-primary-2 to-accent">
                🍳
              </span>
              <span className="font-display">CareerRecipe</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Learn the ingredients, follow the recipe, build your future. Real career
              recipes from real professionals.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Explore</span>
              <Link href="/" className="text-muted hover:text-foreground">Home</Link>
              <Link href="/explore" className="text-muted hover:text-foreground">Recipes</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Account</span>
              <Link href="/login" className="text-muted hover:text-foreground">Log in</Link>
              <Link href="/signup" className="text-muted hover:text-foreground">Sign up</Link>
            </div>
          </div>
        </div>

        <div className="rule my-8" />
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} CareerRecipe · Every career has a recipe.
        </p>
      </div>
    </footer>
  );
}
