# Exemplo de CRUD Completo (Front-end + Back-end com Banco de Dados)

Neste material vamos criar um CRUD (Create-Read-Update-Delete), criando tanto o código do lado do servidor (back-end) quando o código do lado do cliente (front-end). De forma diferente do tutorial anterior, neste tutorial não trabalharemos com endpoints.

Como em nosso tutorial anterior nós também criamos um CRUD, várias partes deste tutorial lhe serão familiares, o que permitirá verificar as diferenças entre os dois CRUDs criados.

Vamos iniciar criando, em uma nova pasta, um novo projeto Next.js. O nome do projeto pode ser `crud-next`.

Neste projeto, vamos utilizar o banco de dados SQLite. A escolha do SQLite foi feita com base na simplicidade e facilidade do uso deste banco de dados, que não exige nenhuma instalação para o seu uso.

Agora, em nosso novo projeto, vamos criar a pasta `/src/lib` e, dentro da mesma, o arquivo `db.ts`:

`/src/lib/db.ts`:
```ts
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function abrirBd() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })
}

async function inicializarBd() {
  const db = await abrirBd();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS produto (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      codigo INTEGER NOT NULL UNIQUE,
      preco REAL NOT NULL
    )
  `);
}

inicializarBd();
```

Acima criamos a função que abre o nosso banco de dados, que se encontra no arquivo `./database.sqlite`. Também criamos e chamamos a função que inicializa o nosso banco de dados, criando a tabela `produto`.

Agora vamos criar a nossa interface `Produto`:

`/src/Types/Produto.ts`:
```ts
export interface Produto {
    id: string;
    nome: string;
    codigo: number;
    preco: number;
}
```

Acima, temos o código da interface `Produto`, que utilizaremos em outros arquivos em nosso sistema.

Vamos criar a pasta `/src/app/Produto` e, nela, o arquivo `actions.tsx`. Neste arquivo agruparemos as funções que realizam a persistência e recuperação de produtos em nossa base de dados:

`/src/app/produto/actions.tsx`:
```ts
'use server'

import { abrirBd } from "@/lib/db"
import { Produto } from "@/types/Produto";
import { revalidatePath } from 'next/cache'

export async function listarProdutos() : Promise<Produto[]> {
    const db = await abrirBd();
    const produtos: Produto[] = await db.all('SELECT * FROM produto');
    await db.close();
    return produtos;
}

export async function inserirProduto(formData: FormData) {
    const db = await abrirBd();
    
    try {
        await db.run(
            'INSERT INTO produto (id, nome, codigo, preco) VALUES (?, ?, ?, ?)',
            [
                crypto.randomUUID(),
                formData.get('nome'),
                Number(formData.get('codigo')),
                Number(formData.get('preco'))
            ]
        );
        revalidatePath('/produto');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    } finally {
        await db.close();
    }
}

export async function alterarProduto(id: string, formData: FormData) {
    const db = await abrirBd();
    
    try {
        await db.run(
            'UPDATE produto SET nome = ?, codigo = ?, preco = ? WHERE id = ?',
            [
                formData.get('nome'),
                Number(formData.get('codigo')),
                Number(formData.get('preco')),
                id
            ]
        );
        revalidatePath('/produto');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    } finally {
        await db.close();
    }
}

export async function excluirProduto(id: string) {
    const db = await abrirBd();
    
    try {
        await db.run('DELETE FROM produto WHERE id = ?', [id])
        revalidatePath('/produto');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    } finally {
        await db.close()
    }
}

export async function getProduto(id: string) : Promise<Produto | undefined> {
    const db = await abrirBd();
    try {
        const produto : Produto | undefined = await db.get('SELECT * FROM produto WHERE id = ?', [id]);
        return produto;
    } finally {
        await db.close();
    }
}
```

As funções que colocamos neste arquivo são "server actions", pois são chamadas em nossos componentes que podem ser "client componentes", porém são funções que são executadas no lado do servidor. A diretiva 'use server' no início do arquivo acima indica que todo o conteúdo deste arquivo deve ser executado do lado do servidor. A diretiva 'use client' é obrigatória, enquando a 'use server' é a padrão do Next.js.

Note que nossos SQL's estão utilizando parâmetros, como você pode notar pelo uso de pontos de interrogação onde se esperam valores e com a passagem dos valores correspondentes separadamente ao invés de concatenação de *strings*. O uso de parâmetros é aconselhável para evitar *SQL Injection*.

Vamos criar o componente ListarProdutos:

`/src/app/produto/page.tsx`:
```ts
import Link from "next/link"
import { Produto } from "@/types/Produto"
import { listarProdutos } from "./actions"

export default async function ListarProdutos() {
    const produtos: Produto[] = await listarProdutos();

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl mb-3">Produtos</h1>
            <Link href="/produto/inserir" className="flex text-white justify-center w-20 bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 mb-2">Inserir</Link>
            
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">Código</th>
                        <th className="px-6 py-3">Nome</th>
                        <th className="px-6 py-3">Preço</th>
                        <th className="px-6 py-3">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr key={produto.id} className="bg-white border-b">
                            <td className="px-6 py-4">{produto.codigo}</td>
                            <td className="px-6 py-4">{produto.nome}</td>
                            <td className="px-6 py-4">R$ {produto.preco.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <Link href={`/produto/alterar/${produto.id}`} className="text-blue-600 hover:underline mr-3">Alterar</Link>
                                <Link href={`/produto/excluir/${produto.id}`} className="text-red-600 hover:underline">Excluir</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
```

O componente acima é assíncrono e é executado no lado do servidor.

Note na linha `const produtos: Produto[] = await listarProdutos();` a chamada para a função `listarProdutos` que realiza o *select* dos produtos em nossa base de dados.

Agora vamos criar o componente `InserirProduto`:

`/src/app/produto/inserir/page.tsx`:
```ts
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { inserirProduto } from '../actions'

export default function InserirProduto() {
    const router = useRouter()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        
        inserirProduto(formData)
            .then(result => {
                if (result.success) {
                    router.push('/produto')
                } else {
                    console.error('Erro ao inserir produto:', result.error)
                }
            })
    }

    return (
        <div>
            <h1 className="text-3xl mb-2">Novo Produto</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="codigo" className="block mb-2 text-sm font-medium">Código</label>
                        <input 
                            type="number"
                            id="codigo"
                            name="codigo"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome</label>
                        <input 
                            type="text"
                            id="nome"
                            name="nome"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="preco" className="block mb-2 text-sm font-medium">Preço</label>
                        <input 
                            type="number"
                            step="0.01"
                            id="preco"
                            name="preco"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="text-white bg-blue-700 rounded-lg px-5 py-2.5">Salvar</button>
                    <Link href="/produto" className="text-black bg-gray-300 rounded-lg px-5 py-2.5">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}
```

Note que não controlamos os imputs no formulário acima. Ao invés disso, optamos por receber os dados do formulário submetido para que possamos ler os valores dos inputs. Isso ocorre devido ao código das nossas funções que executam ações nos bancos de dados rodarem no lado do servidor e, até este momento, não é possível no Next.js chamar uma server action passando um objeto por parâmetro.

O nosso próximo componente permite a alteração de um produto:

`/src/app/produto/alterar/[id]/page.tsx`:
```ts
'use client'

import { Produto } from "@/types/Produto"
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { alterarProduto, getProduto } from '../../actions'

export default function AlterarProduto(props: PageProps<'/produto/alterar/[id]'>) {
    const router = useRouter();
    const [produto, setProduto] = useState<Produto | undefined>(undefined);
    const { id } = use(props.params);

    useEffect(() => {
        getProduto(id).then(data => setProduto(data));
    }, [id])

    if (!produto) return <div>Carregando...</div>;

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        alterarProduto(id, formData)
            .then(result => {
                if (result.success) {
                    router.push('/produto')
                } else {
                    console.error('Erro ao alterar produto:', result.error)
                }
            });
    }

    return (
        <div>
            <h1 className="text-3xl mb-2">Alterar Produto</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="codigo" className="block mb-2 text-sm font-medium">Código</label>
                        <input 
                            type="number"
                            id="codigo"
                            name="codigo"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            defaultValue={produto.codigo}
                        />
                    </div>
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome</label>
                        <input 
                            type="text"
                            id="nome"
                            name="nome"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            defaultValue={produto.nome}
                        />
                    </div>
                    <div>
                        <label htmlFor="preco" className="block mb-2 text-sm font-medium">Preço</label>
                        <input 
                            type="number"
                            step="0.01"
                            id="preco"
                            name="preco"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            defaultValue={produto.preco}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="text-white bg-blue-700 rounded-lg px-5 py-2.5">Salvar</button>
                    <Link href="/produto" className="text-black bg-gray-300 rounded-lg px-5 py-2.5">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}
```

Note que neste componente nós criamos o state `objeto` que inicialmente recebe o valor `undefined`. O método `setState` é chamado dentro do `useEffect`, onde é realizada a chamada ao método do arquivo `actions.tsx` que realiza a consulta do produto pelo `id`no banco de dados. Note também que **não** estamos controlando os *inputs* (não passamos valores para *value* e *onChange*), pois não passamos um objeto para a função `alterarProduto` e sim os dados do formulário.

O nosso próximo componente permite a exclusão de produtos:

`/src/app/produto/excluir/[id]/page.tsx`:
```ts
'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { excluirProduto, getProduto } from '../../actions'

export default function ExcluirProduto(props: PageProps<'/produto/excluir/[id]'>) {
    const router = useRouter()
    const [produto, setProduto] = useState<any>(null)
    const { id } = use(props.params)

    useEffect(() => {
        getProduto(id).then(data => setProduto(data))
    }, [id])

    if (!produto) return <div>Carregando...</div>

    function handleExcluir() {
        excluirProduto(id)
            .then(result => {
                if (result.success) {
                    router.push('/produto')
                } else {
                    console.error('Erro ao excluir produto:', result.error)
                }
            })
    }

    return (
        <div>
            <h1 className="text-3xl mb-2">Excluir Produto</h1>
            <p className="mb-4">Tem certeza que deseja excluir o produto {produto.nome}?</p>
            <div className="flex gap-2">
                <button 
                    onClick={handleExcluir} 
                    className="text-white bg-red-700 rounded-lg px-5 py-2.5">
                    Excluir
                </button>
                <Link 
                    href="/produto" 
                    className="text-black bg-gray-300 rounded-lg px-5 py-2.5">
                    Cancelar
                </Link>
            </div>
        </div>
    )
}
```

Agora já é possível inserir, alterar e excluir produtos em nosso sistema. Como sugestão para que você verifique se entendeu os conceitos apresentados, sugiro que adicione ao componente ListarProduto a opção de consultar um produto, sendo que esta opção deve estar junto às opções já existentes (Alterar e Excluir). Ao clicar em Consultar, os dados do produto em questão devem ser apresentados em tela e não deve ser possível alterá-los.
