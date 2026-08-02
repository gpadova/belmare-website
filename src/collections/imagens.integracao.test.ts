import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import { MARCACAO_DE_MOCK, posicaoDoFoco } from "@/lib/acervo";
import type { Imagen as ImagemGerada } from "@/payload-types";
import { jpegDeTeste, recusaAoSalvar } from "@/test/apoio-de-integracao";

/**
 * A coleção de imagens contra um Payload de verdade.
 *
 * ⚠️ **ESTA COLEÇÃO É O MOLDE, E ERA A ÚNICA SEM SUÍTE PRÓPRIA.** Toda imagem do
 * site vem daqui, então o que estiver errado aqui está errado em todo lugar de
 * uma vez. `lib/acervo.test.ts` já prova a REGRA da marcação de mock e a do
 * ponto focal como funções puras; o que só existe aqui é a mesma promessa
 * atravessando a porta por onde o operador de fato salva — validação de campo,
 * `defaultValue`, hook de leitura e a gravação do ponto focal, que a função pura
 * nunca vê.
 *
 * A distinção importa: uma regra provada em `acervo.ts` e nunca ligada à coleção
 * passa nos testes e some do painel sem sintoma nenhum.
 */

let payload: Payload;

/** Cria uma imagem passando `data` cru — as suítes de PRA-120 usam
 *  `criarImagem`, que já exige descrição; aqui a ausência dela é o assunto, e
 *  `data` precisa poder chegar incompleto sem o TypeScript recusar antes. */
async function salvarImagem(
  dados: Record<string, unknown>,
  nome: string,
): Promise<ImagemGerada> {
  const bytes = await jpegDeTeste();
  const doc = await payload.create({
    collection: "imagens",
    data: dados,
    file: { data: bytes, mimetype: "image/jpeg", name: nome, size: bytes.byteLength },
  } as never);

  return doc as unknown as ImagemGerada;
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

beforeEach(async () => {
  await payload.delete({ collection: "imagens", where: {} });
});

afterAll(async () => {
  await payload.delete({ collection: "imagens", where: {} });
  await payload.destroy();
});

describe("o painel recusa fotografia sem descrição, e explica em português", () => {
  test("salvar sem descrição nenhuma é recusado", async () => {
    const recusa = await recusaAoSalvar(salvarImagem({}, "sem-descricao.jpg"));

    // Não basta recusar: o critério do ticket é que a recusa EXPLIQUE. Quem
    // lê isto é uma pessoa não técnica que abre o painel uma vez por mês.
    expect(recusa).toContain("descrição");
    expect(recusa).toContain("leitor de tela");
  });

  test("descrição só de espaços é recusada como se estivesse vazia", async () => {
    // `required` do Payload aceita uma string de espaços — ela não é vazia. É
    // o `trim` da validação própria que fecha esse caminho, e é o caminho que
    // um operador apressado toma para "sair da tela".
    const recusa = await recusaAoSalvar(salvarImagem({ descricao: "   " }, "espacos.jpg"));

    expect(recusa).toContain("descrição");
  });

  test("com descrição, salva", async () => {
    const doc = await salvarImagem(
      { descricao: "Poltrona de área externa trançada em corda náutica" },
      "com-descricao.jpg",
    );

    expect(doc.id).toBeDefined();
  });
});

describe("a marcação de mock é gerada, nunca digitada", () => {
  test("imagem nova nasce marcada como referência", async () => {
    /* ⚠️ Hoje todo o acervo é geração de IA, e o modo de falha de esquecer a
       marcação é o site apresentar imagem gerada como obra entregue. Esquecer
       de DESMARCAR só custa uma frase a mais num alt verdadeiro. */
    const doc = await salvarImagem({ descricao: "Sofá modular estofado" }, "nasce-mock.jpg");

    expect(doc.mock).toBe(true);
  });

  test("marcada, a descrição publicada termina na marcação — e o campo não", async () => {
    const doc = await salvarImagem(
      { descricao: "Ombrelone lateral com lona técnica", mock: true },
      "marcada.jpg",
    );

    expect(doc.alt).toBe(`Ombrelone lateral com lona técnica — ${MARCACAO_DE_MOCK}.`);

    // A metade que dói se for ignorada: o sufixo é composto na LEITURA e nunca
    // gravado. Persistido, desmarcar o mock não limparia nada.
    expect(doc.descricao).toBe("Ombrelone lateral com lona técnica");
  });

  test("desmarcar tira a marcação da descrição publicada", async () => {
    // O dia em que a fotografia real chega. É a operação inteira: um clique.
    const doc = await salvarImagem(
      { descricao: "Ombrelone lateral com lona técnica", mock: true },
      "desmarcar.jpg",
    );

    const depois = await payload.update({
      collection: "imagens",
      id: doc.id,
      data: { mock: false },
    });

    expect(depois.alt).toBe("Ombrelone lateral com lona técnica");
    expect(depois.alt).not.toContain(MARCACAO_DE_MOCK);
  });

  test("salvar duas vezes não repete a marcação", async () => {
    // A falha do hook que concatena no salvar: só aparece na terceira edição,
    // quando ninguém está mais olhando para o campo.
    const doc = await salvarImagem(
      { descricao: "Espreguiçadeira em alumínio fundido", mock: true },
      "duas-vezes.jpg",
    );

    const depois = await payload.update({
      collection: "imagens",
      id: doc.id,
      data: { descricao: "Espreguiçadeira em alumínio fundido" },
    });

    expect(String(depois.alt).split(MARCACAO_DE_MOCK)).toHaveLength(2);
  });
});

describe("o ponto focal clicado no painel sobrevive ao salvamento", () => {
  test("o foco gravado é o foco lido, e vira o corte da imagem", async () => {
    /* ⚠️ É aqui que o ponto focal deixa de ser configuração e vira dado. O
       painel grava `focalX`/`focalY`; quem os transforma em `object-position` é
       `posicaoDoFoco`, provada sozinha em `lib/acervo.test.ts`. Esta suíte liga
       as duas pontas — sem ela, `focalPoint: true` poderia sair da coleção e
       nenhum teste do projeto mudaria de cor. */
    const doc = await salvarImagem({ descricao: "Poltrona fora do centro" }, "foco.jpg");

    const depois = await payload.update({
      collection: "imagens",
      id: doc.id,
      data: { focalX: 30, focalY: 70 },
    });

    expect(depois.focalX).toBe(30);
    expect(depois.focalY).toBe(70);
    expect(posicaoDoFoco({ focoX: depois.focalX, focoY: depois.focalY })).toBe("30% 70%");
  });

  test("imagem que ninguém reenquadrou fica no centro, e o centro não escreve nada", async () => {
    const doc = await salvarImagem({ descricao: "Poltrona centrada" }, "centro.jpg");

    expect(posicaoDoFoco({ focoX: doc.focalX, focoY: doc.focalY })).toBeUndefined();
  });
});
