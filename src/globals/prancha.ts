import type { GlobalConfig } from "payload";

import { aoPublicarGlobal, VERSOES_DO_GLOBAL } from "@/globals/apoio";
import { identidadeDoRelacionamento } from "@/collections/apoio";
import { estaAutenticado } from "@/collections/papeis";
import { CHAMADA_EM_BRANCO } from "@/lib/prancha-area-externa";

/**
 * A PRANCHA 02 de `/representadas`, dentro do painel — a fotografia da área
 * externa e as chamadas que apontam para os objetos dela.
 *
 * ⚠️ **ESTE GLOBAL EXISTE POR CAUSA DE UM MODO DE FALHA, NÃO POR SIMETRIA COM
 * OS OUTROS TRÊS.** As coordenadas das chamadas eram porcentagens MEDIDAS À MÃO
 * contra uma fotografia específica (`lib/prancha-area-externa.ts`). Trocar a
 * fotografia sem recalcular as quatro deixava quatro linhas numeradas apontando
 * para deck vazio — e não quebrava nada visivelmente, então ninguém seria
 * avisado. Hoje TODA imagem do site é mock; quando a fotografia real chegar, ela
 * chega de uma vez, e é exatamente o dia em que o painel precisa funcionar.
 *
 * Um operador não tem como saber que o sofá está a 19% por 70%. Por isso o
 * campo do meio não é um número: é a fotografia com os pinos, para arrastar.
 *
 * ⚠️ **A CHAMADA NÃO TEM CAMPO DE TEXTO, E ISSO É O ARGUMENTO DA PÁGINA.** O
 * rótulo sai de `Representada.parte` — MÓVEL, ESTRUTURA, ESTOFADO, SOMBRA. Um
 * campo de texto aqui seria a segunda cópia da mesma palavra (a primeira mora
 * na representada), e é assim que uma seta acaba escrita com o nome de uma
 * fábrica: a cena é gerada, e uma seta com o nome da Trisol afirma que aquele
 * ombrelone é produto da Trisol. Nomear a função é verdade; nomear a peça é
 * inventar acervo com cara de ficha técnica.
 *
 * ⚠️ **A PRANCHA DO TERRITÓRIO DE `/quem-somos` NÃO ESTÁ AQUI E NÃO ENTRA.** É
 * malha oficial do IBGE, reprojetada e simplificada: regerada da fonte quando
 * muda, nunca editada à mão, nunca no CMS (decisão 4 da spec). As duas pranchas
 * compartilham a gramática de desenho e nada mais — uma é dado geográfico
 * oficial, a outra é uma fotografia com quatro setas.
 */
export const Prancha: GlobalConfig = {
  slug: "prancha",
  label: "Prancha da área externa",
  typescript: { interface: "Prancha" },
  admin: {
    group: "O site",
    description:
      "A fotografia de /representadas e as chamadas numeradas que apontam para os objetos dela. Suba a fotografia, arraste cada pino até o lugar e publique — nenhum número precisa ser calculado.",
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    // Mesma lacuna fechada de `globals/empresa.ts`.
    update: estaAutenticado,
  },

  versions: VERSOES_DO_GLOBAL,
  hooks: { afterChange: aoPublicarGlobal({ colecao: "prancha" }) },

  fields: [
    {
      name: "foto",
      type: "upload",
      relationTo: "imagens",
      required: true,
      label: "Fotografia da área externa",
      admin: {
        description:
          "A vista de conjunto que a prancha chaveia: uma área externa inteira com os objetos SEPARADOS no quadro, cada um com ar em volta para receber uma chamada. ⚠️ Numa cena em que o ombrelone cobre o sofá, duas chamadas apontam para o mesmo ponto e a prancha deixa de ser conferível. Ao trocar a fotografia, confira os pinos abaixo: eles continuam onde estavam, e o que estava embaixo deles mudou.",
      },
      validate: (valor: unknown) =>
        identidadeDoRelacionamento(valor) !== undefined
          ? true
          : "Escolha a fotografia da área externa. Sem ela não há prancha — a página desenha a fotografia anterior, que está no código.",
    },

    /**
     * ⚠️ **O CAMPO QUE É A RAZÃO DESTE TICKET.** Não guarda valor nenhum: é uma
     * vista sobre `chamadas` logo abaixo, onde o operador arrasta os pinos sobre
     * a fotografia de verdade, no aspecto de verdade dela, e vê a linha de
     * chamada que a página vai desenhar. Os números continuam existindo,
     * visíveis e digitáveis, no array abaixo — arrastar é o caminho confortável,
     * não o único. Ver `components/painel/campo-de-pinos.tsx`.
     */
    {
      name: "pinos",
      type: "ui",
      admin: {
        components: {
          Field: "/components/painel/campo-de-pinos#CampoDePinos",
        },
      },
    },

    {
      name: "chamadas",
      type: "array",
      label: "Chamadas",
      labels: { singular: "Chamada", plural: "Chamadas" },
      admin: {
        description:
          "Uma chamada por fábrica identificada na cena. A ordem aqui é a numeração do desenho e a ordem da legenda — 01, 02, 03… O número não se digita: ele é a posição na lista.",
        initCollapsed: false,
      },

      /* ⚠️ Recusa a lista vazia, e a recusa só morde ao PUBLICAR: rascunho
         atravessa sem validação, então uma troca de fotografia pode ficar
         salva pela metade entre duas sessões. Publicar uma prancha sem chamada
         nenhuma seria publicar uma fotografia de deck sob um título que nomeia
         quatro objetos — a página perde o argumento inteiro, em silêncio. */
      validate: (valor: unknown) =>
        Array.isArray(valor) && valor.length > 0
          ? true
          : "Uma prancha sem chamada nenhuma é só uma fotografia: acrescente ao menos uma antes de publicar. Para guardar o trabalho pela metade, salve como rascunho.",

      fields: [
        {
          name: "representada",
          type: "relationship",
          relationTo: "representadas",
          required: true,
          hasMany: false,
          label: "Representada",
          admin: {
            description:
              "A fábrica que resolve esta parte da cena. O texto da chamada NÃO se escreve aqui: ele é a palavra que a representada já declara em \"A parte que ela resolve\" — móvel, estrutura, estofado, sombra. Duas marcas que dividem a mesma função entram como duas chamadas apontando para o mesmo objeto.",
          },
          validate: (valor: unknown) =>
            identidadeDoRelacionamento(valor) !== undefined
              ? true
              : "Escolha a representada desta chamada. Sem ela a linha aponta para um objeto que a legenda não sabe nomear, e a chamada não é desenhada.",
        },
        {
          type: "row",
          fields: [
            {
              name: "rotuloX",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              defaultValue: CHAMADA_EM_BRANCO.rotulo.x,
              label: "Etiqueta · da esquerda (%)",
              admin: {
                width: "50%",
                step: 0.1,
                description: "0 é a borda esquerda da fotografia, 100 a direita.",
              },
            },
            {
              name: "rotuloY",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              defaultValue: CHAMADA_EM_BRANCO.rotulo.y,
              label: "Etiqueta · do topo (%)",
              admin: {
                width: "50%",
                step: 0.1,
                description: "0 é o topo da fotografia, 100 o pé.",
              },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "alvoX",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              defaultValue: CHAMADA_EM_BRANCO.alvo.x,
              label: "Objeto · da esquerda (%)",
              admin: {
                width: "50%",
                step: 0.1,
                description: "Onde a linha encosta no objeto, não onde o número fica.",
              },
            },
            {
              name: "alvoY",
              type: "number",
              required: true,
              min: 0,
              max: 100,
              defaultValue: CHAMADA_EM_BRANCO.alvo.y,
              label: "Objeto · do topo (%)",
              admin: {
                width: "50%",
                step: 0.1,
                description: "Idem, no eixo vertical.",
              },
            },
          ],
        },
      ],
    },
  ],
};
