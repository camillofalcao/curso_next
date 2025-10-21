import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Página não encontrada</h2>
      <Link className="mt-4 text-blue-500 hover:underline" href="/">Voltar para a página inicial</Link>
    </div>
  )
}

export default NotFound;
