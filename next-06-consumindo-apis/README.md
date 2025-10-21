# Consumindo API's - Exemplo de CRUD

Neste material vamos criar um CRUD (Create-Read-Update-Delete), ou seja, um cadastro simples para uma entidade. Nosso CRUD consumirá uma API REST de forma que trataremos as requisições no front-end, porém a criação de API's não faz parte do nosso escopo neste momento. Dessa forma, para que possamos consumir uma API, vamos criar uma API de exemplo utilizando o JSON-Server, que permite criar API's simples para testes de front-end. Note que você não deve utilizar JSON-Server em aplicações em produção.

Você pode obter mais informações sobre o JSON Server no repositório do projeto: https://github.com/typicode/json-server

Vamos iniciar criando uma nova pasta chamada `crud-api`. Abra o terminal nesta nova pasta e digite:
```
npm install json-server
```

Após isso, crie o arquivo `db.json` com o seguinte conteúdo:

```json
{
  "alunos": [
    {
      "id": "1",
      "nome": "Ana",
      "matricula": 100,
      "email": "ana@email.com"
    },
    {
      "id": "2",
      "nome": "Bruno",
      "matricula": 200,
      "email": "bruno@email.com"
    },
    {
      "id": "3",
      "matricula": 300,
      "nome": "Carlos",
      "email": "carlos@email.com"
    }
  ]
}
```

Cada propriedade do objeto que está definido no JSON acima representa um endpoint. Em nosso caso, temos o endpoint `alunos`.

Para executar o nosso servidor, digite:
```
npx json-server db.json -p 3005
```

Se estiver tudo correto, seu terminal mostrará algo do tipo:

```
JSON Server started on PORT :3005
Press CTRL-C to stop
Watching db.json...

♡( ◡‿◡ )

Index:
http://localhost:3005/

Static files:
Serving ./public directory if it exists

Endpoints:
http://localhost:3005/alunos
```

O último endereço apresentado, se aberto em seu browser, deve mostrar os três alunos que estão no arquivo `db.json`.

O argumento -p passado acima informa que o serviço deve rodar na porta 3005, pois a porta padrão é a 3000, o que causaria uma colisão com o nosso projeto Next.js.

Deixe o nosso "servidor" JSON-Server rodando e, fora da pasta do "servidor", crie uma nova pasta chamada `crud` e inicie um novo projeto Next.js nela.

À partir deste momento, vamos deixar o servidor sempre sendo executado e nos concentrar somente no projeto Next.js.

Dentro da pasta `/src`, crie a pasta `Types` e, dentro dela, o arquivo `Aluno`:

`/src/Types/Aluno.tsx`:
```ts
interface Aluno {
    id: string;
    matricula: string;
    nome: string;
    email: string;
};

export default Aluno;
```

Acima, temos o código da interface `Aluno`, que utilizaremos em outros arquivos em nosso sistema.

Vamos criar a pasta `/src/app/Aluno` e, nela, o arquivo `actions.tsx`:

`/src/app/aluno/actions.tsx`:
```ts
import Aluno from "@/types/Aluno";

const baseUrl = 'http://localhost:3005/alunos';

export async function getAlunos() : Promise<Aluno[]> {
    const req = await fetch(`${baseUrl}`);
    const objeto = await req.json();
    return objeto as Aluno[];
}

export async function getAluno(id: string) : Promise<Aluno | null> {
    const req = await fetch(`${baseUrl}/${id}`);
    const objeto = await req.json();
    return objeto as Aluno;
}

export async function insertAluno(objeto: Aluno) {
    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...objeto, id: undefined}),
    });
    return response;
}

export async function updateAluno(objeto: Aluno) {
    const response = await fetch(`${baseUrl}/${objeto.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(objeto),
    });
    return response;
};

export async function deleteAluno(id: string) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });
    return response;
}
```

No arquivo acima, criamos as funções que se comunicam com o nosso "servidor" JSON-Server. Temos os métodos para recuperação (GET), e os métodos para inserção, alteração e exclusão (POST, PUT e DELETE). Utilizaremos estes métodos nos componentes que criaremos à seguir.

O primeiro componente será o `AlunoListar`:

`/src/app/aluno/page.tsx`:
```ts
import Link from "next/link";
import { getAlunos } from "./actions";

const AlunoListar = async () => {
    const objetos = await getAlunos();

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl mb-3">Alunos</h1>
            <Link href="/aluno/inserir" className="flex text-white justify-center w-20 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Inserir</Link>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="h-7 text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th>Matrícula</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        objetos.map(x => {
                            return (
                                <tr key={x.id}>
                                    <td>{x.matricula}</td>
                                    <td>{x.nome}</td>
                                    <td className="flex">
                                        <Link className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:focus:ring-yellow-900" href={`/aluno/alterar/${x.id}`}>Alterar</Link>
                                        <Link className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" href={`/aluno/excluir/${x.id}`}>Excluir</Link>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AlunoListar;
```

O componente acima será executado do lado do servidor. A linha `const objetos = await getAlunos();` chama a função `getAlunos` que criamos anteriormente no arquivo `actions.tsx`.

Agora vamos criar o componente `AlunoInserir`:

`/src/app/aluno/inserir/page.tsx`:
```ts
'use client';

import { useState } from "react";
import Link from "next/link";
import { redirect, RedirectType } from 'next/navigation'
import { insertAluno } from "../actions";
import Aluno from "@/types/Aluno";

const inserir = async (objeto: Aluno,e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const response = await insertAluno(objeto);
    if (response.ok) {
        alert('Aluno inserido com sucesso!');
        redirect('/aluno', RedirectType.push)
    } else {
        alert('Erro ao inserir aluno!');
    }
};

const AlunoInserir = () => {
    const [objeto, setObjeto] = useState<Aluno>( { id: '', matricula: 0, nome: '', email: '' } );

    return (
        <div>
            <h1 className="text-3xl mb-2">Inserindo aluno</h1>
            <form>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="matricula" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Matrícula</label>
                        <input 
                            type="text" 
                            id="matricula" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            value={objeto.matricula}
                            onChange={(e) => { setObjeto({...objeto, matricula: Number(e.target.value)}) }}
                        />
                    </div>
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input 
                            type="text" 
                            id="nome" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required 
                            value={objeto.nome} 
                            onChange={(e) => { setObjeto({...objeto, nome: e.target.value}) }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            value={objeto.email}
                            onChange={(e) => { setObjeto({...objeto, email: e.target.value}) }}
                        />
                    </div>  
                </div>
                
                <div className="flex gap-2">
                    <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={e => inserir(objeto,e)}
                    >Salvar</button>
                    <Link href={'/aluno'} className="text-black bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Voltar</Link>
                </div>
            </form>

        </div>
    );
};

export default AlunoInserir;
```

Note que a função `inserir` é chamada no clique do botão "Salvar". Esta função chama a função `insertAluno` do arquivo `actions.tsx`, que realiza a requisição do tipo POST para o endpoint `alunos`, enviando o aluno a ser inserido de forma serializada (JSON).

Já é possível testar a inserção de alunos no browser ao executar o projeto. Faça isso acessando "`URL base`/aluno" (http://localhost:3000/aluno), clicando no botão **Incluir** e, após o preenchimento do formulário, clicando no botão **Salvar**. Lembre-se de, à partir deste momento, testar cada nova funcionalidade criada neste tutorial.

Agora já é possível criar o componente que permite a alteração. Cuidado: verifique abaixo o caminho completo para o arquivo e lembre-se de criar todas as pastas, incluindo a pasta `[id]`.

`/src/app/aluno/alterar/[id]/page.tsx`:
```ts
'use client';

import {use, useState, useEffect} from "react";
import Link from "next/link";
import {getAluno, updateAluno} from "../../actions";
import Aluno from "@/types/Aluno";
import { redirect, RedirectType } from "next/navigation";

const salvar = async (objeto: Aluno, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!objeto) {
        alert('Objeto nulo');
        return;
    }

    const response = await updateAluno(objeto);

    if (response.ok) {
        alert('Aluno alterado com sucesso!');
        redirect('/aluno', RedirectType.push)
    } else {
        alert('Erro ao alterar aluno!');
    }
};

const AlunoAlterar = (props: PageProps<'/aluno/alterar/[id]'>) => {
    const { id } = use(props.params);
    const [objeto, setObjeto] = useState<Aluno | null>(null);

    useEffect(() => {
        getAluno(id).then(data => setObjeto(data))
    }, [id]);

    if (!objeto) {
        return <div>Carregando...</div>;
    }
    
    return (
        <div>
            <h1 className="text-3xl mb-2">Alterando aluno</h1>
            <form>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="matricula" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Matrícula</label>
                        <input 
                            type="text" 
                            id="matricula" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            value={objeto.matricula}
                            onChange={(e) => { setObjeto({...objeto, matricula: Number(e.target.value)}) }}
                        />
                    </div>
                    <div>
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                        <input 
                            type="text" 
                            id="nome" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            required 
                            value={objeto.nome}
                            onChange={(e) => { setObjeto({...objeto, nome: e.target.value}) }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            value={objeto.email}
                            onChange={(e) => { setObjeto({...objeto, email: e.target.value}) }}
                        />
                    </div>  
                </div>
                
                <div className="flex gap-2">
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={(e) => salvar(objeto, e)}
                    >
                        Salvar
                    </button>
                    <Link href={'/aluno'} className="text-black bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Voltar</Link>
                </div>
            </form>

        </div>
    );
};

export default AlunoAlterar;
```

Note que neste componente nós criamos o state `objeto` que inicialmente recebe o valor `undefined`. O método `setState` é chamado dentro do `useEffect`, onde é realizada a chamada ao método do arquivo `actions.tsx` que realiza a consulta do aluno pelo `id` em uma requisição do tipo `GET`. Note também que optamos por controlar os *inputs* no *state* (veja *value* e *onChange*).

O nosso próximo componente permite a exclusão de alunos:

`/src/app/aluno/excluir/[id]/page.tsx`:
```ts
"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { getAluno, deleteAluno } from "../../actions";
import Aluno from "@/types/Aluno";

const excluir = async (id: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault();
  const response = await deleteAluno(id);
  if (response.ok) {
    alert('Aluno excluído com sucesso!');
    redirect('/aluno', RedirectType.push);
  } else {
    alert('Erro ao excluir aluno!');
  }
};

const AlunoExcluir = (props: PageProps<"/aluno/alterar/[id]">) => {
  const { id } = use(props.params);
  const [objeto, setObjeto] = useState<Aluno | null>(null);

    useEffect(() => {
        getAluno(id).then(data => setObjeto(data))
    }, [id])

    if (!objeto) {
        return <div>Carregando...</div>;
    }

  return (
    <div>
      <h1 className="text-3xl mb-2">Excluindo aluno</h1>
      <form>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="matricula"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Matrícula
            </label>
            <input
              type="text"
              id="matricula"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled
              defaultValue={objeto.matricula}
            />
          </div>
          <div>
            <label
              htmlFor="nome"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled
              defaultValue={objeto.nome}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              disabled
              defaultValue={objeto.email}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={(e) => excluir(objeto.id, e)}
          >
            Excluir
          </button>
          <Link
            href={"/aluno"}
            className="text-black bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AlunoExcluir;
```

Agora já é possível inserir, alterar e excluir alunos em nosso sistema. Como sugestão para que você verifique se entendeu os conceitos apresentados, sugiro que adicione ao componente AlunoListar a opção de consultar um aluno, sendo que esta opção deve estar junto às opções já existentes (Alterar e Excluir). Ao clicar em Consultar, os dados do aluno em questão devem ser apresentados em tela e não deve ser possível alterá-los.
