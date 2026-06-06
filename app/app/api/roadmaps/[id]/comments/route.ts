import { NextResponse } from "next/server";
import { addComment, listComments } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const comments = await listComments(id);
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: { author?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
  }

  const comment = await addComment(id, body.author ?? "Anonymous", body.content);
  if (!comment) {
    return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  }
  return NextResponse.json(comment, { status: 201 });
}
