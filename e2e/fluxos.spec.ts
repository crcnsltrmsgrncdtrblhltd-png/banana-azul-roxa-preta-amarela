import { test, expect } from "@playwright/test";

async function loginCliente(page: import("@playwright/test").Page) {
  await page.goto("/cliente/login");
  await page.getByLabel(/e-mail, cpf\/cnpj ou telefone/i).fill("cliente@teste.com");
  await page.getByLabel(/senha cadastrada/i).fill("senha123");
  await page.getByRole("button", { name: /acessar/i }).click();
  await expect(page).toHaveURL(/\/cliente\/painel/);
}

test("compra completa: wizard -> confirmação -> aparece no painel", async ({
  page,
}) => {
  await loginCliente(page);

  await page.goto("/vaquejada/inscricao/1/haras-lider");
  await expect(
    page.getByRole("heading", { name: /1\. categoria/i }),
  ).toBeVisible();

  // categoria, dia, número (primeiro disponível — idempotente)
  await page.getByRole("button", { name: /Profissional/ }).click();
  await page
    .getByRole("button", { name: /Classificatória|Sexta|1º dia/ })
    .first()
    .click();
  await page
    .getByRole("button", { name: /^\d+$/ })
    .first()
    .click();

  await page.getByLabel("Nome do vaqueiro").fill("João Vaqueiro Teste");
  await page.getByLabel("CPF do vaqueiro").fill("11144477735");
  await page.getByLabel("Cidade").fill("Quixadá");
  await page.getByLabel("UF").fill("CE");
  await page.getByRole("button", { name: /pix/i }).click();
  await page.getByRole("button", { name: /confirmar e pagar/i }).click();

  await expect(
    page.getByRole("heading", { name: /senha confirmada/i }),
  ).toBeVisible({ timeout: 15000 });

  await page.goto("/cliente/painel");
  await expect(page.getByText(/Haras Líder/).first()).toBeVisible();
  await expect(page.getByText(/João Vaqueiro Teste/).first()).toBeVisible();
});

test("parque acessa painel e detalhe de evento", async ({ page }) => {
  await page.goto("/parque");
  await page.getByLabel(/e-mail/i).fill("parque0@suasenha.com.br");
  await page.getByLabel(/senha cadastrada/i).fill("senha123");
  await page.getByRole("button", { name: /acessar área do parque/i }).click();
  await expect(page).toHaveURL(/\/parque\/painel/);
  await expect(
    page.getByRole("link", { name: /novo evento/i }),
  ).toBeVisible();
});

test("admin acessa visão geral e eventos", async ({ page }) => {
  await page.goto("/admin");
  await page.getByLabel(/e-mail/i).fill("admin@suasenha.com.br");
  await page.getByLabel(/senha cadastrada/i).fill("senha123");
  await page.getByRole("button", { name: /acessar/i }).click();
  await expect(page).toHaveURL(/\/admin\/painel/);
  await expect(
    page.getByRole("heading", { name: /visão geral/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /^Eventos$/ }).click();
  await expect(page).toHaveURL(/\/admin\/painel\/eventos/);
  await expect(
    page.getByRole("heading", { name: /^Eventos$/ }),
  ).toBeVisible();
});
