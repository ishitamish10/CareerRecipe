"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/types";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function CommentsSection({ roadmapId }: { roadmapId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/roadmaps/${roadmapId}/comments`)
      .then((r) => r.json())
      .then((data: Comment[]) => setComments(data))
      .catch(() => {});
  }, [roadmapId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/roadmaps/${roadmapId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });
      if (res.ok) {
        const created: Comment = await res.json();
        setComments((prev) => [created, ...prev]);
        setContent("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card p-6">
      <h2 className="font-display text-xl font-semibold">
        💬 Discussion{" "}
        <span className="text-sm font-normal text-muted">({comments.length})</span>
      </h2>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="cr-input"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ask a question or share your thoughts…"
          rows={3}
          required
          className="cr-input"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="btn-primary rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted">Be the first to start the discussion.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{c.author}</span>
                <span className="text-xs text-muted">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
