import Link from "next/link";
import Image from "next/image";
import { SignOutButton } from "@/components/auth/SignOutButton";

interface PainelShellProps {
  titulo: string;
  usuario: string;
  children: React.ReactNode;
}

export function PainelShell({ titulo, usuario, children }: PainelShellProps) {
  return (
    <div className="min-h-screen">
      <header className="bg-escuro">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Sua Senha"
              width={80}
              height={40}
              className="h-9 w-auto"
            />
            <span className="font-display text-sm uppercase tracking-wide text-white/90">
              {titulo}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-white/70 sm:inline">
              {usuario}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
