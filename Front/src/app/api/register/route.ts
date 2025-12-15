import { NextResponse } from "next/server";
import { createUser } from "@/services/userServices";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, password } = body;

  // 🔎 validação simples
  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios" },
      { status: 400 }
    );
  }

  const user = await createUser(name, email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Email já cadastrado" },
      { status: 400 }
    );
  }

  return NextResponse.json({ error: null, user }, { status: 201 });
}
