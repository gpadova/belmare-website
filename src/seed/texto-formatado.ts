/**
 * Os construtores da árvore serializada do lexical — parágrafo, título, lista e
 * raiz.
 *
 * ⚠️ **MÓDULO SEM EFEITO COLATERAL, PELA MESMA RAZÃO DE `quem-somos-texto.ts`.**
 * Estas quatro funções nasceram dentro de `semear-paginas.ts`, que roda
 * `await semear()` no topo: qualquer outro script que as importasse de lá
 * semearia o banco só de abrir o arquivo. Um construtor compartilhado mora onde
 * importá-lo não faz nada acontecer.
 *
 * ⚠️ **ELES MONTAM SÓ O QUE O EDITOR DAS PÁGINAS LIVRES OFERECE** — parágrafo,
 * dois níveis de título, negrito e as listas (`collections/blocos.ts`,
 * `EDITOR_DE_PAGINA`). Escrever a árvore à mão seriam trezentas linhas de JSON
 * em que um `version` errado quebra o campo sem sintoma.
 */

/** Negrito no lexical é uma máscara de bits no nó de texto; 1 é o primeiro. */
const NEGRITO = 1;

export type No = Record<string, unknown>;

export function textoSimples(valor: string, formato = 0): No {
  return {
    type: "text",
    detail: 0,
    format: formato,
    mode: "normal",
    style: "",
    text: valor,
    version: 1,
  };
}

/** Um parágrafo. `negrito: true` marca a frase inteira. */
export function paragrafo(valor: string, negrito = false): No {
  return {
    type: "paragraph",
    children: [textoSimples(valor, negrito ? NEGRITO : 0)],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: negrito ? NEGRITO : 0,
    textStyle: "",
    version: 1,
  };
}

export function titulo(valor: string, nivel: "h2" | "h3" = "h2"): No {
  return {
    type: "heading",
    tag: nivel,
    children: [textoSimples(valor)],
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  };
}

export function listaDePontos(itens: string[]): No {
  return {
    type: "list",
    listType: "bullet",
    tag: "ul",
    start: 1,
    children: itens.map((item, i) => ({
      type: "listitem",
      value: i + 1,
      children: [textoSimples(item)],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    })),
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  };
}

export function documento(nos: No[]) {
  return {
    root: {
      type: "root",
      children: nos,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
    },
  };
}
