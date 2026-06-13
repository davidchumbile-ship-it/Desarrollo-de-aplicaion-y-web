"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCredentials = async () => {
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) setError(res.error);
    else window.location.href = "/dashboard";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2 rounded w-72"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-4 py-2 rounded w-72"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleCredentials}
        className="bg-blue-600 text-white px-6 py-2 rounded w-72 hover:bg-blue-700"
      >
        Iniciar sesión
      </button>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex items-center gap-3 border px-6 py-2 rounded w-72 hover:bg-gray-100"
      >
        <FcGoogle size={22} /> Continuar con Google
      </button>

      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="flex items-center gap-3 border px-6 py-2 rounded w-72 hover:bg-gray-100"
      >
        <FaGithub size={22} /> Continuar con GitHub
      </button>

      <Link href="/register" className="text-blue-500 text-sm hover:underline">
        ¿No tienes cuenta? Regístrate
      </Link>
    </main>
  );
}