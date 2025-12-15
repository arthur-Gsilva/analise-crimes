'use client';

import { Header } from '@/components/Header';
import { useDashboard } from '@/hooks/useDashboard';
import FiltrosDashboard from '@/components/dashboard/FiltrosDashboard';
import CardsMetricas from '@/components/dashboard/CardsMetricas';
import GraficosDashboard from '@/components/dashboard/GraficosDashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Page = () => {
  const {
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
  } = useDashboard();

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-center text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-bold">Erro ao carregar dados</p>
                <p className="text-sm">{erro}</p>
              </div>
            </div>
            <button
              onClick={buscarDados}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dados) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col container mx-auto px-4 py-3 max-w-7xl overflow-hidden">
        <div className="text-center mb-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Dashboard de Dados Históricos
          </h1>
          <p className="text-sm text-gray-600">
            Análise de crimes violentos em Pernambuco (2004-2025)
          </p>
        </div>

        <FiltrosDashboard
          anoInicio={anoInicio}
          anoFim={anoFim}
          regiaoFiltro={regiaoFiltro}
          generoFiltro={generoFiltro}
          regioes={dados.filtros.regioes}
          generos={dados.filtros.generos}
          onAnoInicioChange={setAnoInicio}
          onAnoFimChange={setAnoFim}
          onRegiaoChange={setRegiaoFiltro}
          onGeneroChange={setGeneroFiltro}
          onAplicarFiltros={buscarDados}
        />

        <CardsMetricas
          total={dados.total}
          anoInicio={anoInicio}
          anoFim={anoFim}
          totalMunicipios={dados.totalMunicipios}
          totalRegioes={dados.porRegiao.length}
        />

        <div className="flex-1 overflow-y-auto">
          <GraficosDashboard dados={dados} />
        </div>
      </div>
    </div>
  );
};

export default Page;