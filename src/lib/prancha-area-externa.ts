/**
 * As chamadas da PRANCHA 02 — a área externa desmontada.
 *
 * ⚠️ **Coordenada pertence ao DESENHO, não à marca.** É o mesmo princípio de
 * `territorio.ts`: a geometria vive longe do cadastro. Trocar a fotografia de
 * `PRANCHA_AREA_EXTERNA` por uma foto real obriga a recalcular só este arquivo;
 * nenhum campo de `representadas.ts` se mexe, e nenhuma fábrica precisa saber
 * onde a peça dela caiu no quadro.
 *
 * ⚠️ **A chamada aponta para uma FUNÇÃO, não para um produto.** `rotulo` sai de
 * `Representada.parte` — MÓVEL, ESTRUTURA, ESTOFADO, SOMBRA — e é a legenda,
 * fora do desenho, que atribui a função à fábrica. A distinção não é sutileza:
 * a cena é gerada, e uma seta que dissesse "Trisol" estaria afirmando que
 * aquele ombrelone é um produto da Trisol. Nomear a função é verdade; nomear a
 * peça seria inventar acervo com cara de ficha técnica.
 *
 * Consequência boa da mesma regra: como a chave é a função e não a marca, o
 * desenho aceita N representadas (P18). Duas marcas podem dividir uma chamada,
 * e uma quinta que resolva algo novo pede um objeto novo na cena — não uma
 * quinta coluna num grid de quatro.
 *
 * `rotulo` e `alvo` estão em porcentagem da caixa da imagem. A etiqueta pousa
 * em área vazia (parede, deck livre); o alvo pousa no objeto. A linha de
 * chamada liga os dois e é o único traço do desenho.
 */

export type Chamada = {
  /** A representada que responde por esta parte. */
  slug: string;
  /** Onde a etiqueta em mono pousa. */
  rotulo: { x: number; y: number };
  /** Onde a linha de chamada encosta no objeto. */
  alvo: { x: number; y: number };
};

/**
 * Medidas tiradas sobre `public/acervo/prancha-area-externa.jpg` (2752 × 1536).
 * A ordem é a de `REPRESENTADAS` — a mesma da galeria da home e do ledger de
 * `/quem-somos`. O leitor já viu esta sequência três vezes; mudá-la aqui só
 * porque o desenho lê da esquerda para a direita custaria mais do que ganha.
 */
export const CHAMADAS: Chamada[] = [
  /* Marê — o sofá de corda, à esquerda, com a parede vazia acima. */
  { slug: "mare-mobilia", rotulo: { x: 11, y: 41 }, alvo: { x: 19, y: 70 } },
  /* GDA — a mesa e as cadeiras de alumínio, ao centro. */
  { slug: "gda-moveis", rotulo: { x: 31, y: 39 }, alvo: { x: 38, y: 63 } },
  /* Bux — a chaise estofada, à direita; a etiqueta fica na parede à esquerda
     dela, fora da sombra do ombrelone. */
  { slug: "bux-garden", rotulo: { x: 51, y: 49 }, alvo: { x: 70, y: 66 } },
  /* Trisol — a lona, no alto à direita, com céu de parede livre acima. */
  { slug: "trisol", rotulo: { x: 60, y: 17 }, alvo: { x: 74, y: 31 } },
];
