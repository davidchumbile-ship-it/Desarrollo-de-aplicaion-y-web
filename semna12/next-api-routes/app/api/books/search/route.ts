import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const authorName = searchParams.get("authorName") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const validSortFields = ["title", "publishedYear", "createdAt"];
    const orderBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const where = {
      ...(search && {
        title: { contains: search, mode: "insensitive" as const },
      }),
      ...(genre && { genre }),
      ...(authorName && {
        author: {
          name: { contains: authorName, mode: "insensitive" as const },
        },
      }),
    };

    const total = await prisma.book.count({ where });
    const totalPages = Math.ceil(total / limit);

    const books = await prisma.book.findMany({
      where,
      include: { author: true },
      orderBy: { [orderBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en la búsqueda" },
      { status: 500 }
    );
  }
}