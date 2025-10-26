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
