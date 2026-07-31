import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Desliga o modo de rascunho e devolve o visitante à home.
 *
 * ⚠️ Sem isto, quem abriu um preview fica preso vendo rascunho em toda rota
 * do site indefinidamente — o cookie de `draftMode` do Next não expira
 * sozinho numa sessão de navegador comum. O link para sair mora na faixa de
 * aviso renderizada em `app/(frontend)/layout.tsx` enquanto o modo estiver
 * ligado.
 */
export async function GET() {
  (await draftMode()).disable();
  redirect("/");
}
