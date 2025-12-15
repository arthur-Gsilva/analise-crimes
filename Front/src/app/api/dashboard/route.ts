import pool from '@/services/db'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const anoInicio = parseInt(searchParams.get('anoInicio') || '2004')
    const anoFim = parseInt(searchParams.get('anoFim') || '2025')
    const regiao = searchParams.get('regiao') || 'TODAS'
    const genero = searchParams.get('genero') || 'TODOS'

    if (isNaN(anoInicio) || isNaN(anoFim)) {
      return NextResponse.json(
        { error: 'Anos devem ser números válidos' },
        { status: 400 }
      )
    }

    if (anoInicio > anoFim) {
      return NextResponse.json(
        { error: 'Ano inicial não pode ser maior que ano final' },
        { status: 400 }
      )
    }

    if (anoInicio < 2004 || anoFim > 2025) {
      return NextResponse.json(
        { error: 'Anos devem estar entre 2004 e 2025' },
        { status: 400 }
      )
    }

    const parametros = [anoInicio, anoFim, regiao, genero]

    const totalCrimes = await pool.query(`
      SELECT COUNT(*) as total 
      FROM crimes_historicos 
      WHERE ano >= $1 AND ano <= $2
        AND ($3 = 'TODAS' OR regiao = $3)
        AND ($4 = 'TODOS' OR genero = $4)
    `, parametros)

    const totalMunicipios = await pool.query(`
      SELECT COUNT(DISTINCT municipio) as total
      FROM crimes_historicos
      WHERE ano >= $1 AND ano <= $2
        AND ($3 = 'TODAS' OR regiao = $3)
        AND ($4 = 'TODOS' OR genero = $4)
        AND municipio IS NOT NULL
    `, parametros)

    const porAno = await pool.query(`
      SELECT ano, COUNT(*) as total
      FROM crimes_historicos
      WHERE ano >= $1 AND ano <= $2
        AND ($3 = 'TODAS' OR regiao = $3)
        AND ($4 = 'TODOS' OR genero = $4)
        AND ano IS NOT NULL
      GROUP BY ano
      ORDER BY ano
    `, parametros)

    const topMunicipios = await pool.query(`
      SELECT municipio, COUNT(*) as total
      FROM crimes_historicos
      WHERE ano >= $1 AND ano <= $2
        AND ($3 = 'TODAS' OR regiao = $3)
        AND ($4 = 'TODOS' OR genero = $4)
        AND municipio IS NOT NULL
      GROUP BY municipio
      ORDER BY total DESC
      LIMIT 10
    `, parametros)

    const porRegiao = await pool.query(`
      SELECT regiao, COUNT(*) as total
      FROM crimes_historicos
      WHERE ano >= $1 AND ano <= $2
        AND ($3 = 'TODAS' OR regiao = $3)
        AND ($4 = 'TODOS' OR genero = $4)
        AND regiao IS NOT NULL
        AND regiao != ''
        AND regiao != '0'
        AND TRIM(regiao) != ''
      GROUP BY regiao
      ORDER BY total DESC
    `, parametros)

    const porGenero = await pool.query(`
      SELECT genero, COUNT(*) as total
      FROM crimes_historicos
      WHERE ano >= $1 AND ano <= $2
        AND ($3 = 'TODAS' OR regiao = $3)
        AND ($4 = 'TODOS' OR genero = $4)
        AND genero IS NOT NULL 
        AND genero != 'N/A'
        AND genero != ''
        AND genero != 'DESCONHECIDO'
        AND genero != 'Desconhecido'
        AND TRIM(genero) != ''
      GROUP BY genero
      ORDER BY total DESC
    `, parametros)

    const comJogo = await pool.query(`
      SELECT 
        CASE 
          WHEN j.id IS NOT NULL THEN 'Com Jogo'
          ELSE 'Sem Jogo'
        END as tipo,
        COUNT(*) as total
      FROM crimes_historicos c
      LEFT JOIN jogos_brasileirao j 
        ON c.ano = j.ano AND c.mes = j.mes
      WHERE c.ano >= $1 AND c.ano <= $2
        AND ($3 = 'TODAS' OR c.regiao = $3)
        AND ($4 = 'TODOS' OR c.genero = $4)
        AND c.ano IS NOT NULL 
        AND c.mes IS NOT NULL
      GROUP BY tipo
    `, parametros)

    const regioes = await pool.query(`
      SELECT DISTINCT regiao 
      FROM crimes_historicos 
      WHERE regiao IS NOT NULL 
        AND regiao != ''
        AND regiao != '0'
        AND TRIM(regiao) != ''
      ORDER BY regiao
    `)

    const generos = await pool.query(`
      SELECT DISTINCT genero 
      FROM crimes_historicos 
      WHERE genero IS NOT NULL 
        AND genero != 'N/A'
        AND genero != ''
        AND genero != 'DESCONHECIDO'
        AND genero != 'Desconhecido'
        AND TRIM(genero) != ''
      ORDER BY genero
    `)

    return NextResponse.json({
      total: totalCrimes.rows[0].total,
      totalMunicipios: totalMunicipios.rows[0].total,
      porAno: porAno.rows,
      topMunicipios: topMunicipios.rows,
      porRegiao: porRegiao.rows,
      porGenero: porGenero.rows,
      comJogo: comJogo.rows,
      filtros: {
        regioes: regioes.rows.map(r => r.regiao),
        generos: generos.rows.map(g => g.genero)
      }
    })

  } catch (erro) {
    console.error('Erro ao buscar dados do dashboard:', erro)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' }, 
      { status: 500 }
    )
  }
}
