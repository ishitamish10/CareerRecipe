import { NextResponse } from "next/server";
import { createRoadmap, listRoadmaps } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import type { RoadmapInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUIRED_FIELDS: (keyof RoadmapInput)[] = [
  "title",
  "field",
  "description",
  "successes",
  "challenges",
  "lessons",
  "tips",
];

export async function GET() {
  const roadmaps = await listRoadmaps();
  return NextResponse.json(roadmaps);
}

export async function POST(request: Request) {
  // Only signed-in professionals may publish career recipes.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to share a recipe" }, { status: 401 });
  }
  if (user.role !== "professional") {
    return NextResponse.json(
      { error: "Only professional accounts can publish recipes" },
      { status: 403 },
    );
  }

  let body: Partial<RoadmapInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((f) => !body[f]?.trim());
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  const roadmap = await createRoadmap({
    title: body.title!.trim(),
    field: body.field!.trim(),
    duration: body.duration?.trim() || "",
    description: body.description!.trim(),
    successes: body.successes!.trim(),
    challenges: body.challenges!.trim(),
    lessons: body.lessons!.trim(),
    tips: body.tips!.trim(),
    authorId: user.id,
    authorName: user.name,
  });

  return NextResponse.json(roadmap, { status: 201 });
}
