import type { GlobalConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";
import { aoPublicarGlobal, VERSOES_DO_GLOBAL } from "@/globals/apoio";

/**
 * `/quem-somos`, dentro do painel — a prosa de cada bloco numerado, e só ela.
 *
 * ⚠️ **A SEQUÊNCIA DOS BLOCOS É O ARGUMENTO DA PÁGINA, E ELA NÃO É EDITÁVEL.**
 * A rota conta uma história em ordem — o começo, o nome, o território
 * desenhado, o acervo de hoje, o interlocutor — e ler fora de ordem é ler outra
 * coisa. Por isso não existe aqui um array de blocos, nem um campo de título,
 * nem o número do bloco: só o texto DENTRO de cada um. Ver a espinha fixa em
 * `app/(frontend)/quem-somos/page.tsx` e a decisão 1 da spec.
 *
 * ⚠️ **O CAMPO `atividades` NÃO EXISTE MAIS, JUNTO COM O BLOCO QUE ELE
 * EXPLICAVA.** A tabela dos cinco CNAEs saiu da página: os códigos não dizem
 * nada a um arquiteto e dizem a coisa errada a um lojista, e a ajuda do campo
 * chegava a proibir interpretá-los — um bloco que ninguém podia explicar. Quem
 * quiser conferir o registro tem o CNPJ no rodapé. Ver
 * `components/quem-somos/registro-abertura.tsx` e `lib/registro.ts`.
 *
 * ⚠️ **A LISTA VINCULANTE DO QUE NUNCA ENTRA NESTA PÁGINA CONTINUA VALENDO, E
 * NENHUM CAMPO DAQUI EXISTE PARA CONTORNÁ-LA:** foto de equipe,
 * missão/visão/valores, contador animando até 26, prosa em superlativo, e
 * qualquer obra, cliente, prêmio ou depoimento que não exista. O que não existe
 * fica ausente — não é preenchido.
 *
 * ⚠️ **O BLOCO 03 NÃO TEM CAMPO.** O parágrafo dele nomeia os três estados,
 * conta as representadas e nomeia a cidade da sede — as três coisas saem do
 * dado que DESENHA a prancha logo ao lado. Um campo de texto ali é como a prosa
 * passa a discordar do único gráfico da página.
 *
 * ⚠️ **DOIS CAMPOS COMEÇAM NO MEIO DA FRASE, E ISSO ESTÁ DITO NA AJUDA DELES.**
 * O bloco 02 abre nomeando a razão social do cadastro e o bloco 04 abre
 * contando as fábricas; as duas aberturas são montadas com o dado, para que
 * trocar a razão social no painel não deixe a prosa nomeando a antiga, e para
 * que a quinta marca não encontre a página dizendo "quatro".
 */
export const QuemSomos: GlobalConfig = {
  slug: "quem-somos",
  label: "Página Quem somos",
  typescript: { interface: "QuemSomos" },
  admin: {
    group: "O site",
    description:
      "O texto dentro de cada bloco numerado de /quem-somos. Os números, os títulos e a ordem dos blocos são desenho da página e não se editam aqui. Todo campo em branco faz o parágrafo desaparecer, nunca aparecer vazio.",
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
      name: "registro",
      type: "textarea",
      label: "01 · Parágrafo de abertura",
      admin: {
        description:
          "Sob o título \"Começou com móvel de jardim.\" O ano, a cidade e o tempo de casa aparecem logo acima e saem do cadastro — não os repita aqui. Este parágrafo conta o que a empresa vendia no começo e o que ela vende hoje; nada de missão, valores ou superlativo.",
      },
    },
    {
      name: "nome",
      type: "textarea",
      label: "02 · Parágrafo sobre o nome anterior — a partir da segunda frase",
      admin: {
        description:
          "⚠️ A primeira frase deste parágrafo é montada pelo site — \"No papel, a empresa continua sendo …\" — com a razão social do cadastro, para que ela nunca discorde do painel. Escreva aqui o que vem DEPOIS dela.",
      },
    },
    {
      name: "acervo",
      type: "textarea",
      label: "04 · Parágrafo sobre o acervo — a partir da segunda frase",
      admin: {
        description:
          "⚠️ A primeira frase é montada pelo site contando as fábricas cadastradas — \"Quatro fábricas, quatro linhas.\" — e vira sozinha quando uma marca entra ou sai. Escreva aqui o que vem DEPOIS dela.",
      },
    },
    {
      name: "interlocutor",
      type: "textarea",
      label: "05 · Parágrafo do fecho",
      admin: {
        description:
          "Sob o título \"Fale com quem representa.\" Diga o que acontece quando alguém chama. ⚠️ Nenhum e-mail de fábrica entra neste site, em lugar nenhum: um representante que se desintermedia do próprio funil está construindo o site do concorrente. Mas isso é regra de bastidor — não a explique ao visitante dentro do parágrafo.",
      },
    },
  ],
};
