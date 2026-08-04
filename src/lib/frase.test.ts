import { describe, expect, test } from "vitest";

import { comInicialMaiuscula, emLista, porExtenso } from "@/lib/frase";

/**
 * A promessa aqui é a do critério de aceite de PRA-122: a lista de
 * representadas do parágrafo de abertura muda quando uma marca entra ou é
 * reordenada. A leitura do painel é testada na suíte de integração; o que se
 * afirma neste arquivo é que a JUNÇÃO acompanha a lista sem ninguém reescrever
 * a frase.
 */

describe("a lista em prosa", () => {
  test("põe a conjunção antes do último item, como se escreve", () => {
    expect(emLista(["Marê Mobília", "GDA Móveis", "Bux Garden", "Trisol"])).toBe(
      "Marê Mobília, GDA Móveis, Bux Garden e Trisol",
    );
  });

  test("acompanha a ordem em que as marcas chegam — reordenar reescreve a frase", () => {
    // A ordem é decisão de apresentação da Belmare (campo `ordem` da coleção).
    // A frase não tem ordem própria: ela segue a lista.
    expect(emLista(["Trisol", "Bux Garden"])).toBe("Trisol e Bux Garden");
    expect(emLista(["Bux Garden", "Trisol"])).toBe("Bux Garden e Trisol");
  });

  test("uma marca só não ganha conjunção, e nenhuma não ganha frase", () => {
    expect(emLista(["Trisol"])).toBe("Trisol");
    expect(emLista([])).toBe("");
  });

  test("uma quinta marca entra sem ninguém editar texto nenhum", () => {
    expect(
      emLista(["Marê Mobília", "GDA Móveis", "Bux Garden", "Trisol", "Nova"]),
    ).toBe("Marê Mobília, GDA Móveis, Bux Garden, Trisol e Nova");
  });
});

describe("o número por extenso", () => {
  test("escreve a contagem como prosa, no gênero certo", () => {
    // Só um e dois variam — "quatro fábricas" e "quatro modelos" são a mesma
    // palavra, "uma fábrica" e "um modelo" não.
    expect(porExtenso(4)).toBe("quatro");
    expect(porExtenso(1)).toBe("uma");
    expect(porExtenso(2)).toBe("duas");
    expect(porExtenso(1, "m")).toBe("um");
    expect(porExtenso(3, "m")).toBe("três");
  });

  test("acima de dez devolve o algarismo — o aviso de que a frase precisa de gente", () => {
    // O projeto já decidiu contra algarismo em texto corrido. Ele é o
    // FALLBACK visível, não o padrão: com dezessete marcas a frase tem que ser
    // reescrita, e um "17" na tela é o sinal de que chegou a hora.
    expect(porExtenso(17)).toBe("17");
  });
});

describe("a inicial maiúscula", () => {
  test("levanta só a primeira letra, e não cada palavra", () => {
    expect(comInicialMaiuscula("quatro")).toBe("Quatro");
    expect(comInicialMaiuscula("três estados")).toBe("Três estados");
  });
});
