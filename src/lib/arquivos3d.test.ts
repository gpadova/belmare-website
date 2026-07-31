import { describe, expect, test } from "vitest";

import { arquivo3DDoPainel, formatoDoArquivo } from "@/lib/arquivos3d";
import type {
  Arquivo as ArquivoGerado,
  Arquivos3D as Arquivo3DGerado,
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
