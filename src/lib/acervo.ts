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
 * A vista de abertura: uma área externa inteira resolvida — móvel, estrutura,
 * conforto e sombra na mesma imagem. É a promessa da página em uma foto, e é
 * o LCP do site.
 */
export const ABERTURA: Imagem = {
  src: "/acervo/abertura.jpg",
  alt: "Área externa de alto padrão com sofá, mesa baixa, ombrelone e estrutura em alumínio sobre deck de madeira — imagem de referência.",
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
 * direita. É a conversa antes de começar, que é o assunto do bloco 06.
 */
export const FECHO: Imagem = {
  src: "/acervo/fecho-interlocutor.jpg",
  alt: "Duas poltronas de área externa com estrutura em alumínio e trançado em corda, viradas uma para a outra em torno de uma mesinha de teca, num terraço coberto ao anoitecer — imagem de referência.",
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
 * Uma imagem por representada, ilustrando O QUE ELA RESOLVE.
 *
 * ⚠️ Não é uma peça do catálogo da fábrica — nenhum alt nomeia produto, porque
 * nomear seria inventar acervo. A seção declara isso em texto visível.
 * A chave é o slug da marca; ver `representadas.ts`.
 */
export const IMAGEM_DA_MARCA: Record<string, Imagem> = {
  "mare-mobilia": {
    src: "/acervo/marca-mare-mobilia.jpg",
    alt: "Poltrona de área externa trançada em corda náutica — imagem de referência.",
  },
  "gda-moveis": {
    src: "/acervo/marca-gda-moveis.jpg",
    alt: "Poltrona de área externa com estrutura em alumínio fundido — imagem de referência.",
  },
  "bux-garden": {
    src: "/acervo/marca-bux-garden.jpg",
    alt: "Sofá modular de área externa estofado em tecido de performance — imagem de referência.",
  },
  trisol: {
    src: "/acervo/marca-trisol.jpg",
    alt: "Ombrelone lateral de área externa com lona técnica — imagem de referência.",
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
  alt: "Vista de conjunto de uma área externa em deck de madeira: sofá de corda à esquerda, mesa e cadeiras de alumínio ao centro, chaise estofada à direita e ombrelone lateral ao fundo — imagem de referência.",
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
    alt: "Poltrona de área externa com assento e encosto trançados em corda sobre estrutura de madeira, sozinha num deck vazio ao sol da tarde — imagem de referência.",
    posicao: "30% center",
  },
  "gda-moveis": {
    src: "/acervo/marca-gda-moveis-larga.jpg",
    alt: "Espreguiçadeira de área externa em alumínio fundido vista de perfil, com as juntas da estrutura à mostra, diante de uma parede de concreto — imagem de referência.",
    posicao: "65% center",
  },
  "bux-garden": {
    src: "/acervo/marca-bux-garden-larga.jpg",
    alt: "Sofá modular de área externa com assentos e encostos estofados em tecido de trama fechada, encostado numa parede de concreto — imagem de referência.",
  },
  trisol: {
    src: "/acervo/marca-trisol-larga.jpg",
    alt: "Ombrelone lateral de lona escura visto de baixo, com haste e ferragens em alumínio, projetando sombra sobre uma parede de concreto e um deck de madeira — imagem de referência.",
  },
};
