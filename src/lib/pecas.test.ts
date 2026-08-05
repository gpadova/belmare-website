import { describe, expect, test } from "vitest";

import { MARCACAO_DE_MOCK } from "@/lib/acervo";
import { pecaDoPainel } from "@/lib/pecas";
import type { Imagen as ImagemGerada, Peca as PecaGerada } from "@/payload-types";

/**
 * O mapper de Peça, sobre as formas que o Payload de fato gera — mesmo motivo
 * de `lib/representadas-traducao.test.ts`: um banco daria só os casos fáceis e
 * esconderia justamente o upload que voltou como identificador solto.
 */

const AGORA = "2026-07-31T00:00:00.000Z";

function imagem(campos: Partial<ImagemGerada> = {}): ImagemGerada {
  return {
    id: 1,
    descricao: "Poltrona de área externa trançada em corda",
    mock: true,
    url: "/api/imagens/file/poltrona.jpg",
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function documento(campos: Partial<PecaGerada> = {}): PecaGerada {
  return {
    id: 1,
    representada: 1,
    nome: "Jubarte",
    categoria: "Poltronas",
    foto: imagem(),
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

describe("a peça, do painel para a página", () => {
  test("nome e categoria atravessam como estão — os dois são obrigatórios no painel", () => {
    const peca = pecaDoPainel(documento());

    expect(peca.nome).toBe("Jubarte");
    expect(peca.categoria).toBe("Poltronas");
  });

  test("sem materiais, o campo fica ausente — a peça salva e mapeia limpa", () => {
    // O critério de aceite: uma peça sem `materiais` não pode virar um campo
    // vazio ou uma string em branco atravessando até o componente.
    const peca = pecaDoPainel(documento({ materiais: null }));

    expect(peca.materiais).toBeUndefined();
    expect(Object.keys(peca)).not.toContain("materiais");
  });

  test("com materiais declarado, o texto atravessa como legenda — nunca como estrutura", () => {
    const peca = pecaDoPainel(
      documento({ materiais: "Alumínio fundido e corda náutica" }),
    );

    expect(peca.materiais).toBe("Alumínio fundido e corda náutica");
  });

  test("ambiente só existe quando a fábrica separa por ele — ausente por padrão", () => {
    expect(pecaDoPainel(documento()).ambiente).toBeUndefined();
    expect(pecaDoPainel(documento({ ambiente: "externo" })).ambiente).toBe(
      "externo",
    );
  });

  test("a fotografia chega com a marcação de mock composta", () => {
    const peca = pecaDoPainel(
      documento({ foto: imagem({ descricao: "Poltrona trançada", mock: true }) }),
    );

    expect(peca.foto?.alt).toBe(`Poltrona trançada, ${MARCACAO_DE_MOCK}.`);
  });

  test("fotografia que veio só como identificador não vira imagem quebrada", () => {
    // Profundidade 0: o upload volta como número, não como documento.
    expect(pecaDoPainel(documento({ foto: 7 })).foto).toBeUndefined();
  });
});
