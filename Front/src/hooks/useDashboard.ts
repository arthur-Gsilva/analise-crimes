import { useState, useEffect, useCallback } from 'react';

type DadosDashboard = {
  total: number;
  totalMunicipios: number;
  porAno: Array<{ ano: number; total: number }>;
  topMunicipios: Array<{ municipio: string; total: number }>;
  porRegiao: Array<{ regiao: string; total: number }>;
  porGenero: Array<{ genero: string; total: number }>;
  comJogo: Array<{ tipo: string; total: number }>;
  filtros: {
    regioes: string[];
    generos: string[];
  };
};

export function useDashboard() {
  const [dados, setDados] = useState<DadosDashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [anoInicio, setAnoInicio] = useState('2004');
  const [anoFim, setAnoFim] = useState('2025');
  const [regiaoFiltro, setRegiaoFiltro] = useState('TODAS');
  const [generoFiltro, setGeneroFiltro] = useState('TODOS');

  const buscarDados = useCallback(() => {
    setCarregando(true);
    setErro(null);

    const params = new URLSearchParams({
      anoInicio,
      anoFim,
      regiao: regiaoFiltro,
      genero: generoFiltro,
    });

    fetch(`/api/dashboard?${params}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao buscar dados');
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setDados(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message || 'Erro ao carregar dados. Tente novamente.');
        setCarregando(false);
      });
  }, [anoInicio, anoFim, regiaoFiltro, generoFiltro]);

  useEffect(() => {
    buscarDados();
  }, []);

  return {
    dados,
    carregando,
    erro,
    anoInicio,
    anoFim,
    regiaoFiltro,
    generoFiltro,
    setAnoInicio,
    setAnoFim,
    setRegiaoFiltro,
    setGeneroFiltro,
    buscarDados,
  };
}
