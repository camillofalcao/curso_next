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
