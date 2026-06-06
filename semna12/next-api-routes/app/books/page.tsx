"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  pages: number;
  authorId: string;
  author: Author;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    title: "", description: "", isbn: "", publishedYear: "",
    genre: "", pages: "", authorId: "",
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      sortBy,
      order,
      ...(search && { search }),
      ...(genre && { genre }),
      ...(authorFilter && { authorName: authorFilter }),
    });
    const res = await fetch(`/api/books/search?${params}`);
    const data = await res.json();
    setBooks(data.data);
    setPagination(data.pagination);
    setLoading(false);
  }, [search, genre, authorFilter, sortBy, order, page]);

  const fetchAuthors = async () => {
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
  };

  useEffect(() => { fetchAuthors(); }, []);
  useEffect(() => {
    const timeout = setTimeout(() => fetchBooks(), 400);
    return () => clearTimeout(timeout);
  }, [fetchBooks]);

  const handleSubmit = async () => {
    const method = editingBook ? "PUT" : "POST";
    const url = editingBook ? `/api/books/${editingBook.id}` : "/api/books";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        publishedYear: parseInt(form.publishedYear),
        pages: parseInt(form.pages),
      }),
    });
    setForm({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" });
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      description: book.description || "",
      isbn: book.isbn || "",
      publishedYear: book.publishedYear?.toString() || "",
      genre: book.genre || "",
      pages: book.pages?.toString() || "",
      authorId: book.authorId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar libro?")) return;
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    fetchBooks();
  };

  const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">📖 Libros</h1>
            <p className="text-gray-400 mt-1">Busca, filtra y gestiona libros</p>
          </div>
          <div className="flex gap-3">
            <Link href="/"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition">
              ← Dashboard
            </Link>
            <button onClick={() => { setShowForm(true); setEditingBook(null); setForm({ title: "", description: "", isbn: "", publishedYear: "", genre: "", pages: "", authorId: "" }); }}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              + Nuevo Libro
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">
              {editingBook ? "Editar Libro" : "Nuevo Libro"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Título", key: "title", type: "text" },
                { label: "ISBN", key: "isbn", type: "text" },
                { label: "Año de publicación", key: "publishedYear", type: "number" },
                { label: "Género", key: "genre", type: "text" },
                { label: "Páginas", key: "pages", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm text-gray-400 mb-1 block">{label}</label>
                  <input type={type} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Autor</label>
                <select value={form.authorId}
                  onChange={(e) => setForm({ ...form, authorId: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                  <option value="">Seleccionar autor</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">Descripción</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg text-sm font-medium transition">
                {editingBook ? "Guardar cambios" : "Crear libro"}
              </button>
              <button onClick={() => { setShowForm(false); setEditingBook(null); }}
                className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6 border border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Buscar título</label>
              <input type="text" value={search} placeholder="Buscar..."
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Género</label>
              <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="">Todos</option>
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Autor</label>
              <select value={authorFilter} onChange={(e) => { setAuthorFilter(e.target.value); setPage(1); }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                <option value="">Todos</option>
                {authors.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Ordenar por</label>
              <div className="flex gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                  <option value="createdAt">Fecha</option>
                  <option value="title">Título</option>
                  <option value="publishedYear">Año</option>
                </select>
                <select value={order} onChange={(e) => setOrder(e.target.value)}
                  className="w-20 bg-gray-700 border border-gray-600 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-indigo-500">
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {pagination && (
          <p className="text-gray-400 text-sm mb-4">
            {pagination.total} resultado(s) encontrado(s)
          </p>
        )}

        {/* Books list */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando libros...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400">No se encontraron libros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <div key={book.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-indigo-400 text-sm">por {book.author?.name}</p>
                    <div className="flex gap-3 mt-1 text-gray-500 text-xs">
                      {book.genre && <span>🏷 {book.genre}</span>}
                      {book.publishedYear && <span>📅 {book.publishedYear}</span>}
                      {book.pages && <span>📄 {book.pages} págs.</span>}
                    </div>
                    {book.description && (
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{book.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => handleEdit(book)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs transition">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(book.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button disabled={!pagination.hasPrev}
              onClick={() => setPage(page - 1)}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm transition">
              ← Anterior
            </button>
            <span className="text-gray-400 text-sm">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button disabled={!pagination.hasNext}
              onClick={() => setPage(page + 1)}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm transition">
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}