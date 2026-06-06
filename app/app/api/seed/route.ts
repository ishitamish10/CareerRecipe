import { NextResponse } from "next/server";
import { seed, usingAzure } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * POST /api/seed — idempotently load the sample recipes into the active
 * backend. Handy right after provisioning a fresh Azure Storage account.
 */
export async function POST() {
  const result = await seed();
  return NextResponse.json({ ...result, backend: usingAzure ? "azure" : "memory" });
}
