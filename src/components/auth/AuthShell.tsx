import Link from "next/link";
import Image from "next/image";

interface AuthShellProps {
  titulo: string;
  children: React.ReactNode;
  rodape?: React.ReactNode;
}

export function AuthShell({ titulo, children, rodape }: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-md bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Link href="/">
            <Image
              src="/brand/logo.png"
              alt="Sua Senha"
              width={90}
              height={90}
              className="h-16 w-auto"
              priority
            />
          </Link>
          <h1 className="font-display text-xl font-semibold uppercase tracking-wide text-escuro">
            {titulo}
          </h1>
        </div>
        {children}
        {rodape ? (
          <div className="mt-6 text-center text-sm text-texto/70">
            {rodape}
          </div>
        ) : null}
      </div>
    </div>
  );
}
