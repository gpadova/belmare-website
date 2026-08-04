import { describe, expect, test } from "vitest";

import { MARCACAO_DE_MOCK } from "@/lib/acervo";
import { representadaDoPainel } from "@/lib/representadas-traducao";
import {
  catalogoPublicado,
  eixoDeFiltro,
  imagemDaRepresentada,
  imagemLargaDaRepresentada,
  pesoEmMB,
  secoesDaRepresentada,
} from "@/lib/representadas";
import type {
  Arquivo as ArquivoGerado,
  Imagen as ImagemGerada,
  Representada as RepresentadaGerada,
} from "@/payload-types";

/**
 * O mapper, sobre as formas que o Payload de fato gera.
 *
 * ⚠️ Os documentos abaixo são escritos à mão de propósito: é a única maneira de
 * exercitar os quatro estados do catálogo, inclusive os dois que só aparecem
 * quando alguém consulta na profundidade errada ou quando um upload chega sem
 * tamanho. Um banco daria os fáceis e esconderia justamente esses.
 */

const AGORA = "2026-07-31T00:00:00.000Z";

function documento(campos: Partial<RepresentadaGerada> = {}): RepresentadaGerada {
  return {
    id: 1,
    nome: "Trisol",
    slug: "trisol",
    resolve: "Ombrelones laterais e centrais",
    parte: "Sombra",
    fato: "Ferragem em inox 304, resistência a vento de 30 a 80 km/h",
    imagem: 1,
    imagemLarga: 2,
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function imagem(campos: Partial<ImagemGerada> = {}): ImagemGerada {
  return {
    id: 1,
    descricao: "Ombrelone lateral de área externa com lona técnica",
    mock: true,
    url: "/api/imagens/file/ombrelone.jpg",
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function arquivo(campos: Partial<ArquivoGerado> = {}): ArquivoGerado {
  return {
    id: 1,
    titulo: "Catálogo Trisol 2026",
    url: "https://arquivos.belmare.com.br/catalogo-trisol.pdf",
    /* Os 24 MB medidos em PRA-115, byte a byte. */
    filesize: 25_166_234,
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

describe("o catálogo, do painel para a página", () => {
  test("com o arquivo em mãos, a linha baixa o PDF e declara o peso do arquivo armazenado", () => {
    const [catalogo] = representadaDoPainel(
      documento({ catalogos: [{ titulo: "Catálogo", ano: 2026, arquivo: arquivo() }] }),
    ).catalogos!;

    expect(catalogoPublicado(catalogo)).toBe(true);
    if (!catalogoPublicado(catalogo)) return;

    expect(catalogo.arquivo).toBe(
      "https://arquivos.belmare.com.br/catalogo-trisol.pdf",
    );
    // O peso é medido, não digitado: 25 166 234 bytes são 24,0 MB.
    expect(pesoEmMB(catalogo.mb)).toBe("24,0");
  });

  test("sem arquivo, o documento continua declarado — a pedir, e sem peso nenhum", () => {
    // A Trisol publica a edição 2026 no site dela e a Belmare ainda não recebeu
    // o arquivo. A página tem que poder dizer isso em vez de escolher entre
    // linkar um arquivo que não existe e fingir que a fábrica não tem catálogo.
    const [catalogo] = representadaDoPainel(
      documento({ catalogos: [{ titulo: "Catálogo", ano: 2026 }] }),
    ).catalogos!;

    expect(catalogoPublicado(catalogo)).toBe(false);
    expect(catalogo.mb).toBeUndefined();
    expect(catalogo.ano).toBe(2026);
  });

  test("arquivo que voltou sem tamanho medido não vira download", () => {
    // O terceiro dos quatro estados gerados: o anexo existe e o site não
    // consegue medi-lo. Um link sem peso é a promessa que este site existe para
    // não quebrar — a linha vira pedido, não download mudo.
    const [catalogo] = representadaDoPainel(
      documento({
        catalogos: [{ titulo: "Catálogo", arquivo: arquivo({ filesize: null }) }],
      }),
    ).catalogos!;

    expect(catalogoPublicado(catalogo)).toBe(false);
    expect(catalogo.arquivo).toBeUndefined();
    expect(catalogo.mb).toBeUndefined();
  });

  test("arquivo que veio só como referência não vira download", () => {
    // O segundo estado: consulta em profundidade 0 devolve o identificador do
    // upload, e não o upload. Nem endereço nem peso existem ali.
    const [catalogo] = representadaDoPainel(
      documento({ catalogos: [{ titulo: "Catálogo", arquivo: 7 }] }),
    ).catalogos!;

    expect(catalogoPublicado(catalogo)).toBe(false);
    expect(catalogo.arquivo).toBeUndefined();
  });

  test("sem edição declarada, o ano fica ausente em vez de plausível", () => {
    // A Marê e a GDA publicam catálogo sem dizer de que ano. A linha escreve
    // "Edição não declarada" com todas as letras, e para isso o ano precisa
    // chegar ausente ao componente — não como um 2025 arredondado.
    const [catalogo] = representadaDoPainel(
      documento({ catalogos: [{ titulo: "Catálogo", ano: null }] }),
    ).catalogos!;

    expect(catalogo.ano).toBeUndefined();
    expect(Object.keys(catalogo)).toEqual(["titulo"]);
  });

  test("fábrica que não declara documento nenhum não ganha lista vazia", () => {
    // A Bux. Lista vazia atravessando o mapper vira título "Para levar." sobre
    // uma tabela sem linha.
    expect(representadaDoPainel(documento({ catalogos: [] })).catalogos).toBeUndefined();
  });
});

describe("a marca que declara pouco", () => {
  test("sem vocabulário, sem designers e sem catálogo, a marca mapeia limpa", () => {
    const representada = representadaDoPainel(
      documento({
        slug: "bux-garden",
        nome: "Bux Garden",
        designers: [],
        colecoes: [],
        vocabulario: { grupos: [] },
        catalogos: [],
      }),
    );

    expect(representada.designers).toBeUndefined();
    expect(representada.colecoes).toBeUndefined();
    expect(representada.vocabulario).toBeUndefined();
    expect(representada.catalogos).toBeUndefined();
  });

  test("as seções que a página abre são só as que têm dado — sem título órfão", () => {
    const representada = representadaDoPainel(
      documento({ vocabulario: { grupos: [] }, catalogos: [] }),
    );

    // Identificação e falar: as duas que não dependem de dado da fábrica.
    expect(secoesDaRepresentada(representada).map((s) => s.id)).toEqual([
      "identificacao",
      "falar",
    ]);
  });

  test("cidade não declarada chega ausente, para a página escrever que não sabe", () => {
    // A Trisol não publica cidade em fonte nenhuma — só o DDD 48. A página
    // escreve "Origem não declarada"; preencher "Florianópolis" porque o DDD
    // bate seria inventar.
    expect(representadaDoPainel(documento({ base: "" })).base).toBeUndefined();
    expect(representadaDoPainel(documento({ base: null })).base).toBeUndefined();
  });

  test("designer sem atribuição de coleção não ganha lista vazia", () => {
    // A GDA publica os dois designers e publica as cinco coleções, e não diz
    // quem assinou o quê. Ligar as duas coisas seria palpite com cara de ficha.
    const representada = representadaDoPainel(
      documento({
        designers: [{ nome: "Sérgio Matos", colecoes: [] }],
        colecoes: ["Esmeralda", "Campo Belo"],
      }),
    );

    expect(representada.designers).toEqual([{ nome: "Sérgio Matos" }]);
    expect(representada.colecoes).toEqual(["Esmeralda", "Campo Belo"]);
  });
});

describe("o vocabulário e o filtro que ele autoriza", () => {
  const grupos = [
    {
      nome: "Laterais",
      slug: "laterais",
      itens: [{ nome: "Zuri", nota: "Entrada" }],
    },
    { nome: "Centrais", slug: "centrais", itens: [{ nome: "Pub" }] },
  ];

  test("o eixo declarado pela fábrica é o que autoriza o recorte", () => {
    const representada = representadaDoPainel(
      documento({ vocabulario: { eixo: "Haste", grupos } }),
    );

    expect(representada.vocabulario?.eixo).toBe("Haste");
    expect(eixoDeFiltro(representada)).toBe("Haste");
  });

  test("lista sem eixo não oferece filtro nenhum", () => {
    // A Marê: dezenove categorias numa lista só. Um controle que reduz uma
    // lista a ela mesma é teatro de interface.
    const representada = representadaDoPainel(
      documento({
        vocabulario: {
          grupos: [
            { nome: "Categorias", slug: "todas", itens: [{ nome: "Sofás" }] },
          ],
        },
      }),
    );

    expect(representada.vocabulario?.eixo).toBeUndefined();
    expect(eixoDeFiltro(representada)).toBeUndefined();
  });

  test("eixo com um grupo só também não é filtro", () => {
    const representada = representadaDoPainel(
      documento({ vocabulario: { eixo: "Haste", grupos: [grupos[0]] } }),
    );

    expect(eixoDeFiltro(representada)).toBeUndefined();
  });

  test("a nota da categoria só existe onde a fábrica a publica", () => {
    const representada = representadaDoPainel(
      documento({ vocabulario: { eixo: "Haste", grupos } }),
    );

    expect(representada.vocabulario?.grupos[1].itens[0]).toEqual({ nome: "Pub" });
  });

  test("grupo sem nenhuma categoria não vira subtítulo sobre grade vazia", () => {
    const representada = representadaDoPainel(
      documento({
        vocabulario: {
          eixo: "Haste",
          grupos: [...grupos, { nome: "Guarda-sóis", slug: "guarda-sois", itens: [] }],
        },
      }),
    );

    expect(representada.vocabulario?.grupos.map((g) => g.slug)).toEqual([
      "laterais",
      "centrais",
    ]);
  });

  test("a contagem da faixa conta categoria distinta, não a soma dos grupos", () => {
    // A GDA repete as mesmas categorias em externo e interno de propósito.
    const representada = representadaDoPainel(
      documento({
        vocabulario: {
          eixo: "Ambiente",
          grupos: [
            { nome: "Externo", slug: "externo", itens: [{ nome: "Sofás" }, { nome: "Mesas" }] },
            { nome: "Interno", slug: "interno", itens: [{ nome: "Sofás" }, { nome: "Mesas" }] },
          ],
        },
      }),
    );

    const secao = secoesDaRepresentada(representada).find(
      (s) => s.id === "vocabulario",
    );
    expect(secao?.contagem).toBe("2");
  });
});

describe("a fotografia que o painel entrega", () => {
  test("imagem marcada como referência chega ao componente já marcada", () => {
    const representada = representadaDoPainel(
      documento({
        imagem: imagem({ descricao: "Ombrelone lateral com lona técnica", mock: true }),
        imagemLarga: imagem({ id: 2, url: "/api/imagens/file/larga.jpg" }),
      }),
    );

    expect(imagemDaRepresentada(representada).alt).toBe(
      `Ombrelone lateral com lona técnica — ${MARCACAO_DE_MOCK}.`,
    );
    expect(imagemDaRepresentada(representada).src).toBe(
      "/api/imagens/file/ombrelone.jpg",
    );
  });

  test("o ponto focal clicado no painel vira o corte da vista larga", () => {
    const representada = representadaDoPainel(
      documento({
        imagemLarga: imagem({ id: 2, url: "/api/imagens/file/larga.jpg", focalX: 30, focalY: 50 }),
      }),
    );

    expect(imagemLargaDaRepresentada(representada).posicao).toBe("30% 50%");
  });

  test("sem foco declarado, nada é escrito no HTML — centro é o padrão do CSS", () => {
    const representada = representadaDoPainel(
      documento({ imagem: imagem({ focalX: null, focalY: null }) }),
    );

    expect(imagemDaRepresentada(representada).posicao).toBeUndefined();
  });

  test("fotografia que veio só como referência não vira imagem quebrada", () => {
    // Profundidade 0 outra vez: o upload volta como identificador. Melhor
    // ausente e tratada como tal do que um `src` com um número dentro.
    expect(representadaDoPainel(documento({ imagem: 3 })).imagem).toBeUndefined();
  });
});
