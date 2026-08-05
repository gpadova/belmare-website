/**
 * Os marcadores que a prosa do painel usa para não congelar num número.
 *
 * ⚠️ **ESTE ARQUIVO É O QUE TORNOU `/quem-somos` INTEIRAMENTE EDITÁVEL.** Antes
 * dele, três frases da página eram metade fixa e metade campo — o site montava
 * a primeira oração contando o dado ("São quatro fábricas brasileiras.") e o
 * operador escrevia da segunda em diante. A regra era defensável e era
 * incômoda: quem editava via meia frase no painel e a outra metade só aparecia
 * no ar, e não havia como mexer na parte contada sem abrir um editor de código.
 *
 * O conflito real nunca foi entre editar e não editar. Era entre editar e
 * **congelar**: um "quatro" digitado dentro de um textarea continua dizendo
 * quatro no dia em que a quinta fábrica entra pelo painel, três centímetros
 * acima de uma lista com cinco linhas. O marcador resolve os dois lados — a
 * frase inteira é do operador, e o número continua sendo contado a cada
 * renderização.
 *
 * ⚠️ **NADA AQUI FALA COM O PAYLOAD NEM COM O NEXT.** Texto e valores entram,
 * texto sai — a mesma tática de `lib/frase.ts`, e pelo mesmo motivo: é o que
 * deixa a regra ser afirmada por teste comum, sem banco e sem servidor.
 */

/**
 * O vocabulário, e ele é fechado.
 *
 * A chave é o que se digita entre chaves no painel; o texto é o que a ajuda do
 * campo mostra ao operador. Acrescentar um marcador é acrescentar uma linha
 * aqui e outra em quem monta os valores (`lib/quem-somos-consulta.ts`) — nunca
 * só uma das duas, ou o painel passa a oferecer um marcador que o site não sabe
 * preencher.
 */
export const MARCADORES = {
  anos: "o tempo de casa, contado da data de abertura — 27",
  fabricas: "quantas fábricas estão publicadas, por extenso — quatro",
  cidade: "a cidade da sede, como está no cadastro — Florianópolis",
  estados: "o território por extenso — Paraná, Santa Catarina e Rio Grande do Sul",
  quantosEstados: "quantos estados o território tem, por extenso — três",
} as const;

export type Marcador = keyof typeof MARCADORES;

/** Os valores de hoje, um por marcador. `undefined` é dado que falta. */
export type Valores = Readonly<Record<Marcador, string | undefined>>;

/** A ajuda que entra no fim de todo campo que aceita marcador. */
export const AJUDA_DOS_MARCADORES = `Marcadores disponíveis, e o site troca cada um pelo dado de hoje: ${Object.entries(
  MARCADORES,
)
  .map(([chave, oQueE]) => `{${chave}} = ${oQueE}`)
  .join(" · ")}. Não digite o número à mão: escrito à mão ele para de mudar.`;

/* `{fabricas}`, e não `{{fabricas}}` nem `%fabricas%`: uma chave só é o que o
   operador escreve sem pensar, e não colide com nada que a prosa desta página
   use — não há chave em texto institucional em português. Sem espaço dentro do
   marcador, de propósito: "{ anos }" é erro de digitação, e cai na regra de
   marcador desconhecido abaixo, que o deixa visível em vez de adivinhar. */
const MARCADOR = /\{(\w+)\}/g;

/**
 * A prosa do painel com os marcadores trocados pelo dado.
 *
 * Três resultados, e os três são deliberados:
 *
 *   · **Texto ausente devolve ausente.** Campo em branco faz o parágrafo sumir,
 *     que é a regra de seção anulável do `CONTEXT.md`, e ela não muda de forma
 *     por causa dos marcadores.
 *
 *   · **Marcador sem valor derruba o parágrafo inteiro.** Se a cidade da sede
 *     não está cadastrada, "A sede fica em {cidade}." não vira "A sede fica em
 *     ." nem "A sede fica em ". Uma frase truncada no ar é pior do que uma
 *     frase a menos, e o parágrafo volta sozinho no minuto em que o cadastro
 *     for preenchido.
 *
 *   · **Marcador desconhecido fica literal.** `{anso}` aparece na página
 *     escrito assim mesmo. É feio de propósito: some-lo em silêncio deixaria o
 *     operador com um buraco no meio da frase e nenhuma pista do que houve, e
 *     preenchê-lo por adivinhação é o começo de um marcador que ninguém
 *     documentou.
 */
export function preencher(
  texto: string | undefined,
  valores: Valores,
): string | undefined {
  if (texto === undefined) return undefined;

  let faltouDado = false;

  const preenchido = texto.replace(MARCADOR, (literal, chave: string) => {
    if (!(chave in valores)) return literal;

    const valor = valores[chave as Marcador];
    if (valor === undefined) {
      faltouDado = true;
      return literal;
    }

    return valor;
  });

  return faltouDado ? undefined : preenchido;
}
