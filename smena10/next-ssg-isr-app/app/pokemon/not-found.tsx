import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-6xl font-bold mb-4">404</h2>
      <p className="text-2xl mb-2">Pokémon no encontrado</p>
      <p className="text-gray-300 mb-8">
        El Pokémon que buscas no existe en la Pokédex.
      </p>
      <Link
        href="/pokemon"
        className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        ← Volver al Pokédex
      </Link>
    </div>
  );
}