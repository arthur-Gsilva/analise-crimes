import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { OPENAI_MODEL, OPENAI_TIMEOUT_MS, SYSTEM_PROMPT, ferramentas } from '@/config/chatConfig'
import { 
  MENSAGENS_ERRO,
  consultarEstatisticas, 
  fazerPrevisao, 
  listarMunicipios, 
  analisarImpactoJogos, 
  calcularCrescimento 
} from '@/services/chatFuncoes'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: OPENAI_TIMEOUT_MS,
})

async function executarFuncao(nome: string, argumentos: string): Promise<string> {
  try {
    const params = JSON.parse(argumentos)

    switch (nome) {
      case 'consultar_estatisticas':
        return await consultarEstatisticas(params)
      case 'fazer_previsao':
        return await fazerPrevisao(params)
      case 'listar_municipios':
        return await listarMunicipios()
      case 'analisar_impacto_jogos':
        return await analisarImpactoJogos(params)
      case 'calcular_crescimento':
        return await calcularCrescimento(params)
      default:
        return JSON.stringify({ erro: `Função ${nome} não encontrada` })
    }
  } catch (erro) {
    console.error('Erro ao executar função:', erro)
    return JSON.stringify({
      sucesso: false,
      mensagem: MENSAGENS_ERRO.ERRO_INTERNO
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { mensagem, historico = [] } = body

    if (!mensagem || typeof mensagem !== 'string' || !mensagem.trim()) {
      return NextResponse.json(
        { erro: MENSAGENS_ERRO.MENSAGEM_OBRIGATORIA },
        { status: 400 }
      )
    }

    const mensagens: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...historico.map((msg: { papel: string; conteudo: string }) => ({
        role: msg.papel === 'usuario' ? 'user' : 'assistant',
        content: msg.conteudo
      })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      { role: 'user', content: mensagem }
    ]

    let resposta = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: mensagens,
      tools: ferramentas,
      tool_choice: 'auto',
      temperature: 0.3
    })

    let mensagemAssistente = resposta.choices[0].message

    while (mensagemAssistente.tool_calls && mensagemAssistente.tool_calls.length > 0) {
      mensagens.push(mensagemAssistente)

      for (const toolCall of mensagemAssistente.tool_calls) {
        if (toolCall.type !== 'function') continue
        
        const resultado = await executarFuncao(
          toolCall.function.name,
          toolCall.function.arguments
        )

        mensagens.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: resultado
        })
      }

      resposta = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: mensagens,
        tools: ferramentas,
        tool_choice: 'auto',
        temperature: 0.3
      })

      mensagemAssistente = resposta.choices[0].message
    }

    return NextResponse.json({
      resposta: mensagemAssistente.content || 'Desculpe, não consegui processar sua solicitação.'
    })

  } catch (erro) {
    console.error('Erro na API do chat:', erro)

    if (erro instanceof OpenAI.APIError) {
      if (erro.status === 429) {
        return NextResponse.json(
          { erro: MENSAGENS_ERRO.OPENAI_RATE_LIMIT },
          { status: 429 }
        )
      }
      if (erro.status === 503 || erro.status === 500) {
        return NextResponse.json(
          { erro: MENSAGENS_ERRO.OPENAI_INDISPONIVEL },
          { status: 503 }
        )
      }
      return NextResponse.json(
        { erro: MENSAGENS_ERRO.OPENAI_INDISPONIVEL },
        { status: 503 }
      )
    }

    if (erro instanceof Error && erro.name === 'AbortError') {
      return NextResponse.json(
        { erro: MENSAGENS_ERRO.OPENAI_TIMEOUT },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { erro: MENSAGENS_ERRO.ERRO_INTERNO },
      { status: 500 }
    )
  }
}
