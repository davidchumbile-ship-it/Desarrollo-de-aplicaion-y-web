import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: { author: true },
    });
    if (!book)
      return NextResponse.json({ error: "Libro no encontrado" }, { status: 404 });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener libro" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const book = await prisma.book.update({
      where: { id: params.id },
      data: body,
      include: { author: true },
    });
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar libro" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.book.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Libro eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar libro" }, { status: 500 });
  }
}