# NextJS - Roteamento, Navegação e Layouts

Next.js possui dois diferentes roteadores:
- App Router: o roteador novo que suporta novas funcionalidades, como Server Components.
- Pages Router: o roteador original, que ainda possui suporte e está recebendo atualizações.

Trabalharemos com "App Router", logo todo o conteúdo restante deste material se refere a App Router.

O roteamento em Next.js é baseado no sistema de arquivos, logo é possível utilizar pastas e arquivos para definir rotas.

Neste material, sempre que nos referirmos a `URL base` e sempre que for solicitado o acesso a determinado endereço no browser, entenda que a `URL base` deve ser digitada primeiro. Exemplo: se for solicitado acessar o endereço `/teste`, você deve digitar a `URL base` seguida de `/teste`. A `URL base` é apresentada a você quando você executa a sua aplicação e, provavelmente, será `http://localhost:3000`.

Para iniciar este tutorial, crie um novo projeto Next.js de nome "roteamento". Seguem os códigos dos componentes que devem ser criados inicialmente:

`/src/app/page.tsx`:
```ts
'use client'

import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();

    return (
      <div>
        <h1 className="text-2xl">Esta é a <strong>Home page</strong></h1>
        <p>Rota: <strong>{pathname}</strong></p>
      </div>
    );
}
```

O componente acima utiliza o Hook `usePathname` para obter o caminho da rota utilizada para acessar a página criada. Este Hook só pode ser utilizado em componentes cliente.

A página acima é a página inicial da nossa aplicação, podendo ser acessada digitando-se a `URL base` no browser.

Para o nosso próximo componente, será necessário criar a pasta `teste-1` dentro de `/src/app/`.

`/src/app/teste-1/page.tsx`:
```ts
'use client'

import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();

    return (
      <div>
        <h1 className="text-2xl">Esta é a página <strong>Teste 1</strong></h1>
        <p>Rota: <strong>{pathname}</strong></p>
      </div>
    );
}
```

A página acima pode ser acessada digitando-se a `URL base` no browser seguida de `/teste-1`. Note que o caminho da rota é definido pelas pastas e, dentro da pasta selecionada pela rota, o arquivo `page.tsx` é selecionado e renderizado.

Para o nosso próximo componente, será necessário criar a pasta `teste-2` dentro de `/src/app/`.

`/src/app/teste-2/page.tsx`:
```ts
'use client'

import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();

    return (
      <div>
        <h1 className="text-2xl">Esta é a página <strong>Teste 2</strong></h1>
        <p>Rota: <strong>{pathname}</strong></p>
      </div>
    );
}
```

A página acima pode ser acessada digitando-se a `URL base` no browser seguida de `/teste-2`.

Agora que já entendemos a utilização das pastas, vamos iniciar nossos preparativos para a passagem de parâmetros via rota. Para isso, crie a pasta `teste` dentro de `/src/app/` e, dentro da pasta `teste`, crie a pasta `[numero]`. O caminho completo será `/src/app/teste/[numero]`. Neste caminho, adicione o arquivo `page.tsx` abaixo:

```ts
export const Teste = () => {
     return (
       <div>
         <h1 className="text-2xl">Esta é a página <strong>Teste</strong></h1>
       </div>
     );
}

export default Teste;
```

Agora acesse a página criada acima em seu browser na rota `/teste` e note que a página não é encontrada. agora acesse nas rotas `/teste/1` e `/teste/2` e note que, para ambas, a página acima foi apresentada. Desta forma, sabemos que, quando criamos uma pasta com nome entre colchetes, como fizemos acima com a pasta `[numero]`, é necessário passar algum valor nesta rota e este valor pode ser qualquer um e não necessariamente o nome da pasta.

O motivo da pasta `[numero]` ter seu nome entre colchetes é que queremos passar o valor que estiver nesta posição da rota por parâmetro para o nosso componente. Vamos fazer isso abaixo, alterando o componente `src/ap/teste/[numero]/page.tsx`:

```ts
export const Teste = async (props: PageProps<'/teste/[numero]'>) => {
    const { numero } = await props.params
     return (
       <div>
         <h1 className="text-2xl">Esta é a página <strong>Teste</strong> e o valor do parâmetro é <strong>{numero}</strong></h1>
       </div>
     );
}

export default Teste;
```

As propriedades, quando vindas na rota, são promises, logo precisamos de uma função assíncrona e será necessário utilizar `await` para acessar os parâmetros. Se não estiver seguro sobre programação assíncrona, você pode conferir o material sobre Javascript indicado na página inicial deste curso.

Note que desestruturamos o objeto `params` obtendo a propriedade `numero`.

Cuidado: se você tiver visto algum exemplo de roteamento com recebimento de parâmetros diretamente sem o uso de promises, saiba que, apesar de ainda funcionar, isto será marcado como deprecated nas próximas versões, logo o seu uso não é aconselhável.

Sobre a tipagem do nosso parâmetro, em páginas, utilizamos PageProps, que nos permite informar a rota e que faz a tipagem correta para nós. Os parâmetros podem ser de um dos seguintes tipos: string, string[] ou string[]?. Os dois últimos tipos veremos mais à diante.

Agora mostraremos como é possível passar dois valores nas rotas. Crie todas as pastas e componentes apresentados à seguir:

`/src/app/teste-com-2/[numero1]/[numero2]/page.tsx`:

```ts
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
```

Agora você pode acessar a nova página assim: `/teste-com-2/1/2`.

PageProps é bastante útil em simplificar a tipagem das propriedades vindas da rota. Veja abaixo como ficaria o mesmo componente sem a facilidade do uso de PageProps:

```ts
export const Teste = async ({
    params,
}: {
    params: Promise<{ numero1: string; numero2: string }>
}) => {
    const { numero1, numero2 } = await params;
    return (
        <div>
            <h1 className="text-2xl">Esta é a página <strong>Teste</strong></h1>
            <p>O valor do parâmetro 1 é <strong>{numero1}</strong> e o valor do parâmetro 2 é <strong>{numero2}</strong></p>
        </div>
    );
}

export default Teste;
```

Ainda nos resta entender como podemos passar um número variável de parâmetros para um componente. Para isso, vamos criar o componente (crie todas as pastas e o arquivo) `/src/app/apresentar/[...valores]/page.tsx`:

```ts
const Apresentar = async (props: PageProps<'/apresentar/[...valores]'>) => {
    const { valores } = await props.params;
    return (
        <div>
            <h1 className="text-2xl">Esta é a página <strong>Apresentar</strong></h1>
            <p>Os valores passados por parâmetro são: <strong>{Array.isArray(valores) ? valores.join(', ') : valores}</strong></p>
        </div>
    );
}

export default Apresentar;
```

Note que, quando queremos que um parâmetro tenha o tipo `string[]` e possa receber diferentes valores na rota, a pasta deve possuir `...` antes do nome do parâmetro dentro dos colchetes. Em nosso caso, o parâmetro `valores` ficou assim: `[...valores]`.

Teste em seu browser com `/apresentar/1/2` e com `/apresentar/1/2/3/4/5`.

Agora teste com `/apresentar` e note que a página não foi encontrada. Para que o parâmetro `valores` seja opcional, precisamos colocar ele entre cochetes duplos (`[[...valores]]`). Renomeie a pasta `[...valores]` para `[[...valores]]`. O caminho completo do componente ficará assim: `/src/app/apresentar/[[...valores]]/page.tsx` e o conteúdo será:

```ts
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
```

Note a mudança na definição de `PageProps` (`props: PageProps<'/apresentar/[[...valores]]'>`) e a renderização condicional dos valores.

Teste novamente em seu browser, agora com `/apresentar` e com `/apresentar/1/2/3/4`.

Agora que já entendemos o funcionamento básico do roteamento, vamos tratar dos search parameters, que são aqueles passados após a rota. Exemplo: para a rota `/x/1/2/3`, podemos adicionar search parameters ao final da mesma adicionando o caractere `?` e separando cada search parameter com o caractere `&`. Então teríamos o seguinte: `/x/1/2/3?parametro1=valor1&parametro2=valor2`.

Vamos preparar um componente para reagir à *search parameters* passados:

`/src/app/formatar/[texto]/page.tsx`:

```ts
const Formatar = async (props: PageProps<'/formatar/[texto]'>) => {
    const { texto } = await props.params;
    const searchParams = await props.searchParams;

    const [formato, aspas] = [searchParams["formato"], searchParams["aspas"]];

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
```

Agora teste no browser:
- `/formatar/Teste`
- `/formatar/Teste?aspas=true`
- `/formatar/Teste?aspas=true&formato=italico`
- `/formatar/Teste?aspas=true&formato=negrito`
- `/formatar/Teste?aspas=true&formato=negrito&formato=italico`

Veja que cada search parameter possui o tipo `string | string[] | undefined`.

Você deve utilizar search parameters quando precisar de parâmetros de pesquisa para carregar dados para uma página, como ocorre quando é necessária a paginação ou filtragem de dados.

Apenas em componentes clientes, você pode utilizar o Hook useSearchParams:

`/src/app/formatar/[texto]/page.tsx`:
```ts
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
```

No caso acima, como o nosso componente é um componente cliente, não podemos utilizar método assíncrono. Como `props.params` é uma promise, fizemos o uso do Hook `use` do React para conseguirmos aguardar o retorno da promise em nosso componente que não é assíncrono.

Note, no código acima, como foi utilizado o Hook `useSearchParams` e como tivemos que chamar métodos diferentes para obter um único parâmetro ou uma coleção de parâmetros (`searchParams.getAll("formato")`, `searchParams.get("aspas")`).

## Links

Não adianta criarmos as nossas rotas se não tivermos meios de acessá-las através de nossas páginas. Você pode fazer isso no Next.js utilizando o componente `Link`.

Veja como fazer isto abaixo com o novo código do componente `/src/app/page.tsx`:

```ts
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation'

export default function Home() {
  const pathname = usePathname();

    return (
      <div>
        <h1 className="text-2xl">Esta é a <strong>Home page</strong></h1>
        <p>Rota: <strong>{pathname}</strong></p>

        <h4>Links:</h4>
        <ul className="underline ml-2">
          <li><Link href="/teste/1">/teste/1</Link></li>
          <li><Link href="/teste-com-2/1/2">/teste-com-2/1/2</Link></li>
          <li><Link href="/teste-1">/teste-1</Link></li>
          <li><Link href="/teste-2">/teste-2</Link></li>
          <li><Link href="/apresentar/1/2/3/4/5">/apresentar/1/2/3/4/5</Link></li>
          <li><Link href="/formatar/Teste?formato=negrito&formato=italico&aspas=true">/formatar/Teste?formato=negrito&formato=italico&aspas=true</Link></li>
        </ul>
      </div>
    );
}
```

Em cada página que você necessitar voltar, adicione um link que retorna para a home page: `<Link className="underline" href="/">Voltar</Link>`

### Grupos de Rotas

Você pode criar uma pasta que não participa diretamente da rota, servindo apenas para agrupar rotas relacionadas. Para isso, basta que o nome da pasta esteja entre parênteses.

Para verificar isso, crie o seguinte componente (lembre-se de criar todas as pastas necessárias).

`/src/app/(vogais)/a/page.tsx`:
```ts
const Vogal = () => {
    return (
        <h2 className="text-2xl font-bold">Vogal A</h2>
    )
};

export default Vogal;
```

Baseado nos componentes acima, crie os componentes para as outras vogais:
- `/src/app/(vogais)/e/page.tsx`
- `/src/app/(vogais)/i/page.tsx`
- `/src/app/(vogais)/o/page.tsx`
- `/src/app/(vogais)/u/page.tsx`

Com os componentes prontos, acesse as rotas `/a`, `/e`, `/i`, `/o`, `/u`. Note que `(vogais)` não faz parte da rota, servindo apenas para agrupar elementos.

## Convenções do Sistema de Arquivos

### Página não encontrada

É possível personalizar a página que é apresentada quando uma rota não é encontrada. Para isso, crie o arquivo `/src/app/not-found.tsx`:

```ts
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
```

Agora, quando uma rota inexistente é informada, a página personalizada é apresentada, permitindo ao usuário voltar para a página inicial.

### Página de carregamento

Algumas páginas podem possuir tarefas dispendiosas, o que pode causar demora para serem apresentadas ao cliente. Vamos criar o nosso componente com carregamento demorado:

`/src/app/teste-carregamento/ApresentaDados.tsx`:
```ts
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
```

Abaixo, segue o código da nossa página.

`/src/app/teste-carregamento/page.tsx`:
```ts
import ApresentaDados from "./ApresentaDados";

const TesteCarregamento = () => {
    
    return (
        <div>
            <ApresentaDados />
        </div>
    );
};

export default TesteCarregamento;
```

Note que a página demora 2 segundos para ser carregada e o usuário. O usuário pode ter uma experiência melhor neste tipo de situação quando uma página de carregamento é apresentada antes da página com os dados.

O Next permite fazer isso de forma simples, apenas criando uma página `loading.tsx`:

`/src/app/loading.tsx`:
```ts
const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold">Carregando...</h2>
        </div>
    )
}

export default Loading;
```

A página acima foi construída para ser apresentada quando tivermos carregamentos possivelmente demorados. Note que o Next já apresenta automaticamente a página de carregamento até que a página contendo os dados seja apresentada.

Você também pode apresentar a página de carregamento dentro da página que estiver sendo apresentada:

`/src/app/teste-carregamento/page.tsx`:
```ts
import { Suspense } from "react";
import ApresentaDados from "./ApresentaDados";
import Loading from "../loading";

const TesteCarregamento = () => {
    
    return (
        <div>
          <h1 className="text-3xl font-bold">Teste de Carregamento</h1>
            <Suspense fallback={<Loading />}>
                <ApresentaDados />
            </Suspense>
        </div>
    );
};

export default TesteCarregamento;
```

Ou você também pode fornecer inline o JSX desejado para o fallback:

`/src/app/teste-carregamento/page.tsx`:
```ts
import { Suspense } from "react";
import ApresentaDados from "./ApresentaDados";

const TesteCarregamento = () => {
    
    return (
        <div>
          <h1 className="text-3xl font-bold">Teste de Carregamento</h1>
            <Suspense fallback={<p>Carregando dados...</p>}>
                <ApresentaDados />
            </Suspense>
        </div>
    );
};

export default TesteCarregamento;
```

Componentes com funções assíncronas só podem ser do tipo servidor. Se for necessário criar um componente do tipo cliente, você deve utilizar o Hook `use`:

`/src/app/teste-carregamento/ApresentaDados.tsx`:
```ts
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
```

## Layouts

Veja o arquivo `src/app/layout.tsx`. Este arquivo possui o layout padrão, que será utilizado em toda a nossa aplicação. Experimente alterá-lo para: 

`/src/app/layout.tsx`:
```ts
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minha aplicação Next.js",
  description: "Aplicação para demonstrar o roteamento e layouts no Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
      >
        <h1 className="text-3xl font-bold bg-blue-300">Esta é a minha aplicação Next.js</h1>
          {children}
        <footer className="text-3xl font-bold bg-blue-300">Fim da aplicação</footer>
      </body>
    </html>
  );
}
```
Note no browser a mudança no título da página, que geralmente é apresentado como título da aba do navegador.

Navegue para diferentes páginas e note que temos, em todas as páginas, o cabeçalho e o rodapé que inserimos no layout. Note também que o conteúdo renderizado pela rota é apresentado no lugar de `{children}`, que é uma propriedade recebida pelo componente da página de layout.

Agora vamos criar um layout para uma rota expecífica:

`/src/app/(vogais)/layout.tsx`:
```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minha aplicação Next.js",
  description: "Aplicação para demonstrar o roteamento e layouts no Next.js",
};

export default function VogalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <h1 className="text-3xl font-bold bg-orange-300">Vogais aqui</h1>
        {children}
        <footer className="text-3xl font-bold bg-orange-300">Fim do componente vogal</footer>
    </>
  );
}
```

Criamos um layout a ser apresentado somente para as páginas que estiverem dentro da pasta `(vogais)`. Teste isso acessando a rota `/a` e a rota `/teste-carregamento` e veja como funciona a composição de layout na rota `/a`.
