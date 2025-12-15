'use client'

import { useState } from 'react'
import { useChatbot } from '@/hooks/useChatbot'
import { ChatBoasVindas } from './ChatBoasVindas'
import { ChatMensagens } from './ChatMensagens'
import { ChatInput } from './ChatInput'
import { ChatHistorico } from './ChatHistorico'
import { exportarConversaParaPDF } from '@/utils/exportarPDF'

export function ChatContainer() {
  const { 
    mensagens, 
    carregando, 
    enviarMensagem, 
    reenviarMensagem, 
    limparHistorico,
    conversas,
    conversaAtual,
    selecionarConversa,
    deletarConversa,
    limparHistoricoCompleto
  } = useChatbot()

  const [mostrarHistorico, setMostrarHistorico] = useState(true)
  const temMensagens = mensagens.length > 0

  const handleExportarPDF = () => {
    if (mensagens.length === 0) return
    
    try {
      const conversaAtiva = conversas.find(c => c.id === conversaAtual)
      const titulo = conversaAtiva?.titulo || 'Conversa com Assistente Criminal'
      
      exportarConversaParaPDF(mensagens, titulo)
      
      console.log('PDF exportado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF. Tente novamente.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex h-[calc(100vh-120px)] min-h-[600px] overflow-hidden">
      {mostrarHistorico && (
        <ChatHistorico
          conversas={conversas}
          conversaAtualId={conversaAtual}
          onSelecionarConversa={selecionarConversa}
          onDeletarConversa={deletarConversa}
          onNovaConversa={limparHistorico}
          onLimparHistorico={limparHistoricoCompleto}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm" style={{ borderTopLeftRadius: mostrarHistorico ? '0' : '1rem', borderTopRightRadius: '1rem' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMostrarHistorico(!mostrarHistorico)}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
            title={mostrarHistorico ? 'Ocultar histórico' : 'Mostrar histórico'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/policia-pe.png" 
                alt="Polícia Civil PE" 
                className="w-full h-full object-cover"
              />
            </div>
            {!carregando && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-blue-700 rounded-full"></div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Assistente Criminal</h2>
            <div className="flex items-center gap-1.5">
              {carregando ? (
                <>
                  <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-100">Processando...</p>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                  <p className="text-xs text-blue-100">Online • Pronto para ajudar</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {temMensagens && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportarPDF}
              className="text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
              title="Exportar conversa para PDF"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <span className="text-sm font-medium hidden md:inline">PDF</span>
            </button>

            <button
              onClick={limparHistorico}
              className="text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
              title="Limpar conversa"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {temMensagens ? (
            <ChatMensagens mensagens={mensagens} onReenviar={reenviarMensagem} />
          ) : (
            <ChatBoasVindas />
          )}
        </div>

        <ChatInput onEnviar={enviarMensagem} carregando={carregando} />
      </div>
    </div>
  )
}
