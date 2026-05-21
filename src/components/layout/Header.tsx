"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { sairAction } from "@/server/auth-actions";

interface HeaderProps {
  logado?: boolean;
  nomeUsuario?: string;
}

export function Header({ logado = false, nomeUsuario = "" }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-escuro/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="Sua Senha">
          <Image
            src="/brand/logo.png"
            alt="Sua Senha"
            width={120}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium tracking-wide text-white/90 transition-colors hover:text-amarelo"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {logado ? (
            <>
              {nomeUsuario ? (
                <span className="text-sm text-white/70">{nomeUsuario}</span>
              ) : null}
              <form action={sairAction}>
                <button
                  type="submit"
                  className="rounded bg-erro px-4 py-1.5 font-display text-xs font-semibold uppercase tracking-wide text-white hover:bg-erro/80"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Button href="/cliente/login" variant="azul" size="sm">
                Login
              </Button>
              <Button href="/cliente/cadastro" variant="verde" size="sm">
                Cadastrar
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </Container>

      <div
        className={cn(
          "border-t border-white/10 bg-escuro lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 font-display text-sm tracking-wide text-white/90 hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            {logado ? (
              <form action={sairAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full rounded bg-erro px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide text-white"
                >
                  Sair
                </button>
              </form>
            ) : (
              <>
                <Button href="/cliente/login" variant="azul" size="sm" className="flex-1">
                  Login
                </Button>
                <Button href="/cliente/cadastro" variant="verde" size="sm" className="flex-1">
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
