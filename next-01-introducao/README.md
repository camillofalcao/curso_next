# Introdução ao Next.js - O Framework React para a Web

Este curso tem o objetivo de apresentar como aplicações Full Stack podem ser construídas utilizando Next.js.

Este curso está dividido em duas partes:
* **Desenvolvimento Frontend**: estudo do **ReactJS** para construção de interfaces com o usuário.
* **Desenvolvimento Backend**: como o **Next.js** pode ser utilizado para acesso à bases de dados, autenticação e autorização.

O nosso foco inicial será no frontend, porém Next é um framework full stack e, am alguns momentos neste início, estaremos utilizando componentes executados no backend. Nosso foco inicial é no entendimento do ReactJS, que é fundamental para o entendimento do Next.js. No final deste curso você deve ser capaz de construir uma aplicação completa em Next.js.

## Instalação

Vamos criar a nossa primeira aplicação! Para isso, basta seguir os passos abaixo. Sempre que for necessário criar uma nova aplicação, você poderá consultar novamente estes passos nesta página.

Para criar uma nova aplicação Next.js:

```
npx create-next-app@latest
```

Você receberá a seguinte mensagem, que deve responder com `y`:

```
Need to install the following packages:
create-next-app@???
Ok to proceed? (y)
```

Note que, no lugar de `???`, será apresentada a versão do NextJS.

Após aceitar prosseguir, serão apresentadas outras mensagens, que você deve selecionar em acordo com as opções detacadas abaixo. Note que, no lugar da expressão `nome-do-seu-projeto-aqui`, você deve digitar o nome do projeto a ser criado.

<span style="color:green">√ </span> What is your project named? ... <span style="color:blue">**nome-do-seu-projeto-aqui**</span>
<span style="color:green">√ </span> Would you like to use TypeScript? ... No / <span style="color:blue">**Yes** </span>  
<span style="color:green">√ </span> Which linter would you like to use? » <span style="color:blue">**ESLint** </span>  
<span style="color:green">√ </span> Would you like to use Tailwind CSS? ... No / <span style="color:blue">**Yes** </span>  
<span style="color:green">√ </span> Would you like your code inside a `src/` directory? ... No / <span style="color:blue">**Yes** </span>  
<span style="color:green">√ </span> Would you like to use App Router? (recommended) ... No / <span style="color:blue">**Yes** </span>  
<span style="color:green">√ </span> Would you like to use Turbopack? (recommended) ... No / <span style="color:blue">**Yes** </span>  
<span style="color:green">√ </span> Would you like to customize the import alias (`@/*` by default)? » <span style="color:blue">**No** </span> / Yes  

Após a criação do projeto, 

Altere o arquivo `/src/app/page.tsx` para o seguinte conteúdo:

```ts
export default function Home() {
  return (
    <div className="text-3xl text-blue-600 font-bold">
      Olá mundo!
    </div>
  );
}
```

Você pode executar o projeto com o seguinte comando:

```
npm run dev
```

Existem outras opções ao comando acima, se você não desejar utilizar o `npm`:  
* `yarn dev`  
* `pnpm dev`  
* `bun dev`

Após este comando, será apresentado em qual porta o seu projeto está sendo executado. Você deve digitar em seu browser ou simplesmente pressionar a tecla `<CTRL>` e clicar no endereço definido como **Local**:

   ▲ Next.js ??? (Turbopack)
   - **Local:**        **http://localhost:3000**
   - Network:      http://192.168.0.31:3000

Para parar a execução, você deve teclar `<CTRL> + <C>`.

Você também pode gerar uma versão otimizada para produção. Para isso:

1. Compile: `npx next build`
2. Execute: `npm start`

Neste tutorial, sempre que for solicitado "rodar" ou "executar" a aplicação, estaremos falando para fazê-lo em modo de desenvolvimento, ou seja, deve-se utilizar o comando `npm run dev` para isso.

Note que, quando estamos executando a nossa aplicação em modo de desenvolvimento, um ícone do Next.js é apresentado na tela. Este ícone apresenta algumas informações e permite realizar algumas ações. Falaremos sobre isso mais à frente neste curso.

## Estrutura do Projeto

Vamos iniciar pela pasta `/src/app`, que contém alguns arquivos importantes para o nosso projeto. São eles:

> src
>- app
>>- favicon.ico
>>- globals.css
>>- layout.tsx
>>- page.tsx

O arquivo `favicon.ico` contém o ícone apresentado no browser do usuário quando se acessa o sistema.

Já o arquivo `globals.css` contém CSS global para o nosso projeto. Como estamos utilizando TailwindCSS, as classes são aplicadas automaticamente. Por este motivo, o texto `Olá mundo!` foi apresentado em cor e tamanho diferentes em seu browser.

O arquivo `layout.tsx` apresenta o layout padrão da nossa aplicação. As nossas páginas serão renderizadas no local indicado por `{children}`. Você pode alterar o idioma nesta página no atributo `lang` do elemento `html`. Exemplo para português brasileiro:

```html
<html lang="pt-BR">
```

Finalmente, o arquivo `page.tsx` é o arquivo que trabalharemos no início deste curso. Ele é a primeira página a ser renderizada em nossa aplicação. Mais à frente, quando falarmos sobre roteamento, você entenderá melhor isso.

Fora da pasta `src`, também temos:

* public: pasta que contém arquivos estáticos
* node_modules: contém arquivos de dependências
* packages.json: armazena as dependências do nosso projeto e configura-o.
* packages-lock.json: guarda as versões de todas as dependências instaladas.

A pasta `node_modules` costuma possuir muitas pastas e arquivos. Esta pasta não costuma ser enviada para o repositório de código fonte e nem copiada, pois a mesma pode ser recriada através do comando:

```
npm install
```

Este comando possui a sua versão resumida:

```
npm i
```

Estes comandos acessam os arquivos `package.json` e `package-lock.json` e realizam o download das dependências configuradas nestes arquivos.

Sempre que você estiver executando o seu projeto (`npm run dev`) e realizar uma alteração no mesmo, o mesmo será automaticamente recarregado em seu browser. Experimente realizar a seguinte alteração no arquivo `/src/app/page.tsx`:

```ts
export default function Home() {
  return (
    <div className="text-3xl text-blue-600 font-bold">
      Este é um curso sobre Next.js!
    </div>
  );
}
```

Assim que salvar a alteração feita, verifique novamente a janela do seu browser. Neste momento você já conseguirá visualizar a nova frase.

Agora note a abertura de parênteses logo após o return. Se os parênteses forem retirados, só será possível realizar o retorno em uma única linha. Para que o JSX possa ser informado em múltiplas linhas, é necessário inserí-lo entre parênteses. Note também que é esperado o retorno de um único elemento, então o retorno de múltiplos elementos deve ser feito dentro de um elemento principal (`div`, por exemplo), conforme apresentado no código abaixo:

```ts
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl text-blue-600 font-bold">
        Este é um curso sobre Next.js!
      </h1>
      <h1 className="text-xl text-gray-500 font-bold">
        Espero que você curta o andamento do nosso curso.
      </h1>
    </div>
  );
}
```

## Entendendo o JSX

Você deve ter entendido o código do nosso arquivo `page.tsx` como retornando um HTML, porém você percebeu que não é retornada uma string? Você também percebeu que, ao invés da tag `class` nós utilizamos a tag `className`?

O trecho de código que se encontra dentro dos parênteses após o `return` no arquivo `page.tsx` não de trata de HTML e sim de JSX, que é um dialeto especial do Javascript.

Browsers não entendem JSX, ou seja, precisa ser transformado (transpilado) para chamadas válidas. Se você acessar https://babeljs.io, clicar em `Try it out` e colar o código que está em seu arquivo `page.tsx`, receberá o código transpilado utilizando Babel.

JSX é muito similar a HTML, com poucas diferenças de sintaxe, como:
* Estilizar elementos.  
&nbsp;&nbsp;&nbsp;HTML:  `<div style="background-color: red;">`  
&nbsp;&nbsp;&nbsp;JSX: `<div style={{backgroundColor: 'red'}}>`  
* Alguns nomes de atributos.  
&nbsp;&nbsp;&nbsp;HTML: `<label for="name">`  
&nbsp;&nbsp;&nbsp;JSX: `<label htmlFor="name">`  
* Adicionar uma classe a um elemento.  
&nbsp;&nbsp;&nbsp;HTML: `<label class="label">`  
&nbsp;&nbsp;&nbsp;JSX: `<label className="label">`  

## Expressões Typescript no JSX:

Para acessar o valor de uma variável, chamar funções para renderizar o seu retorno ou para indicar qualquer expressão que precisa ser avaliada, você deve colocar a expressão entre `{}`, conforme pode ser visto abaixo:

Interpolando o valor de uma variável ou constante:

```ts
export default function Home() {
  const nome = "Ana";
 
  return (
    <div className="text-3xl text-blue-600 font-bold">
      Olá {nome}!
    </div>
  );
}
```

Interpolando o retorno de uma função: 

```ts
export default function Home() {
  const nome = "Ana";
  const idade = 20;

  const somarMaisUm = (numero: number) : number => numero + 1;

  return (
    <div>
      <div className="text-3xl text-blue-600 font-bold">
        Olá {nome}!
      </div>
      <div>  
        No próximo ano você terá {somarMaisUm(idade)} anos.
      </div>
    </div>
  );
}

```

Interpolando uma expressão: 

```ts
export default function Home() {
  const nome = "Ana";

  return (
    <div className="text-3xl text-blue-600 font-bold">
    Olá {nome + " " + sobrenome}!
    </div>
  );
}

```

## Exercícios

**1 - Faça um componente React que apresente a mensagem "Bom dia!", "Boa tarde!" ou "Boa noite!", em acordo com a hora local. Para isso, utilize:**
```ts
const data = new Date();
data.getHours()
```

<details>
  <summary>Após concluir o seu exercício, clique aqui para visualizar uma possível resposta ao mesmo</summary>

```ts
export default function Home() {
  const getMensagem = () => {
    const data = new Date();
    if (data.getHours() < 12) {
      return "Bom dia!";
    } else if (data.getHours() < 19) {
      return "Boa tarde!";
    } else {
      return "Boa noite!";
    }
  };

  return (
    <div>
      {getMensagem()}
    </div>
  );
}
```
</details>

---

**2 - Faça um componente React que apresente um label e um input, sendo que o input deve receber o foco quando o label for clicado.**

<details>
  <summary>Após concluir o seu exercício, clique aqui para visualizar uma possível resposta ao mesmo</summary>

```ts
export default function Home() {
  return (
    <div>
        <label htmlFor="nome">Nome: </label>
        <input id="nome" className="border"/>
    </div>
  );
}
```
</details>
