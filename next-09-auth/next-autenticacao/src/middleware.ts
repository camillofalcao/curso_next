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
