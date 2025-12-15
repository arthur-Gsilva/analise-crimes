'use client'

import { useState, KeyboardEvent, FormEvent } from 'react'

type ChatInputProps = {
  onEnviar: (mensagem: string) => void
  carregando: boolean
}

export function ChatInput({ onEnviar, carregando }: ChatInputProps) {
  const [texto, setTexto] = useState('')

  const sugestoesRapidas = [
    "Crimes em Recife 2024",
    "Compare Agreste e Sertão",
    "Previsão Caruaru 2026"
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (texto.trim() && !carregando) {
      onEnviar(texto.trim())
      setTexto('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSugestao = (sugestao: string) => {
    setTexto(sugestao)
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4">
      {!texto && (
        <div className="mb-3 flex flex-wrap gap-2">
          {sugestoesRapidas.map((sugestao, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSugestao(sugestao)}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors border border-blue-200 hover:border-blue-300"
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta sobre dados criminais de Pernambuco..."
            disabled={carregando}
            rows={1}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm text-gray-900 placeholder:text-gray-500 bg-white"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!texto.trim() || carregando}
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          aria-label="Enviar mensagem"
        >
          {carregando ? (
            <svg 
              className="w-5 h-5 animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Pressione <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">Enter</kbd> para enviar ou <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">Shift+Enter</kbd> para nova linha
      </p>
    </form>
  )
}
