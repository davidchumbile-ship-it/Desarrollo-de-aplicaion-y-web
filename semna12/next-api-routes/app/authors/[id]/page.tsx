"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  genre: string;
  publishedYear: number;
  pages: number;
  description: string;
}

interface Author {
  id: string;
  name: string;
  email: string;
  nationality: string;
  birthYear: number;
  bio: string;
  books: Book[];
}

interface Stats {
  authorId: string;
  authorName: string;
  totalBooks: number;
  firstBook: { title: string; year: number } | null;
  latestBook: { title: string; year: number } | null;
  averagePages: number;
  genres: string[];
  longestBook: { title: string; pages: number } | null;
  shortestBook: { title: string; pages: number } | null;
}

export default function AuthorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", nationality: "", birthYear: "", bio: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [authorRes, statsRes] = await Promise.all([
      fetch(`/api/authors/${id}`),
      fetch(`/api/authors/${id}/stats`),
    ]);
    const authorData = await authorRes.json();
    const statsData = await statsRes.json();
    setAuthor(authorData);
    setStats(statsData);
    setForm({
      name: authorData.name,
      email: authorData.email,
      nationality: authorData.nationality || "",
      birthYear: authorData.birthYear?.toString() || "",
      bio: authorData.bio || "",
    });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/authors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, birthYear: parseInt(form.birthYear) }),
    });
    setEditing(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar autor y todos sus libros?")) return;
    await fetch(`/api/authors/${id}`, { method: "DELETE" });
    router.push("/");
  };

  if (loading) return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Cargando...</p>
    </main>
  );

  if (!author) return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Autor no encontrado</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition">
            ← Dashboard
          </Link>
          <div className="flex gap-3">
            <button onClick={() => setEditing(!editing)}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              {editing ? "Cancelar" : "Editar"}
            </button>
            <button onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Eliminar
            </button>
          </div>
        </div>

        {/* Author info */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          {editing ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Editar Autor</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Nombre", key: "name", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Nacionalidad", key: "nationality", type: "text" },
                  { label: "Año de nacimiento", key: "birthYear", type: "number" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-sm text-gray-400 mb-1 block">{label}</label>
                    <input type={type} value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="text-sm text-gray-400 mb-1 block">Biografía</label>
                  <textarea value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                    rows={3} />
                </div>
              </div>
              <button onClick={handleUpdate}
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-sm font-medium transition">
                Guardar cambios
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{author.name}</h1>
              <p className="text-gray-400 mt-1">{author.email}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                {author.nationality && <span>🌍 {author.nationality}</span>}
                {author.birthYear && <span>🎂 {author.birthYear}</span>}
              </div>
              {author.bio && <p className="text-gray-300 mt-4">{author.bio}</p>}
            </>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 Estadísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs">Total libros</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.totalBooks}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs">Promedio páginas</p>
                <p className="text-3xl font-bold text-indigo-400 mt-1">{stats.averagePages}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs">Géneros</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">{stats.genres.length}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-xs">Géneros escritos</p>
                <p className="text-sm text-gray-300 mt-1">{stats.genres.join(", ") || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.firstBook && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-xs mb-1">📅 Primer libro</p>
                  <p className="font-medium">{stats.firstBook.title}</p>
                  <p className="text-gray-500 text-sm">{stats.firstBook.year}</p>
                </div>
              )}
              {stats.latestBook && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-xs mb-1">🆕 Último libro</p>
                  <p className="font-medium">{stats.latestBook.title}</p>
                  <p className="text-gray-500 text-sm">{stats.latestBook.year}</p>
                </div>
              )}
              {stats.longestBook && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-xs mb-1">📖 Libro más largo</p>
                  <p className="font-medium">{stats.longestBook.title}</p>
                  <p className="text-gray-500 text-sm">{stats.longestBook.pages} páginas</p>
                </div>
              )}
              {stats.shortestBook && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 text-xs mb-1">📕 Libro más corto</p>
                  <p className="font-medium">{stats.shortestBook.title}</p>
                  <p className="text-gray-500 text-sm">{stats.shortestBook.pages} páginas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Books list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">📚 Libros del autor</h2>
          {author.books.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <p className="text-gray-400">Este autor no tiene libros aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {author.books.map((book) => (
                <div key={book.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-500 transition">
                  <h3 className="font-semibold">{book.title}</h3>
                  <div className="flex gap-3 mt-1 text-gray-500 text-xs">
                    {book.genre && <span>🏷 {book.genre}</span>}
                    {book.publishedYear && <span>📅 {book.publishedYear}</span>}
                    {book.pages && <span>📄 {book.pages} págs.</span>}
                  </div>
                  {book.description && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{book.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}