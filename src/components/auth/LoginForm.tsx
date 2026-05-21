"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction, type FormState } from "@/server/auth-actions";
import { MaskedInput } from "@/components/ui/MaskedInput";
import { SubmitButton } from "@/components/auth/SubmitButton";

type Metodo = "cpf" | "email" | "telefone";

const METODOS: { valor: Metodo; label: string; placeholder: string; type: string }[] = [
  { valor: "cpf", label: "CPF/CNPJ", placeholder: "000.000.000-00", type: "text" },
  { valor: "email", label: "E-mail", placeholder: "seu@email.com", type: "email" },
  { valor: "telefone", label: "Telefone", placeholder: "(00) 00000-0000", type: "tel" },
];

const inicial: FormState = {};

export function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "";
  const [metodo, setMetodo] = useState<Metodo>("cpf");
  const [state, action] = useActionState(loginAction, inicial);

  const atual = METODOS.find((m) => m.valor === metodo)!;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirect" value={redirect} />

      <div>
        <p className="mb-3 text-center text-sm font-medium text-escuro">
          Escolha como você quer fazer o Login
        </p>
        <div className="space-y-1">
          {METODOS.map((m) => (
            <label
              key={m.valor}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="metodoLogin"
                value={m.valor}
                checked={metodo === m.valor}
                onChange={() => setMetodo(m.valor)}
                className="accent-azul"
              />
              Fazer login com {m.label}
            </label>
          ))}
        </div>
      </div>

      {metodo === "cpf" ? (
        <MaskedInput
          mascara="cpfcnpj"
          name="identificador"
          label="CPF/CNPJ"
          placeholder="000.000.000-00"
          autoComplete="username"
        />
      ) : metodo === "telefone" ? (
        <MaskedInput
          mascara="telefone"
          name="identificador"
          label="Telefone"
          placeholder="(00) 00000-0000"
          autoComplete="username"
        />
      ) : (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-escuro">
            E-mail
          </span>
          <input
            name="identificador"
            type="email"
            placeholder="seu@email.com"
            required
            autoComplete="username"
            className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
          />
        </label>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-escuro">
          Senha cadastrada
        </span>
        <input
          name="senha"
          type="password"
          placeholder="Senha cadastrada"
          required
          autoComplete="current-password"
          className="w-full rounded border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-azul"
        />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-erro">
          {state.error}
        </p>
      ) : null}

      <div className="text-center">
        <Link
          href="/cliente/recuperar"
          className="text-sm text-azul hover:underline"
        >
          Recuperar acesso
        </Link>
      </div>

      <SubmitButton variant="azul">Acessar</SubmitButton>

      <p className="text-center text-sm text-texto/70">
        Não tem conta?{" "}
        <Link href="/cliente/cadastro" className="text-verde hover:underline">
          Cadastrar
        </Link>
      </p>
    </form>
  );
}
