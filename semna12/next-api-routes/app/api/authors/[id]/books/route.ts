import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const books = await prisma.book.findMany({
      where: { authorId: params.id },
      include: { author: true },
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener libros del autor" },
      { status: 500 }
    );
  }
}