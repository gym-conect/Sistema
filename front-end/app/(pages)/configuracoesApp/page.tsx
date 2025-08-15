"use client";

import Button from "@/components/Forms/Button";
import Input from "@/components/Forms/Input";
import UploadImage from "@/components/UploadImage/UploadComponent";
import { Plus, Save, Trash } from "lucide-react";
import { useState } from "react";

export default function ConfiguracoesApp() {
  const [banner, setBanner] = useState<string | File>("");
  const [logo, setLogo] = useState<string | File>("");
  const [nomeAcademia, setNomeAcademia] = useState("");
  const [diasFuncionamento, setDiasFuncionamento] = useState("");
  const [horario, setHorario] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [portfolio, setPortfolio] = useState<(string | File)[]>([]);
  const [planos, setPlanos] = useState([{ nome: "", preco: "" }]);

  const handleAddPortfolio = () => {
    if (portfolio.length < 6) {
      setPortfolio([...portfolio, ""]);
    }
  };

  const handleRemovePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handleAddPlano = () => {
    setPlanos([...planos, { nome: "", preco: "" }]);
  };

  const handleRemovePlano = (index: number) => {
    setPlanos(planos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data = {
      banner,
      logo,
      nomeAcademia,
      diasFuncionamento,
      horario,
      endereco,
      telefone,
      whatsapp,
      portfolio,
      planos,
    };
    console.log("Configurações salvas:", data);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-32">
      {/* Seção: Banner e Logo */}
      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <h2 className="text-lg font-semibold">Identidade Visual</h2>
        <UploadImage label="Banner" value={banner} onChange={setBanner} />
        <UploadImage label="Logo da Academia" value={logo} onChange={setLogo} />
      </div>

      {/* Seção: Informações */}
      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <h2 className="text-lg font-semibold">Informações da Academia</h2>
        <Input
          label="Nome da Academia"
          value={nomeAcademia}
          onChange={(e) => setNomeAcademia(e.target.value)}
        />
        <Input
          label="Dias de Funcionamento"
          value={diasFuncionamento}
          onChange={(e) => setDiasFuncionamento(e.target.value)}
        />
        <Input
          label="Horário de Funcionamento"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
        />
        <Input
          label="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
      </div>

      {/* Seção: Contato */}
      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <h2 className="text-lg font-semibold">Contato</h2>
        <Input
          label="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <Input
          label="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      {/* Seção: Portfólio */}
      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Portfólio (até 6 fotos)</h2>
          <Button
            type="button"
            onClick={handleAddPortfolio}
            disabled={portfolio.length >= 6}
          >
            <Plus size={16} /> Adicionar Foto
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {portfolio.map((foto, index) => (
            <div key={index} className="relative">
              <UploadImage
                value={foto}
                onChange={(val) => {
                  const updated = [...portfolio];
                  updated[index] = val;
                  setPortfolio(updated);
                }}
              />
              <button
                type="button"
                onClick={() => handleRemovePortfolio(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Seção: Planos */}
      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Planos da Academia</h2>
          <Button type="button" onClick={handleAddPlano}>
            <Plus size={16} /> Adicionar Plano
          </Button>
        </div>
        {planos.map((plano, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border p-3 rounded-lg"
          >
            <Input
              label="Nome do Plano"
              value={plano.nome}
              onChange={(e) => {
                const updated = [...planos];
                updated[index].nome = e.target.value;
                setPlanos(updated);
              }}
            />
            <Input
              label="Preço"
              value={plano.preco}
              onChange={(e) => {
                const updated = [...planos];
                updated[index].preco = e.target.value;
                setPlanos(updated);
              }}
            />
            <button
              type="button"
              onClick={() => handleRemovePlano(index)}
              className="text-red-500 hover:underline"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border space-y-4">
        <div className="flex items-center justify-end">
          <Button
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            onClick={handleSubmit}
          >
            <Save size={18} />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
