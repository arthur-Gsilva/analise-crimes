import { useState, useEffect, useCallback } from 'react'
import { Conversa, Mensagem } from '@/types/chat'

const STORAGE_KEY = 'chat-history'
const MAX_CONVERSAS = 50

function gerarTitulo(mensagens: Mensagem[]): string {
  const primeiraMensagem = mensagens.find(m => m.papel === 'usuario')
  if (primeiraMensagem) {
    const texto = primeiraMensagem.conteudo.substring(0, 50)
    return texto.length < primeiraMensagem.conteudo.length ? `${texto}...` : texto
  }
  return 'Nova conversa'
}

function serializarConversa(conversa: Conversa): string {
  return JSON.stringify({
    ...conversa,
    mensagens: conversa.mensagens.map(m => ({
      ...m,
      timestamp: m.timestamp.toISOString()
    })),
    criadoEm: conversa.criadoEm.toISOString(),
    atualizadoEm: conversa.atualizadoEm.toISOString()
  })
}

function desserializarConversa(data: string): Conversa {
  const parsed = JSON.parse(data)
  return {
    ...parsed,
    mensagens: parsed.mensagens.map((m: Mensagem & { timestamp: string }) => ({
      ...m,
      timestamp: new Date(m.timestamp)
    })),
    criadoEm: new Date(parsed.criadoEm),
    atualizadoEm: new Date(parsed.atualizadoEm)
  }
}

export function useChatHistory() {
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaAtual, setConversaAtual] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const conversasCarregadas = parsed.map((c: string) => desserializarConversa(c))
        setConversas(conversasCarregadas)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }, [])

  const salvarHistorico = useCallback((novasConversas: Conversa[]) => {
    try {
      const serializado = novasConversas.map(c => serializarConversa(c))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializado))
    } catch (error) {
      console.error('Erro ao salvar histórico:', error)
    }
  }, [])

  const criarConversa = useCallback((mensagens: Mensagem[]): string => {
    const novaConversa: Conversa = {
      id: `conversa-${Date.now()}`,
      titulo: gerarTitulo(mensagens),
      mensagens,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    }

    setConversas(prev => {
      const novasConversas = [novaConversa, ...prev].slice(0, MAX_CONVERSAS)
      salvarHistorico(novasConversas)
      return novasConversas
    })

    setConversaAtual(novaConversa.id)
    return novaConversa.id
  }, [salvarHistorico])

  const atualizarConversa = useCallback((id: string, mensagens: Mensagem[]) => {
    setConversas(prev => {
      const novasConversas = prev.map(c => 
        c.id === id 
          ? { 
              ...c, 
              mensagens, 
              titulo: gerarTitulo(mensagens),
              atualizadoEm: new Date() 
            }
          : c
      )
      salvarHistorico(novasConversas)
      return novasConversas
    })
  }, [salvarHistorico])

  const deletarConversa = useCallback((id: string) => {
    setConversas(prev => {
      const novasConversas = prev.filter(c => c.id !== id)
      salvarHistorico(novasConversas)
      return novasConversas
    })
    if (conversaAtual === id) {
      setConversaAtual(null)
    }
  }, [conversaAtual, salvarHistorico])

  const carregarConversa = useCallback((id: string): Mensagem[] | null => {
    const conversa = conversas.find(c => c.id === id)
    if (conversa) {
      setConversaAtual(id)
      return conversa.mensagens
    }
    return null
  }, [conversas])

  const limparHistorico = useCallback(() => {
    setConversas([])
    setConversaAtual(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const novaConversa = useCallback(() => {
    setConversaAtual(null)
  }, [])

  return {
    conversas,
    conversaAtual,
    criarConversa,
    atualizarConversa,
    deletarConversa,
    carregarConversa,
    limparHistorico,
    novaConversa
  }
}
