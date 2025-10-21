import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minha aplicação Next.js",
  description: "Aplicação para demonstrar o roteamento e layouts no Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
      >
        <h1 className="text-3xl font-bold bg-blue-300">Esta é a minha aplicação Next.js</h1>
          {children}
        <footer className="text-3xl font-bold bg-blue-300">Fim da aplicação</footer>
      </body>
    </html>
  );
}