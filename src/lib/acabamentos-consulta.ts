import config from "@payload-config";
import { getPayload } from "payload";

import { acabamentoDoPainel, type Acabamento } from "@/lib/acabamentos";
import { comCache } from "@/lib/cache-do-painel";
import { tagDaRepresentada } from "@/lib/revalidacao";

/** Os acabamentos, já traduzidos para o domínio — mesma garantia de
 *  `lib/pecas-consulta.ts`: uma representada por chamada, rascunho nunca vaza. */

async function painel() {
  return getPayload({ config });
}

export async function buscarAcabamentosDaRepresentada(
  representadaSlug: string,
): Promise<Acabamento[]> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "acabamentos",
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

      return docs.map(acabamentoDoPainel);
    },
    ["acabamentos-da-representada", representadaSlug],
    [tagDaRepresentada(representadaSlug)],
  );
}
