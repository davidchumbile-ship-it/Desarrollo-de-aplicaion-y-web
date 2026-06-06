import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const author = await prisma.author.findUnique({
      where: { id: params.id },
      include: { books: true },
    });
    if (!author)
      return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 });
    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener autor" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const author = await prisma.author.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar autor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.author.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Autor eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar autor" }, { status: 500 });
  }
}