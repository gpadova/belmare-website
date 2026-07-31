import { describe, expect, test } from "vitest";

import {
  arquivo3DDoPainel,
  bibliotecaPorRepresentada,
  formatoDoArquivo,
  pacoteDoPainel,
  totalDeArquivos3D,
  type Arquivo3D,
} from "@/lib/arquivos3d";
import type {
  Arquivo as ArquivoGerado,
  Arquivos3D as Arquivo3DGerado,
  Pacote3D as PacoteGerado,
} from "@/payload-types";

/**
 * O formato lido da extensão — sozinho, sem Payload, sem banco.
 *
 * ⚠️ É esta derivação que sustenta o critério de aceite "SKP nunca é erro de
 * digitação": se ela errasse a extensão, ninguém digitando nada teria como
 * perceber, porque não há campo de formato para conferir contra.
 */
describe("formatoDoArquivo", () => {
  test("lê a extensão e devolve em caixa alta, exatamente como o site anuncia", () => {
    expect(formatoDoArquivo("cadeira-zuri.skp")).toBe("SKP");
    expect(formatoDoArquivo("catalogo-2026.PDF")).toBe("PDF");
    expect(formatoDoArquivo("mesa-vitta.dwg")).toBe("DWG");
  });

  test("nome com mais de um ponto usa a ÚLTIMA extensão, não a primeira", () => {
    expect(formatoDoArquivo("cadeira.v2.final.3ds")).toBe("3DS");
  });

  test("sem extensão nenhuma, o formato fica ausente — nunca um chute", () => {
    expect(formatoDoArquivo("cadeira-sem-extensao")).toBeUndefined();
  });

  test("nome vazio ou ausente não derruba a função", () => {
    expect(formatoDoArquivo("")).toBeUndefined();
    expect(formatoDoArquivo(null)).toBeUndefined();
    expect(formatoDoArquivo(undefined)).toBeUndefined();
  });

  test("ponto colado no início do nome não é extensão de verdade", () => {
    // Um nome ".skp" sem nada antes do ponto não tem um "nome de arquivo" que
    // a extensão qualifique — tratar como sem extensão é mais honesto que
    // devolver "SKP" para o que pode ser um arquivo de configuração oculto.
    expect(formatoDoArquivo(".skp")).toBeUndefined();
  });
});

const AGORA = "2026-07-31T00:00:00.000Z";

function arquivo(campos: Partial<ArquivoGerado> = {}): ArquivoGerado {
  return {
    id: 1,
    titulo: "Cadeira Zuri",
    filename: "cadeira-zuri.skp",
    url: "https://arquivos.belmare.com.br/cadeira-zuri.skp",
    filesize: 8_400_000,
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function documento(campos: Partial<Arquivo3DGerado> = {}): Arquivo3DGerado {
  return {
    id: 1,
    representada: 1,
    nome: "Cadeira Zuri",
    arquivo: arquivo(),
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

/**
 * O mapper de Arquivo3D — mesma disciplina de `lib/representadas-traducao.ts`:
 * nenhum estado gerado é inventado, e o que não pode ser medido não vira
 * meio-objeto, vira ausência completa.
 */
describe("o arquivo 3D, do painel para a página", () => {
  test("em mãos e medido, formato e peso chegam junto do nome e do endereço", () => {
    const item = arquivo3DDoPainel(documento());

    expect(item).toEqual({
      nome: "Cadeira Zuri",
      url: "https://arquivos.belmare.com.br/cadeira-zuri.skp",
      formato: "SKP",
      mb: 8_400_000 / (1024 * 1024),
    });
  });

  test("arquivo que veio só como identificador não vira item pela metade", () => {
    // Profundidade 0: o upload volta como número, e nem endereço nem tamanho
    // existem ali. Diferente do catálogo, não há "a pedir" aqui — o item
    // inteiro fica ausente.
    expect(arquivo3DDoPainel(documento({ arquivo: 9 }))).toBeUndefined();
  });

  test("arquivo sem tamanho gravado não vira item com peso inventado", () => {
    expect(
      arquivo3DDoPainel(
        documento({ arquivo: arquivo({ filesize: null }) }),
      ),
    ).toBeUndefined();
  });

  test("arquivo sem extensão legível não vira item com formato inventado", () => {
    expect(
      arquivo3DDoPainel(
        documento({ arquivo: arquivo({ filename: "cadeira-sem-extensao" }) }),
      ),
    ).toBeUndefined();
  });
});

/* ------------------------------------------------------------------------- *
   PRA-127 — a biblioteca agrupada e o pacote completo.
 * ------------------------------------------------------------------------- */

function pacote(campos: Partial<PacoteGerado> = {}): PacoteGerado {
  return {
    id: 1,
    pacote: arquivo({
      titulo: "Pacote Belmare",
      filename: "pacote-belmare.zip",
      url: "https://arquivos.belmare.com.br/pacote-belmare.zip",
      filesize: 65_400_000,
    }),
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

/**
 * O pacote completo — o ÚNICO download do site atrás de cadastro, e por isso o
 * que menos pode chegar pela metade.
 *
 * ⚠️ Um pacote sem peso ou sem formato legível tem que virar ausência COMPLETA,
 * porque é a ausência que apaga o formulário junto com a seção. Um pacote
 * "existente mas não declarável" seria a única forma de o site pedir nome,
 * e-mail, cidade e escritório em troca de um arquivo que ele não sabe descrever.
 */
describe("o pacote completo, do painel para a página", () => {
  test("em mãos e medido, formato e peso chegam com o endereço", () => {
    expect(pacoteDoPainel(pacote())).toEqual({
      url: "https://arquivos.belmare.com.br/pacote-belmare.zip",
      formato: "ZIP",
      mb: 65_400_000 / (1024 * 1024),
    });
  });

  test("sem pacote cadastrado não há pacote — e a seção inteira some com ele", () => {
    expect(pacoteDoPainel(pacote({ pacote: null }))).toBeUndefined();
    expect(pacoteDoPainel(pacote({ pacote: undefined }))).toBeUndefined();
  });

  test("pacote que veio só como identificador não vira download mudo", () => {
    expect(pacoteDoPainel(pacote({ pacote: 9 }))).toBeUndefined();
  });

  test("pacote sem peso medido não é oferecido em troca de cadastro", () => {
    // O peso vem ANTES do formulário. Um gate que só revela o tamanho depois de
    // a pessoa entregar os dados é a quebra de promessa na pior versão: já se
    // pagou.
    expect(
      pacoteDoPainel(pacote({ pacote: arquivo({ filesize: 0 }) })),
    ).toBeUndefined();
  });

  test("pacote sem extensão legível não é oferecido em troca de cadastro", () => {
    expect(
      pacoteDoPainel(pacote({ pacote: arquivo({ filename: "pacote" }) })),
    ).toBeUndefined();
  });
});

const ITEM: Arquivo3D = {
  nome: "Cadeira Zuri",
  url: "https://arquivos.belmare.com.br/cadeira-zuri.skp",
  formato: "SKP",
  mb: 8.4,
};

/**
 * O agrupamento por representada — **seção anulável aplicada a uma lista de
 * listas**.
 *
 * ⚠️ Hoje NENHUMA das quatro fábricas tem arquivo 3D cadastrado, então a
 * implementação literal do briefing ("lista por marca") renderiza quatro
 * cabeçalhos sobre nada. É o mesmo modo de falha que `/catalogos` já resolveu
 * uma vez, e a regra de `CONTEXT.md` é literal: o pior resultado de um dado
 * ausente é menos página, nunca página quebrada.
 */
describe("a biblioteca agrupada por representada", () => {
  test("a fábrica sem arquivo nenhum não vira cabeçalho órfão", () => {
    expect(
      bibliotecaPorRepresentada([
        { marca: "trisol", arquivos: [ITEM] },
        { marca: "bux-garden", arquivos: [] },
      ]),
    ).toEqual([{ marca: "trisol", arquivos: [ITEM] }]);
  });

  test("nenhuma fábrica com arquivo devolve lista vazia — a página escreve o estado", () => {
    // O estado real do acervo em 31/07/2026. A rota não pode desenhar quatro
    // títulos e um fio embaixo de cada.
    expect(
      bibliotecaPorRepresentada([
        { marca: "trisol", arquivos: [] },
        { marca: "bux-garden", arquivos: [] },
      ]),
    ).toEqual([]);
  });

  test("a ordem das marcas é preservada — agrupar não reordena", () => {
    // A ordem vem de `Representada.ordem`, que é decisão de apresentação da
    // Belmare. Reordenar aqui seria uma segunda opinião sobre um campo que já
    // tem dono.
    const grupos = bibliotecaPorRepresentada([
      { marca: "b", arquivos: [ITEM] },
      { marca: "a", arquivos: [ITEM] },
    ]);

    expect(grupos.map((g) => g.marca)).toEqual(["b", "a"]);
  });

  test("a contagem total é gerada dos grupos, nunca escrita à mão", () => {
    expect(
      totalDeArquivos3D([
        { arquivos: [ITEM, ITEM] },
        { arquivos: [ITEM] },
      ]),
    ).toBe(3);

    expect(totalDeArquivos3D([])).toBe(0);
  });
});
