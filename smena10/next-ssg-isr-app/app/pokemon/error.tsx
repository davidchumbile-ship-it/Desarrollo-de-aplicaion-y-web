"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl font-bold mb-4">⚠️ Algo salió mal</h2>
      <p className="text-gray-300 mb-8">{error.message}</p>
      <button
        onClick={reset}
        className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}