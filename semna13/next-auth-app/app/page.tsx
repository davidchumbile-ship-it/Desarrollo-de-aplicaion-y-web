import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Bienvenido</h1>
      <Link href="/signIn" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        Iniciar sesión
      </Link>
    </main>
  );
}