import { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { userLogin, getUser, userAdd } from "@/app/actions/user-login";
import { JWT } from "next-auth/jwt";

interface TokenCustom extends JWT {
  id?: string;
  role?: string;
}

const OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(req); // objeto contendo informações da requisição
        return userLogin(credentials?.email ?? "", credentials?.password ?? "");
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      async profile(profile) {
        let usr = await getUser(profile.email);

        if (!usr) {
          // Novo usuário logado com o GitHub deve ser persistido
          usr = await userAdd(profile.name || profile.login, profile.email, "user");
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
    async jwt({ token, user }: { token: TokenCustom; user?: User | null }) {
      // Adiciona informações do usuário autenticado no token
      if (user) {
        // user may not have a typed id/role in the User type, so narrow via unknown
        const u = user as unknown as { id?: string; role?: string };
        token.id = u.id ?? token.sub;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: TokenCustom }) {
      // Sessão devolvida via /api/auth/session
      session.user = session.user || {};
      const su = session.user as unknown as { id?: string; role?: string };
      su.id = token.id;
      if (token?.role) {
        su.role = token.role;
      }
      // ensure session.user remains available to callers
      (session as unknown as { user: typeof su }).user = su;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Página de login customizada
  },
};

export default OPTIONS;
