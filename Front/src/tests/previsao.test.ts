import { preverUnico, preverMultiplo } from '../services/previsao';

global.fetch = jest.fn();

describe('Testando as previsões', () => {
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('deve enviar os dados corretos e retornar a resposta em preverUnico', async () => {
    const mockResposta = { resultado: 3 };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResposta
    });

    const predicao = {
      municipio: "Petrolina",
      ano: 2025,
      mes: 3,
      tem_jogo: true
    };

    const resposta = await preverUnico(predicao);
    const sucesso = resposta.sucesso

    expect(fetch).toHaveBeenCalledWith('/api/prever-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predicao)
    });

    expect(sucesso).toBeTruthy;
  });

  it('deve enviar os dados corretos e retornar a resposta em preverMultiplo', async () => {
    const mockResposta = { resultados: [30, 20, 30] };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResposta
    });

    const predicao = {
      municipio: "Recife",
      ano_inicial: 2024,
      mes_inicial: 8,
      meses: 3,
      jogos: [true, false, true]
    };

    const resposta = await preverMultiplo(predicao);

    expect(fetch).toHaveBeenCalledWith('/api/prever-multiplo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predicao)
    });

    expect(resposta).toEqual(mockResposta);
  });

});
