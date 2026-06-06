import { NextResponse } from "next/server";
import { getRoadmap } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const roadmap = await getRoadmap(id);
  if (!roadmap) {
    return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  }
  return NextResponse.json(roadmap);
}
