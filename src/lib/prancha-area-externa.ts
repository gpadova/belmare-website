import { PRANCHA_AREA_EXTERNA } from "@/lib/acervo";
import { presente } from "@/lib/campo-opcional";

/**
 * As chamadas da PRANCHA 02 — a área externa desmontada.
 *
 * ⚠️ **COORDENADA PERTENCE AO DESENHO, NÃO À MARCA.** É o mesmo princípio de
 * `territorio.ts`: a geometria vive longe do cadastro. Nenhum campo de
 * `representadas.ts` sabe onde a peça da fábrica caiu no quadro, e trocar a
 * fotografia não obriga a mexer em fábrica nenhuma.
 *
 * ⚠️ **A CHAMADA APONTA PARA UMA FUNÇÃO, NÃO PARA UM PRODUTO.** O rótulo sai de
 * `Representada.parte` — MÓVEL, ESTRUTURA, ESTOFADO, SOMBRA — e é a legenda,
 * fora do desenho, que atribui a função à fábrica. A distinção não é sutileza:
 * a cena é gerada, e uma seta que dissesse "Trisol" estaria afirmando que
 * aquele ombrelone é um produto da Trisol. Nomear a função é verdade; nomear a
 * peça seria inventar acervo com cara de ficha técnica. Por isso o painel não
 * tem campo de texto para o rótulo da chamada: ele escolhe a REPRESENTADA, e a
 * palavra vem do `parte` dela — uma verdade, um lugar.
 *
 * Consequência boa da mesma regra: como a chave é a função e não a marca, o
 * desenho aceita N representadas (P18). Uma quinta que resolva algo novo pede
 * um objeto novo na cena — não uma quinta coluna num grid de quatro. E duas
 * marcas que dividem uma função dividem o objeto: são duas chamadas apontando
 * para o mesmo alvo com etiquetas em lugares diferentes, que é como uma prancha
 * impressa faria. Não existe "chamada com duas marcas" porque não existe
 * segunda cópia da palavra: a palavra é o `parte` de cada uma.
 *
 * `rotulo` e `alvo` estão em porcentagem da caixa da imagem. A etiqueta pousa
 * em área vazia (parede, deck livre); o alvo pousa no objeto. A linha de
 * chamada liga os dois e é o único traço do desenho.
 *
 * ⚠️ **PRA-123 TIROU ESTAS COORDENADAS DAS MÃOS DE QUEM MEDE.** Elas continuam
 * aqui como RESERVA — o que a página desenha quando o painel ainda não tem
 * prancha publicada (banco recém-criado, antes do seed) —, mas a fonte de
 * verdade passou a ser o global `Prancha`, onde o operador sobe a fotografia e
 * ARRASTA os pinos. O motivo é o modo de falha: a fotografia real chega um dia
 * só, junto com todo o resto do acervo, e nesse dia estas quatro linhas passam
 * a apontar para deck vazio sem nada quebrar visivelmente. Ninguém consegue
 * pedir a um operador que descubra que o sofá está a 19% por 70%.
 */

/** Um ponto na caixa da imagem, nos dois eixos, em porcentagem — nunca pixel.
 *  Pixel quebra no instante em que a imagem é exibida em outro tamanho, e ela é
 *  exibida em pelo menos três (telefone, desktop, painel). */
export type Ponto = { x: number; y: number };

export type Chamada = {
  /** A representada que responde por esta parte. */
  slug: string;
  /** Onde a etiqueta em mono pousa. */
  rotulo: Ponto;
  /** Onde a linha de chamada encosta no objeto. */
  alvo: Ponto;
};

/**
 * A fotografia da prancha, com as dimensões do arquivo.
 *
 * ⚠️ **`largura` E `altura` NÃO SÃO METADADO DECORATIVO — SÃO O QUE MANTÉM A
 * PORCENTAGEM VALENDO.** A chamada está em porcentagem DA CAIXA; se a caixa
 * tiver outro aspecto que o arquivo, `object-cover` recorta a imagem por dentro
 * dela e a seta passa a apontar para o lado. Enquanto a fotografia era uma
 * constante em código dava para cravar `aspect-16/9` no componente e conferir à
 * mão; com o operador subindo o arquivo dele, o aspecto tem que vir do arquivo.
 * Por isso uma foto sem dimensão gravada não vira prancha (ver o mapper): é
 * preferível desenhar a reserva, coerente consigo mesma, a desenhar a foto nova
 * com as chamadas fora de lugar.
 *
 * Não há ponto focal aqui, e a ausência é deliberada: a prancha nunca recorta.
 */
export type FotoDaPrancha = {
  src: string;
  alt: string;
  largura: number;
  altura: number;
};

export type PranchaAreaExterna = {
  foto: FotoDaPrancha;
  chamadas: Chamada[];
};

const MINIMO = 0;
const MAXIMO = 100;

/**
 * A porcentagem que a prancha grava: dentro da caixa, com uma casa decimal.
 *
 * ⚠️ O corte na faixa não é paranoia — é o que impede um pino arrastado para
 * fora da moldura de gravar `-3` e sumir do desenho na página. Uma casa é a
 * precisão que o desenho de fato usa: em 2752 px de largura, 0,1% é menos de
 * 3 px, e a segunda casa só existiria para fazer o número parecer preciso.
 *
 * Valor não finito devolve 0 em vez de propagar `NaN` — acontece quando a caixa
 * ainda não tem largura medida (imagem carregando) e a divisão vira infinito.
 * Quem não pode aceitar esse 0 é o mapper, que trata coordenada ausente como
 * chamada ausente, e não como chamada no canto superior esquerdo.
 */
export function porcentagemDaPrancha(valor: number): number {
  if (!Number.isFinite(valor)) return MINIMO;
  return Math.min(MAXIMO, Math.max(MINIMO, Math.round(valor * 10) / 10));
}

/**
 * Onde o ponteiro caiu, em porcentagem da caixa da imagem.
 *
 * ⚠️ Recebe a caixa medida, e não um elemento: é isso que deixa a conversão ser
 * testada sem DOM nenhum. O componente do painel mede com `getBoundingClientRect`
 * e passa os quatro números; a regra de "onde isso cai em porcentagem" mora
 * aqui, onde um teste consegue afirmá-la.
 */
export function pontoNaCaixa(
  ponteiro: { x: number; y: number },
  caixa: { esquerda: number; topo: number; largura: number; altura: number },
): Ponto {
  return {
    x: porcentagemDaPrancha(
      ((ponteiro.x - caixa.esquerda) / caixa.largura) * 100,
    ),
    y: porcentagemDaPrancha(((ponteiro.y - caixa.topo) / caixa.altura) * 100),
  };
}

/** O passo de uma seta do teclado, em porcentagem da caixa. */
export const PASSO = 1;

/** O passo com Shift — a convenção de toda ferramenta de desenho: o mesmo
 *  movimento, dez vezes maior, para atravessar a foto sem sessenta toques. */
export const PASSO_LARGO = 10;

const DIRECOES: Record<string, { eixo: "x" | "y"; sinal: 1 | -1 }> = {
  ArrowLeft: { eixo: "x", sinal: -1 },
  ArrowRight: { eixo: "x", sinal: 1 },
  ArrowUp: { eixo: "y", sinal: -1 },
  ArrowDown: { eixo: "y", sinal: 1 },
};

/**
 * O ponto depois de uma seta do teclado — `undefined` quando a tecla não é uma
 * seta.
 *
 * ⚠️ **O CAMINHO DE TECLADO NÃO É CORTESIA, É O CAMPO FUNCIONAR.** Um campo que
 * só responde a arrastar é um campo que tranca do lado de fora quem não usa
 * mouse — e este é o único campo do painel inteiro sem um equivalente digitável
 * óbvio. Devolver `undefined` em vez de repetir o ponto é o que permite ao
 * componente só engolir a tecla (`preventDefault`) quando ela de fato moveu
 * algo: Tab continua saindo do pino, e a página continua rolando com as teclas
 * que este campo não usa.
 */
export function deslocarPonto(
  ponto: Ponto,
  { tecla, largo = false }: { tecla: string; largo?: boolean },
): Ponto | undefined {
  const direcao = DIRECOES[tecla];
  if (direcao === undefined) return undefined;

  const passo = (largo ? PASSO_LARGO : PASSO) * direcao.sinal;

  return direcao.eixo === "x"
    ? { x: porcentagemDaPrancha(ponto.x + passo), y: ponto.y }
    : { x: ponto.x, y: porcentagemDaPrancha(ponto.y + passo) };
}

/**
 * Onde nasce uma chamada nova.
 *
 * ⚠️ **NÃO É (0, 0), E A DIFERENÇA É A PRIMEIRA IMPRESSÃO DO OPERADOR.** Um
 * pino no canto superior esquerdo nasce metade fora da moldura, encavalado no
 * registro de canto, e lê como campo quebrado antes de o operador tocar em
 * nada. Estes quatro números põem a etiqueta em cima e o alvo abaixo e à
 * direita dela — a mesma relação que as quatro chamadas medidas à mão têm —,
 * com a linha de chamada já visível, que é o que ensina o que arrastar.
 *
 * São os `defaultValue` dos quatro campos numéricos em `globals/prancha.ts`.
 * Vivem aqui porque são desenho, não configuração de formulário.
 */
export const CHAMADA_EM_BRANCO: { rotulo: Ponto; alvo: Ponto } = {
  rotulo: { x: 12, y: 20 },
  alvo: { x: 20, y: 46 },
};

/**
 * O traço da chamada, em coordenadas da caixa.
 *
 * ⚠️ Mora aqui, e não nos dois componentes, porque são DOIS desenhos da mesma
 * linha: o do site e o da pré-visualização do painel. Se divergirem, o operador
 * arrasta olhando para um desenho e publica outro — que é precisamente a falha
 * que este campo existe para acabar.
 */
export function linhaDaChamada(chamada: {
  rotulo: Ponto;
  alvo: Ponto;
}): string {
  return `M${chamada.rotulo.x} ${chamada.rotulo.y} L${chamada.alvo.x} ${chamada.alvo.y}`;
}

/** `01`, `02`, … — a numeração da prancha, sempre derivada da posição na lista
 *  e nunca digitada. Três chamadas numeram 01–03; cinco numeram 01–05. */
export function numeroDaChamada(indice: number): string {
  return String(indice + 1).padStart(2, "0");
}

/** Uma chamada e a marca que ela nomeia, já conferida como publicada. */
export type ChamadaComMarca<Marca> = { chamada: Chamada; representada: Marca };

/**
 * As chamadas que a página DE FATO desenha — as do painel cruzadas com as
 * representadas publicadas, na ordem do painel.
 *
 * ⚠️ **UMA LISTA SÓ ALIMENTA O DESENHO E A LEGENDA, E É POR ISSO QUE ELA MORA
 * AQUI.** Enquanto o cruzamento vivia dentro do componente, a promessa "três
 * chamadas numeram 01–03" era uma frase num comentário: nada afirmava que a
 * chave sobre a foto e a linha da legenda saem da MESMA lista filtrada. Uma
 * chamada cuja marca foi despublicada tem que sumir das duas — sumir só da
 * legenda deixa um número sobre a fotografia apontando para uma linha que não
 * existe, e a numeração precisa FECHAR o buraco em vez de pular 02.
 *
 * ⚠️ Genérica na marca de propósito: o que este arquivo sabe de uma
 * representada é que ela tem `slug`. Importar o tipo inteiro só para cruzar
 * duas listas ataria a geometria da prancha ao cadastro, que é exatamente o que
 * a nota do topo deste arquivo recusa.
 */
export function chamadasDesenhadas<Marca extends { slug: string }>(
  chamadas: readonly Chamada[],
  representadas: readonly Marca[],
): ChamadaComMarca<Marca>[] {
  return chamadas
    .map((chamada) => {
      const representada = representadas.find((r) => r.slug === chamada.slug);
      return representada === undefined ? undefined : { chamada, representada };
    })
    .filter(presente);
}

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

/**
 * A prancha de reserva — a que a página desenha enquanto o painel não tem uma
 * publicada.
 *
 * ⚠️ **MESMO `??` DE `representadasDaPagina`, E PELO MESMO MOTIVO.** Um banco
 * vazio — máquina recém-clonada, build antes do seed — não pode devolver
 * `/representadas` sem a prancha, que é a página inteira. Painel primeiro; isto
 * só quando o painel não tem nada publicável.
 */
export const PRANCHA_EM_CODIGO: PranchaAreaExterna = {
  foto: {
    src: PRANCHA_AREA_EXTERNA.src,
    alt: PRANCHA_AREA_EXTERNA.alt,
    largura: 2752,
    altura: 1536,
  },
  chamadas: CHAMADAS,
};
