import { Suspense } from "react";
import { ExploreClient } from "./ExploreClient";

export const dynamic = "force-dynamic";

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-muted">Loading…</div>}>
      <ExploreClient />
    </Suspense>
  );
}
