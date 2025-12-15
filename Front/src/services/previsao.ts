import { PredicaoUnica, PredicaoMultipla, ResultadoPrevisao, ResultadoPrevisaoMultipla } from '@/types/chat';

export async function preverUnico(predicao: PredicaoUnica): Promise<ResultadoPrevisao> {
  const resposta = await fetch('/api/prever-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      municipio: predicao.municipio,
      ano: predicao.ano,
      mes: predicao.mes,
      tem_jogo: predicao.tem_jogo
    })
  });

  return await resposta.json();
}

export async function preverMultiplo(predicao: PredicaoMultipla): Promise<ResultadoPrevisaoMultipla> {
  const resposta = await fetch('/api/prever-multiplo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      municipio: predicao.municipio,
      ano_inicial: predicao.ano_inicial,
      mes_inicial: predicao.mes_inicial,
      meses: predicao.meses,
      jogos: predicao.jogos
    })
  });

  return await resposta.json();
}
