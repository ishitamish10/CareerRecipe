import { NextResponse } from "next/server";
import { markHelpful } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const helpful = await markHelpful(id);
  if (helpful === null) {
    return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  }
  return NextResponse.json({ helpful });
}
