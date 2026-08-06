import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { ROTAS_LIVRES } from "@/lib/site";

/**
 * O seed das três páginas livres de PRA-124 — `/arquitetos`, `/contato` e
 * `/politica-de-privacidade`.
 *
 * Como rodar: `pnpm payload run src/seed/semear-paginas.ts`, ou `pnpm db:seed`,
 * que roda este por último — a ficha de `/contato` lê o cadastro da empresa, e
 * ele é semeado antes.
 *
 * ⚠️ **AS TRÊS ERAM 404 ATÉ ESTE TICKET, E É POR ISSO QUE O SEED PUBLICA.** As
 * duas portas da home levavam a lugar nenhum e o link de política de privacidade
 * do rodapé — que aparece em TODA rota do site, inclusive na própria 404 —
 * também. Uma rota livre sem composição publicada continua sendo 404 de
 * propósito (ver `components/paginas/rota-livre.tsx`): não há reserva em código
 * para cair, porque estas três nascem CMS-nativas. Sem este seed, o ticket
 * entregaria três rotas que só existem depois de alguém montá-las à mão.
 *
 * ⚠️ **REEXECUÇÃO: PULA O QUE JÁ EXISTE, NUNCA SOBRESCREVE.** Mesma política dos
 * outros três seeds. Aqui ela é literal: o que está gravado é uma COMPOSIÇÃO que
 * alguém montou arrastando blocos, e uma segunda execução que a reescrevesse
 * apagaria o trabalho sem aviso.
 *
 * ⚠️ `_status: "published"` explícito em cada `data`. `draft: false` sozinho NÃO
 * publica — o padrão do campo é `"draft"` (achado de PRA-118). Sem esta linha as
 * três entram como rascunho e as rotas continuam em 404.
 *
 * ⚠️ **A POLÍTICA DE PRIVACIDADE ABAIXO NÃO É TEXTO JURÍDICO, E ELA DIZ ISSO NA
 * PRÓPRIA PÁGINA.** A redação é de advogado e está fora do escopo deste ticket.
 * O que vai ao ar é (a) um aviso inequívoco de que o documento aguarda revisão
 * jurídica e (b) o LEVANTAMENTO FACTUAL do que este site de fato faz — que
 * dados chegam, por onde, o que ele não instala. Nada disso é redação legal
 * fantasiada de revisada: texto legal plausível é justamente o que ninguém
 * confere depois. O advogado cola por cima; a página já existe e já é editável.
 */

/* ------------------------------------------------------------------------- *
   Construtores de texto formatado.

   O editor grava a árvore serializada do lexical, e escrevê-la à mão neste
   arquivo seria trezentas linhas de JSON em que um `version` errado quebra o
   campo sem sintoma. Estas quatro funções montam só o que o editor das páginas
   livres oferece — parágrafo, dois níveis de título, negrito e lista.
 * ------------------------------------------------------------------------- */

/** Negrito no lexical é uma máscara de bits no nó de texto; 1 é o primeiro. */
const NEGRITO = 1;

type No = Record<string, unknown>;

function textoSimples(valor: string, formato = 0): No {
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

/** Um parágrafo. `negrito: true` marca a frase inteira — é o que o aviso de
 *  revisão jurídica usa, e o único negrito de todo o conteúdo semeado. */
function paragrafo(valor: string, negrito = false): No {
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

function titulo(valor: string, nivel: "h2" | "h3" = "h2"): No {
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

function listaDePontos(itens: string[]): No {
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

function documento(nos: No[]) {
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

/* ------------------------------------------------------------------------- *
   As três composições.
 * ------------------------------------------------------------------------- */

/**
 * `/arquitetos` — hub de trabalho, não página de venda.
 *
 * ✅ **O CAMINHO DOS ARQUIVOS 3D VIROU ROTA EM PRA-127.** Era WhatsApp com um
 * apoio dizendo "a biblioteca ainda não está no ar" — a saída honesta enquanto
 * `/arquivos-3d` era 404 e `DESTINOS_DE_CAMINHO` não o oferecia. Com a rota
 * viva, manter o WhatsApp ali seria o site escondendo a própria biblioteca da
 * página que existe justamente para reunir o material do arquiteto. A troca
 * custou duas linhas porque a união de `lib/paginas.ts` já previa `rota` — o
 * mesmo seam que "quero revender" usou em PRA-126.
 */
const ARQUITETOS = {
  slug: "arquitetos",
  titulo: "Catálogos, arquivos 3D e cartas de acabamento.",
  resumo:
    "O material que a Belmare entrega a quem especifica móveis para área externa: os catálogos das fábricas representadas, os blocos 3D, as cartas de tecido e pintura, e uma pessoa do outro lado para responder medida e prazo.",
  composicao: [
    {
      blockType: "prosa",
      corpo: documento([
        paragrafo(
          "A Belmare representa fábricas de móveis para área externa e atende quem especifica. Medida, acabamento, prazo e ficha cotada você pede direto aqui, e recebe de uma pessoa. Tudo o que a fábrica já publicou está na página dela; o que ela não publicou, a Belmare pergunta.",
        ),
        paragrafo(
          "Como a mesma pessoa atende todas as marcas, ela consegue comparar as linhas entre si e responder pelo projeto inteiro, e não por uma fábrica de cada vez.",
        ),
      ]),
    },
    {
      blockType: "caminhos",
      titulo: "O material",
      itens: [
        {
          rotulo: "Os catálogos das representadas",
          apoio:
            "Um catálogo por fábrica. A edição de cada um aparece antes de você abrir, e o peso do arquivo também, quando ele já está publicado aqui.",
          destino: "rota",
          rota: "/catalogos",
        },
        {
          rotulo: "A linha de cada fábrica",
          apoio:
            "Quem assina cada coleção, as categorias com os nomes que a própria fábrica usa e a ficha técnica que ela publica.",
          destino: "rota",
          rota: "/representadas",
        },
        {
          rotulo: "Os arquivos 3D das representadas",
          apoio:
            "O formato e o peso de cada bloco aparecem antes de você baixar, e não é preciso fazer cadastro. Só o pacote com todas as fábricas juntas pede os seus dados.",
          destino: "rota",
          rota: "/arquivos-3d",
        },
      ],
    },
    {
      blockType: "fecho",
      rotulo: "Falar com quem representa",
      contexto: "vim pela página de arquitetos e queria falar sobre uma especificação",
    },
  ],
};

/**
 * `/contato` — a porta B, onde ela bifurca.
 *
 * ⚠️ **"QUERO REVENDER" É O FORMULÁRIO DE PROPOSTA (PRA-126).** Era um caminho
 * de WhatsApp até o formulário existir; hoje é `destino: "formulario"`, e a
 * troca custou uma linha porque a união de `lib/paginas.ts` já previa o membro.
 * "Quero comprar" continua no WhatsApp de propósito — ver a nota no próprio
 * caminho.
 */
const CONTATO = {
  slug: "contato",
  titulo: "Onde comprar, e como revender.",
  resumo:
    "A Belmare não vende direto: ela indica a loja mais próxima que trabalha com a peça, e recebe a proposta de quem quer revender as fábricas que representa no Sul do Brasil.",
  composicao: [
    {
      blockType: "prosa",
      corpo: documento([
        paragrafo(
          "A Belmare é representação comercial: ela não fabrica e não vende ao consumidor. Quem quer comprar é levado até a loja mais próxima que trabalha com a peça; quem quer revender fala direto com quem responde pelas fábricas no Sul do Brasil.",
        ),
        paragrafo(
          "Os dois caminhos terminam na mesma pessoa, e é por isso que a resposta chega sabendo o que cada fábrica consegue entregar.",
        ),
      ]),
    },
    {
      blockType: "caminhos",
      titulo: "Por onde seguir",
      itens: [
        {
          rotulo: "Quero comprar",
          /* ⚠️ **SEM APOIO, POR DECISÃO DO CLIENTE EM 05/08/2026.** A linha era
             "Diga a peça e a cidade. A Belmare indica a loja mais próxima que a
             tem, ou responde a dúvida de medida e acabamento antes de você ir
             até lá." — instrução de como usar o canal, escrita antes de o
             visitante ter decidido usá-lo. O rótulo já diz o que o caminho faz,
             e o campo é opcional justamente para isso: "em branco, o caminho
             fica só com o rótulo" (`collections/blocos.ts`). Os outros dois
             caminhos desta página mantêm o apoio porque o rótulo deles não basta
             — "Quero revender" precisa dizer que abre um formulário, e o de
             arquiteto precisa nomear o que existe do outro lado. */
          destino: "whatsapp",
          contexto: "quero comprar e preciso saber qual loja trabalha com a peça",
        },
        {
          rotulo: "Quero revender",
          apoio:
            "Loja de móveis, escritório ou operação de área externa: deixe a cidade e o perfil da operação, e a Belmare responde com as condições da fábrica.",

          /* ⚠️ O seam de PRA-126, agora fechado. Era um caminho de WhatsApp
             com contexto próprio; virou o formulário de proposta desenhado na
             própria página. A troca é de UMA linha aqui porque a união de
             `lib/paginas.ts` já previa o membro — era esse o ponto de deixar o
             seam declarado em vez de meio construído.

             Por que revenda é formulário e compra continua WhatsApp: uma
             proposta comercial precisa ficar registrada e exportável no painel
             (decisão 11 — lead que só existe em caixa de entrada já está
             perdido), enquanto "qual loja tem esta peça" é pergunta de
             resposta imediata, e transformá-la em formulário seria pedir
             cadastro para dar uma informação. */
          destino: "formulario",
        },
        {
          rotulo: "Sou arquiteto ou designer",
          apoio:
            "Catálogos, arquivos 3D e cartas de acabamento das representadas, num lugar só.",
          destino: "rota",
          rota: "/arquitetos",
        },
      ],
    },
    {
      blockType: "ficha",
      titulo: "A empresa",
    },
  ],
};

/**
 * `/politica-de-privacidade` — a página existe, a redação é de advogado.
 *
 * ⚠️ Cada afirmação factual abaixo foi conferida contra o código deste
 * repositório em 31/07/2026, e nenhuma delas é conclusão jurídica:
 *
 *   · há UM formulário no site, o de proposta comercial em `/contato`
 *     (PRA-126). Ele pede nome, e-mail, cidade e empresa — nada além disso — e
 *     grava um documento em `leads`, que só é legível com sessão de painel;
 *   · o consentimento de marketing é caixa separada, nunca pré-marcada, e
 *     recusá-lo não impede o contato;
 *   · o único dado que chega da parte do visitante é o que ele escreve numa
 *     conversa de WhatsApp, num e-mail ou num telefonema iniciados por ele;
 *   · não há Google Analytics, tag manager, pixel de rede social nem qualquer
 *     outro rastreador de terceiros — a busca por eles no repositório não
 *     devolve nada;
 *   · as fontes são servidas pelo próprio domínio (`next/font` as baixa no
 *     build), então nem elas geram requisição para terceiro;
 *   · os únicos cookies são a sessão de quem entra no painel e o cookie de
 *     pré-visualização de rascunho do Next — nenhum dos dois existe para o
 *     visitante comum;
 *   · os arquivos pesados (catálogos, fotografias) são servidos de um bucket
 *     Cloudflare R2, que registra acesso como qualquer servidor de arquivos.
 */
const PRIVACIDADE = {
  slug: "politica-de-privacidade",
  titulo: "Política de privacidade",
  resumo:
    "Como a Belmare Representações trata os dados de quem entra em contato pelo site. Documento em elaboração: o texto abaixo é o levantamento do que o site faz, e aguarda revisão jurídica.",
  composicao: [
    {
      blockType: "prosa",
      corpo: documento([
        paragrafo(
          "Aviso: este documento ainda não passou por revisão jurídica. O texto abaixo é o levantamento factual do que este site faz com dados. Ele não é, e não deve ser lido como, uma política de privacidade em vigor. A redação definitiva será publicada aqui assim que revisada.",
          true,
        ),
        paragrafo(
          "Enquanto isso, o que segue descreve o funcionamento real do site, conferido contra o código que o gera. Para qualquer pergunta sobre dados, fale com a Belmare pelos canais listados em Contato.",
        ),

        titulo("O que este site coleta"),
        paragrafo(
          "Este site tem um único formulário, o de proposta comercial em /contato. Ele pede nome, e-mail, cidade e a empresa ou escritório que a pessoa representa, e nada além disso. Não há cadastro, não há login de visitante, não se pede CPF e não se pede telefone. O aceite de novidades por e-mail é uma caixa separada, que nunca vem marcada: deixá-la em branco não muda em nada o atendimento do contato. Fora esse formulário, o único dado pessoal que chega à Belmare é o que a própria pessoa escreve numa conversa iniciada por ela, por WhatsApp, e-mail ou telefone. Esse dado chega pelo aplicativo ou provedor correspondente, não por este site.",
        ),

        titulo("Rastreamento e cookies"),
        paragrafo(
          "O site não instala ferramenta de análise de audiência, gerenciador de tags nem pixel de rede social. As fontes tipográficas são servidas pelo próprio domínio, de modo que a visita não gera requisição para terceiros por causa delas. Existem dois cookies no sistema, e nenhum dos dois alcança o visitante comum:",
        ),
        listaDePontos([
          "a sessão de quem entra no painel de edição, que é da equipe da Belmare;",
          "o cookie de pré-visualização de rascunho, criado apenas quando alguém do painel abre uma página ainda não publicada.",
        ]),
        paragrafo(
          "Por não haver rastreador a consentir, o site não exibe banner de cookies.",
        ),

        titulo("Arquivos e registros de acesso"),
        paragrafo(
          "Catálogos, fotografias e demais arquivos são servidos a partir de armazenamento em nuvem contratado para este fim. Como qualquer servidor de arquivos, ele registra o acesso (endereço de origem, data e arquivo pedido) para operação e segurança do serviço.",
        ),

        titulo("Compartilhamento"),
        paragrafo(
          "A Belmare é o único interlocutor: nenhum contato recebido é repassado automaticamente às fábricas representadas, e nenhum endereço de e-mail comercial de fábrica é publicado neste site. Quando um pedido precisa chegar à fábrica, é a Belmare quem o encaminha.",
        ),

        titulo("Seus direitos e como exercê-los"),
        paragrafo(
          "Esta seção aguarda a redação jurídica: prazos de guarda, base legal de cada tratamento, encarregado pelo tratamento de dados e o procedimento para pedir acesso, correção ou eliminação. Até lá, qualquer pedido sobre dados pode ser feito pelos canais da página de Contato e será respondido pela Belmare.",
        ),
      ]),
    },
  ],
};

/* ------------------------------------------------------------------------- *
   A execução.
 * ------------------------------------------------------------------------- */

type Composicao = { slug: string; titulo: string; resumo: string; composicao: unknown[] };

async function semearPagina(
  payload: Payload,
  pagina: Composicao,
): Promise<"criada" | "existente"> {
  const { docs } = await payload.find({
    collection: "paginas",
    where: { slug: { equals: pagina.slug } },
    limit: 1,
    depth: 0,
  });

  if (docs.length > 0) {
    console.log(`  já existe — pulando ("/${pagina.slug}")`);
    return "existente";
  }

  await payload.create({
    collection: "paginas",
    draft: false,
    data: { ...pagina, _status: "published" },
  } as never);

  console.log(
    `  publicada ("/${pagina.slug}") — ${pagina.composicao.length} bloco(s)`,
  );
  return "criada";
}

async function semear(): Promise<void> {
  const payload = await getPayload({ config });

  console.log("Semeando as três páginas livres no Payload...\n");

  const composicoes = [ARQUITETOS, CONTATO, PRIVACIDADE] as Composicao[];

  /* ⚠️ Prova, não suposição: uma composição para um endereço que não é rota
     seria uma página publicada em URL nenhuma. O registro de rotas é o mesmo que
     a coleção usa para montar a lista de opções — se este seed e ele
     divergirem, é aqui que se descobre, e não em produção. */
  for (const { slug } of composicoes) {
    if (!ROTAS_LIVRES.some((rota) => rota.slug === slug)) {
      throw new Error(
        `"${slug}" não está em ROTAS_LIVRES (lib/site.ts) — não há arquivo de rota para essa página, e ela ficaria publicada sem URL.`,
      );
    }
  }

  const resultados = { criada: 0, existente: 0 };
  for (const pagina of composicoes) {
    console.log(`- /${pagina.slug}`);
    resultados[await semearPagina(payload, pagina)]++;
  }

  console.log(
    `\n${resultados.criada} publicada(s), ${resultados.existente} já existia(m) e foi(ram) preservada(s).`,
  );
  console.log(
    "\n⚠️  A política de privacidade foi publicada com um AVISO de que aguarda\n" +
      "    revisão jurídica, e o corpo dela é o levantamento do que o site faz —\n" +
      "    não texto legal. Cole a redação do advogado por cima, no painel, em\n" +
      "    \"O site › Páginas › Política de privacidade\".",
  );

  await payload.destroy();
}

// `payload run` importa este módulo diretamente — daí o `await` de topo de
// nível, e não um export que outra coisa chama.
await semear();
