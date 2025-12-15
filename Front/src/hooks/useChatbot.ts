import { useState, useCallback, useEffect } from 'react'
import { Mensagem } from '@/types/chat'
import { enviarMensagem as enviarMensagemService } from '@/services/chatService'
import { useChatHistory } from './useChatHistory'

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function useChatbot() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [carregando, setCarregando] = useState(false)
  
  const {
    conversas,
    conversaAtual,
    criarConversa,
    atualizarConversa,
    deletarConversa,
    carregarConversa,
    limparHistorico: limparHistoricoCompleto,
    novaConversa
  } = useChatHistory()

  const adicionarMensagem = useCallback((
    papel: 'usuario' | 'assistente',
    conteudo: string,
    carregandoMsg = false,
    erro = false,
    mensagemOriginal?: string
  ): string => {
    const id = gerarId()
    const novaMensagem: Mensagem = {
      id,
      papel,
      conteudo,
      timestamp: new Date(),
      carregando: carregandoMsg,
      erro,
      mensagemOriginal
    }
    setMensagens(prev => [...prev, novaMensagem])
    return id
  }, [])

  const atualizarMensagem = useCallback((
    id: string, 
    conteudo: string, 
    erro = false,
    mensagemOriginal?: string
  ) => {
    setMensagens(prev =>
      prev.map(msg =>
        msg.id === id
          ? { ...msg, conteudo, carregando: false, erro, mensagemOriginal }
          : msg
      )
    )
  }, [])

  const removerMensagem = useCallback((id: string) => {
    setMensagens(prev => prev.filter(msg => msg.id !== id))
  }, [])

  useEffect(() => {
    if (mensagens.length > 0 && !mensagens.some(m => m.carregando)) {
      if (conversaAtual) {
        atualizarConversa(conversaAtual, mensagens)
      } else if (mensagens.length >= 2) {
        criarConversa(mensagens)
      }
    }
  }, [mensagens, conversaAtual, atualizarConversa, criarConversa])

  const limparHistorico = useCallback(() => {
    setMensagens([])
    novaConversa()
  }, [novaConversa])

  const selecionarConversa = useCallback((id: string) => {
    const mensagensCarregadas = carregarConversa(id)
    if (mensagensCarregadas) {
      setMensagens(mensagensCarregadas)
    }
  }, [carregarConversa])

  const enviarMensagem = useCallback(async (texto: string) => {
    if (!texto.trim() || carregando) return

    adicionarMensagem('usuario', texto)

    const idCarregando = adicionarMensagem('assistente', '', true)

    setCarregando(true)

    try {
      const resposta = await enviarMensagemService(texto, mensagens)

      if (resposta.erro) {
        atualizarMensagem(idCarregando, resposta.erro, true, texto)
      } else {
        atualizarMensagem(idCarregando, resposta.resposta)
      }
    } catch {
      atualizarMensagem(
        idCarregando, 
        'Erro ao processar sua mensagem. Tente novamente.', 
        true, 
        texto
      )
    } finally {
      setCarregando(false)
    }
  }, [mensagens, carregando, adicionarMensagem, atualizarMensagem])

  const reenviarMensagem = useCallback(async (mensagemOriginal: string) => {
    if (carregando) return

    setMensagens(prev => {
      const ultimaMensagem = prev[prev.length - 1]
      if (ultimaMensagem?.erro && ultimaMensagem?.papel === 'assistente') {
        return prev.slice(0, -1)
      }
      return prev
    })

    setMensagens(prev => {
      const ultimaMensagem = prev[prev.length - 1]
      if (ultimaMensagem?.papel === 'usuario') {
        return prev.slice(0, -1)
      }
      return prev
    })

    await enviarMensagem(mensagemOriginal)
  }, [carregando, enviarMensagem])

  return {
    mensagens,
    carregando,
    enviarMensagem,
    reenviarMensagem,
    adicionarMensagem,
    limparHistorico,
    atualizarMensagem,
    removerMensagem,
    conversas,
    conversaAtual,
    selecionarConversa,
    deletarConversa,
    limparHistoricoCompleto
  }
}
