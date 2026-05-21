"use client";

import { useState } from "react";

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
] as const;

const CIDADES: Record<string, string[]> = {
  AL: ["Maceió","Arapiraca","Piaçabuçu","Inhapí","Palmeira dos Índios"],
  BA: ["Salvador","Feira de Santana","Vitória da Conquista","Juazeiro","Itapetinga","Lagoa Real","Eunápolis","Baixa Grande","Euclides da Cunha","Biritinga","Serrinha","Cabaceiras do Paraguaçu","Santanópolis","Santa Rita de Cassia","Serra do Ramalho","Barreiras"],
  CE: ["Fortaleza","Juazeiro do Norte","Barbalha","Brejo Santo","Quixadá","Serra Talhada"],
  GO: ["Goiânia","Anápolis","Cabeceira do Goiás"],
  MA: ["São Luís","Imperatriz"],
  MG: ["Belo Horizonte","Montes Claros","Coração de Jesus","Lontra"],
  PB: ["João Pessoa","Campina Grande","Monteiro","Sousa"],
  PE: ["Recife","Petrolina","Caruaru","Bezerros","Tabira","Tacaratu","São Bento do Una","Custodia","Frei Miguelinho","Serra Talhada"],
  PI: ["Teresina","Picos","Bom Jesus","Parnaguá"],
  TO: ["Palmas","Gurupi","Taguatinga"],
};

interface UfCidadeSelectProps {
  defaultUf?: string;
  defaultCidade?: string;
  ufName?: string;
  cidadeName?: string;
}

export function UfCidadeSelect({
  defaultUf = "",
  defaultCidade = "",
  ufName = "uf",
  cidadeName = "cidade",
}: UfCidadeSelectProps) {
  const [uf, setUf] = useState(defaultUf);
  const [cidade, setCidade] = useState(defaultCidade);
  const cidades = CIDADES[uf] ?? [];

  return (
    <div className="grid grid-cols-[5rem_1fr] gap-3">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-escuro">UF</span>
        <select
          name={ufName}
          value={uf}
          onChange={(e) => {
            setUf(e.target.value);
            setCidade("");
          }}
          required
          className="w-full rounded border border-black/15 bg-white px-2 py-2.5 text-sm outline-none focus:border-azul"
        >
          <option value="">--</option>
          {UFS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-escuro">Cidade</span>
        {cidades.length > 0 ? (
          <select
            name={cidadeName}
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
            className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
          >
            <option value="">Selecione...</option>
            {cidades.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__outra">Outra cidade</option>
          </select>
        ) : (
          <input
            name={cidadeName}
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
            placeholder="Digite a cidade"
            className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
          />
        )}
        {cidade === "__outra" ? (
          <input
            name={cidadeName}
            type="text"
            required
            placeholder="Digite a cidade"
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
          />
        ) : null}
      </label>
    </div>
  );
}
