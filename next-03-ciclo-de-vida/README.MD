# Ciclo de Vida de um Componente React

Neste material você irá aprender sobre ciclo de vida de componentes React. Vamos iniciar com o exemplo de um contador que pode ser incrementado ou decrementado e que, à princípio, tem o seu valor apresentado em unidades. Sempre que o módulo do contador for maior ou igual a 10, nosso sistema apresentará o contador em dezenas. Para isso, crie os componentes abaixo:

Novo componente `src/app/ContadorUnidades.tsx`:
```ts
export default function ContadorUnidades({ unidades } : { unidades: number }) {    
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">
                  {unidades} unidades
                </h2>
            </div>
        </div>
  );
}
```

O componente acima recebe a propriedade `unidades` e apresenta a mesma em um cabeçalho `h2`.

Novo componente `src/app/ContadorDezenas.tsx`:
```ts
export default function ContadorDezenas({ unidades } : { unidades: number }) {    
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">
                  {Math.floor(unidades / 10)} dezenas e {unidades % 10} unidades
                </h2>
            </div>
        </div>
  );
}
```

O componente acima recebe a propriedade `unidade`, calcula a quantidade de dezenas e unidades presentes na quantia recebida e apresenta estes valores em um cabeçalho `h2`.

Novo componente `src/app/Contador.tsx`:

```ts
import { useState } from "react";
import ContadorDezenas from "./ContadorDezenas";
import ContadorUnidades from "./ContadorUnidades";
    
export default function Contador() {
    const [contador, setContador] = useState(0);
    const [texto, setTexto] = useState('Contador');

    const incrementar = () => {
        setContador(contador + 1);
    };

    const decrementar = () => {
        setContador(contador - 1);
    };

    return (
        <div className="hover:bg-gray-100  rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <input className="text-3xl" value={texto} onChange={(e) => setTexto(e.target.value)} />
                <div className="text-xl font-bold">
                    {
                        contador <= -10 || contador >= 10 ? 
                            <ContadorDezenas  unidades={contador} /> : 
                            <ContadorUnidades unidades={contador} />
                    }
                </div>
                <div className="flex justify-between mt-4">
                    <button onClick={decrementar} className="bg-red-500 text-white px-4 py-2 rounded">-</button>
                    <button onClick={incrementar} className="bg-green-500 text-white px-4 py-2 rounded">+</button>
                </div>
            </div>
        </div>
  );
}
```

O componente `Contador`, renderiza o componente `ContadorUnidades` caso o valor do contador não possua nenhuma dezena ou renderiza o componente `ContadorDezenas` caso contrário. Além disso, o título do nosso componente é editável. Isso pode parecer estranho à princípio, porém este recurso foi pensado para possibilitar apresentar a você um entendimento melhor sobre o ciclo de vida dos nossos componentes, conforme será explicado a seguir.

Veja agora como fica o código do  `src/app/Page.tsx`:

```ts
import Contador from "./Contador";

export default function Home() {
    return (
      <Contador />
    );
}
```

Antes de continuarmos, execute o projeto (`npm run dev`) e verifique o funcionamento do mesmo.

Agora vamos falar sobre o hook `useEffect`. Este hook permite executarmos tarefas sempre que o componente for inicializado, atualizado ou descarregado. Vamos começar importando este hook no arquivo `src/app/ContadorDezenas.tsx` (à partir deste ponto, todos os exemplos de `useEffect` serão feitos no componente `ContadorDezenas.tsx`):

```ts
import { useEffect } from 'react';
```

A nossa primeira utilização deste hook ficará assim:

```ts
import { useEffect } from "react";

export default function ContadorDezenas({ unidades } : { unidades: number }) {    
    useEffect(() => {
        console.log('Alterado:', unidades);
    });

    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">
                  {Math.floor(unidades / 10)} dezenas e {unidades % 10} unidades
                </h2>
            </div>
        </div>
  );
}
```

Note que a função `useEffect` foi chamada dentro da nossa função `ContadorDezenas` e que, como parâmetro para `useEffect`, foi passada uma função que, quando chamada, loga o valor da propriedade `unidades`. Se a sua aplicação não estiver sendo executada, lembre-se de deixá-la sendo executada durante todo este tutorial. Abra-a agora e tecle `Ctrl + Shit + i` em seu browser para que o mesmo apresente as *Ferramentas do Desenvolvedor*. Agora clique no botão `+` até que o sistema apresente uma dezena e duas unidades (fique atento quando o sistema apresentar alguma mensagem no console das ferramentas do desenvolvedor). Agora que já atingimos as dezenas nos números positivos, clique no botão `-` até que o sistema apresente a você uma dezena e duas unidades negativas (fique atento ao console).

Como você deve ter notado, assim que o componente `ContadorDezenas` é apresentado, o hook `useEffect` inicia a chamada do log a cada alteração de estado. Quando o componente `ContadorDezenas` deixa de ser renderizado, o log deixa de ser efetuado.

Agora vamos entender o motivo de eu ter deixado o título da aplicação como editável. Faça o seguinte: clique no botão `+` da aplicação até que o componente `ContadorDezenas` seja renderizado e comece a logar as alterações de estado. No console das ferramentas do desenvolvedor, para limpar o console, clique no botão `Clear Console` (este botão costuma ter o símbolo de proibido - círculo cortado: `(/)`) ou digite `Ctrl + L`. Quando o componente `ContadorDezenas` estiver sendo apresentado, clique no título "Contador" da aplicação e altere o mesmo para "Contadores". Você deve ter notado que a aplicação logou as unidades mesmo quando alteramos o título. Isso acontece por não termos atrelado a execução do hook `useEffect` à mudança do valor de `unidades`. Podemos fazer isso adicionando um segundo parâmetro à função `useEffect` contendo os valores que, quando alterados, implicarão na execução da função passada por parâmetro para o hook. Veja como ficou e teste novamente alterar tanto as unidades até chegar nas dezenas quanto alterar o título:

```ts
import { useEffect } from "react";

export default function ContadorDezenas({ unidades } : { unidades: number }) {    
    useEffect(() => {
        console.log('Alterado:', unidades);
    }, [unidades]);
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">
                  {Math.floor(unidades / 10)} dezenas e {unidades % 10} unidades
                </h2>
            </div>
        </div>
  );
}
```

Agora entendemos como é possível executar uma função sempre que qualquer estado da aplicação for alterado ou quando um valor específico for alterado.

E se quisermos executar a função do hook apenas uma vez na inicialização do componente? Basta fornecer como segundo parâmetro para o hook um array vazio:

```ts
import { useEffect } from "react";

export default function ContadorDezenas({ unidades } : { unidades: number }) {    
    useEffect(() => {
        console.log('Alterado:', unidades);
    }, []);
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">
                  {Math.floor(unidades / 10)} dezenas e {unidades % 10} unidades
                </h2>
            </div>
        </div>
  );
}
```

Agora limpe o console, chegue nas dezenas positivas e, em seguida, negativas e note que a função é executada a cada momento que o componente ContadorDezenas volta a ser carregado, porém não é executada a cada alteração do componente.

Neste momento, uma situação deve estar te incomodando: o contador está sendo apresentado duas vezes quando o componente passa a ser renderizado. Não se preocupe, pois isso só acontece em modo de desenvolvimento e serve para que o React consiga checar o componente antes da sua utilização, identificando possíveis problemas. Não precisa fazer isso agora, porém se você parar a execução do modo de desenvolvimento (`Ctrl + c` no terminal), compilar a aplicação (`npm run build`) e executar a aplicação em modo de produção (`npm start`), notará que o hook será executado apenas uma vez a cada momento que o componente for carregado. Se tiver feito este teste, lembre-se de parar a execução novamente e voltar a executar em modo desenvolvedor (`npm run dev`).

Agora que já sabemos como executar uma função somente na inicialização de um componente e também sabemos como executar uma função na atualização de um ou mais valores, nos resta executar funções quando o componente for descarregado. Para isso, vamos alterar o nosso componete `ContadorDezenas` mais uma vez:

```ts
import { useEffect } from "react";

export default function ContadorDezenas({ unidades } : { unidades: number }) {    
    useEffect(() => {
        console.log('Contador de dezenas montado com o valor:', unidades);
        
        return () => {console.log('Contador de dezenas desmontado com o valor:', unidades);}
    }, []);
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">
                  {Math.floor(unidades / 10)} dezenas e {unidades % 10} unidades
                </h2>
            </div>
        </div>
  );
}
```

A função retornada pelo `useEffect` descarrega o componente. Agora temos o nosso componente logando a montagem do componente e a desmontagem do componente.

Vamos fazer uma mudança no componente `src/app/Contador.tsx`, que passará para 9 o contador sempre que o mesmo atingir o valor 12:

```ts
import { useState, useEffect } from "react";
import ContadorDezenas from "./ContadorDezenas";
import ContadorUnidades from "./ContadorUnidades";
    
export default function Contador() {
    const [contador, setContador] = useState(0);
    const [texto, setTexto] = useState('Contador');

    const incrementar = () => {
        if (contador >= 12) {
            setContador(9);    
        } else {
            setContador(contador + 1);
        }
    };

    const decrementar = () => {
        setContador(contador - 1);
    };

    return (
        <div className="hover:bg-gray-100  rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <input className="text-3xl" value={texto} onChange={(e) => setTexto(e.target.value)} />
                <h2 className="text-xl font-bold">
                    {
                        contador <= -10 || contador >= 10 ? 
                            <ContadorDezenas  unidades={contador} /> : 
                            <ContadorUnidades unidades={contador} />
                    }
                </h2>
                <div className="flex justify-between mt-4">
                    <button onClick={decrementar} className="bg-red-500 text-white px-4 py-2 rounded">-</button>
                    <button onClick={incrementar} className="bg-green-500 text-white px-4 py-2 rounded">+</button>
                </div>
            </div>
        </div>
  );
}
```

Note que, como a função a ser executada na desmontagem do componente é retornada na execução inicial do `useEffect`, ela sempre retornará como `unidades` o valor inicial em que ela foi executada, pois a mesma é executada somente na inicialização do componente, uma vez que passamos um vetor vazio como segundo parâmetro. Note que esta função ficou "armazenada" logando o valor inicial de `unidades` até o momento da sua execução.

Se desejar descarregar recursos em acordo com o estado da aplicação, forneça o estado desejado no vetor do segundo parâmetro da função `useEffect`:

```ts
import { useEffect } from "react";

export default function ContadorDezenas({ unidades } : { unidades: number }) {    
    
    useEffect(() => {
        console.log('Contador de dezenas montado com o valor:', unidades);

        return () => {console.log('Contador de dezenas desmontado com o valor:', unidades);}
    }, [unidades]);
    return (
        <div className="hover:bg-gray-900 hover:text-white transition duration-300 max-w-sm rounded overflow-hidden shadow-lg">
            <div className="grid grid-rows-2 py-4 px-8">
                <h2 className="text-xl font-bold">{Math.floor(unidades / 10)} dezenas e {unidades % 10} unidades</h2>
            </div>
        </div>
  );
}
```

Vamos também retornar o código do nosso componente `src/app/Contador.tsx` para o seu funcionamento normal:

```ts
...
    const incrementar = () => {
        setContador(contador + 1);
    };
...
```

Neste ponto, temos uma aplicação que loga cada vez que o componente dezenas é renderizado com um determinado valor de `unidades` e também loga a "saída" de cada valor de `unidades`, o que serviria para carregar e descarregar recursos com base no estado da aplicação.

Espero que, após este tutorial, você tenha entendido que o hook `useEffect` pode ser utilizado para executar funções na inicialização, atualização e na descarga de componentes React.
