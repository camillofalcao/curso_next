# Componentes em React, suas Propriedades e Estado

Neste material você irá aprender a criar componentes em React, passando propriedades e controlando o estado destes.

Vamos iniciar criando um novo projeto chamado `posts`. Logo após a criação do projeto, vamos instalar o Faker, que é uma biblioteca que nos ajuda a obter dados fictícios para que possamos testar nossas interfaces.

```
npm install @faker-js/faker --save-dev
```

Agora você já pode abrir o projeto no VSCode ou em seu editor de código fonte preferido. A utilização do Faker é muito simples: basta importá-lo (`import { faker } from '@faker-js/faker';`) e utilizá-lo:

```ts
import { faker } from '@faker-js/faker';

export default function Home() {
  return (
    <img src={faker.image.avatar()} className="rounded-full h-12 w-12 mb-4" />
  );
}
```

Rode o projeto e note que, cada vez que `faker.image.avatar()` é chamado, ele retorna uma nova imagem de avatar.

Mais informações sobre o Faker podem ser obtidas diretamente no site: https://fakerjs.dev. Sugiro que procure a seção API para que possa conhecer melhor as possibilidades de uso do Faker.

Neste ponto, vamos criar um componente principal baseado no seguinte componente: https://tailwindflex.com/@mr-robot/blog-post-cards. É possível obter o código fonte deste componente clicando em `Code` neste site.

Você deve colar este código substituindo os três pontos (`...`) do código abaixo:

```ts
import { faker } from '@faker-js/faker';

export default function Home() {
  return (
    ...
  );
}
```

Como você deve ter notado, será necessário adaptar este código, que é HTML, para JSX. Para isso, substitua toda ocorrência de `class=` por `className=`. Além disso, toda tag JSX precisa ser fechada, logo linhas como:

```html
<img src="...">
<hr>
```

Devem ser substituídas por suas versões com fechamento das tags:

```html
<img src="..." />
<hr />
```

Após solucionar todos os problemas, basta substituir as imagens por imagens geradas pelo Faker. Segue o código após adicionar as chamadas para o Faker:

```ts
import { faker } from '@faker-js/faker';

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
            <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
                <div className="py-4 px-8">
                    <img src={faker.image.avatar()} className="rounded-full h-12 w-12 mb-4" />
                    <a href="#">
                        <h4 className="text-lg mb-3 font-semibold">How to be effective at working remotely?</h4>
                    </a>
                    <p className="mb-2 text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>

                    <img src={faker.image.urlPicsumPhotos()} className="w-full h-50" />

                    <hr className="mt-4" />
                    <span className="text-xs">ARTICLE</span>
                    &nbsp;<span className="text-xs text-gray-500">PROCESS</span>
                </div>
            </div>

            <div
                className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
                <div className="py-4 px-8">
                    <img src={faker.image.avatar()} className="rounded-full h-12 w-12 mb-4" />
                    <a href="#">
                        <h4 className="text-lg mb-3 font-semibold">How to be effective at working remotely?</h4>
                    </a>
                    <p className="mb-2 text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>

                    <img src={faker.image.urlPicsumPhotos()} className="w-full h-50" />

                    <hr className="mt-4" />
                    <span className="text-xs">ARTICLE</span>
                    &nbsp;<span className="text-xs text-gray-500">PROCESS</span>
                </div>
            </div>

            <div
                className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
                <div className="py-4 px-8">
                    <img src={faker.image.avatar()} className="rounded-full h-12 w-12 mb-4" />
                    <a href="#">
                        <h4 className="text-lg mb-3 font-semibold">How to be effective at working remotely?</h4>
                    </a>
                    <p className="mb-2 text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>

                    <img src={faker.image.urlPicsumPhotos()} className="w-full h-50" />

                    <hr className="mt-4" />
                    <span className="text-xs">ARTICLE</span>
                    &nbsp;<span className="text-xs text-gray-500">PROCESS</span>
                </div>
            </div>

        </div>
    </div>
  );
}
```

Em React, códigos como o acima não devem ser construídos. React defende a criação de componentes reutilizáveis, que podem ser aninhados. Uma aplicação em React é construída pela composição de objetos. Vamos passo a passo melhorar a nossa página contendo os posts então.

Iniciaremos criando o componente `Post.tsx`. Vamos substituir os três posts da nossa página pela utilização do componente Post três vezes. Vamos iniciar criando o arquivo `/src/app/Post.tsx`: 

```ts
import { faker } from '@faker-js/faker';

export default function Post() {
    const avatar = faker.image.avatar();
    const titulo = faker.lorem.lines(1);
    const resumo = faker.lorem.sentence();
    const foto = faker.image.urlPicsumPhotos();
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <div>
                    <img src={avatar} className="rounded-full h-12 w-12 mb-4" />
                    <a href="#">
                        <h4 className="text-lg mb-3 font-semibold">{titulo}</h4>
                    </a>
                    <p className="mb-2 text-sm text-gray-600">{resumo}</p>
                </div>
                <div>
                    <img src={foto} className="w-full h-50" />
                    <hr className="mt-4" />
                </div>
            </div>
        </div>
  );
}
```

Note que o arquivo acima foi criado com base no que é definido como um post em nosso exemplo baixado. Apenas para se adequar melhor ao exemplo que pretendo apresentar, fiz pequenas alterações no cartão do post e separei de antemão os textos que serão diferentes para cada post.

No arquivo `/src/app/page.tsx`, vamos importar o nosso componente criado (`import Post from './Post';`) e vamos utilizá-lo:

```ts
import { faker } from '@faker-js/faker';
import Post from './Post';

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
            <Post />
            <Post />
            <Post />
        </div>
    </div>
  );
}
```

Note que o componente é utilizado através do nome em que foi importado sendo informado como uma tag JSX (`<Post />`).

Agora o nosso código já está melhor organizado, porém os posts são iguais, exceto pelo uso do Faker, que já nos permitiu gerar dados aleatórios para o preenchimento dos posts. Em um sistema real, precisaríamos passar parâmetros para os componentes e isso é feito através das propriedades (`props`) do mesmo.

Um componente React pode receber propriedades, sendo que estas são passadas como atributos das tags. Para passar o título como parâmetro para o componente Post, faríamos isso: `<Post titulo="Título aqui..." />`, só que para isso, precisamos alterar o nosso componente para receber o título como `props`:

```ts
type PostProps = {
    avatar: string,
    titulo: string,
    resumo: string,
    foto: string
}

export default function Post(props: PostProps) {
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <div>
                    <img src={props.avatar} className="rounded-full h-12 w-12 mb-4" />
                    <a href="#">
                        <h4 className="text-lg mb-3 font-semibold">{props.titulo}</h4>
                    </a>
                    <p className="mb-2 text-sm text-gray-600">{props.resumo}</p>
                </div>
                <div>
                    <img src={props.foto} className="w-full h-50" />
                    <hr className="mt-4" />
                </div>
            </div>
        </div>
  );
}
```

Note que criamos o tipo `PostProps` que define quais propriedades são necessárias para o `Post`. Agora, no `/src/app/page.tsx`, enquanto não passarmos todas as propriedades de cada Post, um erro será apresentado. Com isso, Typescript nos auxilia a perceber se alguma propriedade obrigatória ficou esquecida.

Note que recebemos `props` por parâmetro na função `Post`.

Agora veja que passamos o código contendo o Faker novamente para o arquivo `page.tsx`:

```ts
import { faker } from '@faker-js/faker';
import Post from './Post';

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
            <Post 
                avatar={faker.image.avatar()} 
                titulo={faker.lorem.lines(1)} 
                resumo={faker.lorem.sentence()} 
                foto={faker.image.urlPicsumPhotos()}
            />
            <Post 
                avatar={faker.image.avatar()} 
                titulo={faker.lorem.lines(1)} 
                resumo={faker.lorem.sentence()} 
                foto={faker.image.urlPicsumPhotos()}
            />
            <Post 
                avatar={faker.image.avatar()} 
                titulo={faker.lorem.lines(1)} 
                resumo={faker.lorem.sentence()} 
                foto={faker.image.urlPicsumPhotos()}
            />
        </div>
    </div>
  );
}
```

Também é possível utilizar destructuring (`{avatar, titulo, resumo, foto}: PostProps`) ao receber as propriedades por parâmetro. Isso nos desobriga a ficar digitando `props.` em cada propriedade recebida por parâmetro:

```ts
type PostProps = {
    avatar: string,
    titulo: string,
    resumo: string,
    foto: string
}

export default function Post({avatar, titulo, resumo, foto}: PostProps) {
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <div>
                    <img src={avatar} className="rounded-full h-12 w-12 mb-4" />
                    <a href="#">
                        <h4 className="text-lg mb-3 font-semibold">{titulo}</h4>
                    </a>
                    <p className="mb-2 text-sm text-gray-600">{resumo}</p>
                </div>
                <div>
                    <img src={foto} className="w-full h-50" />
                    <hr className="mt-4" />
                </div>
            </div>
        </div>
  );
}
```

Para tornar o nosso exemplo mais real, perceba que, geralmente o nosso frontend se comunica com o backend e recebe os posts a serem apresentados em um array. Vamos fazer uma alteração em nosso código para que os dados dos posts passem a ser recebidos em um array:

```ts
import { faker } from '@faker-js/faker';
import Post from './Post';

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
            {
              obterDados().map(x => {
                return <Post avatar={x.avatar} titulo={x.titulo} resumo={x.resumo} foto={x.foto} />
              })
            }
        </div>
    </div>
  );
}

class Postagem {
  constructor(id: number, avatar: string, titulo: string, resumo: string, foto: string) {
    this.id = id;
    this.avatar = avatar;
    this.titulo = titulo;
    this.resumo = resumo;
    this.foto = foto;
  }
  id: number;
  avatar: string;
  titulo: string;
  resumo: string;
  foto: string;
}

function obterDados() : Postagem[] {
  return [
    new Postagem(1, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(2, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(3, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
  ];
}
```

Note que o ícone das ferramentas do desenvolvedor ficou vermelho e, clicando nele, você pode visualizar que ocorreu um erro: "Each child in a list should have a unique 'key' prop".

Para que o React consiga renderizar listas corretamente, é fundamental que ele saiba identificar cada item em uma lista. Isso ocorre devido ao React aplicar a renderização em um DOM virtual, comparar o DOM virtual com o DOM e atualizar o DOM apenas no que o mesmo for diferente do DOM virtual.

Para solucionar o problema da necessidade da propriedade key, vamos colocar o id de cada post como a sua key (`return <Post key={x.id} avatar={x.avatar} ...`):

```ts
import { faker } from '@faker-js/faker';
import Post from './Post';

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
            {
              obterDados().map(x => {
                return <Post key={x.id} avatar={x.avatar} titulo={x.titulo} resumo={x.resumo} foto={x.foto} />
              })
            }
        </div>
    </div>
  );
}

class Postagem {
  constructor(id: number, avatar: string, titulo: string, resumo: string, foto: string) {
    this.id = id;
    this.avatar = avatar;
    this.titulo = titulo;
    this.resumo = resumo;
    this.foto = foto;
  }
  id: number;
  avatar: string;
  titulo: string;
  resumo: string;
  foto: string;
}

function obterDados() : Postagem[] {
  return [
    new Postagem(1, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(2, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(3, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
  ];
}
```

## Controlando o Estado da Aplicação (state)

Sistemas reais geralmente precisam se comunicar com um servidor para obter os dados a serem apresentados, logo é comum que iniciem com uma mensagem que indica que o recurso está sendo carregado e, assim que os dados são obtidos do servidor, a interface é atualizada e passa a apresentar os dados.

Para fazer isso, precisamos controlar o estado da nossa aplicação, que iniciará sem dados e, após a requisição feita ao servidor, apresentará os dados. Vamos iniciar fazendo isso de uma forma, mas esta forma será alterada posteriormente.

A idéia é termos uma renderização condicional onde, se os dados não estão carregados, apresentamos a mensagem "Carregando..." e chamamos a função que retorna os dados. Assim que os dados são carregados, a interface é alterada para apresentá-los. O nosso controle de estado será então o vetor dados, que poderá estar como `undefined` ou com posts carregados do nosso backend.

Como não estamos trabalhando com backend no momento, vamos adicionar um delay para alteração do estado da aplicação de forma a simular a passagem do tempo durante a carga dos dados.

O controle de estado em componentes do tipo função é realizado através de um Hook chamado `useState`.

Antes da introdução dos hooks em React na versão 16.7, componentes do tipo função tinham acesso às propriedades, mas não tinham acesso ao estado e aos métodos do ciclo de vida dos componentes.

**Uma informação importante sobre o controle de estado no Next**: componentes em Next geralmente são executados no servidor ao invés de serem executados no cliente. **Apenas componentes que executam no cliente possuem acesso ao controle de estado**. Para que um componente seja executado no cliente, a primeira linha do código do mesmo deve ser: `'use client'`.

Antes de utilizarmos o hook `useState`, será necessário importá-lo: `import { useState } from 'react';`

Este hook é uma função que retorna um array contendo dois parâmetros: o primeiro é o dado a ser armazenado e o segundo é uma função que permite alterar o dado. O dado nunca deve ser alterado diretamente, ou seja, **sempre** que for necessário alterar o dado, você deve fazê-lo exclusivamente através da função que permite alterá-lo. A função `useState` recebe por parâmetro o valor inicial do dado a ser mantido. Veja o exemplo abaixo que mostra como seria o controle de estado do nome em algum componente React. Este exemplo não está relacionado ao exemplo dos posts que estamos trabalhando.

```ts
//Como desejamos controlar o nome, a constante se chamará "nome" enquanto a função que permite alterar o nome se chamará "setNome". O tipo genérico é uma string, pois desejamos controlar um dado que é do tipo string. O nome inicial será "Ana".
const [nome, setNome] = useState<string>("Ana");

<p>Olá {nome}!</p>

if (nome === "Ana") {
  //Para alterar o nome, chama-se a função setNome:
  setNome("Ana Maria");
}
```

Uma informação importante: ao chamar a função `setNome`, que foi apresentada no código acima, o sistema irá renderizar novamente o componente, só que o valor da constante `nome` estará atualizado para aquele informado na chamada da função. Como o componente será renderizado novamente, o parágrafo passará a ter novo conteúdo, pois o nome é diferente do nome apresentado anteriormente.

Lembre-se: sempre que a função que atualiza o estado for chamada, o componente será renderizado novamente. Com isso, o React aplicará as alterações ao DOM virtual para, em seguida, comparar o DOM virtual com o DOM e realizar as alterações necessárias.

Antes de utilizarmos o controle de estado em nossa aplicação, vamos criar o componente `Spinner`, que poderá ser chamado assim: `<Spinner mensagem="Carregando..." />`. Este componente apresentará a mensagem passada por parâmetro de forma a informar ao usuário que dados estão sendo carregados. Segue o código do `/src/app/Spinner.tsx`:

```ts
type SpinnerProps = { mensagem: string };

export default function Spinner({ mensagem }: SpinnerProps) {
    return (
        <div className="text-center mt-5">
        <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <div>{mensagem}</div>
        </div>
      </div>
    );
};
```

Agora vamos voltar ao nosso componente que apresenta os posts. Este é o novo código do `/src/app/page.tsx`:

```ts
'use client'

import { useState } from 'react';
import { faker } from '@faker-js/faker';
import Post from './Post';
import Spinner from './spinner';

export default function Home() {
  const [dados, setDados] = useState<Array<Postagem> | undefined>(undefined);

  if (!dados) {

    setTimeout(() => {
      setDados(obterDados());
    }, 2000);

    return (
      <Spinner mensagem="Carregando..." />
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="sm:grid lg:grid-cols-3 sm:grid-cols-2 gap-10">
            {
              obterDados().map(x => {
                return <Post key={x.id} avatar={x.avatar} titulo={x.titulo} resumo={x.resumo} foto={x.foto} />
              })
            }
        </div>
    </div>
  );
}

class Postagem {
  constructor(id: number, avatar: string, titulo: string, resumo: string, foto: string) {
    this.id = id;
    this.avatar = avatar;
    this.titulo = titulo;
    this.resumo = resumo;
    this.foto = foto;
  }
  id: number;
  avatar: string;
  titulo: string;
  resumo: string;
  foto: string;
}

function obterDados() : Postagem[] {
  return [
    new Postagem(1, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(2, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(3, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
  ];
}
```

Note que o estado inicial, armazenado na constante `dados` é `undefined`. O sistema irá renderizar o `Spinner` se o estado for `undefined` ou irá renderizar as postagens caso contrário. Para simular o delay que temos em carga de dados de sistemas reais, a seguinte função foi chamada quando os dados não estão carregados:

```ts
setTimeout(() => {
  setDados(obterDados());
}, 2000);
```

A função acima chamará a função recebida por parâmetro após a passagem de 2000 milisegundos (2 segundos). Com isso, o sistema apresentará como tela inicial a mensagem "Carregando..." (componente Spinner) e, assim que for chamada a função `setDados`, o sistema irá renderizar novamente realizando a alteração do estado, o que fará com que o `if (!dados)` execute o bloco do *else*, renderizando as postagens.

Para completar o nosso exemplo, precisamos entender que aplicações React são construídas através da criação e combinação de componentes e que o nosso componente `Page`, que por enquanto sabemos apenas que é o primeiro componente a ser renderizado, está com a semântica incorreta, pois o mesmo está tomando o papel de um componente que renderiza uma lista de posts. À princípio, isso pode parecer inofensivo, porém em um sistema real, talvez a lista de posts poderia ser apresentada em mais de uma interface ou ainda a nossa página poderia apresentar mais que somente uma lista de posts, o que deixaria a mesma menos coesa.

Vamos criar o componente `/src/app/PostList.tsx` para solucionar isso:

```ts
'use client'

import { useState } from 'react';
import { faker } from '@faker-js/faker';
import Post from './Post';
import Spinner from './spinner';

export default function PostList() {
  const [dados, setDados] = useState<Array<Postagem> | undefined>(undefined);

  if (!dados) {

    setTimeout(() => {
      setDados(obterDados());
    }, 2000);

    return (
      <Spinner mensagem="Carregando..." />
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
            {
              obterDados().map(x => {
                return <Post key={x.id} avatar={x.avatar} titulo={x.titulo} resumo={x.resumo} foto={x.foto} />
              })
            }
        </div>
    </div>
  );
}

class Postagem {
  constructor(id: number, avatar: string, titulo: string, resumo: string, foto: string) {
    this.id = id;
    this.avatar = avatar;
    this.titulo = titulo;
    this.resumo = resumo;
    this.foto = foto;
  }
  id: number;
  avatar: string;
  titulo: string;
  resumo: string;
  foto: string;
}

function obterDados() : Postagem[] {
  return [
    new Postagem(1, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(2, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
    new Postagem(3, faker.image.avatar(), faker.lorem.lines(1), faker.lorem.sentence(), faker.image.urlPicsumPhotos()),
  ];
}
```

E este é o novo código do componente `/src/app/page.tsx`:

```ts
import PostList from "./PostList";

export default function Home() {
  return (
    <main>
      <PostList />
    </main>
  );
}
```

Agora temos componentes reutilizáveis em nosso sistema, que ficou com uma melhor divisão de responsabilidades entre os diferentes componentes.

Para melhorar o nosso entendimento sobre `state`, comente o conteúdo do arquivo `/src/app/page.tsx` e vamos implementar nele uma nova funcionalidade: vamos fazer o exemplo clássico do contador de cliques:

```ts
'use client'

import { useState } from 'react';

export default function Home() {
  const [cliques, setCliques] = useState(0);
  return (
    <main className='flex flex-col w-50 mt-5 ml-2'>
      <label className='self-center'>Cliques: {cliques}</label>
      <button 
        className='w-50 bg-blue-600 text-white border border-black rounded-lg' 
        onClick={() => setCliques(cliques + 1)}
      >
        Clique aqui
      </button>
    </main>
  );
}

// import PostList from "./PostList";

// export default function Home() {
//   return (
//     <main>
//       <PostList />
//     </main>
//   );
// }
```

No código acima, note como o sistema trata o clique do `button`: é passada uma função para a propriedade `onClick` que será executada sempre que este botão for clicado. Esta função chama a função `setCliques` passando, como novo valor para `cliques`, o valor anterior acrescentado em uma unidade.

Vamos ver agora como podemos utilizar o controle de estado para manter valores de inputs. Vamos continuar utilizando o componente `/src/app/page.tsx` para este exemplo.

```ts
'use client'

import { useState } from 'react';

export default function Home() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  return (
    <main className='flex flex-col w-50 mt-5 ml-2'>
      <div>
        <label>Nome:</label>
        <input 
          className='border border-gray-300 rounded-md p-1'
          type='text' 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
        />
      </div>
      <div>
        <label>Sobrenome:</label>
        <input 
          className='border border-gray-300 rounded-md p-1'
          type='text' 
          value={sobrenome} 
          onChange={(e) => setSobrenome(e.target.value)} 
        />
      </div>
      <label className='mt-2 mb-2'>{nome ? `Olá ${nome}${sobrenome ? ` ${sobrenome}` : ''}!` : ''}</label>
      <button 
        className='w-50 bg-blue-600 text-white border border-black rounded-lg' 
        onClick={() => {
          setNome('');
          setSobrenome('');
        }}
      >
        Limpar
      </button>
    </main>
  );
}

// import PostList from "./PostList";

// export default function Home() {
//   return (
//     <main>
//       <PostList />
//     </main>
//   );
// }
```

Note, nos inputs, a ligação feita com o estado da aplicação:  
* `value={nome}`: apresenta o valor da variável "nome" como valor do input  
* `onChange={(e) => setNome(e.target.value)}`: sempre que o evento "onChange" do input for chamado, altera o estado (setNome) para o novo valor informado no input (e.target.value).

Durante o nosso curso, trabalharemos com o controle de estado em diferentes componentes, o que te dará melhor domínio sobre este tema.

Agora vamos voltar o conteúdo original do componente `/src/app/page.tsx`:

```ts
import PostList from "./PostList";

export default function Home() {
  return (
    <main>
      <PostList />
    </main>
  );
}
```

E vamos voltar a nossa atenção para como foi realizada a carga dos dados (carregamento dos posts). Veja trecho do componente `/src/app/PostList.tsx`:
```ts
...

  if (!dados) {

    setTimeout(() => {
      setDados(obterDados());
    }, 2000);

...
```

Buscar dados na inicialização de um componente, realizar processamentos sempre que um componente é atualizado ou realizar ações quando um componente é descarregado são ações comuns em componentes React e, para facilitar estas tarefas e deixar claro o objetivo do código em questão, existe o controle do ciclo de vida de um componente React, que será o nosso próximo tema.
