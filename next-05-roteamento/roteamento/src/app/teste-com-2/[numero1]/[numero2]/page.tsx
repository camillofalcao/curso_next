export const Teste = async (props: PageProps<'/teste-com-2/[numero1]/[numero2]'>) => {
    const { numero1, numero2 } = await props.params;
    return (
        <div>
            <h1 className="text-2xl">Esta é a página <strong>Teste</strong></h1>
            <p>O valor do parâmetro 1 é <strong>{numero1}</strong> e o valor do parâmetro 2 é <strong>{numero2}</strong></p>
        </div>
    );
}

export default Teste;

////Sem PageProps:
// export const Teste = async ({
//     params,
// }: {
//     params: Promise<{ numero1: string; numero2: string }>
// }) => {
//     const { numero1, numero2 } = await params;
//     return (
//         <div>
//             <h1 className="text-2xl">Esta é a página <strong>Teste</strong></h1>
//             <p>O valor do parâmetro 1 é <strong>{numero1}</strong> e o valor do parâmetro 2 é <strong>{numero2}</strong></p>
//         </div>
//     );
// }

// export default Teste;


