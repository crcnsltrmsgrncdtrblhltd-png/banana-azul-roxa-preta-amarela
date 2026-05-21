function parse(data: string): Date {
  return new Date(data.includes("T") ? data : `${data}T00:00:00`);
}

export function dataCurta(data: string): string {
  return parse(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function periodoEvento(inicio: string, fim: string): string {
  return `${dataCurta(inicio)} a ${dataCurta(fim)}`;
}

export function encerramentoVenda(data: string): string {
  const d = parse(data);
  const dia = d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dia} às ${hora}`;
}

export function moeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
