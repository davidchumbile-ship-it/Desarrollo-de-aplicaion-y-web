import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rick and Morty - Next.js",
  description: "Explora los personajes de Rick and Morty",
};

export default function RickAndMortyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black">
      <nav className="bg-black bg-opacity-40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">
          <Link href="/rickandmorty" className="text-green-400 text-2xl font-bold hover:text-green-300 transition">
            🛸 Rick & Morty
          </Link>
          <Link href="/rickandmorty/search" className="text-white text-lg hover:text-green-300 transition mt-1">
            🔍 Buscar
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}