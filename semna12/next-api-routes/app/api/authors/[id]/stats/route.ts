import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!author)
      return NextResponse.json({ error: "Autor no encontrado" }, { status: 404 });

    const books = author.books;
    const totalBooks = books.length;
    const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];
    const avgPages =
      totalBooks > 0
        ? Math.round(books.reduce((acc, b) => acc + (b.pages || 0), 0) / totalBooks)
        : 0;
    const oldestBook = books.reduce(
      (min, b) =>
        b.publishedYear && (!min || b.publishedYear < min) ? b.publishedYear : min,
      null as number | null
    );
    const newestBook = books.reduce(
      (max, b) =>
        b.publishedYear && (!max || b.publishedYear > max) ? b.publishedYear : max,
      null as number | null
    );

    return NextResponse.json({
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        nationality: author.nationality,
        birthYear: author.birthYear,
      },
      stats: {
        totalBooks,
        genres,
        avgPages,
        oldestBook,
        newestBook,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
