"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
  genre: string;
  publishedYear: number;
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

export default function Home() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", nationality: "", birthYear: "", bio: "",
  });

  const fetchAuthors = async () => {
    setLoading(true);
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleSubmit = async () => {
    const method = editingAuthor ? "PUT" : "POST";
    const url = editingAuthor ? `/api/authors/${editingAuthor.id}` : "/api/authors";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, birthYear: parseInt(form.birthYear) }),
    });
    setForm({ name: "", email: "", nationality: "", birthYear: "", bio: "" });
    setShowForm(false);
    setEditingAuthor(null);
    fetchAuthors();
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setForm({
      name: author.name,
      email: author.email,
      nationality: author.nationality || "",
      birthYear: author.birthYear?.toString() || "",
      bio: author.bio || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar autor?")) return;
    await fetch(`/api/authors/${id}`, { method: "DELETE" });
    fetchAuthors();
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📚 Biblioteca</h1>
            <p className="text-gray-400 mt-1">Sistema de gestión de autores y libros</p>
          </div>
          <div className="flex gap-3">
            <Link href="/books"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Ver Libros
            </Link>
            <button onClick={() => { setShowForm(true); setEditingAuthor(null); setForm({ name: "", email: "", nationality: "", birthYear: "", bio: "" }); }}
              className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              + Nuevo Autor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Autores</p>
            <p className="text-4xl font-bold text-emerald-400 mt-1">{authors.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Libros</p>
            <p className="text-4xl font-bold text-indigo-400 mt-1">
              {authors.reduce((acc, a) => acc + a.books.length, 0)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <p className="text-gray-400 text-sm">Nacionalidades</p>
            <p className="text-4xl font-bold text-purple-400 mt-1">
              {new Set(authors.map((a) => a.nationality).filter(Boolean)).size}
            </p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">
              {editingAuthor ? "Editar Autor" : "Nuevo Autor"}
            </h2>
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-sm text-gray-400 mb-1 block">Biografía</label>
                <textarea value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-lg text-sm font-medium transition">
                {editingAuthor ? "Guardar cambios" : "Crear autor"}
              </button>
              <button onClick={() => { setShowForm(false); setEditingAuthor(null); }}
                className="bg-gray-600 hover:bg-gray-500 px-5 py-2 rounded-lg text-sm font-medium transition">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Authors list */}
        {loading ? (
          <p className="text-gray-400 text-center py-12">Cargando autores...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {authors.map((author) => (
              <div key={author.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{author.name}</h3>
                    <p className="text-gray-400 text-sm">{author.email}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {author.nationality} {author.birthYear && `· ${author.birthYear}`}
                    </p>
                    {author.bio && <p className="text-gray-400 text-sm mt-2 line-clamp-2">{author.bio}</p>}
                    <p className="text-indigo-400 text-sm mt-2">📖 {author.books.length} libro(s)</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/authors/${author.id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-xs text-center transition">
                      Ver detalle
                    </Link>
                    <button onClick={() => handleEdit(author)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs transition">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(author.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}