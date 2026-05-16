import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <main className="max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
        <div className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Pokémon App
          </h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
            Explora la diferencia entre Renderizado en el Cliente (CSR) y Renderizado en el Servidor (SSR) usando la PokéAPI.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CSR Card */}
            <Link href="/pokemon-csr" className="group">
              <div className="h-full p-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-100 dark:border-blue-800 transition-all hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2">Pokémon CSR</h2>
                <p className="text-blue-600 dark:text-blue-300">
                  Client-Side Rendering: Los datos se cargan en el navegador.
                </p>
                <div className="mt-6 font-semibold text-blue-700 dark:text-blue-400 group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Ver CSR →
                </div>
              </div>
            </Link>

            {/* SSR Card */}
            <Link href="/pokemon-ssr" className="group">
              <div className="h-full p-8 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-100 dark:border-green-800 transition-all hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-4">⚡</div>
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Pokémon SSR</h2>
                <p className="text-green-600 dark:text-green-300">
                  Server-Side Rendering: Los datos se cargan en el servidor.
                </p>
                <div className="mt-6 font-semibold text-green-700 dark:text-green-400 group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Ver SSR →
                </div>
              </div>
            </Link>

            {/* Movie Gallery Card */}
            <Link href="/movies" className="group">
              <div className="h-full p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-2 border-indigo-100 dark:border-indigo-800 transition-all hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-400 mb-2">Galería OMDb</h2>
                <p className="text-indigo-600 dark:text-indigo-300">
                  Actividad Integradora: Galería de películas híbrida (SSR + CSR).
                </p>
                <div className="mt-6 font-semibold text-indigo-700 dark:text-indigo-400 group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Ir a la Galería →
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 border-t border-gray-200 dark:border-zinc-800 text-center">
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Desarrollado para el curso de Aplicaciones Web Avanzadas
          </p>
        </div>
      </main>
    </div>
  );
}
