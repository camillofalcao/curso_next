'use client'

import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();

    return (
      <div>
        <h1 className="text-2xl">Esta é a página <strong>Teste 1</strong></h1>
        <p>Rota: <strong>{pathname}</strong></p>
      </div>
    );
}