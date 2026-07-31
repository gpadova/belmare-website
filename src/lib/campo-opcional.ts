/**
 * "Ausente é ausente, nunca vazio" — a regra que toda camada de tradução deste
 * projeto segue. Nasceu em `lib/representadas-traducao.ts`, junto com o mapper
 * de Representada; vive aqui porque PRA-120 precisa dela de novo, ao pé da
 * letra, para Peça, Arquivo3D e Acabamento — e uma regra repetida três vezes
 * por três mappers diferentes é exatamente o tipo de divergência silenciosa
 * que este arquivo existe para não deixar acontecer.
 *
 * ⚠️ Array vazio, string em branco e `null` do banco viram `undefined` aqui,
 * porque é `undefined` que faz uma seção sumir da página em vez de abrir um
 * título sobre uma lista sem nenhuma célula — o modo de falha que a seção
 * anulável existe para não ter.
 *
 * Sem dependência de `payload-types`: estas quatro funções são política de
 * tradução pura, não leitura do painel. Isso é deliberado — mantém o número de
 * arquivos que importam o tipo gerado restrito aos mappers que de fato
 * precisam da forma que o Payload grava.
 */

/**
 * Uma chave que só existe quando tem valor.
 *
 * ⚠️ Escrever `base: undefined` não é o mesmo que não escrever `base`: a chave
 * presente com valor indefinido sobrevive a `JSON.stringify` como ausente mas
 * aparece em `Object.keys`, e é assim que uma comparação entre o dado do
 * painel e o dado escrito à mão passa a falhar por uma diferença que não
 * existe.
 */
export function opcional<C extends string, V>(
  chave: C,
  valor: V | undefined,
): { [K in C]?: V } {
  return (valor === undefined ? {} : { [chave]: valor }) as { [K in C]?: V };
}

/** String em branco é campo não preenchido, não conteúdo. */
export function texto(valor: string | null | undefined): string | undefined {
  const limpo = valor?.trim();
  return limpo === undefined || limpo === "" ? undefined : limpo;
}

/** Lista vazia é lista ausente — ver a nota sobre seção anulável acima. */
export function lista<T>(itens: T[]): T[] | undefined {
  return itens.length === 0 ? undefined : itens;
}

export function presente<T>(valor: T | undefined): valor is T {
  return valor !== undefined;
}
