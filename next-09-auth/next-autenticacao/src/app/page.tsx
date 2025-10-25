'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function HomePage() {
  const [dadosUsuario, setDadosUsuario] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setDadosUsuario(JSON.stringify(data, null, 4));
      });
  }, []);

  function logoff() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-r from-sky-600 to-gray-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold">Next‑Auth — Demonstração</h1>
          <p className="mt-2 text-slate-100 max-w-2xl">
            Exemplo didático de autenticação e autorização com next-auth. Use o provider de Credentials
            ou GitHub para experimentar fluxos de login e chamadas a API protegidas.
          </p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Navegação</h2>

          <ul className="grid gap-3">
            <li>
              <Link href="/pages/restrict/teste1-client" className="block p-3 rounded-lg border border-slate-100 hover:shadow">
                Área protegida - Client Component (exemplo) — /pages/restrict/teste1-client
              </Link>
            </li>

            <li>
              <Link href="/pages/restrict/teste1-server" className="block p-3 rounded-lg border border-slate-100 hover:shadow">
                Área protegida - Server Component (exemplo) — /pages/restrict/teste1-server
              </Link>
            </li>

            <li>
              <Link href="/pages/teste2" className="block p-3 rounded-lg border border-slate-100 hover:shadow">
                Área NÃO protegida (exemplo) — /teste2
              </Link>
            </li>

            <li>
              <Link href="/pages/auth/signin" className="block p-3 rounded-lg border border-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400">
                Página de login — /pages/auth/signin
              </Link>
            </li>

            <li>
              <button onClick={logoff} className="block p-3 rounded-lg border border-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400">
                Página de logout — /pages/auth/signoff
              </button>
            </li>

            <li>
              <label>Dados do Usuário</label>
              <div className="block p-3 h-70 rounded-lg bg-black text-white text-small overflow-auto h-24">
                <pre><code id="json-output">{dadosUsuario}</code></pre>
              </div>
            </li>

          </ul>

          <div className="mt-6 border-t pt-6 text-sm text-slate-600">
            <h3 className="font-medium">O que este projeto demonstra</h3>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Uso do next-auth com Credentials + GitHub.</li>
              <li>Emissão de JWT para apps externos (endpoint /api/auth/login).</li>
              <li>Proteção de rotas e Server Actions (middleware / requireAuth).</li>
            </ul>
          </div>
        </div>

        <aside className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold">Credenciais de teste</h2>
          <p className="mt-2 text-sm text-slate-600">Use para testes rápidos:</p>

          <div className="mt-3 flex flex-col gap-2">
            <div className="inline-flex items-center gap-3 bg-sky-50 text-sky-800 px-3 py-2 rounded">
              <strong className="w-20">E-mail</strong>
              <span>teste@email.com</span>
            </div>

            <div className="inline-flex items-center gap-3 bg-amber-50 text-amber-800 px-3 py-2 rounded">
              <strong className="w-20">Senha</strong>
              <span>123456</span>
            </div>
          </div>

          <div className="mt-5 text-sm text-slate-600">
            <h3 className="text-lg text-sky-800">Para aplicativos (mobile / externo):</h3>
            <p className="mt-2">Faça POST em <code className="bg-slate-100 px-1 rounded">/api/auth/login</code> com JSON:</p>

            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-auto">
{`fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'teste@email.com', password: '123456' })
})`}
            </pre>

            <p className="mt-3">Em chamadas protegidas, envie o header:</p>

            <pre className="mt-2 bg-slate-900 text-slate-100 text-xs rounded p-3">Authorization: Bearer &lt;token&gt;</pre>

            <p className="mt-3">No browser, você pode guardar o token no local storage, porém alterar o login para retornar um cookie HttpOnly seria mais seguro.</p>

            <p className="mt-3">Exemplo de GET utilizando token previamente armazenado no local storage:</p>
            
            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-auto">
              {`const token = localStorage.getItem('token')

const response = await fetch('/api/restrict/ola/Brasil', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
    })
})`}
            </pre>

            <p className="mt-3">Exemplo de POST utilizando token previamente armazenado no local storage (este endpoint não está implementado neste projeto):</p>
            
            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-auto">
              {`const token = localStorage.getItem('token')

const response = await fetch('/api/restrict/produtos', {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({"codigo": "1", "descricao": "Produto 1", "preco": 1.2})
})`}
            </pre>

          </div>
        </aside>
      </section>

      <footer className="max-w-6xl mx-auto px-6 mt-8 pb-12 text-center text-sm text-slate-500">
        Projeto de exemplo — Next.js + next-auth.
      </footer>
    </main>
  );
}
