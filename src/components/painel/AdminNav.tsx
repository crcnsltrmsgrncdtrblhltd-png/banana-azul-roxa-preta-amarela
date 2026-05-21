import Link from "next/link";

const LINKS = [
  { href: "/admin/painel", label: "Visão geral" },
  { href: "/admin/painel/eventos", label: "Eventos" },
  { href: "/admin/painel/parques", label: "Parques" },
  { href: "/admin/painel/usuarios", label: "Usuários" },
  { href: "/admin/painel/reembolsos", label: "Reembolsos" },
];

export function AdminNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded border border-black/15 bg-white px-3 py-1.5 font-display text-xs uppercase tracking-wide text-escuro transition-colors hover:bg-escuro hover:text-white"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
