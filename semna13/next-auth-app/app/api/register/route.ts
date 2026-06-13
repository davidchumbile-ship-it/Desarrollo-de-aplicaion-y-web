import { NextResponse } from "next/server";
import { registerUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await registerUser(name, email, password);
    return NextResponse.json({ message: "Usuario registrado" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}