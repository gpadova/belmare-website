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

  test("a página livre abre na rota dela — a mesma URL que o iframe carrega", () => {
    /* PRA-124. O live preview do painel não tem um caminho próprio para ver
       rascunho: o iframe carrega EXATAMENTE esta `/preview?...`, e o token
       continua sendo conferido uma vez só, na rota. */
    expect(enderecoDePreview("paginas", "contato")).toBe("/contato");
    expect(enderecoDePreview("paginas", "politica-de-privacidade")).toBe(
      "/politica-de-privacidade",
    );
  });

  test("página livre com endereço fora do registro de rotas não abre preview", () => {
    /* Diferente de uma representada — cujo slug é texto livre e cuja rota sabe
       devolver 404 —, `/qualquer-coisa` não é rota de página nenhuma. Abrir o
       preview ali mostraria um 404 ao operador e diria que a composição dele
       sumiu; `undefined` faz a rota responder com a recusa escrita. */
    expect(enderecoDePreview("paginas", "quem-somos")).toBeUndefined();
    expect(enderecoDePreview("paginas", "inventada")).toBeUndefined();
  });

  test("coleção desconhecida não inventa destino", () => {
    expect(enderecoDePreview("pecas", "qualquer")).toBeUndefined();
    expect(enderecoDePreview(null, "trisol")).toBeUndefined();
  });

  test("sem endereço, não há o que abrir", () => {
    expect(enderecoDePreview("representadas", "")).toBeUndefined();
    expect(enderecoDePreview("representadas", null)).toBeUndefined();
    expect(enderecoDePreview("paginas", "")).toBeUndefined();
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
