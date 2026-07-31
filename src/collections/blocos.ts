import type { Block } from "payload";
import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { DESTINOS_DE_CAMINHO } from "@/lib/site";

/**
 * A biblioteca de blocos — **quatro, e a lista do que NÃO virou bloco é o
 * conteúdo deste arquivo**.
 *
 * ⚠️ **UM BLOCO A MAIS CUSTA MAIS CARO QUE UM CAMPO A MAIS.** A decisão 2 da
 * spec trata número de campo como custo; numa biblioteca de blocos esse custo
 * compõe, porque cada bloco novo não acrescenta uma linha a preencher — ele
 * acrescenta uma MANEIRA NOVA de montar uma página que fica errada, e quem
 * descobre o erro é o visitante. Uma pessoa não técnica, uma vez por mês, com
 * doze blocos na gaveta, monta a página que o desenho deste site passou o
 * projeto inteiro recusando: grade de logos, herói de categoria, contador
 * animado, depoimento que não existe.
 *
 * Os quatro têm papéis que não se sobrepõem, e é essa ausência de sobreposição
 * que faz a biblioteca ser pequena sem ser insuficiente:
 *
 *   `prosa`     as palavras         título opcional + texto formatado
 *   `caminhos`  as escolhas         destinos com apoio, em fio
 *   `ficha`     o dado da empresa   lido do cadastro, NUNCA redigitado
 *   `fecho`     a ação              a faixa de WhatsApp que o site já tem
 *
 * ⚠️ **O QUE FICOU DE FORA, E POR QUÊ — a lista é vinculante e o próximo ticket
 * não precisa relitigá-la:**
 *
 *   · **imagem / galeria** — toda fotografia deste site é MOCK enquanto a real
 *     não chega, e a marcação "imagem de referência" é gerada da coleção
 *     `Imagens`. Um bloco de imagem solto é o caminho mais curto para um mock
 *     entrar numa página sem marcação nenhuma, que `CONTEXT.md` chama de
 *     defeito com todas as letras. E numa página de trabalho — `/arquitetos` é
 *     hub, não campanha — fotografia de ambiente é ruído entre o arquiteto e o
 *     arquivo, exatamente como em `/catalogos`, a primeira rota do site sem uma
 *     única imagem.
 *   · **colunas / grade / espaçador / divisor** — layout não é conteúdo. O
 *     ritmo vertical, o fio de 1px e o teto de 64rem são o sistema
 *     (`app/(frontend)/globals.css`); um bloco de colunas é como uma página
 *     livre passa a ter DUAS gramáticas de grade, e a segunda é a que o
 *     operador inventou às onze da noite.
 *   · **destaque / números / contador** — "contador animando até 26" está na
 *     lista vinculante do que nunca entra em `/quem-somos`. Um bloco que faz
 *     isso em `/arquitetos` é a mesma página com outro endereço.
 *   · **depoimento / prova social / logos de clientes** — não existe nenhum. O
 *     que não existe fica ausente, não é preenchido.
 *   · **acordeão / FAQ** — esconde texto atrás de clique numa marca cuja
 *     autoridade vem de deixar tudo conferível na página.
 *   · **vídeo / incorporação** — não há vídeo, e um campo de HTML arbitrário é
 *     um buraco de segurança com cara de flexibilidade.
 *   · **formulário** — é PRA-126, e este ticket não o constrói. O seam está no
 *     rádio de `destino` abaixo.
 */

/** A ajuda que abre a descrição de todo bloco no painel. */
const AJUDA_DE_SUMICO =
  "Bloco mal preenchido não vai ao ar: a página desenha um bloco a menos, nunca um bloco quebrado.";

/**
 * O editor de texto formatado das páginas livres — **deliberadamente menor que
 * o padrão**.
 *
 * ⚠️ **O QUE ELE NÃO OFERECE É O ASSUNTO.** O padrão do Payload traz alinhamento,
 * recuo, tabela, citação, upload, blocos aninhados, sublinhado, tachado,
 * sobrescrito, código. Cada um deles é uma decisão de tipografia sendo tomada
 * por quem está escrevendo, não por quem desenhou o sistema — e este site tem
 * uma escala tipográfica única, sem cor de marca, sem raio e sem sombra
 * (`globals.css`). Texto centralizado, tabela dentro do parágrafo ou uma
 * palavra sublinhada em vermelho é como uma página livre deixa de pertencer ao
 * site.
 *
 * ⚠️ **O H1 NÃO ESTÁ AQUI.** A página já tem um, e ele é campo próprio no topo
 * do documento. Dois h1 numa rota é defeito de acessibilidade e de busca; o
 * editor começa em h2 porque é o nível em que uma seção de fato começa.
 *
 * Sobra o que um documento precisa: parágrafo, dois níveis de título, negrito,
 * itálico, link e as duas listas. É o suficiente para colar uma política de
 * privacidade escrita por advogado sem perder a estrutura dela.
 */
const EDITOR_DE_PAGINA = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    InlineToolbarFeature(),
  ],
});

/**
 * **Texto** — o bloco de trabalho da biblioteca.
 *
 * Sozinho, ele constrói a política de privacidade inteira. Acompanhado, é a
 * abertura de `/arquitetos` e de `/contato`. Um título opcional porque nem toda
 * seção de um documento tem título — o primeiro parágrafo de uma página em
 * geral não tem, e um campo obrigatório ali forçaria o operador a inventar um.
 */
export const BlocoDeProsa: Block = {
  slug: "prosa",
  interfaceName: "BlocoDeProsa",
  labels: { singular: "Texto", plural: "Textos" },
  admin: {
    group: "Página",
  },
  fields: [
    {
      name: "titulo",
      type: "text",
      label: "Título da seção (opcional)",
      admin: {
        description:
          "O título que abre esta seção. Deixe em branco quando o texto continua a seção anterior — é o caso do primeiro parágrafo de quase toda página.",
      },
    },
    {
      name: "corpo",
      type: "richText",
      required: true,
      editor: EDITOR_DE_PAGINA,
      label: "Texto",
      admin: {
        description:
          `Parágrafos, subtítulos, listas e links. ${AJUDA_DE_SUMICO} ⚠️ Não escreva aqui o endereço, o telefone, o CNPJ nem o e-mail da Belmare: eles têm o bloco "Ficha da Belmare", que os lê do cadastro e nunca discorda dele. Redigitados aqui, envelhecem sem ninguém perceber.`,
      },
    },
  ],
};

/**
 * **Caminhos** — a bifurcação.
 *
 * É o bloco que faz `/contato` existir ("quero comprar" × "quero revender") e o
 * que faz `/arquitetos` ser um hub de trabalho em vez de um texto sobre
 * arquitetos: catálogos, representadas, e o canal direto, cada um com uma linha
 * dizendo o que há atrás.
 *
 * ⚠️ **O DESTINO É ESCOLHIDO, NUNCA DIGITADO.** Um campo de URL livre é a
 * ferramenta que põe um 404 dentro do site com as próprias mãos do operador — e
 * é também por onde o e-mail comercial de uma fábrica entraria no site, que é a
 * única coisa que este projeto trata como erro de negócio e não de código
 * ("um representante que se desintermedia do próprio funil está construindo o
 * site do concorrente"). As opções saem de `lib/site.ts#DESTINOS_DE_CAMINHO`.
 */
export const BlocoDeCaminhos: Block = {
  slug: "caminhos",
  interfaceName: "BlocoDeCaminhos",
  labels: { singular: "Caminhos", plural: "Caminhos" },
  admin: {
    group: "Página",
  },
  fields: [
    {
      name: "titulo",
      type: "text",
      label: "Título da seção (opcional)",
      admin: {
        description:
          "O que a lista abaixo oferece — \"Por onde seguir\", \"O que você precisa\". Em branco, os caminhos aparecem direto.",
      },
    },
    {
      name: "itens",
      type: "array",
      label: "Caminhos",
      labels: { singular: "Caminho", plural: "Caminhos" },
      minRows: 1,
      admin: {
        initCollapsed: false,
        description: `Um caminho por escolha real. ${AJUDA_DE_SUMICO}`,
      },
      validate: (valor: unknown) =>
        Array.isArray(valor) && valor.length > 0
          ? true
          : "Acrescente ao menos um caminho, ou apague o bloco. Um título sobre uma lista vazia é um bloco quebrado — e o bloco não vai ao ar assim.",
      fields: [
        {
          name: "rotulo",
          type: "text",
          required: true,
          label: "O que o visitante quer",
          admin: {
            description:
              "Escrito na voz de quem lê, não na da empresa — \"Quero comprar\", \"Baixar os catálogos\". Um rótulo que descreve o setor da Belmare em vez do desejo do visitante não é uma escolha, é um organograma.",
          },
        },
        {
          name: "apoio",
          type: "textarea",
          label: "O que há atrás (opcional)",
          admin: {
            description:
              "Uma linha dizendo o que acontece ao clicar. Em branco, o caminho fica só com o rótulo.",
          },
        },
        {
          name: "destino",
          type: "radio",
          required: true,
          defaultValue: "rota",
          label: "Para onde leva",
          /* ⚠️ **AQUI É O SEAM DE PRA-126, E ELE É UMA OPÇÃO A MAIS NESTE
             RÁDIO — não um bloco novo, não um formulário meio construído.**
             O caminho "quero revender" de `/contato` precisa de um formulário
             de proposta comercial; PRA-126 o constrói. Naquele dia entram três
             linhas e nada mais: um valor `"formulario"` neste rádio, um membro
             na união `Caminho` de `lib/paginas.ts`, e um caso no `switch` do
             renderizador — que hoje é exaustivo, então o `satisfies never` vira
             erro de build se alguém esquecer o terceiro.
             Até lá, "quero revender" é um caminho de WhatsApp com contexto
             próprio: funciona hoje, chega marcado de onde veio, e não promete
             formulário nenhum a quem clica. */
          options: [
            { value: "rota", label: "Uma página deste site" },
            { value: "whatsapp", label: "Conversa no WhatsApp" },
          ],
        },
        {
          name: "rota",
          type: "select",
          label: "A página",
          admin: {
            condition: (_dados, irmaos) => irmaos?.destino === "rota",
            description:
              "Só as páginas que já existem aparecem aqui. Uma rota que ainda não foi construída não é oferecida: um caminho para um 404 é pior do que caminho nenhum.",
          },
          options: DESTINOS_DE_CAMINHO.map((destino) => ({
            value: destino.href,
            label: destino.rotulo,
          })),
          validate: (valor: unknown, opcoes: { siblingData?: unknown }) => {
            const irmaos = opcoes.siblingData as { destino?: unknown } | undefined;
            if (irmaos?.destino !== "rota") return true;
            return typeof valor === "string" && valor !== ""
              ? true
              : "Escolha para qual página este caminho leva.";
          },
        },
        {
          name: "contexto",
          type: "text",
          label: "Como a conversa já começa",
          admin: {
            condition: (_dados, irmaos) => irmaos?.destino === "whatsapp",
            description:
              "A mensagem chega no WhatsApp já escrita — \"Oi! Vim pelo site: …\". Escreva a continuação na primeira pessoa: \"queria propor uma revenda\", \"queria os catálogos das representadas\". É a única qualificação de lead que o site tem, e ela custa zero.",
          },
          validate: (valor: unknown, opcoes: { siblingData?: unknown }) => {
            const irmaos = opcoes.siblingData as { destino?: unknown } | undefined;
            if (irmaos?.destino !== "whatsapp") return true;
            return typeof valor === "string" && valor.trim() !== ""
              ? true
              : "Escreva como a conversa já começa. Sem isso a mensagem chega em branco e ninguém sabe de que página o contato veio.";
          },
        },
      ],
    },
  ],
};

/**
 * **Ficha da Belmare** — o bloco sem campo de conteúdo, e é isso que ele é.
 *
 * ⚠️ **ELE EXISTE PARA QUE NINGUÉM REDIGITE O ENDEREÇO.** `/contato` precisa
 * mostrar endereço, telefones, e-mail, território e CNPJ — e todos os cinco já
 * são campo do cadastro da empresa desde PRA-122, lidos pelo rodapé em toda
 * rota do site. Sem este bloco, a única saída do operador seria escrevê-los
 * dentro de um bloco de texto: duas cópias do mesmo telefone, e a segunda é a
 * que ninguém lembra de corrigir. O que o operador ESCOLHE aqui é se a ficha
 * aparece e onde — o conteúdo dela é **gerado** do cadastro, sempre.
 *
 * ⚠️ Um campo em branco no cadastro faz a linha sumir da ficha, e o cadastro
 * inteiro vazio faz o bloco sumir. Menos página, nunca página quebrada.
 */
export const BlocoDeFicha: Block = {
  slug: "ficha",
  interfaceName: "BlocoDeFicha",
  labels: { singular: "Ficha da Belmare", plural: "Fichas da Belmare" },
  admin: {
    group: "Página",
  },
  fields: [
    {
      name: "titulo",
      type: "text",
      label: "Título da seção (opcional)",
      admin: {
        description:
          "Sobre a ficha — \"Onde encontrar\", \"A empresa\". Em branco, a ficha abre direto. ⚠️ Este é o único bloco sem conteúdo para preencher, e é de propósito: endereço, telefones, e-mail, Instagram, território e CNPJ saem do cadastro em \"O site › A Belmare\". Corrigir um telefone lá corrige aqui, no rodapé e em toda página que use esta ficha, de uma vez. O que estiver em branco no cadastro simplesmente não aparece.",
      },
    },
  ],
};

/**
 * **Ação de fecho** — a faixa de WhatsApp que o site inteiro já usa.
 *
 * Não é um bloco novo de desenho: é `components/acao-de-fecho.tsx`, o mesmo que
 * fecha `/catalogos` e a página de cada marca — largura total, corpo de h2, e o
 * único fio em tinta do sistema. Ele é bloco, e não parte fixa do rodapé de
 * toda página livre, porque a política de privacidade não deve terminar num
 * convite para conversar: um documento legal fecha em silêncio.
 */
export const BlocoDeFecho: Block = {
  slug: "fecho",
  interfaceName: "BlocoDeFecho",
  labels: { singular: "Ação de fecho", plural: "Ações de fecho" },
  admin: {
    group: "Página",
  },
  fields: [
    {
      name: "rotulo",
      type: "text",
      label: "O que a faixa diz (opcional)",
      admin: {
        description:
          "Em branco, escreve \"Falar pelo WhatsApp\". Troque quando a página pede algo mais específico — \"Pedir os catálogos num pedido só\".",
      },
    },
    {
      name: "contexto",
      type: "text",
      required: true,
      label: "Como a conversa já começa",
      admin: {
        description:
          "A continuação de \"Oi! Vim pelo site: …\", na primeira pessoa. ⚠️ Sem número de WhatsApp cadastrado a faixa inteira não é desenhada — um botão que é o elemento mais pesado da página e abre um contato inexistente é pior do que botão nenhum.",
      },
      validate: (valor: string | null | undefined) =>
        valor && valor.trim() !== ""
          ? true
          : "Escreva como a conversa já começa. Sem isso o contato chega sem dizer de que página veio, e essa marcação é a única qualificação de lead que o site tem.",
    },
  ],
};

/** A biblioteca inteira, na ordem em que o painel a oferece. */
export const BLOCOS_DE_PAGINA = [
  BlocoDeProsa,
  BlocoDeCaminhos,
  BlocoDeFicha,
  BlocoDeFecho,
];
