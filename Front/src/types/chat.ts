export type Mensagem = {
  id: string
  papel: 'usuario' | 'assistente'
  conteudo: string
  timestamp: Date
  carregando?: boolean
  erro?: boolean
  mensagemOriginal?: string
}

export type RespostaChat = {
  resposta: string
  erro?: string
}

export type Conversa = {
  id: string
  titulo: string
  mensagens: Mensagem[]
  criadoEm: Date
  atualizadoEm: Date
}

export type HistoricoChat = {
  conversas: Conversa[]
}

export type DadosConsulta = {
  municipio?: string
  regiao?: string
  anoInicio?: number
  anoFim?: number
  mes?: number
  agruparPor?: 'ano' | 'mes' | 'municipio' | 'regiao' | 'genero'
}

export type DadosPrevisao = {
  municipio: string
  mes: number
  ano: number
  temJogo: boolean
}

export type PredicaoUnica = {
  municipio: string
  ano: number
  mes: number
  tem_jogo: boolean
}

export type PredicaoMultipla = {
  municipio: string
  ano_inicial: number
  mes_inicial: number
  meses: number
  jogos: boolean[]
}

export type ResultadoPrevisao = {
  sucesso: boolean
  previsao?: number
  erro?: string
}

export type ResultadoPrevisaoMultipla = {
  sucesso: boolean
  previsoes?: Array<{
    ano: number
    mes: number
    previsao: number
  }>
  erro?: string
}
