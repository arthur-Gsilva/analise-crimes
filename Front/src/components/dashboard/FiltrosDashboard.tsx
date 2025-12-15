'use client';

type FiltrosDashboardProps = {
  anoInicio: string;
  anoFim: string;
  regiaoFiltro: string;
  generoFiltro: string;
  regioes: string[];
  generos: string[];
  onAnoInicioChange: (valor: string) => void;
  onAnoFimChange: (valor: string) => void;
  onRegiaoChange: (valor: string) => void;
  onGeneroChange: (valor: string) => void;
  onAplicarFiltros: () => void;
};

export default function FiltrosDashboard({
  anoInicio,
  anoFim,
  regiaoFiltro,
  generoFiltro,
  regioes,
  generos,
  onAnoInicioChange,
  onAnoFimChange,
  onRegiaoChange,
  onGeneroChange,
  onAplicarFiltros,
}: FiltrosDashboardProps) {
  const handleAnoInicioChange = (valor: string) => {
    const ano = parseInt(valor);
    if (ano >= 2004 && ano <= 2025) {
      onAnoInicioChange(valor);
    } else if (valor === '') {
      onAnoInicioChange('2004');
    }
  };

  const handleAnoFimChange = (valor: string) => {
    const ano = parseInt(valor);
    if (ano >= 2004 && ano <= 2025) {
      onAnoFimChange(valor);
    } else if (valor === '') {
      onAnoFimChange('2025');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900">Filtros</h3>
        <button
          onClick={onAplicarFiltros}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
        >
          Aplicar Filtros
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ano Início
          </label>
          <input
            type="number"
            min="2004"
            max="2025"
            value={anoInicio}
            onChange={(e) => handleAnoInicioChange(e.target.value)}
            onBlur={(e) => {
              const ano = parseInt(e.target.value);
              if (ano < 2004) onAnoInicioChange('2004');
              if (ano > 2025) onAnoInicioChange('2025');
            }}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Ano Fim
          </label>
          <input
            type="number"
            min="2004"
            max="2025"
            value={anoFim}
            onChange={(e) => handleAnoFimChange(e.target.value)}
            onBlur={(e) => {
              const ano = parseInt(e.target.value);
              if (ano < 2004) onAnoFimChange('2004');
              if (ano > 2025) onAnoFimChange('2025');
            }}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Região
          </label>
          <select
            value={regiaoFiltro}
            onChange={(e) => onRegiaoChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="TODAS">Todas</option>
            {regioes.map((r: string) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Gênero
          </label>
          <select
            value={generoFiltro}
            onChange={(e) => onGeneroChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="TODOS">Todos</option>
            {generos.map((g: string) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
