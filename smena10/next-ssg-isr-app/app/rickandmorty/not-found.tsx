import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-6xl font-bold mb-4">404</h2>
      <p className="text-2xl mb-2">Personaje no encontrado</p>
      <p className="text-gray-300 mb-8">
        El personaje que buscas no existe.
      </p>
      <Link
        href="/rickandmorty"
        className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        ← Volver a personajes
      </Link>
    </div>
  );
}