'use client'

import { useState, useEffect } from "react";
import obterData from "@/app/actions/restrict/obterData";
import Link from "next/link";

export default function Page() {
  const [horaServidor, setHoraServidor] = useState<Date | null>(null);

  useEffect(() => {
    obterData().then((data) => {
      setHoraServidor(data);
    });
  }, []);

  const msgHoraServidor = horaServidor ? (
        <p className="text-blue-500 mb-5">
          Data e hora do servidor: {horaServidor?.toDateString()} {horaServidor?.toLocaleTimeString()} (informação obtida em action que impõe autenticação)
        </p>) : 
        (<p className="text-red-500 mb-5">
          Data e hora do servidor: é preciso estar autenticado para acessar esta função
        </p>);

  return (
    <main className="max-w-4xl mx-auto mt-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Página de Teste 1 - Área NÃO Autenticada
          </h2>
          <p className="text-gray-600 mb-5">
            Esta é uma área pública. Você não precisa estar logado para visualizar esta página.
          </p>
          {msgHoraServidor}
          <Link href="/" className="w-100 py-2 px-5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60">
            Voltar
          </Link>
        </div>
      </main>
  );
}
