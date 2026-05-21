const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://banana-azul-roxa-preta-amarela.vercel.app";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Sua Senha",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/brand/logo.png`,
    width: 512,
    height: 512,
  },
  description:
    "Plataforma de venda antecipada de senhas para vaquejadas de qualquer porte.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Sua Senha",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/vaquejadas?busca={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const siteNavigation = {
  "@type": "SiteNavigationElement",
  "@id": `${SITE_URL}/#navigation`,
  name: [
    "Vaquejadas",
    "Login",
    "Inscrições",
    "Como Funciona",
    "Cadastro",
    "Quem Somos",
  ],
  url: [
    `${SITE_URL}/vaquejadas`,
    `${SITE_URL}/cliente/login`,
    `${SITE_URL}/vaquejadas`,
    `${SITE_URL}/como-funciona`,
    `${SITE_URL}/cliente/cadastro`,
    `${SITE_URL}/quem-somos`,
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [organization, website, siteNavigation],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
