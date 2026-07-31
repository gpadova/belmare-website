import type { CollectionConfig } from "payload";

import { revalidarTags } from "@/collections/apoio";
import { BLOCOS_DE_PAGINA } from "@/collections/blocos";
import { urlDoBotaoDePreview } from "@/lib/preview";
import { tagsDaMudanca } from "@/lib/revalidacao";
import { ROTAS_LIVRES } from "@/lib/site";

/**
 * As **páginas livres**, dentro do painel — o único lugar deste projeto onde o
 * operador COMPÕE em vez de preencher.
 *
 * ⚠️ **TRÊS ROTAS, E O CRITÉRIO NÃO É GOSTO.** `/arquitetos`, `/contato` e
 * `/politica-de-privacidade` nunca foram escritas em código: não há argumento de
 * desenho a proteger nelas, então nascem CMS-nativas. A home, `/quem-somos` e
 * `/representadas/[marca]` continuam de **espinha fixa** e NÃO ganham construtor
 * de blocos — a sequência de `/quem-somos` é o argumento dela, e aquela página
 * carrega uma lista vinculante do que nunca pode aparecer nela. Um array de
 * blocos ali seria exatamente a ferramenta que contorna essa lista, e ele não
 * existe. Ver `CONTEXT.md` e decisão 1 da spec.
 *
 * ⚠️ **O ENDEREÇO NÃO SE DIGITA — ESCOLHE-SE ENTRE AS ROTAS QUE EXISTEM.** É a
 * decisão mais consequente desta coleção. Um campo de texto livre deixaria o
 * operador compor uma página inteira, publicá-la, e ela não existir em URL
 * nenhuma — o espelho exato da falha que `lib/site.ts` já descreve para o outro
 * lado ("um item de menu editável só serviria para apontar para um 404 que o
 * operador não tem como criar"). As opções saem de `lib/site.ts#ROTAS_LIVRES`,
 * que é o MESMO registro de onde nascem os três arquivos de rota em
 * `app/(frontend)/`: uma rota nova é um arquivo novo mais uma linha lá, e o
 * painel a oferece no mesmo commit. Nunca antes.
 *
 * ⚠️ **É AQUI QUE O LIVE PREVIEW SE PAGA — decisão 8 da spec.** A espinha fixa
 * previsualiza na ROTA DE VERDADE sob o modo de rascunho do Next (PRA-118), e
 * continua assim: quem está trocando um parágrafo dentro de um layout que não se
 * move já vê tudo o que precisa. Aqui é outro trabalho: a composição MUDA
 * enquanto se arrasta um bloco, e ver isso acontecer é o ponto inteiro. Por isso
 * esta é a única coleção com `admin.livePreview`, e os dois convivem — o botão
 * "Visualizar" abre a rota numa aba, a aba de live preview mostra o iframe.
 *
 * ⚠️ **A POLÍTICA DE PRIVACIDADE É PÁGINA, NÃO TEXTO NOSSO.** Este ticket
 * constrói a página e a editabilidade dela; a REDAÇÃO é de advogado e está fora
 * de escopo por decisão da spec. O que a seed publica está marcado, dentro da
 * própria página, como aguardando revisão jurídica — texto legal inventado com
 * cara de revisado é pior do que página vazia, porque ninguém o confere depois.
 * Não há banner de cookie: também fora de escopo.
 */
export const Paginas: CollectionConfig = {
  slug: "paginas",
  labels: { singular: "Página", plural: "Páginas" },

  admin: {
    useAsTitle: "titulo",
    defaultColumns: ["titulo", "slug", "_status", "updatedAt"],
    group: "O site",
    description:
      "As três páginas montadas por blocos: Arquitetos, Contato e Política de privacidade. Escolha o endereço, escreva o título e monte a página arrastando blocos. As demais páginas do site têm sequência desenhada e não se montam aqui.",

    /* O botão "Visualizar": abre a rota de verdade numa aba nova, sob o modo de
       rascunho do Next. É a MESMA rota que o iframe abaixo carrega — não há uma
       segunda maneira de ver um rascunho. */
    preview: (doc) =>
      urlDoBotaoDePreview({
        colecao: "paginas",
        slug: typeof doc.slug === "string" ? doc.slug : "",
        segredo: process.env.PREVIEW_SECRET,
      }),

    /**
     * ⚠️ **O IFRAME, E SÓ PARA ESTA COLEÇÃO.** Ele carrega a mesma
     * `/preview?...` do botão acima — o token é conferido e o modo de rascunho é
     * ligado antes de o redirecionamento chegar na rota. Quem atualiza o quadro
     * a cada mudança de campo é `components/paginas/atualiza-em-preview.tsx`,
     * renderizado pela rota apenas quando o modo de rascunho está ligado: um
     * visitante comum nunca recebe o ouvinte de mensagens.
     *
     * Os três tamanhos são os breakpoints que o site de fato usa (`md` em 768px
     * é o único de verdade no CSS) — não uma lista de aparelhos.
     */
    livePreview: {
      url: ({ data }) =>
        urlDoBotaoDePreview({
          colecao: "paginas",
          slug: typeof data?.slug === "string" ? data.slug : "",
          segredo: process.env.PREVIEW_SECRET,
        }),
      breakpoints: [
        { name: "telefone", label: "Telefone", width: 390, height: 844 },
        { name: "tablet", label: "Tablet", width: 768, height: 1024 },
        { name: "computador", label: "Computador", width: 1440, height: 900 },
      ],
    },
  },

  /* ⚠️ Mesma segunda camada de `collections/representadas.ts`: sem sessão de
     painel, a leitura já sai filtrada por publicado, mesmo que peçam
     `draft=true` direto na API REST/GraphQL. A primeira camada é o filtro
     explícito em `lib/paginas-consulta.ts`, que é por onde o site lê. */
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },

  /**
   * ⚠️ Rascunho com autosave DESLIGADO, como em toda a decisão 8 — dois botões
   * nomeados em vez de duas transições invisíveis. Aqui isso pesa mais do que
   * numa coleção comum: o operador está arrastando blocos, e autosave publicaria
   * a página no meio de um arrasto.
   */
  versions: { drafts: { autosave: false }, maxPerDoc: 20 },

  hooks: {
    /* Chamador fino de `tagsDaMudanca`, como todos os outros — a lista de rotas
       nunca é escrita aqui. Ver `lib/revalidacao.ts`. */
    afterChange: [
      ({ doc, operation, previousDoc }) => {
        if (doc._status !== "published") return;

        revalidarTags(tagsDaMudanca({ colecao: "paginas", slug: doc.slug }));

        /* O endereço de uma página livre é escolhido numa lista de três, mas
           MUDA: mover a composição de `/contato` para `/arquitetos` é uma
           edição legítima, e sem isto a rota antiga continuaria servindo a
           composição velha até o próximo build. */
        if (
          operation === "update" &&
          typeof previousDoc?.slug === "string" &&
          previousDoc.slug !== doc.slug
        ) {
          revalidarTags(
            tagsDaMudanca({ colecao: "paginas", slug: previousDoc.slug }),
          );
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidarTags(tagsDaMudanca({ colecao: "paginas", slug: doc.slug }));
      },
    ],
  },

  fields: [
    {
      name: "slug",
      type: "select",
      required: true,
      unique: true,
      index: true,
      label: "Endereço no site",
      admin: {
        position: "sidebar",
        description:
          "Qual das páginas do site esta composição preenche. Só aparecem aqui os endereços que já existem — uma página nova exige uma rota nova, que é código. Cada endereço recebe uma composição só.",
      },
      options: ROTAS_LIVRES.map((rota) => ({
        value: rota.slug,
        label: `/${rota.slug}`,
      })),
      validate: (valor: unknown) =>
        ROTAS_LIVRES.some((rota) => rota.slug === valor)
          ? true
          : "Escolha um dos endereços da lista. Uma página sem endereço existente não teria URL nenhuma no site, e ninguém chegaria nela.",
    },
    {
      name: "titulo",
      type: "text",
      required: true,
      label: "Título da página",
      admin: {
        description:
          "O título grande que abre a página, e o nome dela na aba do navegador. ⚠️ Nomeie o que o visitante veio buscar, não o setor da empresa: \"Catálogos, arquivos 3D e acabamentos\" diz mais do que \"Área do arquiteto\".",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o título da página. Ele é a primeira linha que se lê e o nome que aparece no Google.",
    },
    {
      name: "resumo",
      type: "textarea",
      required: true,
      label: "Resumo para o Google",
      admin: {
        description:
          "Uma ou duas frases descrevendo o que ESTÁ nesta página — é o texto que aparece no resultado de busca, a única superfície do site que se lê antes do site. ⚠️ Não prometa aqui o que a página não entrega: quem clica chega já desmentido.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva o resumo. Sem ele o Google inventa um trecho da página, e o trecho que ele escolhe raramente é o que interessa.",
    },
    {
      name: "composicao",
      type: "blocks",
      label: "Composição",
      labels: { singular: "Bloco", plural: "Blocos" },
      blocks: BLOCOS_DE_PAGINA,
      admin: {
        description:
          "Os blocos desta página, na ordem em que aparecem. Arraste para reordenar — a pré-visualização ao lado acompanha. Quatro blocos, com papéis que não se sobrepõem: texto, caminhos, a ficha da Belmare e a faixa de WhatsApp.",
      },

      /* ⚠️ Recusa a composição vazia, e a recusa só morde ao PUBLICAR — rascunho
         atravessa sem validação, para que uma montagem pela metade possa ficar
         salva entre duas sessões (história 17 da spec). Publicar uma página sem
         bloco nenhum publicaria um título sobre o vazio numa rota que a home
         linka: a porta da home levaria a uma página em branco, que é pior do que
         o 404 que estava ali antes. */
      validate: (valor: unknown) =>
        Array.isArray(valor) && valor.length > 0
          ? true
          : "Acrescente ao menos um bloco antes de publicar — uma página sem bloco nenhum é um título sobre o vazio. Para guardar o trabalho pela metade, salve como rascunho.",
    },
  ],
};
