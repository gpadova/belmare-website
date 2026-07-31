import config from "@payload-config";
import { getPayload } from "payload";

import { arquivo3DDoPainel, type Arquivo3D } from "@/lib/arquivos3d";
import { comCache } from "@/lib/cache-do-painel";
import { tagDaRepresentada } from "@/lib/revalidacao";

/**
 * Os arquivos 3D, já traduzidos para o domínio — mesma garantia de
 * `lib/pecas-consulta.ts`: uma representada por chamada, rascunho nunca vaza.
 *
 * ⚠️ `depth: 1` não é ajuste de desempenho: sem ele o upload de `arquivo` volta
 * como identificador, e o mapper — que trata identificador solto como arquivo
 * ausente — devolveria a lista vazia mesmo com arquivos cadastrados. Mesma
 * nota que `lib/representadas-consulta.ts` já registra para o catálogo.
 */

async function painel() {
  return getPayload({ config });
}

export async function buscarArquivos3DDaRepresentada(
  representadaSlug: string,
): Promise<Arquivo3D[]> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "arquivos3d",
        depth: 1,
        pagination: false,
        sort: "nome",
        where: {
          and: [
            { "representada.slug": { equals: representadaSlug } },
            { _status: { equals: "published" } },
          ],
        },
      });

      // `arquivo3DDoPainel` devolve `undefined` para o caso defensivo em que o
      // upload não pôde ser medido ou formatado — filtrado aqui, nunca
      // repassado como um item quebrado ao componente.
      return docs
        .map(arquivo3DDoPainel)
        .filter((item): item is Arquivo3D => item !== undefined);
    },
    ["arquivos3d-da-representada", representadaSlug],
    [tagDaRepresentada(representadaSlug)],
  );
}
