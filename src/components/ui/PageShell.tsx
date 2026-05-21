import { Container } from "@/components/ui/Container";

interface PageShellProps {
  titulo: string;
  children: React.ReactNode;
}

export function PageShell({ titulo, children }: PageShellProps) {
  return (
    <Container className="py-8">
      <article className="rounded-md bg-white px-6 py-8 shadow-sm md:px-10">
        <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-escuro md:text-3xl">
          {titulo}
        </h1>
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-texto">
          {children}
        </div>
      </article>
    </Container>
  );
}
