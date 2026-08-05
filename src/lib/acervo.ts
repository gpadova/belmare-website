/**
 * O acervo de imagens do site — um lugar só.
 *
 * ⚠️ TUDO AQUI É MOCK gerado por fal.ai, por decisão do cliente (30/07/2026),
 * enquanto a fotografia real não chega. Três regras que não se negociam:
 *
 *   1. Mock nunca é apresentado como foto real de produto, fábrica ou projeto
 *      entregue — nem em copy, nem em `alt`, nem em legenda. Por isso todo alt
 *      daqui termina em "imagem de referência".
 *   2. As referências ficam centralizadas e trocáveis NESTE arquivo. Substituir
 *      o acervo não pode virar caça a URLs espalhadas pelos componentes.
 *   3. Nenhum mock vai para produção sem substituição ou marcação explícita.
 *
 * Os arquivos vivem em `public/acervo/`. `public/acervo/reserva/` guarda as
 * gerações que sobraram da direção de matéria, cancelada em 30/07/2026 — não
 * são referenciadas por nada e existem só para não jogar geração fora.
 */

export type Imagem = {
  src: string;
  alt: string;
  /** `object-position` quando o assunto não está no centro do quadro. Só as
   *  imagens que sangram precisam disso; card recortado no centro não precisa. */
  posicao?: string;
};

/**
 * A marcação de mock, palavra por palavra. Existe como constante e não como
 * literal solto porque é o texto que `CONTEXT.md` torna vinculante: "o `alt`
 * termina sempre em 'imagem de referência'".
 */
export const MARCACAO_DE_MOCK = "imagem de referência";

/**
 * A vírgula e o ponto que fecham a frase. Ver `descricaoDeImagem`.
 *
 * ⚠️ **ERA UM TRAVESSÃO ATÉ 05/08/2026, E DUAS SEMENTES DESFAZEM ESTE SUFIXO
 * POR EXPRESSÃO REGULAR.** `semear-representadas.ts` e `semear-prancha.ts`
 * removem a marcação antes de gravar a descrição no painel; as duas aceitam o
 * travessão E a vírgula de propósito, porque o banco já tem linhas gravadas com
 * a forma antiga. Trocar o separador aqui sem mexer nas duas era o seed parar
 * de desfazer a marcação em silêncio, e a frase crescer a cada re-semeadura.
 */
const SUFIXO_DE_MOCK = `, ${MARCACAO_DE_MOCK}.`;

/**
 * O `alt` de uma imagem, composto a partir do que o operador escreveu.
 *
 * ⚠️ A marcação de mock é **gerada**, nunca digitada, e nunca gravada de volta
 * no campo. O operador escreve só o assunto da foto; quem garante que a frase
 * termina em "imagem de referência" é esta função. Duas razões, e as duas
 * doem se ignoradas:
 *
 *   1. Persistir o sufixo faz desmarcar o mock não limpar nada — a foto real
 *      chega e o site continua se declarando referência. A honestidade tem que
 *      poder ser desfeita tão fácil quanto foi ligada.
 *   2. Um hook que concatena no salvar concatena de novo no próximo salvar. A
 *      guarda de idempotência abaixo existe porque essa é a falha que aparece
 *      só na terceira edição, quando ninguém está mais olhando.
 *
 * A descrição chega do painel como o operador escreveu — com ou sem ponto
 * final. Os dois casos produzem a mesma frase.
 */
export function descricaoDeImagem({
  descricao,
  mock,
}: {
  descricao: string;
  mock?: boolean | null;
}): string {
  const assunto = descricao.trim();

  if (!mock) return assunto;
  if (assunto === "") return assunto;

  // Já marcada: devolver como está. `descricaoDeImagem(descricaoDeImagem(x))`
  // tem que ser `descricaoDeImagem(x)`, ou a frase cresce a cada leitura.
  if (assunto.toLowerCase().endsWith(MARCACAO_DE_MOCK)) return assunto;
  if (assunto.toLowerCase().endsWith(`${MARCACAO_DE_MOCK}.`)) return assunto;

  return `${assunto.replace(/\.$/, "")}${SUFIXO_DE_MOCK}`;
}

/**
 * O `object-position` de uma imagem, a partir do ponto focal do painel.
 *
 * ⚠️ Isto é o que substitui os valores de `posicao` medidos à mão neste
 * arquivo. O problema que eles resolvem é real — quando o quadro estreita no
 * telefone, o corte central decapita o assunto — mas a solução era um número
 * que só o desenvolvedor sabia calcular e que virava mentira toda vez que a
 * fotografia era trocada. O painel resolve isso clicando no assunto.
 *
 * O Payload grava `focalX`/`focalY` em porcentagem (0–100), e grava `null`
 * enquanto ninguém clicou. Centro é o padrão do CSS, então centro devolve
 * `undefined`: `posicao` é opcional justamente para não escrever no HTML uma
 * declaração que não muda nada.
 */
export function posicaoDoFoco({
  focoX,
  focoY,
}: {
  focoX?: number | null;
  focoY?: number | null;
}): string | undefined {
  const x = porcentagem(focoX);
  const y = porcentagem(focoY);

  if (x === 50 && y === 50) return undefined;

  return `${x}% ${y}%`;
}

/** Sem foco declarado é centro. Fora da faixa é erro de quem chamou, não
 *  motivo para o site quebrar — o valor entra na faixa e a página renderiza. */
function porcentagem(valor: number | null | undefined): number {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return 50;
  return Math.round(Math.min(100, Math.max(0, valor)));
}

/**
 * A vista de abertura: uma área externa inteira resolvida — móvel, estrutura,
 * conforto e sombra na mesma imagem. É a promessa da página em uma foto, e é
 * o LCP do site.
 */
export const ABERTURA: Imagem = {
  src: "/acervo/abertura.jpg",
  alt: "Área externa de alto padrão ao fim da tarde, com sofá modular, mesa baixa em alumínio e ombrelone lateral sobre deck de madeira, e o mar ao fundo, imagem de referência.",
};

/**
 * O fecho de `/quem-somos`: a única fotografia daquela página inteira, larga,
 * logo antes do colofão de contato.
 *
 * ⚠️ Não é obra entregue pela Belmare. O `alt` diz isso, e — diferente de todas
 * as outras imagens do site — **uma legenda visível diz também**. O motivo é a
 * posição: a foto cai logo depois das quatro representadas e exatamente no vão
 * que `lib/projetos.ts` deixa vazio de propósito. Um arquiteto rolando a página
 * lê aquilo como serviço prestado, e é a única mentira grave que este site
 * poderia contar. Alt não resolve: ninguém que enxerga lê alt.
 *
 * ⚠️ A cena é deliberadamente OUTRA que a da abertura da home. A primeira
 * versão repetia o deck largo de frente para o mar, com o mesmo ombrelone e o
 * mesmo sofá — a página não respirava, repetia. Esta é fechada e no fim do
 * dia: duas poltronas viradas uma para a outra, luminária acesa, o chão vazio à
 * direita. É a conversa antes de começar, que é o assunto do fecho.
 */
export const FECHO: Imagem = {
  src: "/acervo/fecho-interlocutor.jpg",
  alt: "Duas poltronas de área externa com estrutura em alumínio e trançado em corda, viradas uma para a outra em torno de uma mesinha de teca, num terraço coberto ao anoitecer, imagem de referência.",
};

/**
 * As duas portas da home. Campo inteiro, sob véu escuro, com o texto por cima —
 * por isso são imagens escuras e de contraste baixo, e por isso são `alt=""`:
 * decorativas de verdade, já que o rótulo da porta diz tudo.
 *
 * ⚠️ Estas entradas existem porque `portas.tsx` apontava para `/pecas/…`, um
 * diretório que nunca existiu: as duas portas da home vinham renderizando campo
 * preto desde sempre. E a correção NÃO foi apontar para as macros de matéria em
 * `acervo/reserva/` — grande campo de textura foi justamente o que caiu em
 * 30/07/2026, por brigar com a fotografia do móvel (`briefing/marca.md` §5).
 * A porta do arquiteto recebe detalhe técnico; a porta de quem compra recebe a
 * peça em casa.
 */
export const IMAGEM_DA_PORTA: Record<string, Imagem> = {
  arquitetos: {
    src: "/acervo/porta-arquitetos.jpg",
    alt: "",
  },
  contato: {
    src: "/acervo/porta-contato.jpg",
    alt: "",
  },
};

/**
 * A faixa editorial da home — a seção que diz o que uma representação faz.
 *
 * ⚠️ **NÃO É AMBIENTE, E ISSO É O PONTO.** Todas as outras fotografias do site
 * mostram a peça montada num deck. Esta mostra a MESA DE TRABALHO de quem
 * especifica — catálogo aberto, cartelas de tecido, chips de acabamento, um
 * pedaço de corda. A seção fala do trabalho da Belmare, não do produto das
 * fábricas, e repetir mais um deck ali seria a quarta fotografia de varanda numa
 * rolagem só.
 *
 * ⚠️ Nenhum objeto do quadro é peça de catálogo de nenhuma das quatro fábricas,
 * e o `alt` não nomeia produto nem marca. Nomear seria inventar acervo.
 */
export const FAIXA_REPRESENTACAO: Imagem = {
  src: "/acervo/faixa-representacao.jpg",
  alt: "Mesa de trabalho com catálogo impresso aberto, cartelas de tecido de performance, chips de acabamento em alumínio anodizado e um trecho de corda náutica, imagem de referência.",
};

/**
 * Uma imagem por representada, ilustrando O QUE ELA RESOLVE.
 *
 * ⚠️ Não é uma peça do catálogo da fábrica — nenhum alt nomeia produto, porque
 * nomear seria inventar acervo. A seção declara isso em texto visível.
 * A chave é o slug da marca; ver `representadas.ts`.
 */
/* ⚠️ **AS QUATRO FOTOGRAFIAS FORAM REFEITAS EM 05/08/2026, E O QUE MUDOU FOI O
   CENÁRIO, NÃO O ASSUNTO.** A revisão de acabamento derrubou o conjunto
   anterior com um argumento de composição: eram "quatro placas cinzentas quase
   idênticas, um assento contra concreto cinza sobre deck cinza, indistinguíveis
   à primeira vista". Numa página cuja regra é que a fotografia é a única cor, o
   trilho inteiro não tinha nenhuma — e quatro cartões que se parecem leem como
   uma fábrica só, o oposto do que o h2 pergunta.

   Agora cada marca tem um AMBIENTE e uma LUZ próprios, e a diferença é
   reconhecível na miniatura: a Marê ao entardecer sobre deck de madeira com o
   mar atrás; a GDA em pedra clara à beira de piscina, sol a pino; a Bux em
   terraço sombreado dentro da vegetação; a Trisol sob sol duro, onde o assunto
   é a sombra projetada. O assunto de cada uma continua sendo o que a fábrica
   resolve — não mudou nenhuma atribuição.

   ⚠️ O `alt` acompanhou a troca, e não é enfeite: ele é a descrição real da
   cena E é SEO de imagem, que é como o arquiteto encontra fotografia no Google
   (`PRODUCT.md → Accessibility`). O da GDA em particular ESTAVA ERRADO depois
   da troca — dizia "poltrona" para uma espreguiçadeira. `alt` que descreve
   outra peça é pior do que `alt` genérico. */
export const IMAGEM_DA_MARCA: Record<string, Imagem> = {
  "mare-mobilia": {
    src: "/acervo/marca-mare-mobilia.jpg",
    alt: "Poltrona de área externa com assento e encosto trançados em corda náutica, sozinha num deck de madeira ao fim da tarde, com o mar ao fundo, imagem de referência.",
  },
  "gda-moveis": {
    src: "/acervo/marca-gda-moveis.jpg",
    alt: "Espreguiçadeira de área externa com estrutura em alumínio fundido e tela tensionada, sobre piso de pedra clara à beira de uma piscina, imagem de referência.",
  },
  "bux-garden": {
    src: "/acervo/marca-bux-garden.jpg",
    alt: "Sofá modular de área externa estofado em tecido de performance, num terraço sombreado cercado de vegetação densa, imagem de referência.",
  },
  trisol: {
    src: "/acervo/marca-trisol.jpg",
    alt: "Ombrelone lateral de lona escura aberto sobre piso de pedra clara ao sol forte, com a mesa e as cadeiras inteiramente dentro da sombra projetada, imagem de referência.",
  },
};

/**
 * A vista de conjunto que a PRANCHA 02 de `/representadas` chaveia: uma área
 * externa inteira com os quatro elementos SEPARADOS no quadro, cada um com ar
 * em volta para receber uma chamada numerada.
 *
 * ⚠️ A separação é requisito de desenho, não gosto de composição. Numa cena em
 * que o ombrelone cobre o sofá, duas chamadas apontam para o mesmo pixel e a
 * prancha deixa de ser conferível. Trocar esta imagem exige recalcular as
 * coordenadas em `lib/prancha-area-externa.ts`.
 *
 * ⚠️ A chamada nomeia a FUNÇÃO, nunca o produto — nada aqui é peça de catálogo
 * de nenhuma das quatro fábricas, e o `alt` diz isso.
 */
export const PRANCHA_AREA_EXTERNA: Imagem = {
  src: "/acervo/prancha-area-externa.jpg",
  alt: "Vista de conjunto de uma área externa em deck de madeira: sofá de corda à esquerda, mesa e cadeiras de alumínio ao centro, chaise estofada à direita e ombrelone lateral ao fundo, imagem de referência.",
};

/**
 * A vista larga de abertura de cada página de marca — sangra de ponta a ponta
 * sob a faixa do índice.
 *
 * ⚠️ É deliberadamente OUTRA imagem que a da galeria da home. Reaproveitar
 * `IMAGEM_DA_MARCA` aqui faria a página de marca abrir com o mesmo quadro que o
 * visitante acabou de ver duas telas atrás, e a rota inteira leria como a
 * galeria de novo, em tamanho maior. Cada uma destas mostra o que a fábrica
 * resolve, num enquadramento panorâmico que a galeria não tem: a trama na Marê,
 * a junta de alumínio na GDA, o têxtil na Bux, a sombra projetada na Trisol.
 *
 * ⚠️ Nenhum `alt` nomeia produto. Nomear seria inventar acervo.
 */
export const IMAGEM_LARGA_DA_MARCA: Record<string, Imagem> = {
  "mare-mobilia": {
    src: "/acervo/marca-mare-mobilia-larga.jpg",
    alt: "Poltrona de área externa com assento e encosto trançados em corda sobre estrutura de madeira, sozinha num deck vazio ao sol da tarde, imagem de referência.",
    posicao: "30% center",
  },
  "gda-moveis": {
    src: "/acervo/marca-gda-moveis-larga.jpg",
    alt: "Espreguiçadeira de área externa em alumínio fundido vista de perfil, com as juntas da estrutura à mostra, diante de uma parede de concreto, imagem de referência.",
    posicao: "65% center",
  },
  "bux-garden": {
    src: "/acervo/marca-bux-garden-larga.jpg",
    alt: "Sofá modular de área externa com assentos e encostos estofados em tecido de trama fechada, encostado numa parede de concreto, imagem de referência.",
  },
  trisol: {
    src: "/acervo/marca-trisol-larga.jpg",
    alt: "Ombrelone lateral de lona escura visto de baixo, com haste e ferragens em alumínio, projetando sombra sobre uma parede de concreto e um deck de madeira, imagem de referência.",
  },
};
