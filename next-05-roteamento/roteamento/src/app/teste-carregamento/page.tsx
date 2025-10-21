'use client';

import { use } from "react";

async function getDados() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [1,2,3,4,5,6,7,8,9,10].map((num) => ({ id: num, texto: `Número ${num}` }));
}

function ApresentarDados() {
  let results = use(getDados());
  return (
    <ul>
      {results &&
        results.map((x: { id: number; texto: string }) => {
          return <li className="text-2xl" key={x.id}>{x.texto}</li>;
        })}
    </ul>
  );
}
export default ApresentarDados;

// import ApresentaDados from "./ApresentaDados";

// const TesteCarregamento = () => {
    
//     return (
//         <div>
//             <ApresentaDados />
//         </div>
//     );
// };

// export default TesteCarregamento;


// import { Suspense } from "react";
// import ApresentaDados from "./ApresentaDados";

// const TesteCarregamento = () => {
    
//     return (
//         <div>
//           <h1 className="text-3xl font-bold">Teste de Carregamento</h1>
//             <Suspense fallback={<p>Carregando dados...</p>}>
//                 <ApresentaDados />
//             </Suspense>
//         </div>
//     );
// };

// export default TesteCarregamento;


// import { Suspense } from "react";
// import ApresentaDados from "./ApresentaDados";
// import Loading from "../loading";

// const TesteCarregamento = () => {
    
//     return (
//         <div>
//           <h1 className="text-3xl font-bold">Teste de Carregamento</h1>
//             <Suspense fallback={<Loading />}>
//                 <ApresentaDados />
//             </Suspense>
//         </div>
//     );
// };

// export default TesteCarregamento;
