'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();

    return (
      <div>
        <h1 className="text-2xl">Esta é a <strong>Home page</strong></h1>
        <p>Rota: <strong>{pathname}</strong></p>

        <h4>Links:</h4>
        <ul className="underline ml-2">
          <li><Link href="/teste/1">/teste/1</Link></li>
          <li><Link href="/teste-com-2/1/2">/teste-com-2/1/2</Link></li>
          <li><Link href="/teste-1">/teste-1</Link></li>
          <li><Link href="/teste-2">/teste-2</Link></li>
          <li><Link href="/apresentar/1/2/3/4/5">/apresentar/1/2/3/4/5</Link></li>
          <li><Link href="/formatar/Teste?formato=negrito&formato=italico&aspas=true">/formatar/Teste?formato=negrito&formato=italico&aspas=true</Link></li>
        </ul>
      </div>
    );
}
