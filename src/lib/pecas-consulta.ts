import config from "@payload-config";
import { getPayload } from "payload";

import { comCache } from "@/lib/cache-do-painel";
import { pecaDoPainel, type Peca } from "@/lib/pecas";
import { tagDaRepresentada } from "@/lib/revalidacao";

/**
 * As peças em destaque, já traduzidas para o domínio.
 *
 * ⚠️ **A ÚNICA FUNÇÃO DESTE ARQUIVO EXIGE UMA REPRESENTADA — NÃO HÁ COMO
 * CONSULTAR PEÇAS ATRAVESSANDO MARCAS.** Isto não é convenção de quem chama:
 * `representadaSlug` é parâmetro obrigatório, e o `where` sempre o inclui. O
 * critério de aceite "filtrar peças por categoria funciona dentro de uma
 * representada e não oferece opção entre marcas" é garantido pela ASSINATURA
 * da função, não por disciplina de quem a usa depois.
 *
 * ⚠️ Mesma garantia de "rascunho nunca vaza" de `lib/representadas-consulta.ts`:
 * `_status: { equals: "published" }` explícito no `where`, e a mesma etiqueta
 * de cache da própria representada (`tagDaRepresentada`) — uma peça só aparece
 * na página da marca a que pertence, então invalidar a marca já invalida as
 * peças dela.
 */

async function painel() {
  return getPayload({ config });
}

/**
 * As peças publicadas de UMA representada, opcionalmente filtradas por
 * categoria — a mesma categoria que só existe no vocabulário desta marca (ver
 * `collections/pecas.ts`). Sem `categoria`, devolve todas as peças da marca.
 */
export async function buscarPecasDaRepresentada(
  representadaSlug: string,
  categoria?: string,
): Promise<Peca[]> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "pecas",
        depth: 1,
        pagination: false,
        sort: "nome",
        where: {
          and: [
            // Consulta pelo `slug` da relação, não pelo `id` — a mesma marca
            // que o site já identifica por endereço em toda outra rota.
            { "representada.slug": { equals: representadaSlug } },
            { _status: { equals: "published" } },
            ...(categoria ? [{ categoria: { equals: categoria } }] : []),
          ],
        },
      });

      return docs.map(pecaDoPainel);
    },
    ["pecas-da-representada", representadaSlug, categoria ?? ""],
    [tagDaRepresentada(representadaSlug)],
  );
}
