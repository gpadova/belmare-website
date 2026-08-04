import config from "@payload-config";
import { getPayload } from "payload";

import { comCache } from "@/lib/cache-do-painel";
import {
  type PranchaAreaExterna,
} from "@/lib/prancha-area-externa";
import { pranchaDoPainel } from "@/lib/prancha-traducao";
import { TAG_REPRESENTADAS } from "@/lib/revalidacao";

/**
 * A prancha de `/representadas`, lida do painel.
 *
 * ⚠️ **UMA ETIQUETA SÓ, E É A DA PÁGINA — NÃO A DO SITE.** A prancha aparece em
 * uma rota, e só nela. Ser global não põe nada em toda rota; o que faz isso é o
 * rodapé (ver a nota em `lib/revalidacao.ts`). É a MESMA `TAG_REPRESENTADAS`
 * que cai quando uma representada muda, e isso é deliberado: a legenda da
 * prancha nomeia as fábricas, então as duas edições sujam a mesma superfície.
 *
 * ⚠️ `depth: 1` não é ajuste de desempenho, é o que faz a prancha existir: sem
 * ele a fotografia volta como identificador — sem endereço, sem dimensão — e
 * cada `representada` de chamada volta sem `slug`. O mapper trataria as duas
 * coisas como ausentes e a página cairia inteira na reserva, silenciosamente.
 *
 * ⚠️ Mesma regra de rascunho de `lib/espinha-consulta.ts`: só
 * `_status === "published"` atravessa. Aqui isso tem consequência visível — um
 * operador que sobe a fotografia nova e salva rascunho continua vendo a prancha
 * antiga no site, que é exatamente o que rascunho promete.
 */

async function painel() {
  return getPayload({ config });
}

export async function buscarPrancha(): Promise<PranchaAreaExterna | undefined> {
  return comCache(
    async () => {
      const payload = await painel();
      const doc = await payload.findGlobal({ slug: "prancha", depth: 1 });

      return doc._status === "published" ? pranchaDoPainel(doc) : undefined;
    },
    ["prancha"],
    [TAG_REPRESENTADAS],
  );
}

/**
 * A prancha que a rota desenha.
 *
 * ⚠️ **O PAINEL É A ÚNICA FONTE.** O `??` para `PRANCHA_EM_CODIGO` saiu: sem
 * prancha publicada no painel, `/representadas` não tem o que desenhar e a
 * chamada estoura em vez de mentir com a prancha antiga. Uma reserva silenciosa
 * aqui era pior do que a falta: ela fazia uma prancha despublicada continuar no
 * ar, e ninguém descobria que a publicação nunca tinha funcionado.
 */
export async function pranchaDaPagina(): Promise<PranchaAreaExterna> {
  const doPainel = await buscarPrancha();

  if (!doPainel) {
    throw new Error(
      "A prancha de /representadas não está publicada no painel. Publique-a em “O site › Prancha”, ou rode `pnpm db:seed` num banco recém-migrado.",
    );
  }

  return doPainel;
}
