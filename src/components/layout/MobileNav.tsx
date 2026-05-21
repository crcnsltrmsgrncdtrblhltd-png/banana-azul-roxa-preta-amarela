import Link from "next/link";
import { ShoppingCart, Ticket, LogOut, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/10 bg-white lg:hidden">
      <Link
        href="/vaquejadas"
        className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] text-texto/70 hover:text-escuro"
      >
        <ShoppingCart size={20} />
        Vaquejadas
      </Link>
      <Link
        href="/cliente/painel"
        className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] text-texto/70 hover:text-escuro"
      >
        <Ticket size={20} />
        Minhas senhas
      </Link>
      <Link
        href="/cliente/login"
        className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] text-texto/70 hover:text-escuro"
      >
        <LogOut size={20} />
        Sair
      </Link>
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col items-center gap-0.5 bg-verde py-2 text-[10px] text-white"
      >
        <MessageCircle size={20} />
        Ajuda
      </a>
    </nav>
  );
}
