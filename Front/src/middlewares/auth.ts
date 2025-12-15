import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import JWT from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }

  try {
    JWT.verify(token, process.env.JWT_SECRET_KEY!);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/protected/:path*"], // rotas protegidas
};
