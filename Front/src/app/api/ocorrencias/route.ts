import { NextResponse } from 'next/server';
import pool from '@/services/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jogo, genero, resposta_modelo, municipio } = body;

    if (!jogo || !genero || !resposta_modelo || !municipio) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    const dataAtual = new Date().toISOString();
    
    const jogoTruncado = jogo.toString().substring(0, 1);
    const generoTruncado = genero.toString().substring(0, 1);
    
    await pool.query(`
      INSERT INTO ocorrencias (jogo, genero, resposta_modelo, data, municipio)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
    `, [jogoTruncado, generoTruncado, resposta_modelo, dataAtual, municipio]);

    return NextResponse.json({ message: 'Ocorrência registrada com sucesso!' });
  } catch (err) {
    console.error('Erro ao processar POST:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
