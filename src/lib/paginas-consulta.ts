import config from "@payload-config";
import { getPayload } from "payload";

import { comCache } from "@/lib/cache-do-painel";
import {
  paginaDoPainel,
  type DocumentoDePagina,
} from "@/lib/paginas-traducao";
import { tagDaPaginaLivre } from "@/lib/revalidacao";
import type { PaginaLivre, RotaLivre } from "@/lib/paginas";

/**
 * As páginas livres, lidas do painel.
 *
 * ⚠️ **UMA ETIQUETA POR ENDEREÇO, E SÓ ELA.** A composição de `/contato` não
 * aparece em rota nenhuma além de `/contato` — o que a home e o rodapé mostram é
 * o RÓTULO do link, texto fixo em código. Editar a política de privacidade não
 * pode invalidar a página estática de quatro marcas que não mudaram. A etiqueta
 * sai de `lib/revalidacao.ts#tagDaPaginaLivre`, a mesma função pura que o hook
 * de `collections/paginas.ts` chama ao publicar — nunca escrita à mão nos dois
 * lados.
 *
 * ⚠️ **RASCUNHO NUNCA VAZA, E A GARANTIA MORA AQUI.** Achado de PRA-118,
 * confirmado por experimento e válido para toda coleção: uma leitura `find`
 * comum NÃO filtra `_status` sozinha. Por isso `buscarPaginaLivre` traz o
 * filtro explícito no próprio `where`, e a única função que lê rascunho é
 * `paginaLivreEmRascunho` — a única que recebe `draft: true`. A segunda camada
 * é o `access.read` da coleção, para quem tentar ler o painel por fora daqui.
 *
 * ⚠️ **A LEITURA DE RASCUNHO NUNCA É EMBRULHADA EM `comCache`, E AQUI ISSO É
 * MAIS DO QUE HIGIENE.** Sob live preview esta função roda a cada mudança de
 * campo no painel; uma entrada de cache com etiqueta congelaria o iframe na
 * primeira leitura e o operador veria o quadro parado enquanto arrasta blocos —
 * que é exatamente o contrário do motivo de o iframe existir.
 */

async function painel() {
  return getPayload({ config });
}

/** A composição publicada de um endereço. `undefined` quando não há nenhuma. */
export async function buscarPaginaLivre(
  slug: RotaLivre,
): Promise<PaginaLivre | undefined> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "paginas",
        /* ⚠️ Profundidade 0 de propósito: nenhum bloco tem upload nem
           relacionamento. O que a ficha mostra vem do cadastro da empresa, por
           `lib/empresa-consulta.ts`, e não de uma junção daqui. */
        depth: 0,
        limit: 1,
        // Ver a nota "rascunho nunca vaza" no topo do arquivo.
        where: { slug: { equals: slug }, _status: { equals: "published" } },
      });

      const doc = docs[0];
      return doc === undefined ? undefined : paginaDoPainel(doc);
    },
    ["pagina-livre", slug],
    [tagDaPaginaLivre(slug)],
  );
}

/**
 * O DOCUMENTO em rascunho, ainda não traduzido — a única leitura deste arquivo
 * que vê conteúdo não publicado, e por isso a única que recebe `draft: true`.
 *
 * ⚠️ **DEVOLVE O DOCUMENTO CRU DE PROPÓSITO, e é o live preview que exige
 * isso.** O hook do painel entrega, a cada mudança de campo, o documento do
 * FORMULÁRIO na mesma forma — e ele precisa de um estado inicial da mesma forma
 * para poder fundir os dois. Traduzir aqui obrigaria o preview a desfazer a
 * tradução para depois refazê-la, e é assim que um preview passa a mostrar uma
 * página que o site não publica. Quem traduz é `paginaDoPainel`, chamada nos
 * dois mundos.
 *
 * ⚠️ Não confere token nenhum: quem a chama já decidiu, por fora dela, que o
 * pedido tem permissão de ver rascunho. O token é conferido uma vez, em
 * `app/(frontend)/preview/route.ts`, e o que chega aqui é o modo de rascunho do
 * Next já ligado. Ver `lib/preview.ts`.
 */
export async function documentoDePaginaEmRascunho(
  slug: RotaLivre,
): Promise<DocumentoDePagina | undefined> {
  const payload = await painel();

  const { docs } = await payload.find({
    collection: "paginas",
    depth: 0,
    limit: 1,
    draft: true,
    where: { slug: { equals: slug } },
  });

  return docs[0];
}

/** A mesma leitura, já traduzida — o caminho que não passa pelo iframe. */
export async function paginaLivreEmRascunho(
  slug: RotaLivre,
): Promise<PaginaLivre | undefined> {
  const doc = await documentoDePaginaEmRascunho(slug);
  return doc === undefined ? undefined : paginaDoPainel(doc);
}
