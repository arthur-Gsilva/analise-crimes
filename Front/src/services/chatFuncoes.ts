import pool from './db'

const DB_TIMEOUT_MS = 10000
const FASTAPI_TIMEOUT_MS = 15000

export const MENSAGENS_ERRO = {
  OPENAI_INDISPONIVEL: 'O serviço de inteligência artificial está temporariamente indisponível. Por favor, tente novamente em alguns instantes.',
  OPENAI_RATE_LIMIT: 'Muitas requisições foram feitas. Por favor, aguarde alguns segundos e tente novamente.',
  OPENAI_TIMEOUT: 'A resposta está demorando mais que o esperado. Por favor, tente uma pergunta mais simples.',
  FASTAPI_INDISPONIVEL: 'O serviço de previsões está temporariamente indisponível. Consultas a dados históricos continuam funcionando.',
  DB_TIMEOUT: 'A consulta ao banco de dados excedeu o tempo limite. Tente filtrar por um período menor ou município específico.',
  DB_INDISPONIVEL: 'O banco de dados está temporariamente indisponível. Por favor, tente novamente em alguns instantes.',
  MUNICIPIO_NAO_ENCONTRADO: 'Município não encontrado no sistema. Use a função listar_municipios para ver os municípios disponíveis.',
  ERRO_INTERNO: 'Ocorreu um erro interno. Por favor, tente novamente.',
  MENSAGEM_OBRIGATORIA: 'Por favor, digite uma mensagem para continuar.'
}

async function executarQueryComTimeout<T>(
  queryFn: () => Promise<T>,
  timeoutMs: number = DB_TIMEOUT_MS
): Promise<T> {
  return Promise.race([
    queryFn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DB_TIMEOUT')), timeoutMs)
    )
  ])
}

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

export async function consultarEstatisticas(params: {
  municipio?: string
  regiao?: string
  anoInicio?: number
  anoFim?: number
  agruparPor?: string
}): Promise<string> {
  try {
    const { municipio, regiao, anoInicio = 2004, anoFim = 2025, agruparPor = 'ano' } = params

    const condicoes: string[] = ['ano >= $1', 'ano <= $2']
    const valores: (string | number)[] = [anoInicio, anoFim]
    let paramIndex = 3

    if (municipio) {
      condicoes.push(`UPPER(municipio) = $${paramIndex}`)
      valores.push(municipio.toUpperCase())
      paramIndex++
    }

    if (regiao) {
      condicoes.push(`UPPER(regiao) = $${paramIndex}`)
      valores.push(regiao.toUpperCase())
      paramIndex++
    }

    const whereClause = condicoes.join(' AND ')

    let groupByColumn: string
    switch (agruparPor) {
      case 'mes':
        groupByColumn = 'mes'
        break
      case 'municipio':
        groupByColumn = 'municipio'
        break
      case 'regiao':
        groupByColumn = 'regiao'
        break
      case 'genero':
        groupByColumn = 'genero'
        break
      default:
        groupByColumn = 'ano'
    }

    const query = `
      SELECT ${groupByColumn}, COUNT(*) as total_vitimas
      FROM crimes_historicos
      WHERE ${whereClause}
      GROUP BY ${groupByColumn}
      ORDER BY ${groupByColumn === 'ano' || groupByColumn === 'mes' ? groupByColumn : 'total_vitimas DESC'}
    `

    const resultado = await executarQueryComTimeout(() => pool.query(query, valores))

    if (resultado.rows.length === 0) {
      return JSON.stringify({
        sucesso: false,
        mensagem: "Não foram encontrados dados para os filtros especificados. Verifique se o município ou região está correto."
      })
    }

    const totalQuery = `
      SELECT COUNT(*) as total
      FROM crimes_historicos
      WHERE ${whereClause}
    `
    const totalResultado = await executarQueryComTimeout(() => pool.query(totalQuery, valores))

    return JSON.stringify({
      sucesso: true,
      filtros: { municipio, regiao, anoInicio, anoFim, agruparPor },
      totalGeral: totalResultado.rows[0].total,
      dados: resultado.rows
    })
  } catch (erro) {
    console.error('Erro ao consultar estatísticas:', erro)
    
    if (erro instanceof Error && erro.message === 'DB_TIMEOUT') {
      return JSON.stringify({
        sucesso: false,
        mensagem: MENSAGENS_ERRO.DB_TIMEOUT
      })
    }
    
    return JSON.stringify({
      sucesso: false,
      mensagem: MENSAGENS_ERRO.DB_INDISPONIVEL
    })
  }
}

export async function fazerPrevisao(params: {
  municipio: string
  mes: number
  ano: number
  temJogo: boolean
}): Promise<string> {
  try {
    const { municipio, mes, ano, temJogo } = params

    const municipioNormalizado = normalizarTexto(municipio)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FASTAPI_TIMEOUT_MS)

    const resposta = await fetch('http://localhost:8000/prever', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        municipio: municipioNormalizado,
        mes,
        ano,
        tem_jogo: temJogo ? 1 : 0
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const dados = await resposta.json()

    if (dados.error) {
      if (dados.error.toLowerCase().includes('município') || 
          dados.error.toLowerCase().includes('municipio') ||
          dados.error.toLowerCase().includes('not found')) {
        return JSON.stringify({
          sucesso: false,
          mensagem: MENSAGENS_ERRO.MUNICIPIO_NAO_ENCONTRADO
        })
      }
      return JSON.stringify({
        sucesso: false,
        mensagem: dados.error
      })
    }

    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const nomeMes = nomesMeses[dados.mes - 1]

    return JSON.stringify({
      sucesso: true,
      previsao: {
        municipio: dados.municipio,
        mes: dados.mes,
        nomeMes: nomeMes,
        ano: dados.ano,
        periodo: `${nomeMes}/${dados.ano}`,
        temJogo: dados.tem_jogo,
        vitimasPrevistas: dados.vitimas_previstas,
        tipoPrevisao: "MENSAL (previsão para um mês específico, NÃO para o ano inteiro)",
        modeloInfo: "Random Forest (R² = 0.916, MAE ≈ 1.2 vítimas)"
      }
    })
  } catch (erro) {
    console.error('Erro ao fazer previsão:', erro)
    
    if (erro instanceof Error && erro.name === 'AbortError') {
      return JSON.stringify({
        sucesso: false,
        mensagem: MENSAGENS_ERRO.FASTAPI_INDISPONIVEL
      })
    }
    
    return JSON.stringify({
      sucesso: false,
      mensagem: MENSAGENS_ERRO.FASTAPI_INDISPONIVEL
    })
  }
}

export async function listarMunicipios(): Promise<string> {
  try {
    const resultado = await executarQueryComTimeout(() => pool.query(`
      SELECT DISTINCT municipio
      FROM crimes_historicos
      WHERE municipio IS NOT NULL
      ORDER BY municipio
    `))

    return JSON.stringify({
      sucesso: true,
      total: resultado.rows.length,
      municipios: resultado.rows.map(r => r.municipio)
    })
  } catch (erro) {
    console.error('Erro ao listar municípios:', erro)
    
    if (erro instanceof Error && erro.message === 'DB_TIMEOUT') {
      return JSON.stringify({
        sucesso: false,
        mensagem: MENSAGENS_ERRO.DB_TIMEOUT
      })
    }
    
    return JSON.stringify({
      sucesso: false,
      mensagem: MENSAGENS_ERRO.DB_INDISPONIVEL
    })
  }
}

export async function analisarImpactoJogos(params: {
  anoInicio?: number
  anoFim?: number
  time?: string
}): Promise<string> {
  try {
    const { anoInicio = 2004, anoFim = 2025, time } = params

    const timesPE = ['Sport', 'Nautico', 'Santa Cruz']
    const timesConsulta = time ? [time] : timesPE

    const jogosQuery = `
      SELECT DISTINCT ano, mes, COUNT(*) as total_jogos
      FROM jogos_brasileirao
      WHERE ano >= $1 AND ano <= $2
        AND (mandante ILIKE ANY($3) OR visitante ILIKE ANY($3))
      GROUP BY ano, mes
      ORDER BY ano, mes
    `
    const jogosResult = await executarQueryComTimeout(() => 
      pool.query(jogosQuery, [anoInicio, anoFim, timesConsulta.map(t => `%${t}%`)])
    )

    if (jogosResult.rows.length === 0) {
      return JSON.stringify({
        sucesso: false,
        mensagem: `Não foram encontrados jogos de times de Pernambuco no período ${anoInicio}-${anoFim}.`
      })
    }

    const mesesComJogos = jogosResult.rows.map(r => ({ ano: r.ano, mes: r.mes, jogos: parseInt(r.total_jogos) }))

    const mesesComJogosConditions = mesesComJogos.map((_, i) => `(ano = ${i * 2 + 1} AND mes = ${i * 2 + 2})`).join(' OR ')
    const mesesComJogosParams = mesesComJogos.flatMap(m => [m.ano, m.mes])

    const crimesComJogosQuery = `
      SELECT ano, mes, COUNT(*) as total_vitimas
      FROM crimes_historicos
      WHERE UPPER(municipio) = 'RECIFE'
        AND (${mesesComJogosConditions})
      GROUP BY ano, mes
      ORDER BY ano, mes
    `
    const crimesComJogosResult = await executarQueryComTimeout(() => 
      pool.query(crimesComJogosQuery, mesesComJogosParams)
    )

    const crimesSemJogosQuery = `
      SELECT ano, mes, COUNT(*) as total_vitimas
      FROM crimes_historicos
      WHERE UPPER(municipio) = 'RECIFE'
        AND ano >= $1 AND ano <= $2
        AND NOT (${mesesComJogosConditions.replace(/\$(\d+)/g, (_, n) => `${parseInt(n) + 2}`)})
      GROUP BY ano, mes
      ORDER BY ano, mes
    `
    const crimesSemJogosResult = await executarQueryComTimeout(() => 
      pool.query(crimesSemJogosQuery, [anoInicio, anoFim, ...mesesComJogosParams])
    )

    const totalComJogos = crimesComJogosResult.rows.reduce((acc, r) => acc + parseInt(r.total_vitimas), 0)
    const totalSemJogos = crimesSemJogosResult.rows.reduce((acc, r) => acc + parseInt(r.total_vitimas), 0)
    const mediaComJogos = crimesComJogosResult.rows.length > 0 ? totalComJogos / crimesComJogosResult.rows.length : 0
    const mediaSemJogos = crimesSemJogosResult.rows.length > 0 ? totalSemJogos / crimesSemJogosResult.rows.length : 0
    const diferencaPercentual = mediaSemJogos > 0 ? ((mediaComJogos - mediaSemJogos) / mediaSemJogos) * 100 : 0

    return JSON.stringify({
      sucesso: true,
      periodo: { anoInicio, anoFim },
      timesAnalisados: timesConsulta,
      mesesComJogos: {
        quantidade: crimesComJogosResult.rows.length,
        totalVitimas: totalComJogos,
        mediaVitimas: Math.round(mediaComJogos * 100) / 100,
        detalhes: crimesComJogosResult.rows.slice(0, 10)
      },
      mesesSemJogos: {
        quantidade: crimesSemJogosResult.rows.length,
        totalVitimas: totalSemJogos,
        mediaVitimas: Math.round(mediaSemJogos * 100) / 100
      },
      analise: {
        diferencaPercentual: Math.round(diferencaPercentual * 100) / 100,
        impacto: diferencaPercentual > 5 ? 'AUMENTO' : diferencaPercentual < -5 ? 'REDUÇÃO' : 'NEUTRO',
        conclusao: diferencaPercentual > 5 
          ? `Meses com jogos do Brasileirão apresentam ${Math.abs(Math.round(diferencaPercentual))}% MAIS vítimas em média`
          : diferencaPercentual < -5
          ? `Meses com jogos do Brasileirão apresentam ${Math.abs(Math.round(diferencaPercentual))}% MENOS vítimas em média`
          : 'Não há diferença significativa entre meses com e sem jogos'
      }
    })
  } catch (erro) {
    console.error('Erro ao analisar impacto de jogos:', erro)
    
    if (erro instanceof Error && erro.message === 'DB_TIMEOUT') {
      return JSON.stringify({
        sucesso: false,
        mensagem: MENSAGENS_ERRO.DB_TIMEOUT
      })
    }
    
    return JSON.stringify({
      sucesso: false,
      mensagem: MENSAGENS_ERRO.DB_INDISPONIVEL
    })
  }
}

export async function calcularCrescimento(params: {
  regiao: string
  anoInicial: number
  anoFinal: number
  limite?: number
}): Promise<string> {
  try {
    const { regiao, anoInicial, anoFinal, limite = 3 } = params

    const queryTotal = `
      SELECT municipio, ano, COUNT(*) as vitimas
      FROM crimes_historicos
      WHERE UPPER(regiao) = $1 AND ano >= $2 AND ano <= $3
      GROUP BY municipio, ano
      ORDER BY municipio, ano
    `
    const resultado = await executarQueryComTimeout(() => 
      pool.query(queryTotal, [regiao.toUpperCase(), anoInicial, anoFinal])
    )

    const dadosPorMunicipio = new Map<string, { porAno: Map<number, number>, total: number }>()
    
    for (const row of resultado.rows) {
      const municipio = row.municipio
      const ano = parseInt(row.ano)
      const vitimas = parseInt(row.vitimas)
      
      if (!dadosPorMunicipio.has(municipio)) {
        dadosPorMunicipio.set(municipio, { porAno: new Map(), total: 0 })
      }
      
      const dados = dadosPorMunicipio.get(municipio)!
      dados.porAno.set(ano, vitimas)
      dados.total += vitimas
    }

    const crescimentos: Array<{
      municipio: string
      vitimasAnoInicial: number
      vitimasAnoFinal: number
      totalPeriodo: number
      crescimentoPercentual: number
    }> = []

    for (const [municipio, dados] of dadosPorMunicipio) {
      const vitimasIni = dados.porAno.get(anoInicial) || 0
      const vitimasFin = dados.porAno.get(anoFinal) || 0
      
      if (vitimasIni > 0) {
        const crescimento = ((vitimasFin - vitimasIni) / vitimasIni) * 100
        crescimentos.push({
          municipio,
          vitimasAnoInicial: vitimasIni,
          vitimasAnoFinal: vitimasFin,
          totalPeriodo: dados.total,
          crescimentoPercentual: Math.round(crescimento * 100) / 100
        })
      }
    }

    crescimentos.sort((a, b) => b.crescimentoPercentual - a.crescimentoPercentual)

    const topCrescimentos = crescimentos.slice(0, limite)

    return JSON.stringify({
      sucesso: true,
      regiao: regiao.toUpperCase(),
      anoInicial,
      anoFinal,
      municipiosAnalisados: crescimentos.length,
      topMunicipios: topCrescimentos,
      observacao: `Crescimento calculado comparando vítimas em ${anoInicial} vs ${anoFinal}. O campo totalPeriodo mostra o total acumulado de ${anoInicial} a ${anoFinal}. Valores positivos indicam aumento, negativos indicam redução.`
    })
  } catch (erro) {
    console.error('Erro ao calcular crescimento:', erro)
    
    if (erro instanceof Error && erro.message === 'DB_TIMEOUT') {
      return JSON.stringify({
        sucesso: false,
        mensagem: MENSAGENS_ERRO.DB_TIMEOUT
      })
    }
    
    return JSON.stringify({
      sucesso: false,
      mensagem: MENSAGENS_ERRO.DB_INDISPONIVEL
    })
  }
}
