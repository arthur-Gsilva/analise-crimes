import React from "react";

type MonthYearPickerProps = {
  selectedMonth: number;
  selectedYear: number;
  onChange: (month: number, year: number) => void;
  startYear?: number;
  endYear?: number;
};

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

const GetDate: React.FC<MonthYearPickerProps> = ({
  selectedMonth,
  selectedYear,
  onChange,
  startYear = new Date().getFullYear() - 20,
  endYear = new Date().getFullYear() + 0
}) => {
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md max-w-md mx-auto mt-8">
      {/* Mês */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 font-semibold mb-1">Mês</label>
        <div className="relative">
          <select
            className="appearance-none w-40 px-4 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={selectedMonth}
            onChange={(e) => onChange(Number(e.target.value), selectedYear)}
          >
            {months.map((month, idx) => (
              <option key={idx} value={idx}>{month}</option>
            ))}
          </select>
          <div className="absolute right-3 top-2.5 pointer-events-none">
            ⌄
          </div>
        </div>
      </div>

      {/* Ano */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 font-semibold mb-1">Ano</label>
        <div className="relative">
          <select
            className="appearance-none w-28 px-4 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={selectedYear}
            onChange={(e) => onChange(selectedMonth, Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="absolute right-3 top-2.5 pointer-events-none">
            ⌄
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetDate;
