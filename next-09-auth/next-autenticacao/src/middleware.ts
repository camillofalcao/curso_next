import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  const caminhosRestritos = [
    "/api/restrict",
    "/pages/restrict",
    "/actions/restrict",
  ];

  // Se o caminho não for restrito, continue
  if (!caminhosRestritos.some((p) => pathname.startsWith(p))) return NextResponse.next();

  //True se a chamada for feita para um endpoint protegido
  const chamadaDeEndpointProtegido = pathname.startsWith("/api/restrict");

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    //Se chamada a endpoint e não possuir token válido, retorna HTTP status code 401
    if (chamadaDeEndpointProtegido) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // redireciona dinamicamente para a página de login com callbackUrl correto
    const callbackUrl = encodeURIComponent(origin + pathname + search);
    const signInUrl = `${origin}/pages/auth/signin?callbackUrl=${callbackUrl}`;
    return NextResponse.redirect(signInUrl);
  }

  // Encaminha info mínima do usuário para a rota via header
  // Isso permite que endpoints tenham acesso aos dados do usuário logado
  const headers = new Headers(req.headers);
  headers.set("x-user", encodeURIComponent(JSON.stringify({ sub: token.sub, email: token.email, role: token.role })));

  return NextResponse.next({ request: { headers } });
}

//Indica quais caminhos serão interceptados pelo middleware
export const config = {
  matcher: ["/api/restrict/:path*", "/pages/restrict/:path*", "/actions/restrict/:path*"],
};
