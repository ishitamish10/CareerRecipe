"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/create", label: "Share Recipe" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass border-b border-glass-border">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex items-center gap-2 text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-primary-2 to-accent text-base shadow-lg transition group-hover:scale-105">
              🍳
            </span>
            <span className="font-display tracking-tight">
              Career<span className="gradient-text">Recipe</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(l.href)
                    ? "bg-glass-strong text-foreground"
                    : "text-muted hover:bg-glass hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <span className="mx-2 h-6 w-px bg-line" />
            <ThemeToggle />
            <AuthArea />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-glass"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="glass border-b border-glass-border px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive(l.href) ? "text-foreground" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="px-2 py-2">
            <MobileAuth onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

function AuthArea() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) return <span className="ml-2 h-9 w-20" />;

  if (!user) {
    return (
      <div className="ml-2 flex items-center gap-2">
        <Link href="/login" className="btn-ghost rounded-full px-4 py-2 text-sm font-medium">
          Log in
        </Link>
        <Link href="/signup" className="btn-primary rounded-full px-4 py-2 text-sm font-semibold">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative ml-2">
      <button
        type="button"
        onClick={() => setMenu((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-glass-border bg-glass py-1 pl-1 pr-3 transition hover:border-primary/40"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="max-w-[8rem] truncate text-sm font-medium">{user.name}</span>
      </button>

      {menu && (
        <div className="card absolute right-0 mt-2 w-56 p-2">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <span className="mt-1.5 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {user.role}
            </span>
          </div>
          <div className="rule my-1" />
          {user.role === "professional" && (
            <Link
              href="/create"
              onClick={() => setMenu(false)}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-glass"
            >
              ✍️ Share a recipe
            </Link>
          )}
          <Link
            href="/explore"
            onClick={() => setMenu(false)}
            className="block rounded-lg px-3 py-2 text-sm hover:bg-glass"
          >
            🔎 Explore recipes
          </Link>
          <button
            type="button"
            onClick={async () => {
              setMenu(false);
              await logout();
              router.push("/");
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
          >
            ⏻ Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileAuth({ onNavigate }: { onNavigate: () => void }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  if (loading) return null;
  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/login" onClick={onNavigate} className="btn-ghost flex-1 rounded-full px-4 py-2 text-center text-sm font-medium">
          Log in
        </Link>
        <Link href="/signup" onClick={onNavigate} className="btn-primary flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold">
          Sign up
        </Link>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={async () => {
        onNavigate();
        await logout();
        router.push("/");
      }}
      className="btn-ghost w-full rounded-full px-4 py-2 text-sm font-medium"
    >
      Sign out ({user.name})
    </button>
  );
}
