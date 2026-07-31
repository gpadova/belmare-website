import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

import { enderecoDePreview, tokenDePreviewValido } from "@/lib/preview";

/**
 * A rota que liga o modo de rascunho do Next e manda para a página real.
 *
 * ⚠️ **É AQUI QUE O TOKEN É CONFERIDO — nenhuma outra camada confere.** Sem
 * token válido, esta rota nunca chama `draftMode().enable()`, e sem o modo de
 * rascunho ligado nenhuma página do site troca de leitura publicada para
 * leitura em rascunho (ver `representadaDaPagina` na própria página). É a
 * combinação das duas coisas — token aqui, filtro de `_status` em
 * `lib/representadas-consulta.ts` — que sustenta "rascunho só aparece com
 * token válido, e nunca para o visitante comum".
 *
 * ⚠️ Fora de `/api`, de propósito: `(payload)/api/[...slug]/route.ts` já é o
 * catch-all da API REST do Payload, e um segmento fixo como `/preview` ganha
 * dele na ordem de precedência do Next — mas só por não competir com ele em
 * `/api/*`. Ver a nota gêmea em `[...naoEncontrada]/page.tsx`.
 */
export async function GET(req: NextRequest) {
  const parametros = req.nextUrl.searchParams;
  const token = parametros.get("token");
  const colecao = parametros.get("colecao");
  const slug = parametros.get("slug");

  if (!tokenDePreviewValido(token, process.env.PREVIEW_SECRET)) {
    return new Response(
      "Token de preview inválido ou ausente. Abra o preview pelo botão dentro do painel.",
      { status: 401 },
    );
  }

  const endereco = enderecoDePreview(colecao, slug);
  if (!endereco) {
    return new Response(
      "Não há rota de preview para esta coleção ou este endereço.",
      { status: 404 },
    );
  }

  (await draftMode()).enable();
  redirect(endereco);
}
