import config from "@payload-config";

import { comCache } from "@/lib/cache-do-painel";
import { getPayload } from "payload";

import { representadaDoPainel } from "@/lib/representadas-traducao";
import { type Representada } from "@/lib/representadas";
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
 * A versão da FORMA de `Representada` guardada em cache.
 *
 * ⚠️ **A ETIQUETA INVALIDA QUANDO O DADO MUDA; ELA NÃO FAZ NADA QUANDO O TIPO
 * MUDA — e essa distinção custou um 500 em 05/08/2026.** `unstable_cache`
 * escreve em disco (`.next/cache`), e a entrada sobrevive ao processo e à
 * troca de código: só uma escrita no painel dispara `revalidateTag`. Quando
 * `Catalogo` deixou de admitir documento sem arquivo, as entradas já gravadas
 * continuaram devolvendo `{"titulo":"Catálogo"}` sem `mb` — e o componente novo,
 * que confia no tipo, chamou `toLocaleString` em `undefined` a cada requisição.
 * A rota inteira caiu, com o banco correto e o código correto.
 *
 * Trocar a chave é o que torna a entrada velha INALCANÇÁVEL, em vez de esperar
 * que alguém apague `.next/` na máquina certa — e o mesmo vale no servidor, onde
 * o cache de dados atravessa deploy.
 *
 * ⚠️ **SUBA ESTE NÚMERO SEMPRE QUE `Representada` MUDAR DE FORMA** — campo novo
 * obrigatório, campo removido, tipo de um campo alterado. Não suba por mudança
 * de conteúdo: para isso existem as etiquetas, e trocar a chave à toa joga fora
 * um cache quente sem motivo.
 */
const FORMA = 2;

const CHAVE_DE_LISTA = `representadas-v${FORMA}`;
const CHAVE_POR_SLUG = `representada-por-slug-v${FORMA}`;

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
    [CHAVE_DE_LISTA],
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
    [CHAVE_POR_SLUG, slug],
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
 * ⚠️ **O PAINEL É A ÚNICA FONTE.** Não há mais reserva em código: uma marca que
 * não está publicada no painel não existe no site, e esta função devolve
 * `undefined` — a rota vira 404. Era o `??` para `representadaPorSlug` que
 * impedia exatamente isso: enquanto ele existiu, despublicar uma marca não a
 * tirava do ar, porque o array de `lib/representadas.ts` a devolvia de volta.
 */
export async function representadaDaPagina(
  slug: string,
): Promise<Representada | undefined> {
  return buscarRepresentadaPorSlug(slug);
}

/**
 * As marcas que as LISTAS do site renderizam — galeria da home, ledger de
 * `/quem-somos`, rodapé.
 *
 * ⚠️ **O PAINEL É A ÚNICA FONTE — E ISSO INCLUI A LISTA VAZIA.** O `??` para o
 * array de `lib/representadas.ts` saiu daqui: banco vazio agora devolve site
 * vazio, em vez de devolver as quatro marcas escritas à mão. É o preço de o
 * painel poder tirar uma marca do ar, e o preço é deliberado — enquanto a
 * reserva existiu, despublicar as quatro no painel ressuscitava as quatro no
 * código.
 *
 * ⚠️ A contrapartida operacional é que o banco de produção precisa estar
 * semeado ANTES do primeiro build, ou a home sobe sem fábrica nenhuma. Ver
 * `pnpm db:seed` e a nota do README sobre a primeira subida.
 */
export async function representadasDaPagina(): Promise<Representada[]> {
  return buscarRepresentadas();
}

/** Os endereços que a rota gera no build — os do painel, e mais nenhum. */
export async function slugsDeRepresentadas(): Promise<string[]> {
  return (await buscarRepresentadas()).map((r) => r.slug);
}
