'use client'

import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resposta, setResposta] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setResposta(data.error || "Erro ao fazer login");
      return;
    }

    setResposta("Login realizado com sucesso!");
    setTimeout(() => router.push("/"), 800);
  }

  return (
    <AuthCard title="Entrar">
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Seu email"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
        >
          Entrar
        </button>
      </form>

      {resposta && (
        <p className="text-center mt-4 text-sm text-gray-700">{resposta}</p>
      )}

      <p className="text-center mt-5 text-gray-600 text-sm">
        Ainda não tem conta?{" "}
        <a href="/register" className="text-blue-600 font-semibold hover:underline">
          Cadastre-se
        </a>
      </p>
    </AuthCard>
  );
}
