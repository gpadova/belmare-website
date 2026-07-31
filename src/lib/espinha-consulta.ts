import config from "@payload-config";
import { getPayload } from "payload";

import { comCache } from "@/lib/cache-do-painel";
import { homeDoPainel, quemSomosDoPainel, type Home, type QuemSomos } from "@/lib/espinha";
import { TAG_HOME, TAG_QUEM_SOMOS } from "@/lib/revalidacao";

/**
 * A prosa da espinha fixa, lida do painel.
 *
 * ⚠️ **UMA ETIQUETA POR PÁGINA, E NÃO A DO SITE INTEIRO.** Diferente de
 * `Empresa` — que está no layout e portanto em toda rota —, o texto da home só
 * aparece na home e o de `/quem-somos` só em `/quem-somos`. Publicar uma
 * correção de vírgula na home não pode invalidar a página estática de quatro
 * marcas que não mudaram. As duas etiquetas são as MESMAS que
 * `lib/representadas-consulta.ts` já usa para essas superfícies: quando a
 * galeria da home muda por causa de uma representada nova, é a mesma
 * `TAG_HOME` que cai, e não uma segunda etiqueta paralela.
 *
 * ⚠️ Mesma regra de rascunho de `lib/empresa-consulta.ts`: só
 * `_status === "published"` atravessa, e o global vazio é resposta válida — o
 * parágrafo simplesmente não é desenhado (seção anulável).
 */

async function painel() {
  return getPayload({ config });
}

export async function buscarHome(): Promise<Home> {
  return comCache(
    async () => {
      const payload = await painel();
      const doc = await payload.findGlobal({ slug: "home", depth: 0 });

      return doc._status === "published" ? homeDoPainel(doc) : {};
    },
    ["home"],
    [TAG_HOME],
  );
}

export async function buscarQuemSomos(): Promise<QuemSomos> {
  return comCache(
    async () => {
      const payload = await painel();
      const doc = await payload.findGlobal({ slug: "quem-somos", depth: 0 });

      return doc._status === "published" ? quemSomosDoPainel(doc) : {};
    },
    ["quem-somos"],
    [TAG_QUEM_SOMOS],
  );
}
