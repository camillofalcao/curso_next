export const Teste = async (props: PageProps<'/teste/[numero]'>) => {
    const { numero } = await props.params
     return (
       <div>
         <h1 className="text-2xl">Esta é a página <strong>Teste</strong> e o valor do parâmetro é <strong>{numero}</strong></h1>
       </div>
     );
}

export default Teste;
