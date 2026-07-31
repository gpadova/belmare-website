import config from "@payload-config";
import { unstable_cache } from "next/cache";

import { foraDeRequisicao } from "@/lib/fora-de-requisicao";
import { getPayload } from "payload";

import { representadaDoPainel } from "@/lib/representadas-traducao";
import { REPRESENTADAS, representadaPorSlug, type Representada } from "@/lib/representadas";
import {
  TAG_CATALOGOS,
  TAG_HOME,
  TAG_QUEM_SOMOS,
  TAG_REPRESENTADAS,
  TAG_RODAPE,
  tagDaRepresentada,
} from "@/lib/revalidacao";

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
 * ⚠️ **AS ETIQUETAS SÃO AS DERIVADAS EM `lib/revalidacao.ts`, NUNCA ESCRITAS
 * AQUI.** Este arquivo só chama a função pura e embrulha a leitura com o
 * resultado — é o hook de `collections/representadas.ts` que revalida essas
 * mesmas etiquetas quando o documento muda ou é apagado. Se um dia esta
 * consulta precisar de uma etiqueta nova, ela nasce em `revalidacao.ts`, não
 * aqui.
 *
 * ⚠️ **RASCUNHO NUNCA VAZA — E A GARANTIA MORA AQUI, NÃO NO PAYLOAD.**
 * Confirmado durante PRA-118, com teste de integração em cima: uma leitura
 * `find` comum, sem `draft: true`, NÃO filtra `_status` sozinha — o Payload
 * devolve o documento em rascunho junto com os publicados se ninguém pedir
 * filtro nenhum. Por isso toda função de leitura PÚBLICA abaixo
 * (`buscarRepresentadas`, `buscarRepresentadaPorSlug`) inclui
 * `_status: { equals: "published" }` no próprio `where`, explícito — não é
 * suposição sobre o framework, é condição escrita na consulta. A única função
 * que lê rascunho é `representadaEmRascunho`, e só ela recebe `draft: true`;
 * nenhuma outra função deste arquivo aceita esse parâmetro. A segunda camada
 * — para quem tentar ler o painel por fora deste arquivo — é o `access.read`
 * de `collections/representadas.ts`.
 */

async function painel() {
  return getPayload({ config });
}

/**
 * `unstable_cache`, tolerante a correr fora de uma requisição do Next.
 *
 * ⚠️ A API local do Payload é chamada de dois mundos: das rotas do site,
 * dentro do processo do Next — onde o cache com etiqueta existe e vale a
 * pena — e do teste de integração e de scripts de linha de comando, fora de
 * qualquer requisição, onde o Next nem chega a instanciar o cache
 * incremental. `unstable_cache` lança `Invariant: incrementalCache missing`
 * antes mesmo de chamar a função nesse segundo mundo, e a resposta certa ali
 * é a leitura direta: teste e script querem o dado fresco de qualquer jeito,
 * nunca uma entrada de cache que sobrevive entre execuções. Isto não é mock
 * de nada — é o mesmo `unstable_cache` de verdade, com uma saída para o único
 * caso em que ele não tem onde guardar a resposta.
 */
async function comCache<T>(
  ler: () => Promise<T>,
  chave: string[],
  tags: string[],
): Promise<T> {
  try {
    return await unstable_cache(ler, chave, { tags })();
  } catch (erro) {
    // Só o invariante de fora-de-requisição vira leitura direta. Um erro do
    // banco vindo de `ler` sobe: engoli-lo aqui chamaria `ler` de novo, o que
    // dobra a carga e esconde a causa atrás de uma segunda falha idêntica.
    if (!foraDeRequisicao(erro)) throw erro;
    return ler();
  }
}

/** Todas as marcas cadastradas, na ordem em que a Belmare as apresenta.
 *
 *  ⚠️ Tagueada com as cinco etiquetas de LISTA — não com a de uma marca
 *  específica, que não existe aqui. São as cinco superfícies que mostram o
 *  conjunto (a sexta, a própria página, lê por `buscarRepresentadaPorSlug`). */
export async function buscarRepresentadas(): Promise<Representada[]> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "representadas",
        depth: 1,
        pagination: false,
        sort: "ordem",
        // Ver a nota sobre "rascunho nunca vaza" no topo do arquivo.
        where: { _status: { equals: "published" } },
      });

      return docs.map(representadaDoPainel);
    },
    ["representadas"],
    [TAG_HOME, TAG_QUEM_SOMOS, TAG_REPRESENTADAS, TAG_CATALOGOS, TAG_RODAPE],
  );
}

/** Uma marca pelo endereço dela. `undefined` quando o painel não a tem.
 *
 *  ⚠️ A etiqueta depende do `slug` recebido, então o embrulho de cache nasce
 *  de novo a cada chamada — a chave de fato (a lista `chave` mais os
 *  argumentos) é o que decide se a entrada é reaproveitada, não a identidade
 *  do embrulho. Editar a Trisol não pode invalidar a leitura da Bux. */
export async function buscarRepresentadaPorSlug(
  slug: string,
): Promise<Representada | undefined> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "representadas",
        depth: 1,
        limit: 1,
        // Ver a nota sobre "rascunho nunca vaza" no topo do arquivo.
        where: { slug: { equals: slug }, _status: { equals: "published" } },
      });

      const doc = docs[0];
      return doc === undefined ? undefined : representadaDoPainel(doc);
    },
    ["representada-por-slug", slug],
    [tagDaRepresentada(slug)],
  );
}

/**
 * A marca em rascunho — a única leitura deste arquivo que vê conteúdo não
 * publicado, e por isso a única que recebe `draft: true`.
 *
 * ⚠️ **NUNCA EMBRULHADA EM `comCache`.** Rascunho é instável por natureza e
 * de uma sessão só; guardar esta leitura atrás de cache com etiqueta faria
 * uma troca de rascunho vazar para uma visita seguinte em preview, ou faria
 * a página de preview mostrar uma versão presa. O próprio modo de rascunho do
 * Next já tira a rota do cache estático — esta função só espelha essa
 * garantia do lado do Payload, lendo direto sempre.
 *
 * ⚠️ Só lê o painel. As quatro marcas escritas à mão em `lib/representadas.ts`
 * não têm rascunho para mostrar: elas não existem no Payload ainda (PRA-119),
 * então não há o que pré-visualizar além do que já está no ar.
 *
 * ⚠️ Chamada apenas pela rota real sob `draftMode()` habilitado — é essa rota
 * que checa o token de preview antes de chegar aqui. Esta função não checa
 * token nenhum: quem a chama já decidiu, por fora dela, que o pedido tem
 * permissão de ver rascunho. Ver `app/(frontend)/representadas/[marca]/page.tsx`
 * e `lib/preview.ts`.
 */
export async function representadaEmRascunho(
  slug: string,
): Promise<Representada | undefined> {
  const payload = await painel();

  const { docs } = await payload.find({
    collection: "representadas",
    depth: 1,
    limit: 1,
    draft: true,
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
