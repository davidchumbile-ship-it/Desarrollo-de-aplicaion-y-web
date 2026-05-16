import axios from 'axios'
import MovieSearch from './MovieSearch'

interface Movie {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
}

const API_KEY = 'c7058f8c'

async function getPopularMovies(): Promise<Movie[]> {
    try {
        const searches = ['avengers', 'batman', 'spider-man']
        const results = await Promise.all(
            searches.map(q =>
                axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${q}`)
                    .then(r => r.data.Search?.slice(0, 4) || [])
            )
        )
        return results.flat()
    } catch (error) {
        console.error("Error fetching popular movies:", error)
        return []
    }
}

export default async function MovieGallery() {
    const popularMovies = await getPopularMovies()

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">
                            MOVIE<span className="text-indigo-600">HUB</span>
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-zinc-400 mt-2 font-medium">
                            Explora lo mejor del cine y la televisión.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="px-4 py-2 bg-indigo-600/10 rounded-full border border-indigo-600/20 text-indigo-600 text-sm font-bold">
                            ⚡ SSR + CSR Powered
                        </div>
                    </div>
                </header>

                <MovieSearch />

                <section className="mt-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Tendencias Populares</h2>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SSR Content</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {popularMovies.map((movie) => (
                            <div key={movie.imdbID} className="group flex flex-col">
                                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl mb-4 bg-zinc-200 dark:bg-zinc-800 transition-all duration-500 group-hover:shadow-indigo-500/20 group-hover:translate-y-[-8px]">
                                    <img
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450?text=No+Poster'}
                                        alt={movie.Title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                        <p className="text-white font-bold text-lg leading-tight mb-1">{movie.Title}</p>
                                        <p className="text-gray-300 text-sm">{movie.Year}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg transform rotate-3">
                                        HOT
                                    </div>
                                </div>
                                <div className="px-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{movie.Title}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{movie.Year} • {movie.Type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="mt-24 pt-12 border-t border-gray-200 dark:border-zinc-800 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 mb-1">SSR</p>
                                <p className="text-sm text-gray-800 dark:text-zinc-300">Initial Load</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 mb-1">CSR</p>
                                <p className="text-sm text-gray-800 dark:text-zinc-300">Live Search</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs">
                            © 2026 MovieHub - Aplicaciones Web Avanzadas
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}