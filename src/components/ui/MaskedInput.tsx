"use client";

import { useCallback } from "react";

type Mascara = "cpf" | "cnpj" | "cpfcnpj" | "telefone";

function aplicarMascara(valor: string, tipo: Mascara): string {
  const d = valor.replace(/\D/g, "");

  if (tipo === "telefone") {
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").slice(0, 15);
  }

  if (tipo === "cpf") {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4").slice(0, 14);
  }

  if (tipo === "cnpj") {
    return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5").slice(0, 18);
  }

  // cpfcnpj: auto-detect
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4").slice(0, 14);
  }
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5").slice(0, 18);
}

interface MaskedInputProps {
  mascara: Mascara;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
}

export function MaskedInput({
  mascara,
  name,
  label,
  placeholder,
  required = true,
  defaultValue = "",
  autoComplete,
}: MaskedInputProps) {
  const onInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      input.value = aplicarMascara(input.value, mascara);
    },
    [mascara],
  );

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-escuro">
        {label}
      </span>
      <input
        name={name}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue ? aplicarMascara(defaultValue, mascara) : ""}
        autoComplete={autoComplete}
        onInput={onInput}
        className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
      />
    </label>
  );
}
