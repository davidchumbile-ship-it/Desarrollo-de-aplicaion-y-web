"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RickAndMortyCharacter, RickAndMortyResponse } from "@/types/rickandmorty";

export default function SearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [characters, setCharacters] = useState<RickAndMortyCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (status) params.append("status", status);
        if (type) params.append("type", type);
        if (gender) params.append("gender", gender);

        const res = await fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`);
        if (!res.ok) {
          setCharacters([]);
          setError("No se encontraron personajes.");
          return;
        }
        const data: RickAndMortyResponse = await res.json();
        setCharacters(data.results);
      } catch {
        setError("Error al buscar personajes.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [name, status, type, gender]); // CSR: se ejecuta cada vez que cambia un filtro

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-8">🔍 Búsqueda (CSR)</h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="Nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-green-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-green-400"
          >
            <option value="">Estado</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="text"
            placeholder="Tipo..."
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-green-400"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-green-400 focus:outline-none"
          >
            <option value="">Género</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Resultados */}
        {loading && <p className="text-green-400 text-center text-xl">Cargando...</p>}
        {error && <p className="text-red-400 text-center text-xl">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Link key={character.id} href={`/rickandmorty/${character.id}`} className="transform transition hover:scale-105">
              <div className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden">
                <Image
                  width={200} height={200}
                  src={character.image}
                  alt={character.name}
                  className="w-full h-48 object-cover"
                  priority={false}
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold">{character.name}</h2>
                  <p className="text-gray-400 text-sm">{character.status} - {character.species}</p>
                  <p className="text-gray-400 text-sm">⚧ {character.gender}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}