import type { CollectionConfig } from "payload";

import { estaAutenticado } from "@/collections/papeis";

/**
 * Os logotipos das fábricas representadas.
 *
 * ⚠️ **É UMA COLEÇÃO PRÓPRIA, E NÃO UM UPLOAD PARA `Imagens`.** A tentação é
 * óbvia — as duas guardam arquivo de imagem —, mas `Imagens` é o molde da
 * FOTOGRAFIA do site e carrega três coisas que um logotipo não pode receber:
 * `descricao` obrigatória, `mock` marcado por padrão e ponto focal. Um logotipo
 * que entrasse por lá sairia com o `alt` terminando em "imagem de referência", e
 * a marca registrada de outra empresa apresentada como geração de IA é
 * exatamente a mentira que aquela marcação existe para impedir. Ponto focal, no
 * mesmo movimento, é controle sem assunto: ninguém recorta um logotipo.
 *
 * ⚠️ **A COLEÇÃO NÃO TEM CAMPO DE TEXTO NENHUM, E ISSO É A DECISÃO.** O nome da
 * fábrica já existe em `Representada.nome`; digitá-lo outra vez aqui criaria uma
 * segunda fonte para o mesmo dado, e `CONTEXT.md` classifica nome de fábrica
 * como texto **Gerado** — "digitar um valor gerado é como o site passa a mentir
 * sozinho". Na página o logotipo é publicado com `alt=""`: o `h3` ao lado já
 * anuncia a fábrica, então repetir o nome no `alt` faria o leitor de tela dizer
 * "Marê Mobília" duas vezes seguidas. Marca ao lado do próprio nome escrito é
 * decorativa, e é assim que a WCAG a quer marcada.
 *
 * ⚠️ **SVG E PNG, E NADA MAIS.** SVG é o formato certo — um traço que não
 * desfoca em nenhuma densidade de tela, e alguns kilobytes. PNG entra porque o
 * levantamento de `PRODUCT.md` achou o melhor ativo web da GDA num raster de
 * 636 × 89: uma trava só-vetor deixaria o campo vazio e a seção com quatro
 * buracos até alguém responder um e-mail. JPG fica de fora porque logotipo
 * precisa de fundo transparente, e não existe JPG transparente.
 */
export const Logotipos: CollectionConfig = {
  slug: "logotipos",
  labels: { singular: "Logotipo", plural: "Logotipos" },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "mimeType", "updatedAt"],
    group: "Acervo",
    description:
      "As marcas das fábricas representadas, como a própria fábrica as desenhou. O site publica o arquivo exatamente como ele sobe — não recolore, não recorta e não redesenha. Peça sempre o vetor e a autorização de uso junto.",
  },
  access: {
    // O site público lê o logotipo sem sessão, como lê a fotografia.
    read: () => true,
    create: estaAutenticado,
    update: estaAutenticado,
    delete: estaAutenticado,
  },

  /* Histórico sem rascunho, igual a `Imagens` e pela mesma razão: uma
     representada lida em `depth: 1` popula este relacionamento, e um documento
     só-rascunho aí dentro reabriria a pergunta de visibilidade numa leitura
     aninhada, sem rota própria para testar o preview. Aqui o histórico ainda
     ganha um segundo uso: a fábrica muda de identidade e o arquivo anterior
     continua recuperável. */
  versions: true,

  upload: {
    mimeTypes: ["image/svg+xml", "image/png"],

    /* Só vale sem R2 configurado — com ele o Payload liga `disableLocalStorage`
       sozinho. `.uploads/` é ignorado pelo git. */
    staticDir: ".uploads/logotipos",

    /* ⚠️ Os três ficam desligados de propósito, e por dois motivos somados.
       O primeiro é o mesmo de `Imagens`: recorte e `imageSizes` exigem que o
       servidor tenha os bytes para passar no sharp, e `clientUploads` manda o
       arquivo do navegador direto para o bucket. O segundo é próprio daqui —
       nenhum dos três faz sentido sobre uma marca. Redimensionar um logotipo é
       trabalho do CSS sobre o arquivo original, que no caso do SVG é exato em
       qualquer tamanho. */
    crop: false,
    focalPoint: false,

    displayPreview: true,
  },

  /* Sem campos. Ver a nota acima: o único dado que um logotipo carrega é o
     próprio arquivo, e o nome da fábrica mora na Representada que o aponta. */
  fields: [],
};
