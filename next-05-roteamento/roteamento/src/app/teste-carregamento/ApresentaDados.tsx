async function getDados() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return [1,2,3,4,5,6,7,8,9,10].map((num) => ({ id: num, texto: `Número ${num}` }));
}

async function ApresentarDados() {
  let results = await getDados();
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
