import { describe, expect, test } from "vitest";

import {
  MARCACAO_DE_MOCK,
  descricaoDeImagem,
  posicaoDoFoco,
} from "@/lib/acervo";

describe("descricaoDeImagem", () => {
  test("imagem marcada como mock termina na marcação de referência", () => {
    // A promessa do CONTEXT.md: mock em produção sem marcação explícita é
    // defeito. Quem escreve o alt é o operador; quem garante o fecho é o site.
    const alt = descricaoDeImagem({
      descricao: "Poltrona de área externa trançada em corda náutica",
      mock: true,
    });

    expect(alt.endsWith(`${MARCACAO_DE_MOCK}.`)).toBe(true);
  });

  test("desmarcar o mock tira a marcação", () => {
    // O caso que existe justamente por isso: a fotografia real chegou. Se o
    // sufixo estivesse gravado no campo, desmarcar não limparia nada e o site
    // continuaria se declarando referência sobre uma foto verdadeira.
    const alt = descricaoDeImagem({
      descricao: "Poltrona de área externa trançada em corda náutica",
      mock: false,
    });

    expect(alt).toBe("Poltrona de área externa trançada em corda náutica");
    expect(alt).not.toContain(MARCACAO_DE_MOCK);
  });

  test("marcar duas vezes não repete a marcação", () => {
    // A falha do hook que concatena no salvar: ela só aparece na terceira
    // edição, quando ninguém está mais olhando para o campo.
    const umaVez = descricaoDeImagem({
      descricao: "Sofá modular estofado em tecido de performance",
      mock: true,
    });
    const duasVezes = descricaoDeImagem({ descricao: umaVez, mock: true });

    expect(duasVezes).toBe(umaVez);
    expect(duasVezes.split(MARCACAO_DE_MOCK)).toHaveLength(2);
  });

  test("o ponto final que o operador digitou não vira dois", () => {
    const alt = descricaoDeImagem({
      descricao: "Ombrelone lateral com lona técnica.",
      mock: true,
    });

    expect(alt).toBe(`Ombrelone lateral com lona técnica — ${MARCACAO_DE_MOCK}.`);
  });
});

describe("posicaoDoFoco", () => {
  test("foco fora do centro reposiciona o corte", () => {
    // É a promessa do ponto focal: no telefone, onde o quadro estreita, o
    // corte segue o assunto em vez de decapitá-lo.
    expect(posicaoDoFoco({ focoX: 30, focoY: 50 })).toBe("30% 50%");
  });

  test("centro não escreve nada — é o padrão do CSS", () => {
    expect(posicaoDoFoco({ focoX: 50, focoY: 50 })).toBeUndefined();
  });

  test("imagem sem foco declarado é imagem centrada", () => {
    // O Payload grava null enquanto ninguém clicou no assunto.
    expect(posicaoDoFoco({ focoX: null, focoY: null })).toBeUndefined();
    expect(posicaoDoFoco({})).toBeUndefined();
  });
});
