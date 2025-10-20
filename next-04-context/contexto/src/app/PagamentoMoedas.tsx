import React, { useState, createContext } from "react";
import Moeda from "./Moeda";

interface PagamentoContextType {
  saldo: number;
  totalPago: number;
  pagamentoConcluido: boolean;
  pagar: (valor: number) => void;
}

export const PagamentoContext = createContext<PagamentoContextType | undefined>(undefined);

const valores = [0.05, 0.10, 0.25, 0.50, 1, 2, 5, 10, 20, 50, 100, 200];

interface PagamentoMoedasProps {
  saldoInicial?: number;
}

export const formatador = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PagamentoMoedas = ({ saldoInicial = 100 } : PagamentoMoedasProps) => {
  const [saldo, setSaldo] = useState(saldoInicial);
  const [totalPago, setTotalPago] = useState(0);
  const pagamentoConcluido = saldo <= 0;

  const pagar = (valor: number) => {
    setSaldo((prev) => +(prev - valor).toFixed(2));
    setTotalPago((prev) => +(prev + valor).toFixed(2));
  };

  const contexto = { saldo, totalPago, pagamentoConcluido, pagar };

  const troco = pagamentoConcluido ? +(totalPago - saldoInicial).toFixed(2) : 0;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Saldo a Pagar</h2>
      <div className="text-3xl font-mono text-center mb-6 text-blue-600">
        R$ {saldo > 0 ? formatador.format(saldo) : "0,00"}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <PagamentoContext.Provider value={contexto}>
        {
            valores.map((valor) => (
                <Moeda key={valor} valor={valor} />
            ))
        }
        </PagamentoContext.Provider>
      </div>
      {
        pagamentoConcluido && (
            <div className="mt-6 text-green-600 font-bold text-center">
            Pagamento concluído!<br />
            {troco > 0 && (
                <span className="text-lg text-blue-700">Troco: R$ {formatador.format(troco)}</span>
            )}
            </div>
        )
      }
    </div>
  );
};

export default PagamentoMoedas;
