'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Mensagem } from '@/types/chat'

type ChatMensagensProps = {
  mensagens: Mensagem[]
  onReenviar?: (mensagemOriginal: string) => void
}

function IndicadorCarregando() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-600">Analisando dados...</span>
    </div>
  )
}

function BotaoReenviar({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 mt-2 px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      aria-label="Tentar novamente"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Tentar novamente
    </button>
  )
}

function MensagemItem({ 
  mensagem, 
  onReenviar 
}: { 
  mensagem: Mensagem
  onReenviar?: (mensagemOriginal: string) => void 
}) {
  const ehUsuario = mensagem.papel === 'usuario'
  const ehErro = mensagem.erro
  
  return (
    <div className={`flex ${ehUsuario ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${ehUsuario ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm overflow-hidden ${
          ehUsuario 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
            : 'bg-white'
        }`}>
          {ehUsuario ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : (
            <img 
              src="/policia-pe.png" 
              alt="Polícia Civil PE" 
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Mensagem */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            ehUsuario
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
              : ehErro
                ? 'bg-red-50 text-red-800 rounded-bl-sm border border-red-200'
                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
          }`}
        >
          {mensagem.carregando ? (
            <IndicadorCarregando />
          ) : (
            <>
              {ehErro && (
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-red-600">Erro ao processar</span>
                </div>
              )}
              <div className={`text-sm leading-relaxed markdown-content ${ehUsuario ? 'text-white' : 'text-gray-800'}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => (
                      <h1 className={`text-xl font-bold mt-4 mb-2 first:mt-0 ${ehUsuario ? 'text-white' : 'text-gray-900'}`}>
                        {props.children}
                      </h1>
                    ),
                    h2: (props) => (
                      <h2 className={`text-lg font-bold mt-3 mb-2 first:mt-0 ${ehUsuario ? 'text-white' : 'text-gray-900'}`}>
                        {props.children}
                      </h2>
                    ),
                    h3: (props) => (
                      <h3 className={`text-base font-bold mt-2 mb-1 first:mt-0 ${ehUsuario ? 'text-white' : 'text-gray-900'}`}>
                        {props.children}
                      </h3>
                    ),
                    h4: (props) => (
                      <h4 className={`text-sm font-semibold mt-2 mb-1 first:mt-0 ${ehUsuario ? 'text-white' : 'text-gray-800'}`}>
                        {props.children}
                      </h4>
                    ),
                    ul: (props) => (
                      <ul className="list-disc ml-4 my-2 space-y-1">
                        {props.children}
                      </ul>
                    ),
                    ol: (props) => (
                      <ol className="list-decimal ml-4 my-2 space-y-1">
                        {props.children}
                      </ol>
                    ),
                    li: (props) => (
                      <li className="my-0.5">
                        {props.children}
                      </li>
                    ),
                    p: (props) => (
                      <p className="my-2 first:mt-0 last:mb-0">
                        {props.children}
                      </p>
                    ),
                    strong: (props) => (
                      <strong className="font-semibold">
                        {props.children}
                      </strong>
                    ),
                    em: (props) => (
                      <em className="italic">
                        {props.children}
                      </em>
                    ),
                    code: (props) => (
                      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        ehUsuario ? 'bg-blue-800 text-blue-100' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {props.children}
                      </code>
                    ),
                    pre: (props) => (
                      <pre className={`p-3 rounded my-2 overflow-x-auto font-mono text-xs ${
                        ehUsuario ? 'bg-blue-800 text-blue-100' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {props.children}
                      </pre>
                    ),
                    table: (props) => (
                      <div className="overflow-x-auto my-2">
                        <table className={`min-w-full border ${
                          ehUsuario ? 'border-blue-400' : 'border-gray-300'
                        }`}>
                          {props.children}
                        </table>
                      </div>
                    ),
                    thead: (props) => (
                      <thead className={ehUsuario ? 'bg-blue-800' : 'bg-gray-50'}>
                        {props.children}
                      </thead>
                    ),
                    th: (props) => (
                      <th className={`px-3 py-2 text-left text-xs font-semibold border ${
                        ehUsuario ? 'border-blue-400' : 'border-gray-300'
                      }`}>
                        {props.children}
                      </th>
                    ),
                    td: (props) => (
                      <td className={`px-3 py-2 text-xs border ${
                        ehUsuario ? 'border-blue-400' : 'border-gray-300'
                      }`}>
                        {props.children}
                      </td>
                    ),
                  }}
                >
                  {mensagem.conteudo}
                </ReactMarkdown>
              </div>
              {ehErro && mensagem.mensagemOriginal && onReenviar && (
                <BotaoReenviar onClick={() => onReenviar(mensagem.mensagemOriginal!)} />
              )}
            </>
          )}
          <div
            className={`text-xs mt-2 ${
              ehUsuario ? 'text-blue-100' : ehErro ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {mensagem.timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChatMensagens({ mensagens, onReenviar }: ChatMensagensProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [mensagens])

  if (mensagens.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {mensagens.map((mensagem) => (
        <MensagemItem 
          key={mensagem.id} 
          mensagem={mensagem} 
          onReenviar={onReenviar}
        />
      ))}
    </div>
  )
}
