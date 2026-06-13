import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Profile() {
  const session = await getServerSession();
  if (!session) redirect("/signIn");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Perfil</h1>
      {session.user?.image && (
        <Image src={session.user.image} alt="avatar" width={80} height={80} className="rounded-full" />
      )}
      <p>{session.user?.name}</p>
      <p>{session.user?.email}</p>
    </main>
  );
}