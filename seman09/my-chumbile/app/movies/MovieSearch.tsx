'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Movie {
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
}

interface MovieDetails extends Movie {
    Plot: string
    Director: string
    Actors: string
    Genre: string
    Runtime: string
    imdbRating: string
}

const API_KEY = 'c7058f8c'

export default function MovieSearch() {
    const [query, setQuery] = useState('')
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true)
                try {
                    const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
                    if (response.data.Search) {
                        setMovies(response.data.Search)
                    } else {
                        setMovies([])
                    }
                } catch (error) {
                    console.error("Error fetching movies:", error)
                }
                setLoading(false)
            } else if (query.length === 0) {
                setMovies([])
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const fetchDetails = async (id: string) => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
            setSelectedMovie(response.data)
            setIsModalOpen(true)
        } catch (error) {
            console.error("Error fetching details:", error)
        }
    }

    return (
        <div className="mt-12">
            <div className="relative max-w-xl mx-auto mb-12">
                <input
                    type="text"
                    placeholder="Busca películas o series..."
                    className="w-full p-4 pl-12 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-transparent focus:border-indigo-500 shadow-lg text-gray-800 dark:text-white transition-all outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>

            {movies.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-indigo-500 pl-4">
                        Resultados de búsqueda
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies.map((movie) => (
                            <div
                                key={movie.imdbID}
                                onClick={() => fetchDetails(movie.imdbID)}
                                className="group relative bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                            >
                                <div className="aspect-[2/3] overflow-hidden">
                                    <img
                                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450?text=Sin+Imagen'}
                                        alt={movie.Title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{movie.Title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{movie.Year} • {movie.Type}</p>
                                </div>
                                <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de Detalles */}
            {isModalOpen && selectedMovie && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-full text-2xl hover:bg-red-500 hover:text-white transition-colors z-10"
                        >
                            ×
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3">
                                <img
                                    src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://placehold.co/400x600?text=Sin+Imagen'}
                                    alt={selectedMovie.Title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-2/3 p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedMovie.Genre.split(',').map(g => (
                                        <span key={g} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {g.trim()}
                                        </span>
                                    ))}
                                    <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                                        ⭐ {selectedMovie.imdbRating}
                                    </span>
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                                    {selectedMovie.Title}
                                </h2>
                                <p className="text-lg text-gray-500 dark:text-zinc-400 mb-6 font-medium">
                                    {selectedMovie.Year} • {selectedMovie.Runtime}
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Sinopsis</h4>
                                        <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">
                                            {selectedMovie.Plot}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">Director</h4>
                                            <p className="text-gray-600 dark:text-zinc-400">{selectedMovie.Director}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">Actores</h4>
                                            <p className="text-gray-600 dark:text-zinc-400">{selectedMovie.Actors}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}