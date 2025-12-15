import { cookies } from "next/headers";
import JWT from "jsonwebtoken";

export async function getAuthUser() {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return null;

  try {
    return JWT.verify(token, process.env.JWT_SECRET_KEY!);
  } catch {
    return null;
  }
}