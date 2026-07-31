import type { GlobalConfig } from "payload";

import { revalidarTags } from "@/collections/apoio";
import { tagsDaMudanca, type MudancaNoPainel } from "@/lib/revalidacao";

/**
 * O que os três globais de PRA-122 — `Empresa`, `Home`, `QuemSomos` — têm em
 * comum: rascunho com autosave desligado, e um hook de publicação que é
 * chamador fino de `tagsDaMudanca`.
 *
 * ⚠️ **NENHUM DOS TRÊS ESCREVE UMA LISTA DE ROTAS.** É `lib/revalidacao.ts` que
 * sabe que a identidade da empresa cai em toda rota (rodapé no layout) e que a
 * prosa da home cai só na home. Escrever a etiqueta aqui dentro seria a lista
 * lembrada de cabeça que aquele arquivo existe para não deixar mais ninguém
 * escrever — e num global o erro é mais caro, porque a única superfície de
 * teste que sobra é abrir o site e reparar.
 */

/**
 * As versões de um global — os mesmos dois botões nomeados da decisão 8, e pelo
 * mesmo motivo.
 *
 * ⚠️ `autosave: false` é explícito e não é padrão por acaso: rascunho com
 * autosave dá ao operador duas transições de estado invisíveis para raciocinar
 * sobre. Num global isso é ainda pior do que numa coleção — o documento é único
 * e está no site inteiro, então "será que já publicou?" vale para todas as
 * páginas ao mesmo tempo. Ver a nota completa em `collections/representadas.ts`.
 */
export const VERSOES_DO_GLOBAL = {
  drafts: { autosave: false },
  max: 20,
} as const;

/**
 * O hook de publicação de um global.
 *
 * ⚠️ **RASCUNHO NÃO DISPARA ETIQUETA.** Salvar rascunho passa por `afterChange`
 * exatamente como publicar — é a mesma escrita, com `draft: true` — e revalidar
 * nos dois casos etiquetaria uma página que o público nem vê: o ponto inteiro
 * de ter rascunho deixaria de existir. Achado de PRA-118, aplicado igual aqui.
 *
 * ⚠️ Global não tem `afterDelete` — não há como apagar um global. É a única
 * diferença de forma em relação às coleções, e por isso a paridade
 * "apagar invalida o mesmo que mudar" não tem o que provar deste lado.
 */
export function aoPublicarGlobal(
  mudanca: MudancaNoPainel,
): NonNullable<GlobalConfig["hooks"]>["afterChange"] {
  return [
    ({ doc }) => {
      if (doc._status !== "published") return;
      revalidarTags(tagsDaMudanca(mudanca));
    },
  ];
}

/** Texto obrigatório, com a explicação de por que ele não pode faltar — a mesma
 *  forma de `collections/representadas.ts`. */
export function exigeTexto(recusa: string) {
  return (valor: string | null | undefined) =>
    valor && valor.trim() !== "" ? true : recusa;
}
