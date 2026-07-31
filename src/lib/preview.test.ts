import { describe, expect, test } from "vitest";

import {
  enderecoDePreview,
  tokenDePreviewValido,
  urlDoBotaoDePreview,
} from "@/lib/preview";

/**
 * A lógica pura do preview, sozinha — sem Payload, sem Next, sem `draftMode`.
 *
 * ⚠️ O teste mais importante aqui é o de falha fechada: sem segredo
 * configurado, nenhum token passa. É a garantia de que "esqueceu de configurar
 * `PREVIEW_SECRET`" falha para o lado de recusar preview, nunca para o lado de
 * aceitar qualquer token.
 */
describe("tokenDePreviewValido", () => {
  test("recusa quando não há segredo configurado, mesmo com um token presente", () => {
    expect(tokenDePreviewValido("qualquer-coisa", undefined)).toBe(false);
    expect(tokenDePreviewValido("qualquer-coisa", "")).toBe(false);
  });

  test("recusa quando o token recebido não bate com o segredo", () => {
    expect(tokenDePreviewValido("errado", "certo")).toBe(false);
  });

  test("recusa quando não veio token nenhum", () => {
    expect(tokenDePreviewValido(null, "certo")).toBe(false);
  });

  test("aceita quando o token bate exatamente com o segredo", () => {
    expect(tokenDePreviewValido("certo", "certo")).toBe(true);
  });
});

describe("enderecoDePreview", () => {
  test("a marca abre na própria rota, não num iframe", () => {
    expect(enderecoDePreview("representadas", "trisol")).toBe(
      "/representadas/trisol",
    );
  });

  test("coleção desconhecida não inventa destino", () => {
    expect(enderecoDePreview("paginas", "contato")).toBeUndefined();
    expect(enderecoDePreview(null, "trisol")).toBeUndefined();
  });

  test("sem endereço, não há o que abrir", () => {
    expect(enderecoDePreview("representadas", "")).toBeUndefined();
    expect(enderecoDePreview("representadas", null)).toBeUndefined();
  });
});

describe("urlDoBotaoDePreview", () => {
  test("compõe coleção, endereço e token na querystring", () => {
    const url = urlDoBotaoDePreview({
      colecao: "representadas",
      slug: "trisol",
      segredo: "abc123",
    });

    const [caminho, querystring] = url.split("?");
    const parametros = new URLSearchParams(querystring);

    expect(caminho).toBe("/preview");
    expect(parametros.get("colecao")).toBe("representadas");
    expect(parametros.get("slug")).toBe("trisol");
    expect(parametros.get("token")).toBe("abc123");
  });

  test("sem segredo configurado, o token vai vazio — nunca `undefined` na URL", () => {
    const url = urlDoBotaoDePreview({
      colecao: "representadas",
      slug: "trisol",
      segredo: undefined,
    });

    expect(new URLSearchParams(url.split("?")[1]).get("token")).toBe("");
  });
});
