import { DESTINOS_DE_CAMINHO, ROTAS_LIVRES } from "@/lib/site";

/**
 * A **página livre** — o único lugar deste projeto onde o operador COMPÕE em
 * vez de preencher.
 *
 * ⚠️ **TRÊS ROTAS, E A LISTA DO QUE NÃO GANHA BLOCO VALE MAIS DO QUE A DELAS.**
 * `/arquitetos`, `/contato` e `/politica-de-privacidade` nunca foram escritas em
 * código: não há argumento de desenho a proteger nelas, então nascem
 * CMS-nativas. A home, `/quem-somos` e `/representadas/[marca]` continuam de
 * **espinha fixa** e NÃO ganham construtor de blocos — a sequência de
 * `/quem-somos` é o argumento dela, e aquela página carrega uma lista
 * vinculante do que nunca pode aparecer nela. Um array de blocos ali seria a
 * ferramenta que contorna essa lista. Ver `CONTEXT.md` e decisão 1 da spec.
 *
 * ⚠️ **NADA AQUI FALA COM O PAYLOAD NEM COM O NEXT.** O tipo do domínio, o
 * portão de publicação e a resolução de rota são funções puras — a mesma tática
 * de `lib/revalidacao.ts` e `lib/preview.ts`. Quem lê o painel é
 * `lib/paginas-consulta.ts`; quem traduz o documento gravado é
 * `lib/paginas-traducao.ts`.
 *
 * ⚠️ **A BIBLIOTECA DE BLOCOS É PEQUENA POR DECISÃO, NÃO POR FALTA DE TEMPO.**
 * Número de campo é custo (decisão 2 da spec) e num construtor de páginas esse
 * custo compõe: cada bloco novo é mais uma maneira de montar uma página que
 * fica errada, e é o operador — não o desenho — quem paga por isso. Quatro
 * blocos, com papéis que não se sobrepõem:
 *
 *   `prosa`     as palavras            título opcional + texto formatado
 *   `caminhos`  as escolhas            uma lista de destinos, com apoio
 *   `ficha`     o dado da empresa      lido do cadastro, NUNCA redigitado
 *   `fecho`     a ação                 a faixa de WhatsApp do site
 *
 * O que ficou de fora, e por quê, está em `collections/blocos.ts`.
 */

/** O endereço de uma página livre — só os que têm arquivo de rota. */
export type RotaLivre = (typeof ROTAS_LIVRES)[number]["slug"];

/** Um destino interno que um caminho pode apontar. */
export type DestinoInterno = (typeof DESTINOS_DE_CAMINHO)[number]["href"];

/**
 * ⚠️ **A FORMA DO TEXTO FORMATADO, ESCRITA AQUI E NÃO IMPORTADA.** O tipo do
 * lexical mora dentro de `@payloadcms/richtext-lexical`, que é dependência do
 * painel — e o pacote `lexical` em si nem é resolvível na raiz do projeto. Esta
 * declaração estrutural é o que permite um componente do site tipar o corpo de
 * um bloco sem importar nem `payload-types` nem o editor. É a mesma divisão que
 * o resto de `lib` já faz.
 */
export type NoRico = { type: string; version: number; [chave: string]: unknown };

export type ConteudoRico = {
  root: {
    type: string;
    version: number;
    children: NoRico[];
    direction: "ltr" | "rtl" | null;
    format: "" | "left" | "start" | "center" | "right" | "end" | "justify";
    indent: number;
  };
};

/** Um caminho: uma escolha oferecida ao visitante, com o que há atrás dela.
 *
 *  ⚠️ **É UMA UNIÃO DISCRIMINADA, E O DISCRIMINANTE É O SEAM DE PRA-126.** O
 *  caminho "quero revender" de `/contato` vai virar um formulário de proposta —
 *  isso é PRA-126 e NÃO está construído aqui. Quando estiver, ele entra como um
 *  terceiro membro desta união (`{ destino: "formulario" }`), um caso novo no
 *  renderizador e um valor novo no rádio da coleção. Nenhuma das três mudanças
 *  toca o que já existe: o `switch` exaustivo do renderizador vira erro de build
 *  no dia em que o membro entrar sem caso, que é exatamente o aviso que se quer.
 *  Enquanto isso, "quero revender" é um caminho de WhatsApp com contexto
 *  próprio — que funciona hoje e não promete formulário nenhum. */
export type Caminho =
  | {
      destino: "rota";
      rotulo: string;
      apoio?: string;
      href: DestinoInterno;
    }
  | {
      destino: "whatsapp";
      rotulo: string;
      apoio?: string;
      /** O que a mensagem do WhatsApp já vem dizendo — ver `linkDeWhatsapp`. */
      contexto: string;
    }
  | {
      /** O terceiro membro que o seam previa. O caminho não leva a lugar
       *  nenhum: ele desce até o formulário de proposta desenhado na mesma
       *  página, logo abaixo da lista — ver `components/paginas/caminhos.tsx`.
       *
       *  ⚠️ Não tem `href` nem `contexto` de propósito. Um formulário não é um
       *  destino externo, e dar a ele um endereço próprio abriria uma rota que
       *  ninguém pediu para uma página que já existe. */
      destino: "formulario";
      rotulo: string;
      apoio?: string;
    };

/** A âncora do formulário de proposta dentro de uma página livre.
 *
 *  ⚠️ Mora aqui, e não no componente, porque duas coisas precisam concordar
 *  sobre ela: o `href` do caminho e o `id` da seção que ele desce até. Duas
 *  cópias da mesma string é como uma âncora passa a apontar para lugar nenhum
 *  sem nada quebrar. */
export const ANCORA_DO_FORMULARIO = "proposta-comercial";

export type Bloco =
  | { tipo: "prosa"; titulo?: string; corpo: ConteudoRico }
  | { tipo: "caminhos"; titulo?: string; itens: Caminho[] }
  | { tipo: "ficha"; titulo?: string }
  | { tipo: "fecho"; rotulo?: string; contexto: string };

export type PaginaLivre = {
  slug: RotaLivre;
  /** O h1. Em página livre ele é CAMPO — não há argumento de desenho a
   *  proteger, ao contrário do h1 da home. */
  titulo: string;
  /** A descrição do resultado de busca. */
  resumo?: string;
  composicao: Bloco[];
};

/** O endereço de uma rota livre é o próprio slug na raiz. */
export function enderecoDaPaginaLivre(slug: RotaLivre): string {
  return `/${slug}`;
}

/** O sobretítulo em mono que abre a página — **gerado** do registro de rotas,
 *  nunca um campo. Ele nomeia a rota, e a rota é decisão de código. */
export function rotuloDaRotaLivre(slug: RotaLivre): string {
  return ROTAS_LIVRES.find((rota) => rota.slug === slug)?.rotulo ?? "";
}

/**
 * O endereço recebido é uma das rotas que existem?
 *
 * ⚠️ Guarda de tipo, e não `as`: um slug vindo do painel (ou de uma URL) é
 * `string` até alguém provar que não é. O portão está aqui porque é o mesmo
 * critério em três lugares — a rota do site, a rota de preview e o mapper —,
 * e três cópias de uma lista de três endereços é como um endereço novo entra em
 * dois deles e não no terceiro.
 */
export function ehRotaLivre(slug: string | null | undefined): slug is RotaLivre {
  return ROTAS_LIVRES.some((rota) => rota.slug === slug);
}

/** Idem para o destino de um caminho. Um `href` que não está na lista não vira
 *  link: a página desenha um caminho a menos, nunca um link para 404. */
export function ehDestinoInterno(
  href: string | null | undefined,
): href is DestinoInterno {
  return DESTINOS_DE_CAMINHO.some((destino) => destino.href === href);
}

/**
 * O corpo de um bloco de texto tem alguma palavra escrita dentro?
 *
 * ⚠️ **UM EDITOR EM BRANCO NÃO CHEGA VAZIO — CHEGA COM UM PARÁGRAFO SEM
 * FILHOS.** O lexical grava a raiz com um nó de parágrafo assim que o campo é
 * tocado, e por isso contar os filhos da raiz aprova exatamente o caso que este
 * portão existe para recusar: uma seção com título, fio de 1px e um vão onde
 * deveria haver texto. Quem conta é o TEXTO, e a busca é recursiva porque um
 * título ou um item de lista também é conteúdo — e nenhum dos dois é filho
 * direto da raiz.
 *
 * ⚠️ **É A MESMA REGRA QUE O PAINEL JÁ APLICA AO PUBLICAR** — um campo de texto
 * formatado obrigatório recusa "só um parágrafo vazio". Tê-la também aqui é o
 * que faz a pré-visualização concordar com o site publicado: sob live preview o
 * documento atravessa sem validação nenhuma, e é justamente ali que o operador
 * está montando a página.
 */
function temTexto(nos: NoRico[]): boolean {
  return nos.some((no) => {
    if (typeof no.text === "string") return no.text.trim() !== "";
    const filhos = no.children;
    return Array.isArray(filhos) && temTexto(filhos as NoRico[]);
  });
}

/**
 * Os blocos que de fato vão ao ar.
 *
 * ⚠️ **SEÇÃO ANULÁVEL, APLICADA À COMPOSIÇÃO INTEIRA.** Um bloco de caminhos
 * sem nenhum caminho válido é um título sobre o vazio; um bloco de prosa sem
 * corpo é um fio horizontal sem motivo. O mapper já descarta o que está pela
 * metade — esta função é o portão final, e ela é a razão de o pior resultado de
 * um bloco mal preenchido ser MENOS PÁGINA, nunca página quebrada.
 *
 * ⚠️ `ficha` e `fecho` atravessam sempre: os dois não têm conteúdo próprio para
 * estar vazio — a ficha lê o cadastro da empresa e o fecho é uma ação. Quando o
 * cadastro está vazio, quem some é o componente, pela mesma regra
 * (`AcaoDeFecho` não desenha nada sem número de WhatsApp).
 */
export function blocosPublicaveis(blocos: Bloco[]): Bloco[] {
  return blocos.filter((bloco) => {
    switch (bloco.tipo) {
      case "prosa":
        return temTexto(bloco.corpo.root.children);
      case "caminhos":
        return bloco.itens.length > 0;
      case "ficha":
      case "fecho":
        return true;
      default:
        return bloco satisfies never;
    }
  });
}
