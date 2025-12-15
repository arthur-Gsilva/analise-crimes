'use client'

import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resposta, setResposta] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setResposta(data.error || "Erro ao cadastrar");
      return;
    }

    setResposta("Cadastro realizado com sucesso!");
    setTimeout(() => router.push("/login"), 800);
  }

  return (
    <AuthCard title="Criar Conta">
      <form onSubmit={handleRegister} className="space-y-4">
        
        <input
          type="text"
          placeholder="Nome completo"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          Criar Conta
        </button>
      </form>

      {resposta && (
        <p className="text-center mt-4 text-sm text-gray-700">{resposta}</p>
      )}

      <p className="text-center mt-5 text-gray-600 text-sm">
        Já tem conta?{" "}
        <a href="/login" className="text-blue-600 font-semibold hover:underline">
          Entrar
        </a>
      </p>
    </AuthCard>
  );
}
