'use client';

import { useSearchParams } from "next/navigation";
import { use } from "react";

const Formatar = (props: PageProps<'/formatar/[texto]'>) => {
    const { texto } = use(props.params);
    const searchParams = useSearchParams();

    const [formato, aspas] = [searchParams.getAll("formato"), searchParams.get("aspas")];

    let textoFinal = texto;

    if (aspas === 'true') {
        textoFinal = `"${textoFinal}"`;
    }

    let conteudo = <span>{textoFinal}</span>;
    
    if (formato) {
        if (formato.includes('negrito')) {
            conteudo = <strong>{conteudo}</strong>;
        }
        if (formato.includes('italico')) {
            conteudo = <em>{conteudo}</em>;
        }
    }

    return (
        <div>
            {conteudo}
        </div>
    );
};

export default Formatar;

// const Formatar = async (props: PageProps<'/formatar/[texto]'>) => {
//     const { texto } = await props.params;
//     const searchParams = await props.searchParams;

//     const [formato, aspas] = [searchParams["formato"], searchParams["aspas"]];

//     let textoFinal = texto;

//     if (aspas === 'true') {
//         textoFinal = `"${textoFinal}"`;
//     }

//     let conteudo = <span>{textoFinal}</span>;
    
//     if (formato) {
//         if (formato.includes('negrito')) {
//             conteudo = <strong>{conteudo}</strong>;
//         }
//         if (formato.includes('italico')) {
//             conteudo = <em>{conteudo}</em>;
//         }
//     }

//     return (
//         <div>
//             {conteudo}
//         </div>
//     );
// };

// export default Formatar;
