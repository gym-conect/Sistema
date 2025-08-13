"use client";

import Button from "@/components/Forms/Button";
import { parseISO } from "date-fns";
import { Copy } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Transaction = {
  id: string;
  date: string; // ISO
  description: string;
  category: string;
  paymentMethod: "Dinheiro" | "Pix" | "Cartão" | "Boleto" | string;
  type: "entrada" | "saida";
  value: number;
  month: string;
  filial: string;
};

// Meses fixos do ano
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Lista de filiais
const filiais = ["Filial A", "Filial B", "Filial C"];

// Dados base conhecidos
const initialData: Record<
  string,
  { month: string; entrada: number; saida: number }[]
> = {
  "Filial A": [
    { month: "Janeiro", entrada: 10000, saida: 4000 },
    { month: "Fevereiro", entrada: 11000, saida: 4500 },
    { month: "Março", entrada: 12000, saida: 5000 },
    { month: "Abril", entrada: 9000, saida: 3500 },
    { month: "Maio", entrada: 13000, saida: 6000 },
    { month: "Junho", entrada: 11000, saida: 4000 },
    { month: "Julho", entrada: 14000, saida: 5000 },
    { month: "Agosto", entrada: 12500, saida: 5500 },
  ],
  "Filial B": [
    { month: "Janeiro", entrada: 8000, saida: 3000 },
    { month: "Fevereiro", entrada: 9000, saida: 3500 },
    { month: "Março", entrada: 9500, saida: 4000 },
    { month: "Abril", entrada: 7000, saida: 2500 },
    { month: "Maio", entrada: 10000, saida: 4500 },
    { month: "Junho", entrada: 9000, saida: 3000 },
    { month: "Julho", entrada: 11000, saida: 3500 },
    { month: "Agosto", entrada: 10500, saida: 4000 },
  ],
  "Filial C": [
    { month: "Janeiro", entrada: 12000, saida: 5000 },
    { month: "Fevereiro", entrada: 13000, saida: 5500 },
    { month: "Março", entrada: 13500, saida: 6000 },
    { month: "Abril", entrada: 10000, saida: 4500 },
    { month: "Maio", entrada: 14000, saida: 7000 },
    { month: "Junho", entrada: 12000, saida: 4500 },
    { month: "Julho", entrada: 15000, saida: 6000 },
    { month: "Agosto", entrada: 14000, saida: 6500 },
  ],
};

// Função para garantir todos os meses
const fillMissingMonths = (
  data: { month: string; entrada: number; saida: number }[]
) => {
  return MONTHS.map((month) => {
    const found = data.find((m) => m.month === month);
    return found || { month, entrada: 0, saida: 0 };
  });
};

// Dados finais com todos os meses para todas as filiais
const allCashFlowDataByFilial: Record<
  string,
  { month: string; entrada: number; saida: number }[]
> = Object.fromEntries(
  Object.entries(initialData).map(([filial, data]) => [
    filial,
    fillMissingMonths(data),
  ])
);

// Transações
const transactions: Transaction[] = [
  {
    id: "1",
    date: "2025-08-05",
    description: "Mensalidade Cliente X",
    category: "Mensalidade",
    paymentMethod: "Pix",
    type: "entrada",
    value: 1200,
    month: "Agosto",
    filial: "Filial A",
  },
  {
    id: "2",
    date: "2025-08-07",
    description: "Compra Material",
    category: "Despesas",
    paymentMethod: "Cartão",
    type: "saida",
    value: 450,
    month: "Agosto",
    filial: "Filial A",
  },
  {
    id: "3",
    date: "2025-07-15",
    description: "Mensalidade Cliente Y",
    category: "Mensalidade",
    paymentMethod: "Dinheiro",
    type: "entrada",
    value: 1300,
    month: "Julho",
    filial: "Filial B",
  },
  {
    id: "4",
    date: "2025-07-20",
    description: "Pagamento Energia",
    category: "Despesas",
    paymentMethod: "Boleto",
    type: "saida",
    value: 300,
    month: "Julho",
    filial: "Filial B",
  },
  {
    id: "5",
    date: "2025-08-10",
    description: "Mensalidade Cliente Z",
    category: "Mensalidade",
    paymentMethod: "Pix",
    type: "entrada",
    value: 1500,
    month: "Agosto",
    filial: "Filial C",
  },
  {
    id: "6",
    date: "2025-08-12",
    description: "Compra Equipamentos",
    category: "Despesas",
    paymentMethod: "Cartão",
    type: "saida",
    value: 700,
    month: "Agosto",
    filial: "Filial C",
  },
];

// Cores do gráfico
const PIE_COLORS = ["#60a5fa", "#34d399", "#f97316", "#f87171", "#a78bfa"];

export default function FluxoCaixaPage() {
  const [selectedFilial, setSelectedFilial] = useState<string>(filiais[0]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["Agosto"]);
  const [modalidade, setModalidade] = useState<string>("Todos");
  const [tipoPagamento, setTipoPagamento] = useState<string>("Todos");
  const [fluxo, setFluxo] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");

  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [sortBy, setSortBy] = useState<"date" | "value">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filteredChartData = useMemo(() => {
    const dataForFilial = allCashFlowDataByFilial[selectedFilial] || [];
    return dataForFilial.filter((m) => selectedMonths.includes(m.month));
  }, [selectedFilial, selectedMonths]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (t.filial !== selectedFilial) return false;
        if (selectedMonths.length && !selectedMonths.includes(t.month))
          return false;
        if (modalidade !== "Todos" && t.category !== modalidade) return false;
        if (tipoPagamento !== "Todos" && t.paymentMethod !== tipoPagamento)
          return false;
        if (fluxo !== "Todos" && t.type !== fluxo) return false;
        if (
          search &&
          !(
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase())
          )
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const diff = parseISO(a.date).getTime() - parseISO(b.date).getTime();
          return sortDir === "asc" ? diff : -diff;
        } else {
          const diff = a.value - b.value;
          return sortDir === "asc" ? diff : -diff;
        }
      });
  }, [
    transactions,
    selectedFilial,
    selectedMonths,
    modalidade,
    tipoPagamento,
    fluxo,
    search,
    sortBy,
    sortDir,
  ]);

  const totalEntrada = filteredChartData.reduce((s, c) => s + c.entrada, 0);
  const totalSaida = filteredChartData.reduce((s, c) => s + c.saida, 0);
  const saldo = totalEntrada - totalSaida;

  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredTransactions.forEach((t) => {
      if (t.type === "saida") {
        const key = t.category;
        map[key] = (map[key] || 0) + Math.abs(t.value);
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize)
  );
  const pageItems = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const toggleMonth = (month: string) => {
    setSelectedMonths((prev) => {
      if (prev.includes(month)) return prev.filter((m) => m !== month);
      if (prev.length >= 4) return prev;
      return [...prev, month];
    });
  };

  const opcoesModalidade = [
    { label: "Todos", value: "Todos" },
    { label: "Mensalidade", value: "Mensalidade" },
    { label: "Despesas", value: "Despesas" },
  ];
  const opcoesTipoPagamento = [
    { label: "Todos", value: "Todos" },
    { label: "Pix", value: "Pix" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Cartão", value: "Cartão" },
    { label: "Boleto", value: "Boleto" },
  ];
  const opcoesFluxo = [
    { label: "Todos", value: "Todos" },
    { label: "Entrada", value: "entrada" },
    { label: "Saída", value: "saida" },
  ];

  const onSubmitFunction = async () => {};

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Filial */}
      <div className="mb-4 flex items-center justify-between">
        <div className="max-w-xs w-full">
          <label className="block text-sm font-medium mb-1" htmlFor="filial">
            Filial
          </label>
          <select
            id="filial"
            value={selectedFilial}
            onChange={(e) => setSelectedFilial(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            {filiais.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            title="Gerar Relatório"
            className="bg-gray-100 p-2 rounded hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            onClick={() => console.log("Gerar relatório")}
          >
            <Copy size={16} />
            <span>Gerar Relatório</span>
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 text-green-800 shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">
            Entradas (período)
          </h3>
          <div className="mt-2 text-2xl font-bold text-green-700">
            R$ {totalEntrada.toLocaleString()}
          </div>
        </div>
        <div className="bg-red-100 text-red-800 shadow rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600">
            Saídas (período)
          </h3>
          <div className="mt-2 text-2xl font-bold text-red-600">
            R$ {totalSaida.toLocaleString()}
          </div>
        </div>
        <div
          className={`shadow rounded-lg p-4 ${
            saldo >= 0 ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h3 className="text-sm font-medium text-gray-600">Saldo (período)</h3>
          <div className="mt-2 text-2xl font-bold">
            {saldo >= 0 ? "+" : "-"} R$ {Math.abs(saldo).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Meses e exportação */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-sm font-medium mr-2">Meses:</label>
            {(allCashFlowDataByFilial[selectedFilial] || []).map((m) => (
              <button
                key={m.month}
                onClick={() => toggleMonth(m.month)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  selectedMonths.includes(m.month)
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {m.month}
              </button>
            ))}
          </div>
          <div className="flex-1" />
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold mb-4">Fluxo de Caixa</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={filteredChartData}
              onClick={(e: any) => {
                if (e && e.activeLabel) {
                  toggleMonth(e.activeLabel as string);
                }
              }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: any) =>
                  `R$ ${Number(value).toLocaleString()}`
                }
              />
              <Legend />
              <Bar dataKey="entrada" name="Entradas" fill="#34d399" />
              <Bar dataKey="saida" name="Saídas" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
            <select id="modalidade" className="w-full border rounded px-2 py-1">
              {opcoesModalidade.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
            <select
              id="tipoPagamento"
              className="w-full border rounded px-2 py-1"
            >
              {opcoesTipoPagamento.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
            <select id="fluxo" className="w-full border rounded px-2 py-1">
              {opcoesFluxo.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              className="w-full h-[30px] bg-green-500 cursor-pointer text-white rounded px-4 py-2"
            >
              Filtrar
            </Button>
          </form>
          <h2 className="font-semibold mb-4">Gráfico por Categoria</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Tooltip
                formatter={(value: any) =>
                  `R$ ${Number(value).toLocaleString()}`
                }
              />
              <Legend />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, percent }: any) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
