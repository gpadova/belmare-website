import type { GlobalConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { aoPublicarGlobal, VERSOES_DO_GLOBAL } from "@/globals/apoio";
import { AJUDA_DOS_MARCADORES } from "@/lib/marcadores";

/**
 * `/quem-somos`, dentro do painel — a página inteira, título por título.
 *
 * ⚠️ **NENHUM TEXTO DESTA ROTA MORA MAIS EM CÓDIGO.** Até 05/08/2026 os títulos
 * das seções eram fixos e três parágrafos eram metade fixos: o site montava a
 * primeira oração contando o dado e o operador escrevia da segunda em diante.
 * O que mantinha os títulos em código era a lista do que a página recusa
 * publicar — e a lista continua valendo (ela está abaixo, e está na ajuda dos
 * campos), mas ela nunca precisou de um campo trancado para valer. Uma página
 * institucional em que o dono do negócio não consegue trocar o próprio título
 * sem pedir deploy é uma página que envelhece esperando a agenda de outra
 * pessoa.
 *
 * ⚠️ **O QUE CONTINUA SENDO CONTADO, E NÃO DIGITADO:** o tempo de casa, quantas
 * fábricas estão publicadas, a cidade da sede e a lista dos estados. Eles
 * entram na prosa por marcador — `{anos}`, `{fabricas}`, `{cidade}`,
 * `{estados}`, `{quantosEstados}` — e o site troca cada um pelo dado de hoje a
 * cada renderização. Ver `lib/marcadores.ts`: a frase é do operador, o número
 * continua acompanhando o cadastro. Digitar "quatro" à mão dentro de um destes
 * campos é como a página amanhece dizendo quatro no dia da quinta marca.
 *
 * ⚠️ **A LISTA VINCULANTE DO QUE NUNCA ENTRA NESTA PÁGINA CONTINUA VALENDO, E
 * NENHUM CAMPO DAQUI EXISTE PARA CONTORNÁ-LA:** foto de equipe,
 * missão/visão/valores, contador animado, prosa em superlativo, e qualquer
 * obra, cliente, prêmio ou depoimento que não exista. O que não existe fica
 * ausente — não é preenchido.
 *
 * ⚠️ **A ORDEM DAS SEÇÕES CONTINUA FORA DO PAINEL, E É A ÚNICA COISA QUE
 * CONTINUA.** Não é apego: um construtor de blocos genérico oferece exatamente
 * foto de equipe, missão/visão/valores e contador animado, que é a lista acima
 * inteira, item por item. Ver `app/(frontend)/quem-somos/page.tsx` e
 * `collections/blocos.test.ts`.
 *
 * ⚠️ **TÍTULO EM BRANCO CAI NO PADRÃO; PARÁGRAFO EM BRANCO SOME.** São regras
 * diferentes de propósito. Uma seção sem parágrafo é uma seção mais curta; uma
 * seção sem título é markup quebrado, com um `h2` vazio que leitor de tela
 * anuncia como cabeçalho sem nome. Os padrões estão em
 * `lib/quem-somos-consulta.ts`.
 */
export const QuemSomos: GlobalConfig = {
  slug: "quem-somos",
  label: "Página Quem somos",
  typescript: { interface: "QuemSomos" },
  admin: {
    group: "O site",
    description:
      "Todo o texto de /quem-somos, na ordem em que ele aparece na página. Título em branco volta para o texto padrão; parágrafo em branco faz o parágrafo desaparecer, nunca aparecer vazio. A ordem das seções é desenho da página e não se edita aqui.",
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    // Mesma lacuna fechada de `globals/empresa.ts`.
    update: estaAutenticado,
  },

  versions: VERSOES_DO_GLOBAL,
  hooks: { afterChange: aoPublicarGlobal({ colecao: "quem-somos" }) },

  /* Os campos são PLANOS, e o agrupamento é só visual (`collapsible`). Um
     `group` de verdade renomearia toda coluna do banco — `apresentacao` viraria
     `apresentacao_texto` — e uma migração de rename existe para trocar de nome,
     não para arrumar a aparência do formulário. O painel fica organizado do
     mesmo jeito e nenhum texto publicado corre risco. */
  fields: [
    {
      type: "collapsible",
      label: "1 · Apresentação",
      admin: { initCollapsed: false },
      fields: [
        {
          name: "titulo",
          type: "text",
          label: "Título da página (o h1)",
          admin: {
            description:
              "A primeira linha que o visitante lê. Diga em quem a Belmare atende e onde. ⚠️ Não repita o título da home (\"Representação comercial de mobiliário de área externa.\"): quem chega aqui já leu aquilo duas rolagens atrás. Em branco, volta para o texto padrão.",
          },
        },
        {
          name: "apresentacao",
          type: "textarea",
          label: "Parágrafo de apresentação",
          admin: {
            description: `Uma ou duas frases sobre o que a empresa é e há quanto tempo. ⚠️ Sem missão, valores ou superlativo. ${AJUDA_DOS_MARCADORES}`,
          },
        },
      ],
    },

    {
      type: "collapsible",
      label: "2 · O que a Belmare faz",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "atuacaoTitulo",
          type: "text",
          label: "Título da seção",
          admin: { description: "Em branco, volta para o texto padrão." },
        },
        {
          name: "atuacao",
          type: "textarea",
          label: "Parágrafo de abertura",
          admin: {
            description: `Em uma ou duas frases, como a Belmare trabalha com a loja e com o escritório de arquitetura. ⚠️ Sem promessa de prazo, de exclusividade ou de condição comercial. ${AJUDA_DOS_MARCADORES}`,
          },
        },
        {
          name: "atuacaoLinhas",
          type: "array",
          label: "As etapas",
          labels: { singular: "Etapa", plural: "Etapas" },
          admin: {
            description:
              "A lista sob o parágrafo, uma linha por etapa do trabalho. ⚠️ Cada linha descreve o que a empresa FAZ, não o que o cliente ganha — \"acompanha o pedido junto com a loja\" é trabalho, \"atendimento diferenciado\" é autoelogio. Sem nenhuma etapa, a lista inteira desaparece e a seção fica só com o parágrafo.",
          },
          fields: [
            {
              name: "rotulo",
              type: "text",
              required: true,
              label: "Etapa",
              admin: {
                description:
                  "Uma ou duas palavras, na coluna da esquerda — \"Representação\", \"Especificação\", \"Pedido\", \"Pós-venda\".",
              },
            },
            {
              name: "texto",
              type: "textarea",
              required: true,
              label: "O que acontece nessa etapa",
              admin: { description: AJUDA_DOS_MARCADORES },
            },
          ],
        },
      ],
    },

    {
      type: "collapsible",
      label: "3 · As fábricas representadas",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "acervoTitulo",
          type: "text",
          label: "Título da seção",
          admin: { description: "Em branco, volta para o texto padrão." },
        },
        {
          name: "acervo",
          type: "textarea",
          label: "Parágrafo acima da lista",
          admin: {
            description: `A lista das fábricas é montada sozinha logo abaixo deste parágrafo, com o que está cadastrado em Representadas. ⚠️ Nada aqui pode descrever o contrato das fábricas — exclusividade é termo comercial de terceiro. ${AJUDA_DOS_MARCADORES}`,
          },
        },
      ],
    },

    {
      type: "collapsible",
      label: "4 · Onde a Belmare atende",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "territorioTitulo",
          type: "text",
          label: "Título da seção",
          admin: { description: "Em branco, volta para o texto padrão." },
        },
        {
          name: "territorio",
          type: "textarea",
          label: "Parágrafo ao lado do mapa",
          admin: {
            description: `⚠️ O mapa ao lado é a malha oficial do IBGE e desenha exatamente três estados; ele não se edita no painel. Escreva o território com {estados} e {quantosEstados}, nunca com os nomes digitados — é assim que a prosa não passa a dizer "quatro estados" ao lado de um desenho com três. ${AJUDA_DOS_MARCADORES}`,
          },
        },
      ],
    },

    {
      type: "collapsible",
      label: "5 · Projetos entregues",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "projetosTitulo",
          type: "text",
          label: "Título da seção",
          admin: {
            description:
              "⚠️ A seção inteira só aparece com três projetos publicados ou mais — com menos, nem o título nem o parágrafo vão ao ar. Em branco, volta para o texto padrão.",
          },
        },
        {
          name: "projetos",
          type: "textarea",
          label: "Parágrafo acima das fotos",
          admin: {
            description: `O que a lista de fotos abaixo mostra. ⚠️ Toda obra citada tem que existir e ter sido de fato entregue: as fotos e os créditos vêm de Projetos, e o que não existe fica ausente. ${AJUDA_DOS_MARCADORES}`,
          },
        },
      ],
    },

    {
      type: "collapsible",
      label: "6 · Fale com a Belmare",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "contatoTitulo",
          type: "text",
          label: "Título da seção",
          admin: { description: "Em branco, volta para o texto padrão." },
        },
        {
          name: "contato",
          type: "textarea",
          label: "Parágrafo do fecho",
          admin: {
            description: `Diga o que acontece quando alguém chama. ⚠️ Nenhum e-mail de fábrica entra neste site, em lugar nenhum: um representante que se desintermedia do próprio funil está construindo o site do concorrente. Mas isso é regra de bastidor — não a explique ao visitante dentro do parágrafo. ${AJUDA_DOS_MARCADORES}`,
          },
        },
        {
          name: "contatoLegenda",
          type: "text",
          label: "Legenda da fotografia",
          admin: {
            description:
              "A linha em maiúsculas sob a foto larga do fecho. ⚠️ Ela existe porque a imagem é de banco e cai no lugar onde um arquiteto espera obra entregue — sem a legenda, a foto vira portfólio de trabalho que não foi feito. Em branco, volta para o texto padrão em vez de sumir; se a fotografia um dia for de uma obra real e creditada, a legenda muda aqui.",
          },
        },
      ],
    },
  ],
};
