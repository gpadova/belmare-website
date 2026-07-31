import { describe, expect, test } from "vitest";

import {
  catalogoPublicado,
  pesoEmMB,
  type Catalogo,
} from "@/lib/representadas";

describe("pesoEmMB", () => {
  test("peso inteiro ganha a casa decimal que faltava, para a coluna não desalinhar", () => {
    expect(pesoEmMB(24)).toBe("24,0");
  });

  test("peso com mais dígitos é arredondado para uma casa, não truncado a esmo", () => {
    expect(pesoEmMB(8.44)).toBe("8,4");
  });
});

describe("catalogoPublicado", () => {
  test("um catálogo com arquivo em mãos está publicado", () => {
    const catalogo: Catalogo = { titulo: "Catálogo", arquivo: "catalogo.pdf", mb: 8.4 };
    expect(catalogoPublicado(catalogo)).toBe(true);
  });

  test("um catálogo sem arquivo é só a pedir, nunca publicado", () => {
    const catalogo: Catalogo = { titulo: "Catálogo" };
    expect(catalogoPublicado(catalogo)).toBe(false);
  });
});
