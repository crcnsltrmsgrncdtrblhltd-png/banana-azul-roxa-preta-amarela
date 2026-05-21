import { test, expect } from "@playwright/test";

test("home exibe filtro de estados e eventos", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /qual o estado da vaquejada/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /mais vaquejadas/i })).toBeVisible();
});

test("listagem filtra por estado", async ({ page }) => {
  await page.goto("/vaquejadas?uf=PE");
  await expect(page).toHaveURL(/uf=PE/);
  await expect(page.getByRole("heading", { name: "Vaquejadas" })).toBeVisible();
});

test("detalhe da vaquejada mostra categorias", async ({ page }) => {
  await page.goto("/vaquejada/1/haras-lider");
  await expect(
    page.getByRole("heading", { name: /categorias/i }),
  ).toBeVisible();
});

test("rota protegida redireciona para login", async ({ page }) => {
  await page.goto("/cliente/painel");
  await expect(page).toHaveURL(/\/cliente\/login\?redirect=/);
});

test("login do cliente acessa o painel", async ({ page }) => {
  await page.goto("/cliente/login");
  await page.getByLabel(/e-mail, cpf\/cnpj ou telefone/i).fill("cliente@teste.com");
  await page.getByLabel(/senha cadastrada/i).fill("senha123");
  await page.getByRole("button", { name: /acessar/i }).click();
  await expect(page).toHaveURL(/\/cliente\/painel/);
  await expect(
    page.getByRole("heading", { name: /minhas senhas/i }),
  ).toBeVisible();
});
