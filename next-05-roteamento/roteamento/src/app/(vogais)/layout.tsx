import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha aplicação Next.js",
  description: "Aplicação para demonstrar o roteamento e layouts no Next.js",
};

export default function VogalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <h1 className="text-3xl font-bold bg-orange-300">Vogais aqui</h1>
        {children}
        <footer className="text-3xl font-bold bg-orange-300">Fim do componente vogal</footer>
    </>
  );
}