import config from "@payload-config";
import { getPayload } from "payload";

import { representadaDoPainel } from "@/lib/representadas-traducao";
import { REPRESENTADAS, representadaPorSlug, type Representada } from "@/lib/representadas";

/**
 * As consultas ao painel, já traduzidas para o domínio.
 *
 * ⚠️ **ESTE É O ÚNICO LUGAR DO SITE QUE FALA COM O PAYLOAD.** Rota e componente
 * chamam daqui e recebem `Representada` — o tipo de `lib/representadas.ts`,
 * não o gerado. Uma rota que chamasse `getPayload()` direto teria que decidir
 * sozinha o que fazer com um catálogo sem peso, e é essa decisão que a camada
 * de tradução existe para tomar uma vez só.
 *
 * ⚠️ `depth: 1` não é ajuste de desempenho: sem ele os uploads voltam como
 * identificador, e o mapper — que trata identificador solto como anexo ausente
 * — transformaria todo catálogo publicado em pedido pelo WhatsApp. A
 * profundidade é o que faz o peso existir.
 *
 * Cache de leitura não está aqui de propósito: as etiquetas de invalidação são
 * PRA-117, e uma etiqueta escrita à mão antes da função pura que as deriva é
 * exatamente a lista que envelhece em silêncio.
 */

async function painel() {
  return getPayload({ config });
}

/** Todas as marcas cadastradas, na ordem em que a Belmare as apresenta. */
export async function buscarRepresentadas(): Promise<Representada[]> {
  const payload = await painel();

  const { docs } = await payload.find({
    collection: "representadas",
    depth: 1,
    pagination: false,
    sort: "ordem",
  });

  return docs.map(representadaDoPainel);
}

/** Uma marca pelo endereço dela. `undefined` quando o painel não a tem. */
export async function buscarRepresentadaPorSlug(
  slug: string,
): Promise<Representada | undefined> {
  const payload = await painel();

  const { docs } = await payload.find({
    collection: "representadas",
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  });

  const doc = docs[0];
  return doc === undefined ? undefined : representadaDoPainel(doc);
}

/**
 * A marca que a rota `/representadas/[marca]` renderiza.
 *
 * ⚠️ **O PAINEL PRIMEIRO, O CÓDIGO ENQUANTO A MIGRAÇÃO NÃO PASSOU.** As quatro
 * marcas ainda vivem escritas à mão em `lib/representadas.ts`, e passá-las para
 * o painel é PRA-119. Até lá as duas fontes coexistem — e é isso que permite
 * cadastrar UMA marca no painel para provar o caminho inteiro sem que as outras
 * três virem 404 no meio do caminho. Quando o array sair, o `??` sai com ele e
 * esta função vira `buscarRepresentadaPorSlug`.
 */
export async function representadaDaPagina(
  slug: string,
): Promise<Representada | undefined> {
  return (await buscarRepresentadaPorSlug(slug)) ?? representadaPorSlug(slug);
}

/**
 * Os endereços que a rota gera no build — a união das duas fontes, sem repetir
 * quem já está no painel.
 */
export async function slugsDeRepresentadas(): Promise<string[]> {
  const doPainel = await buscarRepresentadas();

  return [
    ...new Set([
      ...doPainel.map((r) => r.slug),
      ...REPRESENTADAS.map((r) => r.slug),
    ]),
  ];
}
