import { describe, expect, test } from "vitest";

import { anosDeMercado } from "@/lib/site";

describe("anosDeMercado", () => {
  test("o tempo de casa vira no aniversário, não no Ano-Novo", () => {
    // Abertura registrada em 22/04/1999 (site.ts). Um dia antes do
    // aniversário ainda conta o ano anterior; no dia do aniversário, o ano
    // completa — é a diferença entre contar por dia-e-mês e contar por
    // ano-calendário, que erraria por um durante quase quatro meses.
    expect(anosDeMercado(new Date(2026, 3, 21))).toBe(26);
    expect(anosDeMercado(new Date(2026, 3, 22))).toBe(27);
  });

  test("virar o ano não adianta a contagem", () => {
    // 31/12 e 01/01 seguinte ficam dos dois lados do Réveillon, mas dos
    // dois lados do MESMO aniversário (abril) — a contagem tem que ser
    // igual, ou o número estaria reagindo ao calendário, não à data de
    // fundação.
    expect(anosDeMercado(new Date(2025, 11, 31))).toBe(
      anosDeMercado(new Date(2026, 0, 1)),
    );
  });
});
