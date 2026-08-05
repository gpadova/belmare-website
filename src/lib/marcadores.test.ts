import { describe, expect, test } from "vitest";

import { AJUDA_DOS_MARCADORES, MARCADORES, preencher, type Valores } from "@/lib/marcadores";

/**
 * A promessa deste arquivo é a que tornou `/quem-somos` editável por inteiro
 * sem que a página passe a mentir: **a frase é do operador, o número continua
 * sendo contado.** O que se afirma aqui é a troca — que ela acompanha o dado,
 * que ela recusa publicar frase truncada, e que erro de digitação do operador
 * aparece em vez de sumir.
 */

const HOJE: Valores = {
  anos: "27",
  fabricas: "quatro",
  cidade: "Florianópolis",
  estados: "Paraná, Santa Catarina e Rio Grande do Sul",
  quantosEstados: "três",
};

describe("a troca dos marcadores", () => {
  test("põe o dado de hoje dentro da frase que o operador escreveu", () => {
    expect(
      preencher(
        "São {anos} anos de atuação no mercado de móveis, com ênfase em área externa.",
        HOJE,
      ),
    ).toBe("São 27 anos de atuação no mercado de móveis, com ênfase em área externa.");
  });

  test("troca o mesmo marcador quantas vezes ele aparecer", () => {
    expect(preencher("{fabricas} fábricas, {fabricas} linhas.", HOJE)).toBe(
      "quatro fábricas, quatro linhas.",
    );
  });

  test("a quinta fábrica reescreve a frase sem ninguém abrir o painel", () => {
    // É a falha inteira que os marcadores existem para matar: um "quatro"
    // digitado à mão continua dizendo quatro acima de uma lista com cinco.
    const frase = "São {fabricas} fábricas brasileiras.";

    expect(preencher(frase, HOJE)).toBe("São quatro fábricas brasileiras.");
    expect(preencher(frase, { ...HOJE, fabricas: "cinco" })).toBe(
      "São cinco fábricas brasileiras.",
    );
  });

  test("texto ausente continua ausente — a seção anulável não muda de forma", () => {
    expect(preencher(undefined, HOJE)).toBeUndefined();
  });

  test("texto sem marcador nenhum atravessa intacto", () => {
    expect(preencher("A venda é sempre fechada pela loja.", HOJE)).toBe(
      "A venda é sempre fechada pela loja.",
    );
  });
});

describe("o dado que falta", () => {
  test("derruba o parágrafo inteiro em vez de publicar frase truncada", () => {
    // "A sede fica em ." no ar é pior do que uma frase a menos, e o parágrafo
    // volta sozinho quando o cadastro for preenchido.
    expect(
      preencher("A sede fica em {cidade}.", { ...HOJE, cidade: undefined }),
    ).toBeUndefined();
  });

  test("só derruba quando o marcador que falta está de fato na frase", () => {
    expect(
      preencher("São {anos} anos de atuação.", { ...HOJE, cidade: undefined }),
    ).toBe("São 27 anos de atuação.");
  });
});

describe("o marcador que não existe", () => {
  test("fica visível na página, escrito como o operador digitou", () => {
    // Feio de propósito. Sumir em silêncio deixa um buraco no meio da frase e
    // nenhuma pista do que houve; adivinhar cria marcador que ninguém
    // documentou.
    expect(preencher("São {anso} anos de casa.", HOJE)).toBe("São {anso} anos de casa.");
  });

  test("marcador com espaço dentro é erro de digitação, não sintaxe alternativa", () => {
    expect(preencher("São { anos } anos.", HOJE)).toBe("São { anos } anos.");
  });

  test("não derruba o parágrafo — o resto da frase continua sendo preenchido", () => {
    expect(preencher("{anso} anos, {fabricas} fábricas.", HOJE)).toBe(
      "{anso} anos, quatro fábricas.",
    );
  });
});

describe("a ajuda que o painel mostra", () => {
  test("nomeia todo marcador do vocabulário, para não haver marcador secreto", () => {
    for (const chave of Object.keys(MARCADORES)) {
      expect(AJUDA_DOS_MARCADORES).toContain(`{${chave}}`);
    }
  });
});
