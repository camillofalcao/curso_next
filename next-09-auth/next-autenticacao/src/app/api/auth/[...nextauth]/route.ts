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