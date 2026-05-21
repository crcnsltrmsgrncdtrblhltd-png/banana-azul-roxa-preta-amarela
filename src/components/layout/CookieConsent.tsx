"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CHAVE = "ss_cookie_consent";

export function CookieConsent() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CHAVE) !== "1") {
      setVisivel(true);
    }
  }, []);

  if (!visivel) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 bg-escuro-900 text-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 text-sm sm:flex-row sm:justify-between">
        <p className="text-white/85">
          A Sua Senha usa cookies para melhorar sua experiência. Saiba mais na{" "}
          <Link
            href="/politica-de-privacidade"
            className="text-amarelo underline"
          >
            política de privacidade
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(CHAVE, "1");
            setVisivel(false);
          }}
          className="shrink-0 rounded bg-amarelo px-5 py-2 font-display text-xs font-semibold uppercase tracking-wide text-escuro-900 hover:bg-amarelo-escuro"
        >
          Ok, entendi
        </button>
      </div>
    </div>
  );
}
