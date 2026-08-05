import type { GlobalConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { aoPublicarGlobal, VERSOES_DO_GLOBAL } from "@/globals/apoio";

/**
 * A home, dentro do painel — **um campo só, e a lista do que ficou de fora é o
 * conteúdo deste arquivo**.
 *
 * A home é abertura, as quatro marcas e duas portas. Nada mais, por decisão do
 * cliente, e essa contenção é o que separa esta home de qualquer site de
 * representante (ver `app/(frontend)/page.tsx`). Dentro dela, quase tudo é
 * argumento de desenho ou dado derivado — e o único vão de prosa institucional
 * genuína é o parágrafo que apresenta as fábricas.
 *
 * ⚠️ **O QUE NÃO ENTRA AQUI, E POR QUÊ:**
 *
 *   · **o h1 "Representação comercial de móveis para área externa."** —
 *     fixo. Quatro versões já caíram: "Quatro fábricas. Um interlocutor."
 *     (jargão de organograma, 30/07/2026), "Móveis para área externa"
 *     (descreve uma fábrica, e a Belmare é representação), "Sofá, mesa,
 *     espreguiçadeira e ombrelone." (prometia varejo numa empresa que não
 *     vende direto, 04/08/2026) e "A área externa inteira, para quem
 *     especifica e para quem revende." (promessa de posicionamento que não
 *     diz o ramo, 05/08/2026). Um campo de texto aqui é um convite para uma
 *     das quatro voltar numa tarde de edição. Trocar esse título é
 *     reposicionar a empresa, e reposicionamento é conversa, não edição.
 *   · **a linha de apoio da abertura** — ela é feita de dado: a lista das
 *     marcas e o tempo de casa saem do painel e do calendário, não de um campo
 *     (`components/abertura.tsx`).
 *   · **o nome e o texto das duas portas** — fixo por decisão 3 da spec. As
 *     duas têm que ter peso igual e a simetria "eu especifico / eu compro" é o
 *     argumento; um campo por porta é como uma delas vira maior que a outra.
 *   · **o título da galeria** — a frase é fixa e o número dentro dela é gerado
 *     ("O que cada uma das quatro fábricas faz." conta as representadas
 *     publicadas).
 *   · **o aviso de imagem de referência** — gerado da marcação de mock.
 */
export const Home: GlobalConfig = {
  slug: "home",
  label: "Página inicial",
  typescript: { interface: "Home" },
  admin: {
    group: "O site",
    description:
      "O texto editável da página inicial. O título grande, o nome das duas portas e a lista de marcas não estão aqui: os dois primeiros são decisão de desenho e a lista o site monta sozinho a partir das representadas cadastradas.",
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    // Mesma lacuna fechada de `globals/empresa.ts`: sem isto, escrever este
    // global não exigia sessão nenhuma.
    update: estaAutenticado,
  },

  versions: VERSOES_DO_GLOBAL,
  hooks: { afterChange: aoPublicarGlobal({ colecao: "home" }) },

  fields: [
    {
      name: "galeria",
      type: "textarea",
      label: "Parágrafo da seção das marcas",
      admin: {
        description:
          "O parágrafo logo abaixo de \"O que cada uma das quatro fábricas faz.\" — o título conta as marcas sozinho, então não repita o número nele. Em branco, o parágrafo desaparece e a seção abre direto nas fotografias, e isso é um resultado válido: cada fábrica já mostra a própria linha logo abaixo. ⚠️ Não escreva benefício aqui. \"Conforto\" e \"sombra\" dizem o que o cliente sente; quem lê esta página especifica e revende, e lê o que a fábrica faz. E não conte interlocutores — \"um interlocutor para as quatro\" já foi recusado duas vezes. ⚠️ Se uma quinta fábrica entrar, esta frase é sua para reescrever: o título vira sozinho, este texto não.",
      },
    },
  ],
};
