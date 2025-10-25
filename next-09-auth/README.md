# Autenticação e Autorização em Next.js

Dois conceitos muito importantes que vamos começar este tutorial definindo-os são os conceitos de autenticação e autorização.

Autenticação:
Identificar que determinado usuário é quem afirma ser ou que determinado dispositivo é o que afirma ser.
Exemplo: tanto um atendente quanto o gerente de uma loja podem ser identificados como pessoas que possuem acesso ao sistema da loja. Esta identificação é feita pelo processo de autenticação.

Autorização:
Afirma quais recursos do sistema podem ser acessados por cada usuário ou dispositivo autenticado.
Exemplo: o gerente de uma loja provavelmente pode acessar mais recursos do sistema que o atendente. A imposição de quais recursos um gerente pode acessar e quais recursos um atendente pode acessar é feita pelo processo de autorização.

Neste tutorial também trabalharemos com *tokens* JWT (*JSON Web Token*), que permitem a um servidor gerar um *token* contendo a identificação de um usuário assim como as suas permissões de acesso e outras informações importantes.

A estrutura de um *token* JWT consiste em:
- **Header**: geralmente utilizado para especificar se o *token* será assinado e por qual algoritmo.
- **Payload**: qualquer dado necessário para a aplicação.
- **Assinatura**: utilizada para provar a autenticidade do *token*.

Declarações registradas para a assinatura:
- **iss** (*issuer*) quem criou o *token*;
- **sub** (*subject*) sobre quem o *token* se refere;
- **aud** (*audience*) para quem o *token* é esperado;
- **exp** (*expiration*) data de expiração;
- **nbf** (*not before*) a partir de quando o *token* é valido;
- **iat** (*issued at*) data de criação;
- **jti** (*jwt id*) identificador único;

Neste tutorial, trabalharemos com enfoque maior em autenticação, porém vamos apresentar soluções de autorização com base em *role* de usuário, de forma que você possa ficar confortável para implementar autorização onde for necessário.

Criaremos neste tutorial soluções de autenticação e autorização tanto para componentes do lado do servidor quanto para *endpoints*. Explicaremos cada parte separadamente, de forma que você possa acompanhar os exemplos com tranquilidade.

**ATENÇÃO: para este tutorial, sugiro que instale as versões expecíficas indicadas nos comandos**

Vamos iniciar criando um novo projeto Next.js de nome `next-autenticacao` na versão 15 do Next.js:
```
npx create-next-app@15
```

Em seguida, instale a lib Next-Auth, que utilizaremos para facilitar a nossa tarefa de autenticação neste tutorial:
```
npm install next-auth@4
```

Na época da criação deste tutorial, o Next 16 já havia sido lançado, só que a versão padrão para o Next-Auth não era compatível com o Next 16. Por este motivo que optei por indicar as versões a serem instaladas para este tutorial. Fique à vontade para retirar as versões após os comandos de instalação (a versão é indicada pelo @ seguido de um número) e testar a compatibilidade. Se não for compatível, siga com as versões indicadas neste tutorial.

Para realizar a autorização do usuário, vamos adicionar ao objeto User, definido pelo Next-Auth a propriedade `role`, que nos permitirá identificar o tipo de usuário que estamos lidando, o que pode ser utilizado para conceder ou não autorização para o mesmo executar a ação. Para isso, crie o seguinte arquivo:

`/src/types/next-auth.d.ts`:
```ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // Add role to the user object in the session
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // Add role to the User object
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add role to the JWT token
  }
}
```

Vamos separar em nosso projeto os nossos componentes que representam páginas, dos *endpoints* e das *server actions*, criando a seguinte estrutura de pastas:
- `/src/app/actions`: pasta que conterá as *server actions*
- `/src/app/api`: pasta que conterá os *endpoints*
- `/src/app/pages`: pasta que conterá os componentes de interface com o usuário

Começaremos criando algumas *server actions* para controle dos usuários. Para fins de simplificação, neste tutorial não trabalharemos com bancos de dados e sim com um simples vetor de usuários.

`/src/app/actions/user-login.ts`:
```ts
'use server'

import { User } from "next-auth";

export async function userLogin(email: string, senha: string): Promise<User | null> {
  if (!email || !senha) {
    return Promise.resolve(null);
  }

  let usuario = usuarios.find(x => email === x.email && senha === x?.password);

  if (usuario) {
    return Promise.resolve({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
  }
  
  return Promise.resolve(null);
}

export async function getUser(email: string): Promise<User | null> {
  if (!email) {
    return Promise.resolve(null);
  }

  let usuario = usuarios.find(x => email === x.email);

  if (usuario) {
    return Promise.resolve({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
  }
  
  return Promise.resolve(null);
}

export async function userAdd(name: string, email: string, role: string) : Promise<User> {
  const usuario = { id: new Date().getTime().toString(), name, email, role, password: '' };

  usuarios.push(usuario);

  return Promise.resolve({ id: usuario.id, name: usuario.name, email: usuario.email, role: usuario.role });
}

let usuarios = [
  { id: "1", name: "Usuário Admin", password: '123456', email: "admin@email.com", role: "admin" },
  { id: "2", name: "Usuário Teste", password: '123456', email: "teste@email.com", role: "user" },
]
```

Acredito que as funções acima sejam de fácil identificação e entendimento.

Note que armazenamos a senha dos usuários à descoberto. Você nunca deve fazer isso, porém este é um assunto a ser discutivo em outro momento.

Vamos continuar a nossa aplicação criando os *endpoints* utilizados no *login* pelo NextAuth:

`/src/app/api/auth/[...nextauth]/route.ts`:
```ts
import NextAuth, { NextAuthOptions, User } from "next-auth";

export const OPTIONS: NextAuthOptions = {
  providers: [
    
  ],
  session: {
    strategy: "jwt",
  },  
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
```

Acima, criamos um objeto `OPTIONS` do tipo NextAuthOptions. Este objeto contém as informações que o Next-Auth necessita para gerar os *endpoints*, o que é feito passando `OPTIONS` por parâmetro para a função `NextAuth`. Por fim, exportamos como um método GET e outro método POST.

Abaixo de `providers`, temos o objeto `session`, que define que utilizaremos JWT (*Jason Web Tokens*) como estratégia de autenticação.

Voltando ao array `providers`, note que não fornecemos nada neste array. Antes de preenchê-lo, adicione as importações abaixo:

```ts
import CredentialsProvider from "next-auth/providers/credentials";
import {userLogin, getUser, userAdd} from "@/app/actions/user-login";
```

Segue o primeiro objeto que você deve colocar no array `providers`:

```ts
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        return userLogin(credentials?.email ?? "", credentials?.password ?? "");
      },
    }),
```

O objeto acima configura um provedor de credenciais, onde é possível fazer *login* com o e-mail e a senha do usuário. A função de autorização chama a action `userLogin`, que criamos anteriormente. Esta action retorna o usuário sem a senha se existir usuário com o e-mail e a senha informados.

O segundo provider que vamos adicionar nos possibilitará fazer *login* com a conta do GitHub. Para preparar o projeto para isso, crie um arquivo `.env` na raiz do projeto (pasta onde se encontra o arquivo `package.json`). As variáveis deste arquivo são automaticamente transformadas em variáveis de ambiente pelo Next.js.

`.env`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=9cc6d091-8dc6-42b8-b307-b37b2476b8ca
GITHUB_ID=
GITHUB_SECRET=
```

Adicione uma string grande como segredo na veriável `NEXTAUTH_SECRET` acima. Para isso, sugiro que pesquise no Google por "Gerador Guid online", entre em um dos resultados da sua busca, gere um GUID e copie-o. Um número grande deve ser gerado. Substitua o número que deixei na variável `NEXTAUTH_SECRET` pelo número que você gerou. Este número será utilizado para assinar o *token* de autenticação.

Já para o *login* com o GitHub, precisamos preencher os valores `GITHUB_ID` e `GITHUB_SECRET`, faça *login* em sua conta GitHub e siga os passos abaixo

1. No canto superior direito, clique na imagem do seu usuário e clique em "Settings".
2. Na página que abrir, no canto inferior esquerdo, clique em "Developer Settings"
3. Na página que abrir, clique em "OAuth Apps". O endereço direto que te permite chegar a este passo é este aqui: `https://github.com/settings/developers`.
4. Na tela que abrir, clique no botão `<New OAuth App>`. Preencha os campos como indicado à seguir:
Application name: Next - Autenticação
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000
5. Clique em `<Register Application>`
6. Copie o **Client ID** e cole-o após o igual da variável `GITHUB_ID` do arquivo `.env` do nosso projeto.
7. Clique em `<Generate a new client secret>` e copie o *client secret* e cole-o como valor da variável `GITHUB_SECRET` do `.env`.

Agora que já temos tudo o que necessitamos para adicionar o nosso provider, vamos fazê-lo. No arquivo `/src/app/api/auth/[...nextauth]/route.ts`, importe o GitHubProvider (`import GitHubProvider from "next-auth/providers/github";`) e adicione o objeto abaixo no array de providers.

```ts
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      async profile(profile) {

        let usr = await getUser(profile.email);

        //Novo usuário logado com o GitHub
        if (!usr) {
          usr = await userAdd(profile.name || profile.login, profile.email, 'user');
        }

        return {
          id: usr.id,
          name: usr.name,
          email: usr.email,
          image: profile.avatar_url,
          role: usr.role,
        };
      },
    }),
```

Passamos os valores das variáveis de ambiente `GITHUB_ID` e `GITHUB_SECRET` para o `GitHubProvider`. A função `profile` é executada quando um *login* é realizado com sucesso. Nela verificamos se o usuário não existe no sistema e, se não existir, crio um novo usuário no sistema e adiciono-o na *role* `user`, que é utilizada para usuários comuns. Para usuários administradores, seria necessário alterar a *role* no sistema posteriormente para `admin`. A função `profile` retorna então o objeto contendo informações sobre o usuário logado.

Faça a importação do JWT (`import { JWT } from "next-auth/jwt";`) do Next-Auth. Agora, abaixo do objeto `session` e dentro do objeto `OPTIONS`, vamos adicionar funções de callback para preencher os *tokens* JWT e de sessão com a *role* e o *id*  do usuário:

```ts
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      // Adiciona informações do usuário autenticado no token
      if (user) {
        (token as any).id = (user as any).id ?? token.sub;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Sessão devolvida via /api/auth/session
      session.user = session.user || {};
      (session.user as any).id = (token as any).id;
      if (token?.role) {
        // Adiciona a role do token JWT token no objeto session
        session.user.role = token.role;
      }
      return session;
    },
  },
```

Finalmente, vamos adicionar também o endereço para uma página personalidade de *login* ao nosso objeto `OPTIONS`:

```ts
  pages: {
    signIn: "/auth/signin",
  },
```

O arquivo completo se encontra abaixo:

`/src/app/api/auth/[...nextauth]/route.ts`:
```ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import {userLogin, getUser, userAdd} from "@/app/actions/user-login";
import { JWT } from "next-auth/jwt";

export const OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        return userLogin(credentials?.email ?? "", credentials?.password ?? "");
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      async profile(profile) {
        let usr = await getUser(profile.email);

        if (!usr) { //Novo usuário logado com o GitHub deve ser persistido
          usr = await userAdd(profile.name || profile.login, profile.email, 'user');
        }

        return {
          id: usr.id,
          name: usr.name,
          email: usr.email,
          image: profile.avatar_url,
          role: usr.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      // Adiciona informações do usuário autenticado no token
      if (user) {
        (token as any).id = (user as any).id ?? token.sub;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Sessão devolvida via /api/auth/session
      session.user = session.user || {};
      (session.user as any).id = (token as any).id;
      if (token?.role) {
        // Adiciona a role do token JWT token no objeto session
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Página de login customizada
  },  
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
```

Vamos criar agora a nossa página customizada de *login*:

`/src/app/pages/auth/signin/page.tsx`
```ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      return;
    }

    const destination = result?.url ?? callbackUrl;
    router.push(destination);
  }

  function preencherPadrao() {
    if (email === 'teste@email.com') {
      setEmail('admin@email.com');
    } else {
      setEmail('teste@email.com');
    }

    setPassword('123456');
  }

  return (
    <main className="max-w-md mx-auto mt-12 px-5 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-semibold mb-2">Login</h1>
        <p className="text-gray-700 mt-0">
          Faça login para acessar as áreas protegidas. Após o login você será redirecionado para a página solicitada.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block mb-2">
            <div className="text-sm mb-1">E-mail</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block mb-3">
            <div className="text-sm mb-1">Senha</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {error && (
            <div className="text-red-600 mb-3 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2">
          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm"
          >
            Entrar com GitHub
          </button>

          <div onClick={() => preencherPadrao()} className="ml-auto text-xs text-gray-600 border border-gray p-2 rounded-md">
            <strong>Clique aqui para teste rápido:</strong>
            <div>email: {email === 'teste@email.com' ? 'admin' : 'teste'}@email.com</div>
            <div>senha: 123456</div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-600">
          Dica didática: este formulário usa o provider "credentials" do next-auth. Para testar um app externo (mobile), você pode chamar o endpoint <code className="bg-gray-100 px-1 py-0.5 rounded">/api/auth/login</code> para receber um token.
        </p>
      </div>
    </main>
  );
}
```

Apesar de termos muito código na página de *login*, com o conhecimento que você adquiriu até aqui, você não terá dificuldade em entendê-la.

É importante destacar dois pontos principais nesta página:

1. A constante `callbackUrl` conterá o valor do *search parameter* de mesmo nome e possui o objetivo de permitir o redirecionamento para a página de origem quando o usuário fizer o *login*.
2. O *login* é feito chamando a função `signIn`, importada de `next-auth/react`. Esta função utilizará o *endpoint* criado em `/src/app/api/auth/[...nextauth]/route.ts` para realizar o *login* do usuário.

Agora que já temos a nossa página de *login*, vamos criar também um *endpoint* para *login* via aplicações externas:

`/src/app/api/auth/login/route.ts
```ts
import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import {userLogin} from "@/app/actions/user-login";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const usr = await userLogin(email, password);

  if (!usr) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // payload do token (o que quiser expor)
  const tokenPayload = {
    sub: usr.id,
    name: usr.name,
    email: usr.email,
    role: usr.role,
  };

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const jwt = await encode({
    token: tokenPayload,
    secret,
    maxAge: 60, // 1 minuto - considere aumentar este tempo
  });

  return NextResponse.json({ token: jwt });
}
```

No arquivo acima temos um *endpoint* para *login* que recebe um *JSON* contendo um e-mail e uma senha. O serviço busca o usuário que possui esta senha no banco de dados e, se não encontrar, retorna o *HTTP status code* 401. Se encontrado, cria-se o *payload* do *token* e utilza-se a função `encode` que assina digitalmente o *token* utilizando o valor da variável `NEXTAUTH_SECRET`, armazenado em uma constante de nome `secret`. Note que `maxAge: 60,` indica que o nosso *token* será válido por apenas um minuto. Você pode aumentar o número de segundos para, por exemplo, 2 horas: `maxAge: 60 * 60 * 2,` ou até mais tempo, porém quanto mais tempo o *token* for válido, maior será a janela de oportunidade para um atacante que conseguir obtê-lo.

Geralmente *tokens* JWT possuem validade curta e novos *tokens* são obtidos através de *refresh tokens*, porém este conteúdo está fora do escopo deste tutorial.

Agora vamos criar o *middleware* que irá interceptar as requisições aos nossos componentes e serviços, não permitindo o acesso a conteúdo restrito por usuários não autenticados. Para isso, vamos criar o seguinte padrão: pages, actions e *endpoints* que necessitam de autenticação serão colocados dentro de uma pasta chamada `restrict`. Dessa forma, vamos criar as pastas:

- `/src/app/actions/restrict`
- `/src/app/api/restrict`
- `/src/app/pages/restrict`

Agora vamos criar o nosso *middleware*:

`src/middleware.ts`:
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const caminhosRestritos = [
    "/api/restrict",
    "/pages/restrict",
    "/actions/restrict",
  ];

  //Se o caminho não for restrito, continue
  if (!caminhosRestritos.some((p) => pathname.startsWith(p))) return NextResponse.next();

  //True se a chamada for feita para um endpoint protegido
  const chamadaDeEndpointProtegido = pathname.startsWith("/api/restrict");
  
  // Valida token/ sessão via next-auth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    //Se chamada a endpoint e não possuir token válido, retorna HTTP status code 401
    if (chamadaDeEndpointProtegido) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    
    //Se chamada a página e não possuir sessão autenticada, redireciona para a página 
    // de login, encaminhando a callbackUrl como sendo a URL atual
    return NextResponse.redirect(new URL("/pages/auth/signin?callbackUrl=" + encodeURIComponent(req.url), req.url));
  }

  // Encaminha info mínima do usuário para a rota via header
  // Isso permite que endpoints tenham acesso aos dados do usuário logado
  const headers = new Headers(req.headers);
  headers.set("x-user", encodeURIComponent(JSON.stringify({ sub: token.sub, email: token.email, role: token.role })));

  return NextResponse.next({ request: { headers } });
}

//Indica quais caminhos seão interceptados pelo middleware
export const config = {
  matcher: ["/api/restrict/:path*", "/pages/restrict/:path*", "/actions/restrict/:path*"],
};
```

Optei por deixar as explicações do *middleware* em comentários.

Uma informação importante: infelizmente, não conseguimos interceptar via *middleware* as chamadas para as nossas *server actions*, porém deixei a rota das *server actions* no *middleware* para evitar que alguma página, colocada acidentalmente na pasta restrita das *server actions*, possa ser acessada sem autenticação.

Vamos criar a nossa primeira *server action* restrita, porém a mesma não funcionará da forma que queremos ainda. Ao término deste tutorial, isso será resolvido.

`/src/app/actions/restrict/obterData.ts`:
```ts
'use server'

export default async function obterData(): Promise<Date> {
  return Promise.resolve(new Date());
}
```

A função acima é muito simples e apenas retorna a data e hora do servidor.

Nosso próximo passo será criar as páginas restritas.

Vamos iniciar criando o layout que vai fornecer o componente provedor de sessão, que permitirá que nossa página restrita leia as informações do usuário autenticado:

`/src/app/pages/restrict/layout.tsx`:
```ts
"use client";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

Segue a primeira página restrita:

`/src/app/pages/restrict/teste1-client/page.tsx`:
```ts
'use client'

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  return (
      <main className="max-w-4xl mx-auto mt-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Página de Teste 1 - Área Autenticada (Client Component)
          </h2>
          <p className="text-gray-600 mb-5">
            Esta é uma área protegida. Você só consegue visualizar esta página se estiver logado com sucesso.
          </p>
          <div className="mb-5  grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-large text-blue-600 mb-1">Usuário logado:</h3>
              <p className="text-sm text-gray-700">Status: {status}</p>
              <p className="text-sm text-gray-700">Nome: {session?.user?.name}</p>
              <p className="text-sm text-gray-700">E-mail: {session?.user?.email}</p>
              <p className="text-sm text-gray-700">Tipo: {session?.user?.role}</p>
            </div>
          </div>

          <Link href="/" className="w-100 py-2 px-5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60">
            Voltar
          </Link>
        </div>
      </main>
  );
}
```

A página acima é um *cliente component* que utiliza o *hook* `useSession` para obter os dados do usuário logado.

Abaixo temos a nossa próxima página:

`/src/app/pages/restrict/teste1-server/page.tsx`:
```ts
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { OPTIONS as authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Page() {
  const session = await getServerSession(authOptions);

  console.log(session?.user);

  return (
      <main className="max-w-4xl mx-auto mt-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Página de Teste 1 - Área Autenticada (Server Component)
          </h2>
          <p className="text-gray-600 mb-5">
            Esta é uma área protegida. Você só consegue visualizar esta página se estiver logado com sucesso.
          </p>
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-large text-blue-600 mb-1">Usuário logado:</h3>
              <p className="text-sm text-gray-700">Nome: {session?.user?.name}</p>
              <p className="text-sm text-gray-700">E-mail: {session?.user?.email}</p>
              <p className="text-sm text-gray-700">Tipo: {session?.user?.role}</p>
            </div>
          </div>

          <Link href="/" className="w-100 py-2 px-5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60">
            Voltar
          </Link>
        </div>
      </main>
  );
}
```

A página acima é um *server component* que utiliza a função `getServerSession` para obter as informações do usuário logado.

Agora vamos criar a nossa primeira página que não exige que o usuário esteja logado:

`/src/app/pages/teste2/page.tsx`:
```ts
'use client'

import { useState, useEffect } from "react";
import obterData from "@/app/actions/restrict/obterData";
import Link from "next/link";

export default function Page() {
  const [horaServidor, setHoraServidor] = useState<Date | null>(null);

  useEffect(() => {
    obterData().then((data) => {
      setHoraServidor(data);
    });
  }, []);

  const msgHoraServidor = horaServidor ? (
        <p className="text-blue-500 mb-5">
          Data e hora do servidor: {horaServidor?.toDateString()} {horaServidor?.toLocaleTimeString()} (informação obtida em action que impõe autenticação)
        </p>) : 
        (<p className="text-red-500 mb-5">
          Data e hora do servidor: é preciso estar autenticado para acessar esta função
        </p>);

  return (
    <main className="max-w-4xl mx-auto mt-10 px-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Página de Teste 1 - Área NÃO Autenticada
          </h2>
          <p className="text-gray-600 mb-5">
            Esta é uma área pública. Você não precisa estar logado para visualizar esta página.
          </p>
          {msgHoraServidor}
          <Link href="/" className="w-100 py-2 px-5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60">
            Voltar
          </Link>
        </div>
      </main>
  );
}
```

Rode a aplicação, acesse `URL base/pages/teste2` e note que a *server action* `obterData` pôde ser acessada pela página mesmo por usuário não autenticado. Vamos resolver isso agora.

Crie o arquivo abaixo:

`/src/app/actions/requireUser.ts`:
```ts
'use server'

import { getServerSession } from 'next-auth/next';
import { OPTIONS as authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    const err: any = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }
  return session.user;
}
```

Na função acima, utilizamos a função `getServerSession` para obter as informações do usuário logado e, se não o usuário não estiver logado, lançamos um erro.

Vamos chamar esta função dentro da nossa *server action* `obterData`:

`/src/app/actions/obterData.ts`:
```ts
'use server'

import { requireUser } from '../requireUser';

export default async function obterData(): Promise<Date> {
  await requireUser();
  return Promise.resolve(new Date());
}
```

Agora acesse novamente `URL base/pages/teste2` e note que obtivemos um erro indicando que é necessário estar logado para acessar a função. O motivo de eu ter feito uma chamada a uma *server action* autenticada é para ilustrar um erro comum que pode acontecer em equipes de desenvolvimento assim como alertá-lo que, se existe função que deveria ser chamada apenas por usuários autenticados e que pode ser acessada por um componente não autenticado, logo um atacante pode aproveitar esta brecha para contornar o seu sistema e fazer requisições maliciosas. Cuidado: toda *server action* que realiza qualquer atividade que exija autenticação pode ser utilizada de forma maliciosa e, por isso, a mesma deve chamar a função `requireUser` que criamos ou outra função semelhante.

Para retirar qualquer erro que o Next.js estiver apresentando, atualize a página (F5).

Agora que já temos nossas páginas, vamos criar um *endpoint* autenticado:

`/src/app/api/restrict/ola/route.ts`:
```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Olá mundo!" });
}
```

O *endpoint* acima apenas retorna um *JSON* contendo uma propriedade `message` com a mensagem `Olá mundo!`.

`/src/app/api/restrict/ola/[slug]/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const userHeader = request.headers.get("x-user");
  const user = userHeader ? JSON.parse(decodeURIComponent(userHeader)) : null;
  return NextResponse.json({ message: `Olá ${slug}! (Usuário: ${user?.email} - ${user?.role})` });
}
```

O *endpoint* acima verifica obtém os dados do usuário, adicionados no cabeçalho `x-user` da nossa requisição. Lembre-se que este *header* foi adicionado em pelo nosso *middleware*. Este *entpoint* apresentará a mensagem "Olá" seguido do texto passado para o parâmetro `slug` da rota.

Ok, falamos bastante sobre autenticação. Agora, como podemos fazer a autorização, ou seja, como podemos identificar quais usuários podem ter acesso a quais recursos? A resposta é simples: como nossos usuários possuem a propriedade "role", basta verificar a *role* do usuário dentro da funcionalidade desejada para saber se ele pode ou não acessá-la. Outra forma é criar uma pasta especial, como `admin`, por exemplo, e alterar o *middleware* para tratar as rotas considerando as *roles* dos usuários.

Finalmente, vamos criar a nossa página inicial, que conterá os links para as funcionalidades da nossa aplicação assim como explicações sobre como os *endpoints* podem ser acessados:

`/src/app/page.tsx`:
```ts
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function HomePage() {
  const [dadosUsuario, setDadosUsuario] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setDadosUsuario(JSON.stringify(data, null, 4));
      });
  }, []);

  function logoff() {
    signOut({ callbackUrl: "/" });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-r from-sky-600 to-gray-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold">Next‑Auth — Demonstração</h1>
          <p className="mt-2 text-slate-100 max-w-2xl">
            Exemplo didático de autenticação e autorização com next-auth. Use o provider de Credentials
            ou GitHub para experimentar fluxos de login e chamadas a API protegidas.
          </p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Navegação</h2>

          <ul className="grid gap-3">
            <li>
              <Link href="/pages/restrict/teste1-client" className="block p-3 rounded-lg border border-slate-100 hover:shadow">
                Área protegida - Client Component (exemplo) — /pages/restrict/teste1-client
              </Link>
            </li>

            <li>
              <Link href="/pages/restrict/teste1-server" className="block p-3 rounded-lg border border-slate-100 hover:shadow">
                Área protegida - Server Component (exemplo) — /pages/restrict/teste1-server
              </Link>
            </li>

            <li>
              <Link href="/pages/teste2" className="block p-3 rounded-lg border border-slate-100 hover:shadow">
                Área NÃO protegida (exemplo) — /teste2
              </Link>
            </li>

            <li>
              <Link href="/pages/auth/signin" className="block p-3 rounded-lg border border-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400">
                Página de login — /pages/auth/signin
              </Link>
            </li>

            <li>
              <button onClick={logoff} className="block p-3 rounded-lg border border-slate-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-400">
                Página de logout — /pages/auth/signoff
              </button>
            </li>

            <li>
              <label>Dados do Usuário</label>
              <div className="block p-3 h-70 rounded-lg bg-black text-white text-small overflow-auto h-24">
                <pre><code id="json-output">{dadosUsuario}</code></pre>
              </div>
            </li>

          </ul>

          <div className="mt-6 border-t pt-6 text-sm text-slate-600">
            <h3 className="font-medium">O que este projeto demonstra</h3>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Uso do next-auth com Credentials + GitHub.</li>
              <li>Emissão de JWT para apps externos (endpoint /api/auth/login).</li>
              <li>Proteção de rotas e Server Actions (middleware / requireAuth).</li>
            </ul>
          </div>
        </div>

        <aside className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold">Credenciais de teste</h2>
          <p className="mt-2 text-sm text-slate-600">Use para testes rápidos:</p>

          <div className="mt-3 flex flex-col gap-2">
            <div className="inline-flex items-center gap-3 bg-sky-50 text-sky-800 px-3 py-2 rounded">
              <strong className="w-20">E-mail</strong>
              <span>teste@email.com</span>
            </div>

            <div className="inline-flex items-center gap-3 bg-amber-50 text-amber-800 px-3 py-2 rounded">
              <strong className="w-20">Senha</strong>
              <span>123456</span>
            </div>
          </div>

          <div className="mt-5 text-sm text-slate-600">
            <h3 className="text-lg text-sky-800">Para aplicativos (mobile / externo):</h3>
            <p className="mt-2">Faça POST em <code className="bg-slate-100 px-1 rounded">/api/auth/login</code> com JSON:</p>

            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-auto">
{`fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'teste@email.com', password: '123456' })
})`}
            </pre>

            <p className="mt-3">Em chamadas protegidas, envie o header:</p>

            <pre className="mt-2 bg-slate-900 text-slate-100 text-xs rounded p-3">Authorization: Bearer &lt;token&gt;</pre>

            <p className="mt-3">No browser, você pode guardar o token no local storage, porém alterar o login para retornar um cookie HttpOnly seria mais seguro.</p>

            <p className="mt-3">Exemplo de GET utilizando token previamente armazenado no local storage:</p>
            
            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-auto">
              {`const token = localStorage.getItem('token')

const response = await fetch('/api/restrict/ola/Brasil', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
    })
})`}
            </pre>

            <p className="mt-3">Exemplo de POST utilizando token previamente armazenado no local storage (este endpoint não está implementado neste projeto):</p>
            
            <pre className="mt-3 bg-slate-900 text-slate-100 text-xs rounded p-3 overflow-auto">
              {`const token = localStorage.getItem('token')

const response = await fetch('/api/restrict/produtos', {
    method: 'POST',
    headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({"codigo": "1", "descricao": "Produto 1", "preco": 1.2})
})`}
            </pre>

          </div>
        </aside>
      </section>

      <footer className="max-w-6xl mx-auto px-6 mt-8 pb-12 text-center text-sm text-slate-500">
        Projeto de exemplo — Next.js + next-auth.
      </footer>
    </main>
  );
}
```

Finalmente você pode testar entrar nas páginas logadas sem efetuar o *login* para que seja redirecionado para a página de *login*. Pode fazer *login* e logoout, inclusive pelo seu usuário do GitHub. Pode acessar a página que não exige *login* estando e não estando logado para verificar o comportamento da *server action*.
