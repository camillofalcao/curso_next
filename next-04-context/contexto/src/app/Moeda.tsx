import { useContext } from "react";
import { PagamentoContext } from "./PagamentoMoedas";
import { formatador } from "./PagamentoMoedas";

const Moeda = ({ valor }: { valor: number }) => {
    const contexto = useContext(PagamentoContext);
    if (!contexto) return null;

    const { pagar, pagamentoConcluido } = contexto;

    return (
        <button
            key={valor}
            onClick={() => pagar(valor)}
            className={valor <= 1 ? "bg-orange-300 hover:bg-orange-300 text-gray-800 font-bold py-2 px-4 rounded shadow transition" : "bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded shadow transition"}
            disabled={pagamentoConcluido}
        >
            {`R$ ${formatador.format(valor)}`}
        </button>
    );
}

export default Moeda;
