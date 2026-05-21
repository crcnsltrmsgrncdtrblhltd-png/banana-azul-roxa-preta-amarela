import { sairAction } from "@/server/auth-actions";

export function SignOutButton() {
  return (
    <form action={sairAction}>
      <button
        type="submit"
        className="rounded border border-black/15 px-4 py-2 font-display text-xs font-medium uppercase tracking-wide text-escuro transition-colors hover:bg-escuro hover:text-white"
      >
        Sair
      </button>
    </form>
  );
}
