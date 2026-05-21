import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

const COL_INSTITUCIONAL = [
  { label: "Quem somos", href: "/quem-somos" },
  { label: "Como funciona", href: "/como-funciona" },
];

const COL_LEGAL = [
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
  { label: "Política de cancelamento e reembolso", href: "/politica-de-cancelamento" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white">
      <Container className="grid gap-8 py-10 md:grid-cols-4">
        <div>
          <Button href="/parque" variant="amarelo" size="sm">
            Área restrita ao Parque
          </Button>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          {COL_INSTITUCIONAL.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-azul">
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-2 text-sm">
          {COL_LEGAL.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-azul">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="text-sm text-texto/70 md:text-right">
          <p>
            © {SITE.ano} {SITE.nome}
          </p>
          <p>CNPJ: {SITE.cnpj}</p>
          <p>{SITE.email}</p>
        </div>
      </Container>
    </footer>
  );
}
