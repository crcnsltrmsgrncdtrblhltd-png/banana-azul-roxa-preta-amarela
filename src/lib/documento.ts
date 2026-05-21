function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

function validarCpf(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  const calc = (fator: number): number => {
    let soma = 0;
    for (let i = 0; i < fator - 1; i += 1) {
      soma += Number(cpf[i]) * (fator - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
}

function validarCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }
  const calc = (tamanho: number): number => {
    const pesos =
      tamanho === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) {
      soma += Number(cnpj[i]) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return (
    calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13])
  );
}

export function normalizarDocumento(valor: string): string {
  return somenteDigitos(valor);
}

export function documentoValido(valor: string): boolean {
  const limpo = somenteDigitos(valor);
  if (limpo.length === 11) {
    return validarCpf(limpo);
  }
  if (limpo.length === 14) {
    return validarCnpj(limpo);
  }
  return false;
}

export function normalizarTelefone(valor: string): string {
  return somenteDigitos(valor);
}

export function tipoIdentificador(
  valor: string,
): "email" | "cpfCnpj" | "telefone" {
  if (valor.includes("@")) {
    return "email";
  }
  const digitos = somenteDigitos(valor);
  if (digitos.length === 11 || digitos.length === 14) {
    return "cpfCnpj";
  }
  return "telefone";
}
