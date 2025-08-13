"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const allCashFlowData = [
  { month: "Janeiro", entrada: 12000, saida: 5000 },
  { month: "Fevereiro", entrada: 10000, saida: 4000 },
  { month: "Março", entrada: 15000, saida: 6000 },
  { month: "Abril", entrada: 9000, saida: 3000 },
  { month: "Maio", entrada: 13000, saida: 7000 },
  { month: "Junho", entrada: 11000, saida: 4000 },
  { month: "Julho", entrada: 14000, saida: 5000 },
  { month: "Agosto", entrada: 12500, saida: 5500 },
  { month: "Setembro", entrada: 0, saida: 0 },
  { month: "Outubro", entrada: 0, saida: 0 },
  { month: "Novembro", entrada: 0, saida: 0 },
  { month: "Dezembro", entrada: 0, saida: 0 },
];

export default function DashboardPage() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["Agosto"]);

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) {
        return prev.filter((m) => m !== month);
      } else if (prev.length < 4) {
        return [...prev, month];
      } else {
        return prev; // limita a 4 meses
      }
    });
  };

  const filteredData = allCashFlowData.filter((item) =>
    selectedMonths.includes(item.month)
  );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8">
      {/* Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-100 text-green-800 shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Alunos Cadastrados
          </h2>
          <p className="mt-2 text-3xl font-bold">1.245</p>
          <p className="text-sm text-gray-500">Alunos Cadastrados</p>
        </div>

        <div className="bg-green-100 text-green-800 shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Alunos Ativos</h2>
          <p className="mt-2 text-3xl font-bold">182</p>
          <p className="text-sm text-gray-500">Alunos Ativos</p>
        </div>

        <div className="bg-green-100 text-green-800 shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Alunos Inativos
          </h2>
          <p className="mt-2 text-3xl font-bold">45</p>
          <p className="text-sm text-gray-500">Alunos Inativos</p>
        </div>
      </div>

      {/* Seletor de meses */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Selecionar até 4 meses:
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCashFlowData.map((item) => (
            <button
              key={item.month}
              className={`px-4 py-2 rounded-full border ${
                selectedMonths.includes(item.month)
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => toggleMonth(item.month)}
            >
              {item.month}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de fluxo de caixa */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Fluxo de Caixa
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="entrada" fill="#4ade80" name="Entradas" />
            <Bar dataKey="saida" fill="#f87171" name="Saídas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
