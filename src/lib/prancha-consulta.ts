import config from "@payload-config";
import { getPayload } from "payload";

import { comCache } from "@/lib/cache-do-painel";
import {
  PRANCHA_EM_CODIGO,
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
 * ⚠️ **PAINEL PRIMEIRO, CÓDIGO COMO RESERVA — mesmo `??` de
 * `representadasDaPagina`, e pelo mesmo motivo.** Um banco vazio (máquina
 * recém-clonada, build antes do seed) não pode devolver `/representadas` sem a
 * prancha, que é a página inteira. A reserva não é uma segunda fonte de
 * verdade: é o que o site desenhava antes deste ticket, coerente consigo mesma,
 * e ela só aparece quando o painel não tem NADA publicável.
 */
export async function pranchaDaPagina(): Promise<PranchaAreaExterna> {
  return (await buscarPrancha()) ?? PRANCHA_EM_CODIGO;
}
