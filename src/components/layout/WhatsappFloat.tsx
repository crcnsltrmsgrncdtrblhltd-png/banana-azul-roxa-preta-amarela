import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function WhatsappFloat() {
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-verde text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={28} />
    </a>
  );
}
