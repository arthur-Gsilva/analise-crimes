import { Mensagem, RespostaChat } from '@/types/chat'

const TIMEOUT_MS = 60000
 
export async function enviarMensagem(
  mensagem: string,
  historico: Mensagem[]
): Promise<RespostaChat> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const historicoFormatado = historico
      .filter(msg => !msg.carregando)
      .map(msg => ({
        papel: msg.papel,
        conteudo: msg.conteudo
      }))

    const resposta = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mensagem,
        historico: historicoFormatado
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!resposta.ok) {
      const dados = await resposta.json().catch(() => ({}))
      return {
        resposta: '',
        erro: dados.erro || `Erro do servidor: ${resposta.status}`
      }
    }

    const dados = await resposta.json()

    if (dados.erro) {
      return {
        resposta: '',
        erro: dados.erro
      }
    }

    return {
      resposta: dados.resposta
    }
  } catch (erro) {
    clearTimeout(timeoutId)

    if (erro instanceof Error) {
      if (erro.name === 'AbortError') {
        return {
          resposta: '',
          erro: 'A requisição excedeu o tempo limite. Tente novamente.'
        }
      }
      
      if (erro.message.includes('fetch')) {
        return {
          resposta: '',
          erro: 'Erro de conexão. Verifique sua internet e tente novamente.'
        }
      }
    }

    return {
      resposta: '',
      erro: 'Erro inesperado. Tente novamente.'
    }
  }
}
