'use client'

import { Header } from "@/components/Header"
import PrevisaoForm from "@/components/PrevisaoForm"
import ResultadoPrevisao from "@/components/ResultadoPrevisao"
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {

  const router = useRouter();
  const { user, loading } = useUser();

  const [resultado, setResultado] = useState<{
    valor: number;
    municipio: string;
    mes: string;
    ano: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);


  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  const handlePrevisao = (valor: number, dados: { municipio: string; mes: string; ano: string }) => {
    setResultado({
      valor,
      municipio: dados.municipio,
      mes: dados.mes,
      ano: dados.ano
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Sistema de Previsão de Crimes
          </h1>
          <p className="text-lg text-gray-600">
            Análise preditiva baseada em Machine Learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <PrevisaoForm onPrevisao={handlePrevisao} />
          </div>

          <div className="lg:col-span-1">
            {resultado ? (
              <ResultadoPrevisao
                resultado={resultado.valor}
                municipio={resultado.municipio}
                mes={resultado.mes}
                ano={resultado.ano}
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 h-full flex flex-col justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Aguardando dados
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Preencha o formulário para gerar a análise preditiva
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
