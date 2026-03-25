import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "E-Mail bereits vergeben." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name: name || email.split("@")[0], password: hashed },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    console.error("[register]", e);
    return NextResponse.json({ error: "Serverfehler.", detail: String(e) }, { status: 500 });
  }
}
