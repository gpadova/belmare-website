import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { ROTAS_LIVRES } from "@/lib/site";
import { PRIVACIDADE } from "@/seed/politica-de-privacidade-texto";
import { documento, paragrafo } from "@/seed/texto-formatado";

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
 * ⚠️ **A POLÍTICA DE PRIVACIDADE NÃO MORA MAIS AQUI** — ela é
 * `seed/politica-de-privacidade-texto.ts`, e a nota longa no topo daquele
 * arquivo é que explica cada frase dela. Ela saiu deste arquivo em 06/08/2026,
 * quando a redação deixou de ser um levantamento provisório e passou a ser a
 * política de fato: um texto compartilhado entre este seed e o script que
 * atualiza um banco já semeado (`atualizar-politica-de-privacidade.ts`) precisa
 * de um módulo sem efeito colateral para morar, ou importá-lo passa a semear o
 * banco de quem só queria ler a constante.
 *
 * ⚠️ **OS CONSTRUTORES DO LEXICAL TAMBÉM SAÍRAM, E PELA MESMA RAZÃO** — agora
 * são `seed/texto-formatado.ts`. Nada mudou no que eles montam.
 */

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
 *
 * ⚠️ **O BLOCO DE PROSA DE ABERTURA SAIU EM 06/08/2026, POR DECISÃO DO
 * CLIENTE.** Ele dizia: "A Belmare é representação comercial: ela não fabrica e
 * não vende ao consumidor. Quem quer comprar é levado até a loja mais próxima
 * que trabalha com a peça; quem quer revender fala direto com quem responde
 * pelas fábricas no Sul do Brasil." — e, embaixo, "Os dois caminhos terminam na
 * mesma pessoa". **Duas descrições do organograma da Belmare no lugar mais caro
 * da página**, e é a mesma frase que `PRODUCT.md` já registra como rejeitada:
 * ninguém chega a um site de mobiliário querendo saber como o fornecedor se
 * organiza. Nada se perdeu, porque nada ali era novo: o h1 já diz as duas coisas
 * que se pode fazer nesta página ("Onde comprar, e como revender"), e os três
 * caminhos abaixo dele demonstram cada uma com o destino real. **O que a prosa
 * de fato fazia era empurrar o formulário de proposta para 1170px do topo.**
 *
 * ⚠️ **O TÍTULO DO BLOCO DE CAMINHOS NOMEIA OBJETOS, e é por isso que ele mudou
 * junto.** Era "Por onde seguir" — tecido conectivo, e um rótulo que se aplicava
 * igualmente bem a qualquer lista de qualquer site. Com o desenho de duas
 * colunas ele passou a encabeçar SÓ as duas linhas que sobram ao lado do
 * formulário, e essas duas linhas têm um objeto atrás de cada uma: a loja mais
 * próxima e os arquivos das representadas.
 */
const CONTATO = {
  slug: "contato",
  titulo: "Onde comprar, e como revender.",
  resumo:
    "A Belmare não vende direto: ela indica a loja mais próxima que trabalha com a peça, e recebe a proposta de quem quer revender as fábricas que representa no Sul do Brasil.",
  composicao: [
    {
      blockType: "caminhos",
      titulo: "A loja, e os arquivos",
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
    "\n⚠️  A política de privacidade descreve o que ESTE site faz com dados, e\n" +
      "    cita o artigo de lei de cada obrigação. Se a instalação passar a fazer\n" +
      "    outra coisa — um rastreador, um operador a mais, um formulário novo —,\n" +
      "    a página passa a mentir: reescreva-a no painel, em \"O site › Páginas ›\n" +
      "    Política de privacidade\". O texto ainda não passou por advogado.",
  );

  await payload.destroy();
}

// `payload run` importa este módulo diretamente — daí o `await` de topo de
// nível, e não um export que outra coisa chama.
await semear();
