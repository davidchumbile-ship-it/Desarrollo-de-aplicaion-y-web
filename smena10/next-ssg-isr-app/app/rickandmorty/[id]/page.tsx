import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RickAndMortyCharacter, RickAndMortyResponse } from "@/types/rickandmorty";

interface Props {
  params: { id: string };
}

async function getCharacter(id: string): Promise<RickAndMortyCharacter> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 }, // ISR - revalida cada 10 días
  });
  if (!res.ok) notFound();
  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch("https://rickandmortyapi.com/api/character");
  const data: RickAndMortyResponse = await res.json();
  return data.results.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} - Rick & Morty`,
    description: `${character.species} - ${character.status}`,
  };
}

const statusColor: Record<string, string> = {
  Alive: "text-green-500",
  Dead: "text-red-500",
  unknown: "text-gray-400",
};

export default async function CharacterDetail({ params }: Props) {
  const { id } = await params;
  const character = await getCharacter(id);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        <div className="flex flex-col md:flex-row">
          <Image
            width={400} height={400}
            src={character.image}
            alt={character.name}
            className="w-full md:w-80 h-80 object-cover"
          />
          <div className="p-8 flex-1">
            <h1 className="text-4xl font-bold text-green-400 mb-6">{character.name}</h1>

            <div className="space-y-3">
              <p><span className="text-gray-400 font-semibold">Estado:</span>{" "}
                <span className={`font-bold ${statusColor[character.status]}`}>{character.status}</span>
              </p>
              <p><span className="text-gray-400 font-semibold">Especie:</span> {character.species}</p>
              <p><span className="text-gray-400 font-semibold">Tipo:</span> {character.type || "N/A"}</p>
              <p><span className="text-gray-400 font-semibold">Género:</span> {character.gender}</p>
              <p><span className="text-gray-400 font-semibold">Origen:</span> {character.origin.name}</p>
              <p><span className="text-gray-400 font-semibold">Ubicación:</span> {character.location.name}</p>
              <p><span className="text-gray-400 font-semibold">Episodios:</span> {character.episode.length}</p>
              <p><span className="text-gray-400 font-semibold">Creado:</span>{" "}
                {new Date(character.created).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gray-900">
          <Link href="/rickandmorty" className="inline-block bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition">
            ← Volver a personajes
          </Link>
        </div>
      </div>
    </div>
  );
}