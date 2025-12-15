import pool from '@/services/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear().toString());
    const mes = parseInt(searchParams.get('mes') || (new Date().getMonth() + 1).toString());

    if (isNaN(ano) || isNaN(mes) || mes < 1 || mes > 12) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    const resultado = await pool.query(`
      SELECT 
        LOWER(TRIM(municipio)) as municipio,
        COUNT(*) as total
      FROM crimes_historicos
      WHERE ano = $1 AND mes = $2 AND municipio IS NOT NULL
      GROUP BY LOWER(TRIM(municipio))
      ORDER BY total DESC
    `, [ano, mes]);

    const counts: Record<string, number> = {};
    resultado.rows.forEach(row => {
      counts[row.municipio] = parseInt(row.total);
    });

    return NextResponse.json({
      ano,
      mes,
      total_municipios: resultado.rows.length,
      total_ocorrencias: resultado.rows.reduce((sum, row) => sum + parseInt(row.total), 0),
      dados: counts
    });

  } catch (erro) {
    console.error('Erro ao buscar dados do mapa:', erro);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do mapa' },
      { status: 500 }
    );
  }
}
