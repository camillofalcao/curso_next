# Trabalhando com Context

Ao dividirmos as responsabilidades do que desejamos fazer entre vários objetos, é comum termos muitos níveis em que um componente precisa passar propriedades para outros componentes descendentes, sendo que alguns desses componentes podem acabar recebendo propriedades apenas para passarem as mesmas para outros componentes filhos, como podemos ver nos componentes que montaremos à seguir.

O nosso objetivo neste momento será criar uma barra de topo para uma aplicação contendo um menu e um botão para login que, quando clicado, simulará que o usuário efetuou o login no sistema. Quando o usuário estiver logado, o botão Logout será apresentado para permitir que o usuário faça o logoff do sistema. Vamos iniciar criando a interface Usuario, conforme código abaixo.

`/src/app/Usuario.ts`:
```ts
interface Usuario {
    nome: string;
    email: string;
}
export default Usuario;
```

O botão Login é apresentado à seguir.

`/src/app/Login.tsx`:
```ts
import Usuario from "./Usuario";

interface LoginProps {
    onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onLogin}
                className="bg-gray-200 hover:bg-white text-black px-3 py-1 rounded transition"
            >
                Login
            </button>
        </div>
    );
};

export default Login;
```

Já o botão Logout é apresentado à seguir.

`/src/app/Logout.tsx`:
```ts
import Usuario from "./Usuario";

interface LogoutProps {
    usuario: Usuario | undefined;
    onLogoff: () => void;
}

const Logout = ({ usuario, onLogoff }: LogoutProps) => {
    return (
        <div className="flex items-center gap-4">
            <span>{usuario?.nome}</span>
            <button
                onClick={onLogoff}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded transition"
            >
                Logoff
            </button>
        </div>
    );
};

export default Logout;
```

Existe um componente que vamos criar para que o mesmo possa ser utilizado na barra do topo da nossa aplicação. Este componente renderizará o componente Login se não houver usuário logado ou o nome do usuário seguido do componente Logout se existir usuário logado.

`/src/app/LoginLogout.tsx`:
```ts
import Login from "./Login";
import Logout from "./Logout";
import Usuario from "./Usuario";

interface LoginLogoutProps {
    usuario: Usuario | undefined;
    onLogin: () => void;
    onLogoff: () => void;
}

const LoginLogout = ({ usuario, onLogin, onLogoff }: LoginLogoutProps) => {
    return (
        <div className="flex items-center gap-4">
            {usuario ? (
                <Logout usuario={usuario} onLogoff={onLogoff} />
            ) : (
                <Login onLogin={onLogin} />
            )}
        </div>
    );
};

export default LoginLogout;
```

Neste momento já podemos ter o nosso componente BarraTopo:

`/src/app/BarraTopo.tsx`:
```ts
import LoginLogout from "./LoginLogout";
import Usuario from "./Usuario";

interface BarraTopoProps {
    usuario: Usuario | undefined;
    onLogin: () => void;
    onLogoff: () => void;
}

const BarraTopo = ({ usuario, onLogin, onLogoff }: BarraTopoProps) => {
    return (
        <header className="bg-black text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold">Minha Aplicação</span>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/configuracoes" className="hover:underline">Configurações</a></li>
          </ul>
        </nav>
      </div>
      <LoginLogout
        usuario={usuario}
        onLogin={onLogin}
        onLogoff={onLogoff}
      />
    </header>
    );
};

export default BarraTopo;
```

Agora o page.tsx:

`/src/app/page.tsx`
```ts
'use client';

import { useState } from "react";
import Usuario from "./Usuario";
import BarraTopo from "./BarraTopo";

const App = () => {
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

  const handleLogoff = () => {
    setUsuario(undefined);
  };

  const handleLogin = () => {
    setUsuario({"nome": "João Silva", "email": "joao@email.com"});
  }

  return (
    <BarraTopo
      usuario={usuario}
      onLogoff={handleLogoff}
      onLogin={handleLogin}
    />
  );
};

export default App;
```

Com isso, podemos Identificar a seguinte hierarquia de componentes:

```
1. page
1.1. BarraTopo     (usuário, handleLogin, handleLogout)
1.1.1. LoginLogout (usuário, handleLogin, handleLogout)
1.1.1.1. Login     (handleLogin)
1.1.1.2. Logout    (usuário, handleLogout)
```

Note que o componente BarraTopo recebe o usuário e os métodos que tratam o login e logout por parâmetro apenas para repassar estas propriedades para o componente LoginLogout. Por sua vez, o componente LoginLogout recebe as mesmas propriedades do seu componente pai somente para poder conhecer o usuário e para poder repassar as propriedades que cada componente filho (Login e Logout) precisam.

A necessidade de ter toda esta cadeia de componentes repassando suas props é uma complexidade a mais para lidarmos, só que esta complexidade pode ser diminuída ao trabalharmos com Context em React.

Um contexto permite compartilhar valores entre componentes descendentes (filhos, netos, bisnetos, etc) de forma simples. Com o uso de contexto, podemos fazer com que cada componente conheça somente as propriedades necessárias para seu funcionamento.

Para entendermos como que o contexto pode ser utilizado em React, vamos primeiramente entendê-lo de forma isolada. Existem três partes importantes quando estamos falando em contexto:
  - Criação do contexto;
  - Criação do provedor do contexto;
  - Uso do contexto

Para criar o contexto, utilizamos o Hook createContext. Deve ser informado um valor padrão para quando não existir provedor de serviço nos componentes ascendentes do componente em que estiver sendo utilizado o contexto. Vamos temporariamente chamar o contexto criado de `MeuContexto` para auxiliar nesta explicação.

O provedor de contexto deve ser criado utilizando-se o componente `MeuContexto.Provider` e passando-se o valor do contexto (valores e métodos que serão compartilhados).

O uso do contexto é feito através do Hook useContext, que permite acessar os valores e métodos de um determinado contexto.

Vamos agora ver quais alterações serão feitas em nossos componentes para que os mesmos utilizem contexto em React. Iniciaremos pela definição do tipo `UsuarioContext` que deve ser adicionado ao arquivo `/src/app/page.tsx` antes da linha `const App = () => {`:

```ts
...
interface UsuarioContextType  {
  usuario: Usuario | undefined;
  onLogoff: () => void;
  onLogin: () => void;
};
...
```

Agora criaremos e exportaremos o contexto (`/src/app/page.tsx`):

```ts
...
import { useState, createContext } from "react";
...
export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);
...
```
Agora que temos o contexto, vamos criar o provider. O código completo do componente `/src/app/page.tsx` se encontra abaixo.

NEste tutorial, várias vezes o seu código apresentará erros, mas não se preocupe, continue no tutorial que os erros serão solucionados.

```ts
'use client';

import { useState, createContext } from "react";
import Usuario from "./Usuario";
import BarraTopo from "./BarraTopo";

interface UsuarioContextType  {
  usuario: Usuario | undefined;
  onLogoff: () => void;
  onLogin: () => void;
};

export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

const App = () => {
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

  const handleLogoff = () => {
    setUsuario(undefined);
  };

  const handleLogin = () => {
    setUsuario({"nome": "João Silva", "email": "joao@email.com"});
  }

  return (
    <UsuarioContext.Provider value={{ usuario, onLogoff: handleLogoff, onLogin: handleLogin }}>
      <BarraTopo />
    </UsuarioContext.Provider>
  );
};

export default App;
```

Note que retiramos as propriedades que estavam sendo passadas para o componente BarraTopo. Vamos retirar então as propriedades deste componente, que deve ficar assim:

```ts
import LoginLogout from "./LoginLogout";
import Usuario from "./Usuario";

const BarraTopo = () => {
    return (
        <header className="bg-black text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold">Minha Aplicação</span>
        <nav>
          <ul className="flex gap-6">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/configuracoes" className="hover:underline">Configurações</a></li>
          </ul>
        </nav>
      </div>
      <LoginLogout />
    </header>
    );
};

export default BarraTopo;
```

Agora, o componente LoginLogout passou a não receber mais as propriedades, então vamos retirá-las. Além disso, utilizaremos o contexto pela primeira vez para ler o valor de `usuario`:

```ts
import { useContext } from "react";
import { UsuarioContext } from "./page";
import Login from "./Login";
import Logout from "./Logout";

const LoginLogout = () => {
    const usuario = useContext(UsuarioContext)?.usuario;

    return (
        <div className="flex items-center gap-4">
            {usuario ? (
                <Logout />
            ) : (
                <Login />
            )}
        </div>
    );
};

export default LoginLogout;
```

O próximo componente a ser alterado será o Login:

```ts
import React, { useContext } from "react";
import { UsuarioContext } from "./page";

const Login = () => {
    const contexto = useContext(UsuarioContext);

    if (!contexto) {
        throw new Error("Login deve ser usado dentro de um UsuarioContext.Provider");
    }
    const { onLogin } = contexto;

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onLogin}
                className="bg-gray-200 hover:bg-white text-black px-3 py-1 rounded transition"
            >
                Login
            </button>
        </div>
    );
};

export default Login;
```

Por último, vamos alterar o componente Logout. Procurei variar as formas de tratar a inexistência de provider para fins didáticos.

```ts
import { useContext } from "react";
import { UsuarioContext } from "./page";

const Logout = () => {
    const { usuario, onLogoff } = useContext(UsuarioContext) ?? {};

    if (!onLogoff) {
        throw new Error("Logout deve ser usado dentro de um UsuarioContext.Provider");
    }

    return (
        <div className="flex items-center gap-4">
            <span>{usuario?.nome}</span>
            <button
                onClick={onLogoff}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded transition"
            >
                Logoff
            </button>
        </div>
    );
};

export default Logout;
```

É chegada a hora de executar e verificar o funcionamento da aplicação. Você perceberá que o login e o logoff estão funcionando adequadamente.

Para finalizar o entendimento de contexto em React, criaremos agora dois novos componentes: Pagamento.tsx e PagamentoMoedas.tsx.

O componente PagamentoMoedas apresenta vários botões, um para cada nota ou moeda existente e controla o valor pago pelo usuário acumulando quantias representadas em cada botão clicado. Note que este componente provê um contexto para o componente filho Moeda. Segue o código:

`/src/app/PagamentoMoedas.tsx`:
```ts
import React, { useState, createContext } from "react";
import Moeda from "./Moeda";

interface PagamentoContextType {
  saldo: number;
  totalPago: number;
  pagamentoConcluido: boolean;
  pagar: (valor: number) => void;
}

export const PagamentoContext = createContext<PagamentoContextType | undefined>(undefined);

const valores = [0.05, 0.10, 0.25, 0.50, 1, 2, 5, 10, 20, 50, 100, 200];

interface PagamentoMoedasProps {
  saldoInicial?: number;
}

export const formatador = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PagamentoMoedas = ({ saldoInicial = 100 } : PagamentoMoedasProps) => {
  const [saldo, setSaldo] = useState(saldoInicial);
  const [totalPago, setTotalPago] = useState(0);
  const pagamentoConcluido = saldo <= 0;

  const pagar = (valor: number) => {
    setSaldo((prev) => +(prev - valor).toFixed(2));
    setTotalPago((prev) => +(prev + valor).toFixed(2));
  };

  const contexto = { saldo, totalPago, pagamentoConcluido, pagar };

  const troco = pagamentoConcluido ? +(totalPago - saldoInicial).toFixed(2) : 0;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Saldo a Pagar</h2>
      <div className="text-3xl font-mono text-center mb-6 text-blue-600">
        R$ {saldo > 0 ? formatador.format(saldo) : "0,00"}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <PagamentoContext.Provider value={contexto}>
        {
            valores.map((valor) => (
                <Moeda key={valor} valor={valor} />
            ))
        }
        </PagamentoContext.Provider>
      </div>
      {
        pagamentoConcluido && (
            <div className="mt-6 text-green-600 font-bold text-center">
            Pagamento concluído!<br />
            {troco > 0 && (
                <span className="text-lg text-blue-700">Troco: R$ {formatador.format(troco)}</span>
            )}
            </div>
        )
      }
    </div>
  );
};

export default PagamentoMoedas;
```

Agora vamos criar o componente Moeda:

`./scr/app/Moeda.tsx`:
```ts
import { useContext } from "react";
import { PagamentoContext } from "./PagamentoMoedas";
import { formatador } from "./PagamentoMoedas";

const Moeda = ({ valor }: { valor: number }) => {
    const contexto = useContext(PagamentoContext);
    if (!contexto) return null;

    const { pagar, pagamentoConcluido } = contexto;

    return (
        <button
            key={valor}
            onClick={() => pagar(valor)}
            className={valor <= 1 ? "bg-orange-300 hover:bg-orange-300 text-gray-800 font-bold py-2 px-4 rounded shadow transition" : "bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded shadow transition"}
            disabled={pagamentoConcluido}
        >
            {`R$ ${formatador.format(valor)}`}
        </button>
    );
}

export default Moeda;
```

O componente Moeda usa o contexto provido pelo componente PagamentoMoedas. Investigue melhor o código destes dois componentes para entender o funcionamento dos mesmos.

Por último, vamos adicionar o componente PagamentoMoedas em nossa página inicial:

`/src/app/page.tsx`:
```ts
'use client';

import { useState, createContext } from "react";
import Usuario from "./Usuario";
import BarraTopo from "./BarraTopo";
import PagamentoMoedas from "./PagamentoMoedas";

interface UsuarioContextType  {
  usuario: Usuario | undefined;
  onLogoff: () => void;
  onLogin: () => void;
};

export const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

const App = () => {
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

  const handleLogoff = () => {
    setUsuario(undefined);
  };

  const handleLogin = () => {
    setUsuario({"nome": "João Silva", "email": "joao@email.com"});
  }

  return (
    <UsuarioContext.Provider value={{ usuario, onLogoff: handleLogoff, onLogin: handleLogin }}>
      <BarraTopo />
      <PagamentoMoedas saldoInicial={123.45} />
    </UsuarioContext.Provider>
  );
};

export default App;
```

Passamos para o componente PagamentoMoedas o saldo inicial de R$123,45. Você pode executar e clicar nos botões em acordo com as notas e/ou moedas que você tiver para realizar o pagamento até que o sistema apresentará o troco.

Espero que estes componentes tenham te ajudado a entender o uso de context em React.
