/**
 * As duas junções de frase que o site faz com dado contado — a lista "A, B, C e
 * D" e o número por extenso.
 *
 * ⚠️ **ESTE ARQUIVO EXISTE PORQUE CONTAGEM EM PROSA É GERADO, NÃO CAMPO.** A
 * home escreve "As quatro fábricas que a Belmare representa", `/quem-somos`
 * escreve "Quatro fábricas, quatro papéis" e a prancha escreve "para as quatro
 * representadas". As três eram a palavra `quatro` digitada dentro de uma frase,
 * em três arquivos diferentes — e no dia em que a quinta marca entrar pelo
 * painel, as três continuam dizendo quatro sem ninguém ficar sabendo. É a mesma
 * falha do tempo de casa que `anosDeMercado` existe para matar, só que sem
 * calendário para denunciá-la: a página passa a mentir e só um leitor atento
 * repara.
 *
 * ⚠️ **NADA AQUI FALA COM O PAYLOAD NEM COM O NEXT.** Número e lista entram,
 * string sai — a mesma tática de `lib/revalidacao.ts` e `lib/preview.ts`, e
 * pelo mesmo motivo: é o que deixa a regra ser afirmada por teste comum.
 */

/**
 * "A, B, C e D" — a conjunção antes do último item, como se escreve.
 *
 * ⚠️ Morava dentro de `components/abertura.tsx` e existia numa segunda escrita
 * (`join(", ").replace(/, ([^,]*)$/, " e $1")`) em mais três lugares. Uma
 * junção escrita quatro vezes é uma junção que diverge na primeira vez que
 * alguém mexer numa das cópias: a lista de representadas da home e a lista de
 * estados do rodapé têm que ser pontuadas do mesmo jeito, ou a mesma empresa
 * escreve de duas maneiras na mesma tela.
 */
export function emLista(itens: readonly string[]): string {
  if (itens.length === 0) return "";
  if (itens.length === 1) return itens[0] ?? "";
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/** As formas femininas e masculinas de um a dez. Acima disso a prosa deixa de
 *  ser prosa e o algarismo é mais honesto do que "dezessete". */
const POR_EXTENSO: Record<"f" | "m", readonly string[]> = {
  f: ["zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"],
  m: ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"],
};

/**
 * O número escrito por extenso, para caber dentro de uma frase.
 *
 * ⚠️ O gênero é parâmetro porque só um e dois variam — "quatro fábricas" e
 * "quatro papéis" são a mesma palavra, "uma fábrica" e "um papel" não. Um
 * padrão único aqui daria "duas estados" no dia em que o território encolhesse,
 * que é justamente o dia em que ninguém estaria olhando para esta linha.
 *
 * ⚠️ Acima de dez devolve o algarismo. Já existe decisão escrita no projeto
 * contra algarismo em texto corrido (`app/representadas/page.tsx`: "algarismo
 * em texto corrido lê como erro de revisão") — e é por isso que ele é o
 * FALLBACK e não o padrão: com dezessete representadas a frase precisa ser
 * reescrita por gente, e um "17" visível é o aviso de que chegou a hora.
 */
export function porExtenso(quantidade: number, genero: "f" | "m" = "f"): string {
  const palavra = POR_EXTENSO[genero][quantidade];
  return palavra ?? String(quantidade);
}

/**
 * A inicial em maiúscula, para quando o número gerado ABRE a frase — "Cinco
 * atividades registradas.", "Quatro fábricas, quatro papéis."
 *
 * ⚠️ Existe como função e não como `capitalize` do CSS porque `capitalize`
 * levanta a inicial de TODA palavra, e a alternativa (`first-letter`) muda o
 * significado da regra de estilo para quem for ler o componente depois. Isto é
 * gramática, não tipografia — e gramática de string mora perto da string.
 */
export function comInicialMaiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
