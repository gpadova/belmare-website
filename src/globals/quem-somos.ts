import type { GlobalConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { aoPublicarGlobal, VERSOES_DO_GLOBAL } from "@/globals/apoio";

/**
 * `/quem-somos`, dentro do painel — a prosa de cada seção, e só ela.
 *
 * ⚠️ **A SEQUÊNCIA DAS SEÇÕES CONTINUA FORA DO PAINEL, POR OUTRO MOTIVO QUE
 * ANTES.** A rota já foi um documento em ordem — o começo, o nome, o
 * território, o acervo, o interlocutor — e o argumento contra editar a ordem
 * era que ler fora de ordem era ler outra coisa. A página de agora é
 * institucional comum e nenhuma seção depende da anterior; o que a mantém em
 * código é o que ela RECUSA. A lista vinculante abaixo não sobrevive a um
 * construtor de blocos, porque uma biblioteca de blocos genérica oferece
 * exatamente foto de equipe, missão/visão/valores e contador animado. Ver
 * `app/(frontend)/quem-somos/page.tsx` e `collections/blocos.test.ts`.
 *
 * ⚠️ **A LISTA VINCULANTE DO QUE NUNCA ENTRA NESTA PÁGINA CONTINUA VALENDO, E
 * NENHUM CAMPO DAQUI EXISTE PARA CONTORNÁ-LA:** foto de equipe,
 * missão/visão/valores, contador animando até 26, prosa em superlativo, e
 * qualquer obra, cliente, prêmio ou depoimento que não exista. O que não existe
 * fica ausente — não é preenchido.
 *
 * ⚠️ **DOIS CAMPOS SAÍRAM NESTA REVISÃO, JUNTO COM O QUE ELES ESCREVIAM.**
 * `registro` legendava o ano de fundação em display, e `nome` era o parágrafo
 * do bloco que comparava o nome público anterior ao logotipo de hoje. Os dois
 * blocos saíram da página: em que ano a empresa abriu e como ela se chamava
 * antes não decidem conversa comercial nenhuma, e gastavam as duas primeiras
 * telas de uma página que precisa vender. No lugar deles entraram
 * `apresentacao` — o que a empresa é — e `atuacao` — o que ela faz por quem
 * chega, que é o que faltava na rota inteira.
 *
 * ⚠️ **A SEÇÃO DO TERRITÓRIO NÃO TEM CAMPO.** O parágrafo dela nomeia os três
 * estados, conta as representadas e nomeia a cidade da sede — as três coisas
 * saem do dado que DESENHA o mapa logo ao lado. Um campo de texto ali é como a
 * prosa passa a discordar do único gráfico da página.
 *
 * ⚠️ **UM CAMPO COMEÇA NO MEIO DA FRASE, E ISSO ESTÁ DITO NA AJUDA DELE.** A
 * seção das fábricas abre contando as representadas cadastradas, e essa
 * abertura é montada com o dado, para que a quinta marca não encontre a página
 * dizendo "quatro".
 */
export const QuemSomos: GlobalConfig = {
  slug: "quem-somos",
  label: "Página Quem somos",
  typescript: { interface: "QuemSomos" },
  admin: {
    group: "O site",
    description:
      "O texto dentro de cada seção de /quem-somos. Os títulos e a ordem das seções são desenho da página e não se editam aqui. Todo campo em branco faz o parágrafo desaparecer, nunca aparecer vazio.",
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    // Mesma lacuna fechada de `globals/empresa.ts`.
    update: estaAutenticado,
  },

  versions: VERSOES_DO_GLOBAL,
  hooks: { afterChange: aoPublicarGlobal({ colecao: "quem-somos" }) },

  fields: [
    {
      name: "apresentacao",
      type: "textarea",
      label: "Apresentação · Segundo parágrafo",
      admin: {
        description:
          "Sob o título \"A Belmare é uma representação comercial de mobiliário para área externa.\" ⚠️ O primeiro parágrafo é montado pelo site com o cadastro — a contagem de fábricas, a cidade da sede e o tempo de casa. Escreva aqui o que vem DEPOIS dele: o que a empresa faz de diferente, em uma ou duas frases. Nada de missão, valores ou superlativo, e nenhuma contagem digitada à mão.",
      },
    },
    {
      name: "atuacao",
      type: "textarea",
      label: "O que a Belmare faz · Parágrafo de abertura",
      admin: {
        description:
          "Sob o título \"O que a Belmare faz.\", antes da lista de representação, especificação, pedido e pós-venda. Diga em uma ou duas frases como a Belmare trabalha com a loja e com o escritório de arquitetura. ⚠️ Sem promessa de prazo, de exclusividade ou de condição comercial — a lista abaixo dele descreve trabalho, não serviço contratado.",
      },
    },
    {
      name: "acervo",
      type: "textarea",
      label: "As fábricas representadas · A partir da segunda frase",
      admin: {
        description:
          "⚠️ A primeira frase é montada pelo site contando as fábricas cadastradas — \"São quatro fábricas brasileiras.\" — e vira sozinha quando uma marca entra ou sai. Escreva aqui o que vem DEPOIS dela.",
      },
    },
    {
      name: "contato",
      type: "textarea",
      label: "Fale com a Belmare · Parágrafo do fecho",
      admin: {
        description:
          "Sob o título \"Fale com a Belmare.\" Diga o que acontece quando alguém chama. ⚠️ Nenhum e-mail de fábrica entra neste site, em lugar nenhum: um representante que se desintermedia do próprio funil está construindo o site do concorrente. Mas isso é regra de bastidor — não a explique ao visitante dentro do parágrafo.",
      },
    },
  ],
};
