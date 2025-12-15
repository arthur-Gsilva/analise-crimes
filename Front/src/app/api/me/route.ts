import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import JWT from "jsonwebtoken";

export async function GET() {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY!);
    return NextResponse.json({ user: decoded });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
