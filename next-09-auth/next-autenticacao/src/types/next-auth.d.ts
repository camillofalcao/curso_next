import { DefaultSession } from "next-auth";

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
