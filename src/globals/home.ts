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
 *   · **o h1 "A área externa inteira, para quem especifica e para quem
 *     revende."** — fixo. Três versões já caíram: "Quatro fábricas. Um
 *     interlocutor." (jargão de organograma, 30/07/2026), "Móveis para área
 *     externa" (descreve uma fábrica, e a Belmare é representação) e "Sofá,
 *     mesa, espreguiçadeira e ombrelone." (prometia varejo numa empresa que
 *     não vende direto, 04/08/2026). Um campo de texto aqui é um convite para
 *     uma das três voltar numa tarde de edição. Trocar esse título é
 *     reposicionar a empresa, e reposicionamento é conversa, não edição.
 *   · **a linha de apoio da abertura** — ela é feita de dado: a lista das
 *     marcas, o território e o tempo de casa saem do painel e do calendário,
 *     não de um campo (`components/abertura.tsx`).
 *   · **o nome e o texto das duas portas** — fixo por decisão 3 da spec. As
 *     duas têm que ter peso igual e a simetria "eu especifico / eu compro" é o
 *     argumento; um campo por porta é como uma delas vira maior que a outra.
 *   · **o título da galeria** — a frase é fixa e o número dentro dela é gerado
 *     ("As quatro fábricas…" conta as representadas publicadas).
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
          "O parágrafo logo abaixo de \"As quatro fábricas que a Belmare representa.\" — o título conta as marcas sozinho, então não repita o número nele. Em branco, o parágrafo desaparece e a seção abre direto nas fotografias. ⚠️ Se uma quinta fábrica entrar, esta frase é sua para reescrever: o título vira sozinho, este texto não.",
      },
    },
  ],
};
