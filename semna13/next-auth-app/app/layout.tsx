import type { Metadata } from "next";
import "./globals.css";
import NextAuthSessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Next Auth App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  );
}