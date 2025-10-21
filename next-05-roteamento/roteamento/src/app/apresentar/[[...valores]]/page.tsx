const Apresentar = async (props: PageProps<'/apresentar/[[...valores]]'>) => {
    const { valores } = await props.params;
    return (
        <div>
            <h1 className="text-2xl">Esta é a página <strong>Apresentar</strong></h1>
            {
                valores ? 
                    <p>Os valores passados por parâmetro são: <strong>{Array.isArray(valores) ? valores.join(', ') : valores}</strong></p>
                :
                    <p>Nenhum valor foi passado por parâmetro.</p>
            }
        </div>
    );
}

export default Apresentar;
