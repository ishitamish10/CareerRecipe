"use client";

import { useState } from "react";

export function HelpfulButton({
  roadmapId,
  initial,
}: {
  roadmapId: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [voted, setVoted] = useState(false);
  const [pending, setPending] = useState(false);

  async function vote() {
    if (voted || pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/helpful`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.helpful);
        setVoted(true);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={vote}
      disabled={voted || pending}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        voted
          ? "border border-line bg-surface-2 text-muted"
          : "btn-primary hover:scale-[1.02]"
      }`}
    >
      <span>{voted ? "💖" : "🤍"}</span>
      {voted ? "Marked helpful" : "Mark as helpful"}
      <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{count}</span>
    </button>
  );
}
