import Image from "next/image";
import Link from "next/link";
import { RickAndMortyResponse } from "@/types/rickandmorty";

async function getCharacters() {
  const res = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "force-cache", // SSG - caché forzado
  });
  if (!res.ok) throw new Error("Error al cargar personajes");
  const data: RickAndMortyResponse = await res.json();
  return data.results;
}

const statusColor: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

export default async function RickAndMortyList() {
  const characters = await getCharacters();

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-2">
          🛸 Personajes (SSG)
        </h1>
        <p className="text-gray-400 mb-8">Mostrando los primeros 20 personajes</p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/rickandmorty/${character.id}`}
              className="transform transition hover:scale-105"
            >
              <div className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer">
                <Image
                  width={200}
                  height={200}
                  src={character.image}
                  alt={character.name}
                  className="w-full h-48 object-cover"
                  priority={false} // Lazy Loading
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold capitalize">{character.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-3 h-3 rounded-full ${statusColor[character.status]}`} />
                    <span className="text-gray-300 text-sm">{character.status} - {character.species}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">📍 {character.location.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}