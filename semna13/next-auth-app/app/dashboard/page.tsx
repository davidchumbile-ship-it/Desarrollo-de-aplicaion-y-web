import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/signIn");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Bienvenido, {session.user?.name}</p>
      <LogoutButton />
    </main>
  );
}