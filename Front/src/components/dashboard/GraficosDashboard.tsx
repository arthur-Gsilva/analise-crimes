'use client';

import { Line, Bar, Pie } from 'react-chartjs-2';

type DadosGraficos = {
  porAno: Array<{ ano: number; total: number }>;
  topMunicipios: Array<{ municipio: string; total: number }>;
  porRegiao: Array<{ regiao: string; total: number }>;
  porGenero: Array<{ genero: string; total: number }>;
  comJogo: Array<{ tipo: string; total: number }>;
};

type GraficosDashboardProps = {
  dados: DadosGraficos;
};

export default function GraficosDashboard({ dados }: GraficosDashboardProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Evolução Temporal
          </h3>
          <div className="h-[200px]">
            <Line
              data={{
                labels: dados.porAno.map((d) => d.ano),
                datasets: [
                  {
                    label: 'Crimes por Ano',
                    data: dados.porAno.map((d) => d.total),
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F61A',
                    tension: 0.4,
                  },
                ],
              }}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Top 10 Municípios
          </h3>
          <div className="h-[200px]">
            <Bar
              data={{
                labels: dados.topMunicipios.map((d) => d.municipio),
                datasets: [
                  {
                    label: 'Total de Crimes',
                    data: dados.topMunicipios.map((d) => d.total),
                    backgroundColor: '#EF444499',
                    borderColor: '#EF4444',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-3">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">Por Região</h3>
          <div className="h-[180px]">
            <Pie
              data={{
                labels: dados.porRegiao.map((d) => d.regiao),
                datasets: [
                  {
                    data: dados.porRegiao.map((d) => d.total),
                    backgroundColor: [
                      '#3B82F699',
                      '#10B98199',
                      '#F59E0B99',
                      '#EF444499',
                      '#8B5CF699',
                    ],
                  },
                ],
              }}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">Por Gênero</h3>
          <div className="h-[180px]">
            <Pie
              data={{
                labels: dados.porGenero.map((d) => d.genero),
                datasets: [
                  {
                    data: dados.porGenero.map((d) => d.total),
                    backgroundColor: [
                      '#3B82F699',
                      '#EC489999',
                      '#9CA3AF99',
                    ],
                  },
                ],
              }}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            Jogos do Brasileirão
          </h3>
          <div className="h-[180px]">
            <Pie
              data={{
                labels: dados.comJogo.map((d) => d.tipo),
                datasets: [
                  {
                    data: dados.comJogo.map((d) => d.total),
                    backgroundColor: [
                      '#10B98199',
                      '#EF444499',
                    ],
                  },
                ],
              }}
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 10
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
