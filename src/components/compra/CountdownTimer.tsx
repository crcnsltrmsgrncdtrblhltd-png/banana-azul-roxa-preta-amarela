"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  dataAlvo: string;
}

interface Tempo {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcular(alvo: string): Tempo {
  const diff = Math.max(0, new Date(alvo).getTime() - Date.now());
  return {
    dias: Math.floor(diff / 86400000),
    horas: Math.floor((diff % 86400000) / 3600000),
    minutos: Math.floor((diff % 3600000) / 60000),
    segundos: Math.floor((diff % 60000) / 1000),
  };
}

function Bloco({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-14 w-14 items-center justify-center rounded border border-black/20 bg-white font-display text-2xl font-bold text-escuro">
        {String(valor).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-texto/60">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ dataAlvo }: CountdownTimerProps) {
  const [tempo, setTempo] = useState<Tempo>(calcular(dataAlvo));

  useEffect(() => {
    const id = setInterval(() => setTempo(calcular(dataAlvo)), 1000);
    return () => clearInterval(id);
  }, [dataAlvo]);

  const zerou =
    tempo.dias === 0 &&
    tempo.horas === 0 &&
    tempo.minutos === 0 &&
    tempo.segundos === 0;

  if (zerou) {
    return (
      <p className="font-display text-lg font-semibold uppercase text-erro">
        Vendas encerradas
      </p>
    );
  }

  return (
    <div className="text-center">
      <h2 className="mb-3 font-display text-lg font-semibold uppercase tracking-wide text-escuro">
        Contagem regressiva...
      </h2>
      <div className="flex justify-center gap-3">
        <Bloco valor={tempo.dias} label="dias" />
        <Bloco valor={tempo.horas} label="horas" />
        <Bloco valor={tempo.minutos} label="min" />
        <Bloco valor={tempo.segundos} label="seg" />
      </div>
    </div>
  );
}
