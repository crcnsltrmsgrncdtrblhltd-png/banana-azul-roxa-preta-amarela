import { auth } from "@/auth";
import { Header } from "@/components/layout/Header";

export async function HeaderWrapper() {
  const session = await auth();
  const logado = !!session?.user;
  const nome = session?.user?.name ?? "";

  return <Header logado={logado} nomeUsuario={nome} />;
}
