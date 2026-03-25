import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, folderId } = await req.json();
  const note = await prisma.note.create({
    data: {
      title: title ?? "Neue Notiz",
      content: content ?? "",
      folderId: folderId ?? null,
      userId: session.user.id,
    },
  });
  return NextResponse.json(note, { status: 201 });
}
