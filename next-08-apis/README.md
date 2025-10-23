# Criando API's

Neste tutorial, vamos criar uma API para manutenção de produtos. Iniciaremos pela criação do tipo da entidade que utilizaremos, do banco de dados e dos métodos para acesso ao mesmo, pois estes tópicos já foram discutidos nos tutoriais anteriores e, ao mesmo tempo, são partes importantes da aplicação de exemplo. Em seguida a estes tópicos, abordaremos como o Next.js aborda a criação de endpoints, lembrando que estamos trabalhando com App Rounter.

### Criando o tipo da entidade

Vamos criar a interface Produto abaixo:

`/src/types/Produto.ts`:
```ts
export interface Produto {
    id: string;
    descricao: string;
    codigo: number;
    preco: number;
}
```

Utilizaremos esta interface em outros arquivos do nosso projeto.

### Criando o banco de dados

Inicie instalando o SQLite através dos dois comandos abaixo, que devem ser executados no terminal:

`npm i sqlite`

`npm i sqlite3`

Vamos criar agora um banco de dados SQLite para persistência de produtos:

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
      descricao TEXT NOT NULL,
      codigo INTEGER NOT NULL UNIQUE,
      preco REAL NOT NULL
    )
  `);
}

inicializarBd();
```

### Criando métodos para acesso ao banco de dados

Com o bancos de dados e o tipo criados, vamos criar os métodos de acesso à nossa tabela `produto`:

`/src/app/actions/Produto.ts`:
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

export async function inserirProduto(objeto : Produto) : Promise<{ sucesso: boolean; objeto: Produto | null; error?: any }> {
    const db = await abrirBd();
    
    objeto.id = crypto.randomUUID();

    try {
        await db.run(
            'INSERT INTO produto (id, descricao, codigo, preco) VALUES (?, ?, ?, ?)',
            [
                objeto.id,
                objeto.descricao,
                objeto.codigo,
                objeto.preco
            ]
        );
        revalidatePath('/api/produtos');
        return { sucesso: true, objeto };
    } catch (error) {
        return { sucesso: false, objeto: null, error };
    } finally {
        await db.close();
    }
}

export async function alterarProduto(id: string, objeto: Produto) : Promise<{ sucesso: boolean; error?: any }>  {
    const db = await abrirBd();
    
    if (id !== objeto.id) {
        return { sucesso: false, error: 'ID do objeto não corresponde ao ID fornecido' };
    }

    try {
        await db.run(
            'UPDATE produto SET descricao = ?, codigo = ?, preco = ? WHERE id = ?',
            [
                objeto.descricao,
                objeto.codigo,
                objeto.preco,
                id
            ]
        );
        revalidatePath('/api/produtos');
        return { sucesso: true };
    } catch (error) {
        return { sucesso: false, error };
    } finally {
        await db.close();
    }
}

export async function excluirProduto(id: string) : Promise<{ sucesso: boolean; error?: any }> {
    const db = await abrirBd();
    
    try {
        await db.run('DELETE FROM produto WHERE id = ?', [id])
        revalidatePath('/api/produtos');
        return { sucesso: true };
    } catch (error) {
        return { sucesso: false, error };
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

Note no código acima que estamos recebendo por parâmetro, nos métodos que permitem a inserção e a alteração de produtos, o próprio objeto ao invés de um FormData. Estes métodos serão chamados pela nossa API e não através do *post* de um formulário.

### API

Agora que já temos tudo o que é necessário para a persistência e recuperação de produtos, podemos focar no conteúdo principal deste tutorial: criar a API para produtos.

Lembre-se que em Next.js, quando utilizamos App Router, o caminho criado pelas pastas da aplicação é utilizado para definir as rotas. Isso também ocorre com os nossos endpoints.

Para separarmos os endpoints dos demais elementos da aplicação, vamos criar a pasta `/src/app/api`. Concentraremos nesta pasta todas as API's.

Vamos criar neste momento uma pasta para a nossa API `produtos`: `/src/app/api/produtos`.

Cada API é formada por um conjunto de endpoints, que são as ações específicas que podem ser realizadas. Vamos criar um arquivo para as rotas de `produtos` que chamaremos de `route.ts`: `/src/app/api/produtos/route.ts`

 Como utilizaremos REST, sabemos que alguns endpoints recebem na rota o `id` do objeto em questão. Estes parâmetros na rota são definidos em Next.js através de pastas com nome entre colchetes. Dessa forma, estes endpoints ficarão em um arquivo de rota separado, dentro da pasta `[id]`. Crie este arquivo: `/src/app/api/produtos/[id]/route.ts`

Vamos iniciar pelo nosso primeiro endpoint, que nos permite recuperar os produtos:
`/src/app/api/produtos/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { listarProdutos, inserirProduto } from "@/app/actions/Produto";

export async function GET(request: NextRequest) {
    return NextResponse.json(await listarProdutos(), { status: 200 });
}
```

No código acima, iniciamos pela importação dos objetos que representam uma requisição e uma resposta ao nosso servidor. Em seguida, importamos as funções `listarProdutos` e `inserirProduto`, criadas anteriormente. A segunda função importtada será utilizada mais tarde.

Quando o usuário realizar uma chamada do tipo GET na rota `/produtos`, será executado o método de nome `GET` e receberemos por parâmetro um objeto contendo os dados da requisição. Utilizamos o método `json` do objeto `NextResponse` para serializar a nossa lista de produtos, que obtivemos através da action `listarProdutos`. O status de retorno `200` indica sucesso na operação. Não realizamos tratamento de erros e seus respectivos retornos apenas para manter o exemplo mais simples.

Vamos agora adicionar ao arquivo `route.ts` o método que permite a inclusão de novos produtos:

`/src/app/api/produtos/route.ts`:
```ts
...

export async function POST(request: NextRequest) {
  const objeto = await request.json();
  const novoObjeto = await inserirProduto(objeto);
  return NextResponse.json(novoObjeto, { status: 201 });
}
```

Novamente não tratamos erros adequadamente com o intuito de deixar o código menor, o que permite a você focar no entendimento do endpoint em si.

O objeto enviado na requisição é recebido através do método `json` do objeto `request`. o objeto é inserido no banco de dados e retornado, junto ao status de sucesso (201). Ao retornar o objeto inserido, campos preenchidos pelo servidor, tal como o campo `id`, são retornados para quem solicitou a inserção, o que nos permitirá conhecer o `id` do objeto inserido.

Neste momento você já pode testar a aplicação, enviando uma requisição do tipo GET, outra do tipo POST e novamente uma do tipo GET para verificar se a inserção foi realizada com sucesso. Se você não sabe como fazer isso, sugiro que instale a extensão "Thunder Client" no "VSCode". Dica: utilizando esta extensão você pode enviar o *JSON* do objeto no *POST* na aba *Body*. Outra opção que você tem é alterar o endereço das chamadas que fizemos no exemplo do CRUD com API de forma que o mesmo passe a consumir a API que estamos criando neste tutorial.

Agora vamos nos concentrar nos endpoints que recebem o `id` do objeto por parâmetro:

`/src/app/api/produtos/[id]/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getProduto, alterarProduto, excluirProduto } from "@/app/actions/Produto";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produto = await getProduto(id);
  if (produto) {
    return NextResponse.json(produto, { status: 200 });
  }
  return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
}

export async function PUT(request: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
  const objeto = await request.json();
  const { id } = await params;
  const resultado = await alterarProduto(id, objeto);
  if (resultado.sucesso) {
    return NextResponse.json({ status: 204 });
  }
  return NextResponse.json({ message: resultado.error }, { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resultado = await excluirProduto(id);
  if (resultado.sucesso) {
    return NextResponse.json({ status: 204 });
  }
  return NextResponse.json({ message: resultado.error}, { status: 404 });
}
```

Note que, para estes endpoints, além de receber a requisição, recebemos também o objeto `params` contendo o `id` em questão.

Nestes métodos, estamos retornando códigos HTTP de sucesso (2**) sempre que a função que realiza a ação no banco de dados retorna sucesso. Para todos os outros casos, estamos retornando um código de erro (4**), mais especificamente o 404, que significa *not found*, sendo que nem todos os erros que podem acontecer são deste tipo. Em aplicações profissionais, você deveria realizar retornos mais assertivos, tal como retornar o erro 400 *bad request* em caso o `id` da rota não seja o mesmo que o `id` do objeto no método  `PUT`, por exemplo.

O restante do código você deve olhar com atenção, mas acretido que será de fácil entendimento, pois se trata de pequena variação de códigos que já vimos anteriormente.

Aproveite este final de tutorial para testar adequadamente a sua nova API de produtos.
