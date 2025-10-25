"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      return;
    }

    const destination = result?.url ?? callbackUrl;
    router.push(destination);
  }

  function preencherPadrao() {
    if (email === 'teste@email.com') {
      setEmail('admin@email.com');
    } else {
      setEmail('teste@email.com');
    }

    setPassword('123456');
  }

  return (
    <main className="max-w-md mx-auto mt-12 px-5 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-semibold mb-2">Login</h1>
        <p className="text-gray-700 mt-0">
          Faça login para acessar as áreas protegidas. Após o login você será redirecionado para a página solicitada.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block mb-2">
            <div className="text-sm mb-1">E-mail</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-3">
            <div className="text-sm mb-1">Senha</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {error && (
            <div className="text-red-600 mb-3 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2">
          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            Entrar com GitHub
          </button>

          <div onClick={() => preencherPadrao()} className="ml-auto text-xs text-gray-600 border border-gray p-2 rounded-md">
            <strong>Clique aqui para teste rápido:</strong>
            <div>email: {email === 'teste@email.com' ? 'admin' : 'teste'}@email.com</div>
            <div>senha: 123456</div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-600">
          Dica didática: este formulário usa o provider "credentials" do next-auth. Para testar um app externo (mobile), você pode chamar o endpoint <code className="bg-gray-100 px-1 py-0.5 rounded">/api/auth/login</code> para receber um token.
        </p>
      </div>
    </main>
  );
}
