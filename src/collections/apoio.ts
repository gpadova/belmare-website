/**
 * Ajudantes compartilhados pelas três coleções filhas de PRA-120 — Peça,
 * Arquivo3D e Acabamento. As três pendem de uma representada só (a árvore da
 * decisão 10) e por isso precisam da MESMA leitura defensiva de relacionamento
 * e da MESMA resolução de "qual marca é esta" para disparar a etiqueta certa.
 *
 * ⚠️ **`collections/representadas.ts` NÃO importa daqui.** Ele já tem a própria
 * cópia de `identidadeDoUpload`, testada e em produção desde PRA-116/117/118;
 * reescrevê-lo para importar deste arquivo trocaria risco de regressão numa
 * coleção fechada por um ganho puramente estético. Este arquivo existe para as
 * coleções NOVAS não triplicarem a mesma lógica entre si — não para unificar
 * tudo que já existia antes de PRA-120.
 */

import { revalidateTag } from "next/cache";

import { foraDeRequisicao } from "@/lib/fora-de-requisicao";
import type { Payload } from "payload";

/** O que sobra de um campo de relacionamento quando o painel manda o
 *  documento inteiro em vez do identificador. As duas formas chegam, e
 *  comparar sem normalizar deixaria uma checagem de presença passar batido. */
export function identidadeDoRelacionamento(
  valor: unknown,
): string | number | undefined {
  if (typeof valor === "string" || typeof valor === "number") return valor;
  if (valor && typeof valor === "object" && "id" in valor) {
    const id = (valor as { id?: unknown }).id;
    if (typeof id === "string" || typeof id === "number") return id;
  }
  return undefined;
}

/**
 * O `slug` da representada dona de um documento filho, a partir do valor cru
 * que um hook recebe em `doc.representada` — quase sempre só o identificador,
 * nunca o documento populado (hooks de coleção leem em profundidade 0).
 *
 * ⚠️ Devolve `undefined` em vez de lançar quando a representada não existe
 * mais (apagada por baixo) ou o campo veio vazio: um hook de revalidação que
 * derruba a escrita do documento por não achar a etiqueta certa é pior do que
 * uma edição que não propaga — o documento já foi gravado quando este código
 * roda.
 */
export async function slugDaRepresentadaPai(
  payload: Payload,
  valor: unknown,
): Promise<string | undefined> {
  const id = identidadeDoRelacionamento(valor);
  if (id === undefined) return undefined;

  const representada = await payload
    .findByID({ collection: "representadas", id, depth: 0 } as never)
    .then((doc) => doc as { slug?: string | null } | null)
    .catch(() => null);

  return typeof representada?.slug === "string" && representada.slug !== ""
    ? representada.slug
    : undefined;
}

/**
 * `revalidateTag`, tolerante a correr fora de uma requisição do Next.
 *
 * ⚠️ **RELOCADA A PARTIR DE `collections/representadas.ts` NESTE TICKET**, sem
 * mudar de comportamento — Peça, Arquivo3D e Acabamento disparam a mesma
 * revalidação depois de publicar, e uma terceira/quarta cópia deste laço de
 * `try/catch` era exatamente a duplicação que o resto deste arquivo existe
 * para evitar. `collections/representadas.ts` foi atualizado para importar
 * daqui; o comportamento é idêntico ao original.
 *
 * Este hook dispara toda vez que uma coleção é escrita pela API local — e isso
 * inclui teste de integração e um eventual script de seed, nenhum dos dois
 * rodando dentro de uma requisição de verdade. Nesse mundo o Next nem chega a
 * montar o armazenamento de geração estática, e `revalidateTag` lança antes de
 * fazer qualquer coisa. Não existe rota renderizada para invalidar ali mesmo —
 * a resposta certa é não fazer nada, e nunca deixar a escrita do documento
 * falhar por causa de uma invalidação sem onde acontecer.
 */
export function revalidarTags(tags: string[]): void {
  for (const tag of tags) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch (erro) {
      // Fora de uma requisição do Next — ver a nota acima. Silêncio esperado.
      if (foraDeRequisicao(erro)) continue;

      /* ⚠️ Qualquer outra falha é a edição NÃO propagando. Não derruba o
         salvamento — o documento já foi gravado e falhar depois disso só
         confunde quem está no painel —, mas não pode sumir: sem esta linha a
         falha só aparece como o operador jurando que editou e a página velha
         no ar. */
      console.error(
        `[revalidação] a etiqueta "${tag}" não foi invalidada; a edição pode não aparecer no site`,
        erro,
      );
    }
  }
}
