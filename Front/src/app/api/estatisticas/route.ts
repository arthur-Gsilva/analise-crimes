import pool from '@/services/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const todasOcorrencias = await pool.query(`
      SELECT * FROM ocorrencias ORDER BY data DESC
    `);

    const total = todasOcorrencias.rows.length;

    const porRegiao = await pool.query(`
      SELECT regiao, COUNT(*) as total
      FROM ocorrencias
      GROUP BY regiao
      ORDER BY total DESC
    `);

    const porGenero = await pool.query(`
      SELECT genero, COUNT(*) as total
      FROM ocorrencias
      GROUP BY genero
    `);

    const porJogo = await pool.query(`
      SELECT 
        CASE 
          WHEN jogo = 'T' THEN 'Com Jogo'
          ELSE 'Sem Jogo'
        END as tipo,
        COUNT(*) as total
      FROM ocorrencias
      GROUP BY jogo
    `);

    const mediaPorRegiao = await pool.query(`
      SELECT 
        regiao,
        AVG(CAST(REPLACE(resposta_modelo, '%', '') AS NUMERIC)) as media
      FROM ocorrencias
      GROUP BY regiao
      ORDER BY media DESC
    `);

    return NextResponse.json({
      total,
      porRegiao: porRegiao.rows,
      porGenero: porGenero.rows,
      porJogo: porJogo.rows,
      mediaPorRegiao: mediaPorRegiao.rows,
      ultimasOcorrencias: todasOcorrencias.rows.slice(0, 5)
    });

  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' }, 
      { status: 500 }
    );
  }
}
