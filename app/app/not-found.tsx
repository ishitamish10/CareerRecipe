import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <span className="text-6xl">🍳</span>
      <h1 className="mt-6 font-display text-3xl font-bold">This recipe is off the menu</h1>
      <p className="mt-3 text-muted">
        We couldn&apos;t find what you were looking for. Let&apos;s get you back to the kitchen.
      </p>
      <Link href="/" className="btn-primary mt-6 rounded-full px-6 py-3 text-sm font-semibold">
        Back home
      </Link>
    </div>
  );
}
