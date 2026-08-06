import { describe, expect, test } from "vitest";

import {
  catalogosDoSite,
  marcasComCatalogo,
  pesoEmMB,
  secoesDaRepresentada,
  type Catalogo,
  type Representada,
} from "@/lib/representadas";

describe("pesoEmMB", () => {
  test("peso inteiro ganha a casa decimal que faltava, para a coluna não desalinhar", () => {
    expect(pesoEmMB(24)).toBe("24,0");
  });

  test("peso com mais dígitos é arredondado para uma casa, não truncado a esmo", () => {
    expect(pesoEmMB(8.44)).toBe("8,4");
  });
});

/** Um catálogo é sempre um arquivo — o tipo não admite outra coisa desde
 *  05/08/2026, e é essa invariante que a lista abaixo exercita. */
function catalogo(campos: Partial<Catalogo> = {}): Catalogo {
  return {
    titulo: "Catálogo",
    arquivo: "https://arquivos.belmare.com.br/catalogo.pdf",
    mb: 8.4,
    ...campos,
  };
}

function marca(
  slug: string,
  nome: string,
  catalogos?: Catalogo[],
): Representada {
  return {
    slug,
    nome,
    resolve: "Mobiliário de área externa",
    parte: "Móvel",
    fato: "Um fato verificável",
    ...(catalogos ? { catalogos } : {}),
  };
}

describe("catalogosDoSite", () => {
  test("a fábrica é a chave: os catálogos de cada uma saem juntos, na ordem do painel", () => {
    /* A ordem das marcas é a que chegou (campo `ordem`), a mesma da galeria da
       home. Uma segunda ordenação por nome aqui faria a mesma marca aparecer em
       terceiro num lugar e em primeiro no outro. */
    const lista = catalogosDoSite([
      marca("mare-mobilia", "Marê Mobília", [
        catalogo({ titulo: "Linha Ânima" }),
        catalogo({ titulo: "Catálogo geral" }),
      ]),
      marca("trisol", "Trisol", [catalogo({ titulo: "Catálogo" })]),
    ]);

    expect(lista.map((c) => c.marca.slug)).toEqual([
      "mare-mobilia",
      "mare-mobilia",
      "trisol",
    ]);
  });

  test("dentro da fábrica, a edição mais recente vem primeiro", () => {
    const lista = catalogosDoSite([
      marca("trisol", "Trisol", [
        catalogo({ titulo: "Antigo", ano: 2024 }),
        catalogo({ titulo: "Novo", ano: 2026 }),
      ]),
    ]);

    expect(lista.map((c) => c.catalogo.titulo)).toEqual(["Novo", "Antigo"]);
  });

  test("catálogo sem edição declarada vai para o fim da fábrica, não para o começo", () => {
    /* Um `?? 0` numa comparação decrescente o colocaria em primeiro, que é o
       lugar onde ele menos ajuda a decidir. */
    const lista = catalogosDoSite([
      marca("trisol", "Trisol", [
        catalogo({ titulo: "Sem ano" }),
        catalogo({ titulo: "Com ano", ano: 2026 }),
      ]),
    ]);

    expect(lista.map((c) => c.catalogo.titulo)).toEqual(["Com ano", "Sem ano"]);
  });

  test("dois catálogos sem edição desempatam pelo título, para a lista não reordenar sozinha", () => {
    const lista = catalogosDoSite([
      marca("mare-mobilia", "Marê Mobília", [
        catalogo({ titulo: "Zoe" }),
        catalogo({ titulo: "Ânima" }),
      ]),
    ]);

    expect(lista.map((c) => c.catalogo.titulo)).toEqual(["Ânima", "Zoe"]);
  });

  test("a marca atravessa magra: só slug e nome, e nunca a representada inteira", () => {
    /* A lista é serializada para o cliente, que filtra no navegador. Mandar a
       `Representada` inteira levaria fotografia, ficha, designers e vocabulário
       junto — dezenas de KB por linha para desenhar um nome. */
    const [entrada] = catalogosDoSite([
      marca("trisol", "Trisol", [catalogo()]),
    ]);

    expect(Object.keys(entrada.marca).sort()).toEqual(["nome", "slug"]);
  });

  test("fábrica sem catálogo não produz entrada nenhuma", () => {
    // A Bux. Numa página de catálogos, uma fábrica sem catálogo não é assunto.
    expect(catalogosDoSite([marca("bux-garden", "Bux Garden")])).toEqual([]);
  });
});

describe("marcasComCatalogo", () => {
  test("o filtro só oferece fábrica que tem catálogo, e conta quantos", () => {
    /* As opções derivam da lista já montada: um filtro que oferece uma fábrica
       sem catálogo é um controle que leva a uma tela vazia. */
    const lista = catalogosDoSite([
      marca("mare-mobilia", "Marê Mobília", [catalogo(), catalogo()]),
      marca("bux-garden", "Bux Garden"),
      marca("trisol", "Trisol", [catalogo()]),
    ]);

    expect(marcasComCatalogo(lista)).toEqual([
      { slug: "mare-mobilia", nome: "Marê Mobília", quantidade: 2 },
      { slug: "trisol", nome: "Trisol", quantidade: 1 },
    ]);
  });

  test("lista vazia não oferece recorte nenhum", () => {
    expect(marcasComCatalogo([])).toEqual([]);
  });
});

describe("a seção de catálogo na página da marca", () => {
  test("com um catálogo, a faixa declara o peso — é o custo do clique", () => {
    const secao = secoesDaRepresentada(
      marca("trisol", "Trisol", [catalogo({ mb: 24 })]),
    ).find((s) => s.id === "catalogos");

    expect(secao?.rotulo).toBe("Catálogo");
    expect(secao?.contagem).toBe("PDF 24,0 MB");
  });

  test("com vários, a quantidade volta a ser a informação e o rótulo vai ao plural", () => {
    /* "PDF 24,0 MB" ao lado de um rótulo no plural anunciaria o custo de um dos
       seis e esconderia os outros cinco. */
    const secao = secoesDaRepresentada(
      marca("mare-mobilia", "Marê Mobília", [
        catalogo(),
        catalogo(),
        catalogo(),
      ]),
    ).find((s) => s.id === "catalogos");

    expect(secao?.rotulo).toBe("Catálogos");
    expect(secao?.contagem).toBe("3");
  });

  test("sem catálogo, a seção não existe — nem numerada, nem vazia", () => {
    expect(
      secoesDaRepresentada(marca("bux-garden", "Bux Garden")).map((s) => s.id),
    ).toEqual(["identificacao", "falar"]);
  });
});
