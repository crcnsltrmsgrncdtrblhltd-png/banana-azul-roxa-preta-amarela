import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIAS = [
  { nome: "Profissional", preco: 1200, bois: 4, senhas: 2 },
  { nome: "Amador", preco: 900, bois: 4, senhas: 2 },
  { nome: "Aspirante", preco: 700, bois: 4, senhas: 2 },
  { nome: "Master", preco: 800, bois: 3, senhas: 2 },
  { nome: "Jovem", preco: 500, bois: 3, senhas: 2 },
  { nome: "Feminina", preco: 600, bois: 3, senhas: 2 },
];

interface EventoSeed {
  nome: string; slug: string; cidade: string; uf: string;
  inicio: string; fim: string; vendaEncerra: string; poster: string;
}

const EVENTOS: EventoSeed[] = [
  { nome: "Vaquejada de Coração de Jesus", slug: "vaquejada-de-coracao-de-jesus", cidade: "Coração de Jesus", uf: "MG", inicio: "2026-05-27", fim: "2026-05-31", vendaEncerra: "2026-05-25T23:59:00", poster: "69d6993e806c4.jpg" },
  { nome: "Haras DS", slug: "haras-ds", cidade: "Barbalha", uf: "CE", inicio: "2026-05-23", fim: "2026-05-24", vendaEncerra: "2026-05-21T23:59:00", poster: "69cab1253d668.jpg" },
  { nome: "Vaquejada de Petrolina - CNV", slug: "vaquejada-de-petrolina-cnv", cidade: "Petrolina", uf: "PE", inicio: "2026-05-26", fim: "2026-05-31", vendaEncerra: "2026-05-24T23:59:00", poster: "69cbb62cc5613.jpg" },
  { nome: "5ª Etapa Campeonato Pernambucano de vaquejada", slug: "etapa-campeonato-pernambucano", cidade: "Bezerros", uf: "PE", inicio: "2026-05-28", fim: "2026-05-31", vendaEncerra: "2026-05-26T23:59:00", poster: "69dd33dcd90bf.jpg" },
  { nome: "Arena São Francisco - CNV", slug: "arena-sao-francisco-cnv", cidade: "Cabaceiras do Paraguaçu", uf: "BA", inicio: "2026-06-02", fim: "2026-06-07", vendaEncerra: "2026-05-29T23:59:00", poster: "69deaa380026b.jpg" },
  { nome: "Copa Organnact", slug: "copa-organnact", cidade: "Itapetinga", uf: "BA", inicio: "2026-06-16", fim: "2026-06-18", vendaEncerra: "2026-06-01T23:59:00", poster: "69e62c94aaf0d.jpg" },
  { nome: "Cadastro Animais CBV", slug: "cadastro-animais-cbv", cidade: "Bahia", uf: "BA", inicio: "2026-07-01", fim: "2026-07-01", vendaEncerra: "2026-06-01T23:59:00", poster: "69e953bc3dd6e.jpg" },
  { nome: "Vaquejada de Lagoa Real", slug: "vaquejada-de-lagoa-real", cidade: "Lagoa Real", uf: "BA", inicio: "2026-06-03", fim: "2026-06-07", vendaEncerra: "2026-06-01T23:59:00", poster: "69e9592ad9433.jpg" },
  { nome: "Vaquejada de Cabeceira do Goiás", slug: "vaquejada-de-cabeceira-do-goias", cidade: "Cabeceira do Goiás", uf: "GO", inicio: "2026-06-04", fim: "2026-06-07", vendaEncerra: "2026-06-02T23:59:00", poster: "69e959efd0d77.jpg" },
  { nome: "Parque Mãe Maria", slug: "parque-mae-maria", cidade: "Tacaratu", uf: "PE", inicio: "2026-06-04", fim: "2026-06-07", vendaEncerra: "2026-06-02T23:59:00", poster: "69ea1a33de5bc.jpg" },
  { nome: "Parque Joaquim Machado", slug: "parque-joaquim-machado", cidade: "Serra do Ramalho", uf: "BA", inicio: "2026-06-10", fim: "2026-06-14", vendaEncerra: "2026-06-08T23:59:00", poster: "69ea8deb81bb6.jpg" },
  { nome: "Parque Santa Maria", slug: "parque-santa-maria", cidade: "Taguatinga", uf: "TO", inicio: "2026-06-11", fim: "2026-06-14", vendaEncerra: "2026-06-09T23:59:00", poster: "69ef96197258f.jpg" },
  { nome: "Parque João Chame Chame", slug: "parque-joao-chame-chame", cidade: "Eunápolis", uf: "BA", inicio: "2026-06-11", fim: "2026-06-14", vendaEncerra: "2026-06-09T23:59:00", poster: "69efa60d99fe2.jpg" },
  { nome: "Parque 25 de Dezembro", slug: "parque-25-de-dezembro", cidade: "Baixa Grande", uf: "BA", inicio: "2026-06-12", fim: "2026-06-14", vendaEncerra: "2026-06-10T23:59:00", poster: "69f33f1166c5d.jpg" },
  { nome: "Arena Germana", slug: "arena-germana", cidade: "Brejo Santo", uf: "CE", inicio: "2026-06-17", fim: "2026-06-21", vendaEncerra: "2026-06-15T23:59:00", poster: "69f8bf3dce5ba.jpg" },
  { nome: "Parque HF4", slug: "parque-hf4", cidade: "Tabira", uf: "PE", inicio: "2026-06-18", fim: "2026-06-21", vendaEncerra: "2026-06-16T23:59:00", poster: "69f9edc7d04cc.jpg" },
  { nome: "Vaquejada Grupo 3 em 1", slug: "vaquejada-grupo-3-em-1", cidade: "Eunápolis", uf: "BA", inicio: "2026-06-18", fim: "2026-06-21", vendaEncerra: "2026-06-16T23:59:00", poster: "69fb341e91cf5.jpg" },
  { nome: "Parque São José", slug: "parque-sao-jose", cidade: "Parnaguá", uf: "PI", inicio: "2026-06-26", fim: "2026-06-28", vendaEncerra: "2026-06-24T23:59:00", poster: "69fde7da47e9e.jpg" },
  { nome: "Parque Guerra - CVV", slug: "parque-guerra-cvv", cidade: "Euclides da Cunha", uf: "BA", inicio: "2026-07-01", fim: "2026-07-05", vendaEncerra: "2026-06-29T23:59:00", poster: "69fe1967163da.jpg" },
  { nome: "Parque D. Delicia Rafael", slug: "parque-d-delicia-rafael", cidade: "Custodia", uf: "PE", inicio: "2026-07-03", fim: "2026-07-05", vendaEncerra: "2026-07-01T23:59:00", poster: "69fe1d8d5776a.jpg" },
  { nome: "Diamante Park Show - CAVAL", slug: "diamante-park-show-caval", cidade: "Inhapí", uf: "AL", inicio: "2026-07-08", fim: "2026-07-12", vendaEncerra: "2026-07-06T23:59:00", poster: "6a01b7b3c53b2.jpg" },
  { nome: "6ª Etapa Campeonato Pernambucano de vaquejada", slug: "sexta-etapa-campeonato-pe", cidade: "São Bento do Una", uf: "PE", inicio: "2026-07-09", fim: "2026-07-12", vendaEncerra: "2026-07-07T23:59:00", poster: "6a01dce127549.jpg" },
  { nome: "Parque Donna Bella", slug: "parque-donna-bella", cidade: "Bom Jesus", uf: "PI", inicio: "2026-07-09", fim: "2026-07-12", vendaEncerra: "2026-07-07T23:59:00", poster: "6a021307ebb70.jpg" },
  { nome: "Rancho 3A", slug: "rancho-3a", cidade: "Biritinga", uf: "BA", inicio: "2026-07-09", fim: "2026-07-12", vendaEncerra: "2026-07-07T23:59:00", poster: "6a02f41e46ec8.jpg" },
  { nome: "Parque Chutão", slug: "parque-chutao", cidade: "Monteiro", uf: "PB", inicio: "2026-07-16", fim: "2026-07-19", vendaEncerra: "2026-07-14T23:59:00", poster: "6a030fc0b2770.jpg" },
  { nome: "Haras Cartaxo 2ºLOTE - CNV", slug: "haras-cartaxo-2-lote-cnv", cidade: "Sousa", uf: "PB", inicio: "2026-07-21", fim: "2026-07-26", vendaEncerra: "2026-07-17T23:59:00", poster: "6a031c7e1382a.jpg" },
  { nome: "Parque O Estevão", slug: "parque-o-estevao", cidade: "Tabira", uf: "PE", inicio: "2026-07-22", fim: "2026-07-26", vendaEncerra: "2026-07-20T23:59:00", poster: "6a03a0c6b1683.jpg" },
  { nome: "Parque Boi Nelore - CNV", slug: "parque-boi-nelore-cnv", cidade: "Frei Miguelinho", uf: "PE", inicio: "2026-07-29", fim: "2026-08-02", vendaEncerra: "2026-07-24T23:59:00", poster: "6a048ab0dcb0a.jpg" },
  { nome: "Parque Rufina Borba - CNV", slug: "parque-rufina-borba-cnv", cidade: "Bezerros", uf: "PE", inicio: "2026-08-11", fim: "2026-08-16", vendaEncerra: "2026-08-07T23:59:00", poster: "6a04971a73008.jpg" },
  { nome: "Vaquejada de Serrinha - CNV", slug: "vaquejada-de-serrinha-cnv", cidade: "Serrinha", uf: "BA", inicio: "2026-09-01", fim: "2026-09-06", vendaEncerra: "2026-08-28T23:59:00", poster: "6a06fe40f1eb7.jpg" },
  { nome: "Circuito Nacional BYD", slug: "circuito-nacional-byd", cidade: "CE", uf: "CE", inicio: "2026-06-04", fim: "2026-06-04", vendaEncerra: "2026-11-06T23:59:00", poster: "6a0db39ca490f.jpg" },
  { nome: "Haras Líder", slug: "haras-lider", cidade: "Serra Talhada", uf: "PE", inicio: "2026-05-20", fim: "2026-05-24", vendaEncerra: "2026-05-18T23:59:00", poster: "69177d1d71e4b.jpg" },
  { nome: "Vaquejada de Santa Rita de Cassia", slug: "vaquejada-de-santa-rita-de-cassia", cidade: "Santa Rita de Cassia", uf: "BA", inicio: "2026-05-20", fim: "2026-05-24", vendaEncerra: "2026-05-18T23:59:00", poster: "695d0cc83940b.jpg" },
  { nome: "Parque Lilian Mascarenhas - CVV", slug: "parque-lilian-mascarenhas-cvv", cidade: "Santanópolis", uf: "BA", inicio: "2026-05-20", fim: "2026-05-24", vendaEncerra: "2026-05-18T23:59:00", poster: "697d1c1b17c3d.jpg" },
  { nome: "Rancho 3 Marias", slug: "rancho-3-marias", cidade: "Piaçabuçu", uf: "AL", inicio: "2026-05-20", fim: "2026-05-24", vendaEncerra: "2026-05-18T23:59:00", poster: "6984a2ea0e5a3.jpg" },
  { nome: "Vaquejada de Lontra", slug: "vaquejada-de-lontra", cidade: "Lontra", uf: "MG", inicio: "2026-05-21", fim: "2026-05-24", vendaEncerra: "2026-05-19T23:59:00", poster: "69b42e7425476.jpg" },
];

const SENHAS_POR_GRUPO = 12;

async function main() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "AuditLog","ConsentLog","Reembolso","Pagamento",' +
      '"ItemPedido","Pedido","Senha","DiaEvento","Categoria","Evento",' +
      '"Parque","User" RESTART IDENTITY CASCADE;',
  );

  const senha = await bcrypt.hash("senha123", 10);

  await prisma.user.create({
    data: {
      tipo: "ADMIN",
      nome: "Administrador Sua Senha",
      cpfCnpj: "00000000000",
      telefone: "00000000000",
      email: "admin@suasenha.com.br",
      dataNascimento: new Date("1990-01-01"),
      passwordHash: senha,
    },
  });

  await prisma.user.create({
    data: {
      tipo: "CLIENTE",
      nome: "Cliente Teste",
      cpfCnpj: "11144477735",
      telefone: "11999990000",
      email: "cliente@teste.com",
      dataNascimento: new Date("1995-06-15"),
      passwordHash: senha,
    },
  });

  for (let i = 0; i < EVENTOS.length; i += 1) {
    const e = EVENTOS[i];

    const usuarioParque = await prisma.user.create({
      data: {
        tipo: "PARQUE",
        nome: `Organizador ${e.nome}`,
        cpfCnpj: String(10000000000 + i).padStart(11, "0"),
        telefone: String(21900000000 + i),
        email: `parque${i}@suasenha.com.br`,
        dataNascimento: new Date("1980-01-01"),
        passwordHash: senha,
      },
    });

    const parque = await prisma.parque.create({
      data: {
        usuarioId: usuarioParque.id,
        nome: e.nome,
        cidade: e.cidade,
        uf: e.uf,
      },
    });

    const inicio = new Date(e.inicio + "T00:00:00");
    const fim = new Date(e.fim + "T00:00:00");
    const vendaEncerra = new Date(e.vendaEncerra);

    const evento = await prisma.evento.create({
      data: {
        slug: e.slug,
        nome: e.nome,
        parqueId: parque.id,
        cidade: e.cidade,
        uf: e.uf,
        dataInicio: inicio,
        dataFim: fim,
        vendaEncerraEm: vendaEncerra,
        posterUrl: `/posters/${e.poster}`,
        status: "PUBLICADO",
        descricao:
          "Venda antecipada de senhas. Escolha categoria, dia e número da senha.",
      },
    });

    const duracao = Math.max(1, Math.round((fim.getTime() - inicio.getTime()) / 86_400_000) + 1);
    const diasLabels = duracao <= 1
      ? [{ label: "Dia único", offset: 0 }]
      : duracao === 2
        ? [{ label: "1º Dia", offset: 0 }, { label: "2º Dia", offset: 1 }]
        : [
            { label: "Quarta", offset: 0 },
            { label: "Quinta", offset: Math.min(1, duracao - 1) },
            ...(duracao > 2 ? [{ label: "Sexta", offset: Math.min(2, duracao - 1) }] : []),
            ...(duracao > 3 ? [{ label: "Sábado", offset: Math.min(3, duracao - 1) }] : []),
            ...(duracao > 4 ? [{ label: "Domingo", offset: Math.min(4, duracao - 1) }] : []),
          ].slice(0, Math.min(duracao, 5));

    const dias = await Promise.all(
      diasLabels.map((d) =>
        prisma.diaEvento.create({
          data: {
            eventoId: evento.id,
            data: new Date(inicio.getTime() + d.offset * 86_400_000),
            label: d.label,
          },
        }),
      ),
    );

    for (const c of CATEGORIAS) {
      const categoria = await prisma.categoria.create({
        data: {
          eventoId: evento.id,
          nome: c.nome,
          regras: `Categoria ${c.nome}: ${c.senhas} senhas por vaqueiro, ${c.bois} bois por bateria, conforme regulamento.`,
          qtdSenhasPorVaqueiro: c.senhas,
          qtdBois: c.bois,
          preco: c.preco,
          taxaAdministrativa: 0,
        },
      });

      const senhas = dias.flatMap((dia) =>
        Array.from({ length: SENHAS_POR_GRUPO }, (_, n) => ({
          eventoId: evento.id,
          categoriaId: categoria.id,
          diaId: dia.id,
          numero: n + 1,
          status: "DISPONIVEL" as const,
        })),
      );

      await prisma.senha.createMany({ data: senhas });
    }
  }

  const totais = await prisma.$transaction([
    prisma.evento.count(),
    prisma.categoria.count(),
    prisma.senha.count(),
    prisma.user.count(),
  ]);
  console.log(
    `Seed concluído: ${totais[0]} eventos, ${totais[1]} categorias, ${totais[2]} senhas, ${totais[3]} usuários.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
