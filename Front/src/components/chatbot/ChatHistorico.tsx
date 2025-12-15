'use client'

import { Conversa } from '@/types/chat'
import { useState } from 'react'

import { exportarConversaParaPDF } from '@/utils/exportarPDF'

type ChatHistoricoProps = {
  conversas: Conversa[]
  conversaAtualId: string | null
  onSelecionarConversa: (id: string) => void
  onDeletarConversa: (id: string) => void
  onNovaConversa: () => void
  onLimparHistorico: () => void
}

export function ChatHistorico({
  conversas,
  conversaAtualId,
  onSelecionarConversa,
  onDeletarConversa,
  onNovaConversa,
  onLimparHistorico
}: ChatHistoricoProps) {
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  const formatarData = (data: Date) => {
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)

    if (data.toDateString() === hoje.toDateString()) {
      return 'Hoje'
    } else if (data.toDateString() === ontem.toDateString()) {
      return 'Ontem'
    } else {
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }
  }

  const agruparPorData = () => {
    const grupos: { [key: string]: Conversa[] } = {}
    
    conversas.forEach(conversa => {
      const chave = formatarData(conversa.atualizadoEm)
      if (!grupos[chave]) {
        grupos[chave] = []
      }
      grupos[chave].push(conversa)
    })

    return grupos
  }

  const grupos = agruparPorData()

  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <button
          onClick={onNovaConversa}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Nova Conversa</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {Object.keys(grupos).length === 0 ? (
          <div className="text-center py-8 px-4">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm text-gray-500">Nenhuma conversa ainda</p>
            <p className="text-xs text-gray-400 mt-1">Inicie uma nova conversa</p>
          </div>
        ) : (
          Object.entries(grupos).map(([data, conversasGrupo]) => (
            <div key={data}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                {data}
              </h3>
              <div className="space-y-1">
                {conversasGrupo.map((conversa) => (
                  <div
                    key={conversa.id}
                    className={`group relative rounded-lg transition-all ${
                      conversaAtualId === conversa.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => onSelecionarConversa(conversa.id)}
                      className="w-full text-left px-3 py-2.5 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <svg 
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            conversaAtualId === conversa.id ? 'text-blue-600' : 'text-gray-400'
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            conversaAtualId === conversa.id ? 'text-blue-900' : 'text-gray-700'
                          }`}>
                            {conversa.titulo}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {conversa.mensagens.length} mensagens
                          </p>
                        </div>
                      </div>
                    </button>
                    
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          exportarConversaParaPDF(conversa.mensagens, conversa.titulo)
                        }}
                        className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-all"
                        title="Exportar para PDF"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeletarConversa(conversa.id)
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                        title="Deletar conversa"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {conversas.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-white">
          {mostrarConfirmacao ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-600 text-center">Limpar todo o histórico?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onLimparHistorico()
                    setMostrarConfirmacao(false)
                  }}
                  className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setMostrarConfirmacao(false)}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setMostrarConfirmacao(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpar histórico
            </button>
          )}
        </div>
      )}
    </div>
  )
}
