"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Registro exitoso. Redirigiendo...");
      setTimeout(() => router.push("/signIn"), 1500);
    } else {
      setMessage(data.error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Registro</h1>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-4 py-2 rounded w-72"
      />
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
      {message && <p className="text-sm text-blue-600">{message}</p>}
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-6 py-2 rounded w-72 hover:bg-green-700"
      >
        Registrarse
      </button>
    </main>
  );
}