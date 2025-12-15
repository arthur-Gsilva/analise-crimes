'use client'

export function ChatBoasVindas() {
  const capacidades = [
    {
      icone: "📊",
      titulo: "Dados Históricos",
      descricao: "Consulte estatísticas de crimes de 2004 até 2025",
      cor: "from-blue-500 to-blue-600"
    },
    {
      icone: "🔮",
      titulo: "Previsões IA",
      descricao: "Previsões com Machine Learning (R² = 0.916)",
      cor: "from-purple-500 to-purple-600"
    },
    {
      icone: "📈",
      titulo: "Comparações",
      descricao: "Compare municípios, regiões e períodos",
      cor: "from-emerald-500 to-emerald-600"
    },
  ]

  const exemplosPerguntas = [
    {
      categoria: "Consultas",
      perguntas: [
        "Quantos crimes em Recife em 2024?",
        "Dados de Caruaru nos últimos 3 anos"
      ]
    },
    {
      categoria: "Comparações",
      perguntas: [
        "Compare Agreste e Região Metropolitana",
        "Qual região teve maior redução?"
      ]
    },
    {
      categoria: "Previsões",
      perguntas: [
        "Previsão para Petrolina em março 2026",
        "Impacto dos jogos em Recife"
      ]
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl mb-6 shadow-lg overflow-hidden border-2 border-blue-200">
            <img 
              src="/policia-pe.png" 
              alt="Polícia Civil PE" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Assistente de Análise Criminal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Especializado em dados criminais de Pernambuco com IA avançada. 
            Consulte estatísticas, faça previsões e compare regiões.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {capacidades.map((cap, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${cap.cor} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                {cap.icone}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{cap.titulo}</h3>
              <p className="text-sm text-gray-600">{cap.descricao}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            Exemplos de Consultas
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {exemplosPerguntas.map((grupo, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 animate-fadeIn"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <h4 className="font-semibold text-blue-900 mb-3 text-sm uppercase tracking-wide">
                  {grupo.categoria}
                </h4>
                <div className="space-y-2">
                  {grupo.perguntas.map((pergunta, pIndex) => (
                    <div
                      key={pIndex}
                      className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-gray-700 border border-blue-200/50 hover:border-blue-300 hover:bg-white transition-all cursor-default"
                    >
                      {pergunta}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 animate-fadeIn" style={{ animationDelay: '700ms' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">💡 Dicas para melhores resultados</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Seja específico sobre municípios e períodos</li>
                <li>• Use nomes completos (ex: &quot;Jaboatão dos Guararapes&quot;)</li>
                <li>• Para previsões, especifique mês e ano desejado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
