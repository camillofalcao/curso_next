import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';

export default async function Page() {
  const session = await getServerSession(authOptions);

  console.log(session?.user);

  return (
      <main className="max-w-4xl mx-auto mt-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Página de Teste 1 - Área Autenticada (Server Component)
          </h2>
          <p className="text-gray-600 mb-5">
            Esta é uma área protegida. Você só consegue visualizar esta página se estiver logado com sucesso.
          </p>
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-large text-blue-600 mb-1">Usuário logado:</h3>
              <p className="text-sm text-gray-700">Nome: {session?.user?.name}</p>
              <p className="text-sm text-gray-700">E-mail: {session?.user?.email}</p>
              <p className="text-sm text-gray-700">Tipo: {session?.user?.role}</p>
            </div>
          </div>

          <Link href="/" className="w-100 py-2 px-5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60">
            Voltar
          </Link>
        </div>
      </main>
  );
}
