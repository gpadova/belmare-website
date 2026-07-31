import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import { buscarAcabamentosDaRepresentada } from "@/lib/acabamentos-consulta";
import {
  criarImagem,
  criarRepresentadaPublicada,
  recusaAoSalvar,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * Os acabamentos contra um Payload de verdade — mesma garantia de
 * `lib/pecas-consulta.integracao.test.ts`: uma marca por consulta, rascunho
 * nunca vaza, e o painel recusa o que falta.
 */

let payload: Payload;
let fotoDaGaleria: number;
let fotoDeAbertura: number;
let amostra: number;

async function criarAcabamentoPublicado(
  dados: Record<string, unknown>,
): Promise<{ id: number }> {
  return payload.create({
    collection: "acabamentos",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
}

beforeAll(async () => {
  payload = await getPayload({ config });

  fotoDaGaleria = await criarImagem(
    payload,
    "Sofá modular estofado em tecido de performance",
    "galeria-acabamento.jpg",
  );
  fotoDeAbertura = await criarImagem(
    payload,
    "Sofá modular encostado numa parede de concreto",
    "abertura-acabamento.jpg",
  );
  amostra = await criarImagem(payload, "Amostra de tecido, close-up da trama", "amostra.jpg");
});

afterAll(async () => {
  await payload.delete({ collection: "acabamentos", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "imagens", where: {} });
  await payload.destroy();
});

beforeEach(async () => {
  await payload.delete({ collection: "acabamentos", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
});

describe("o acabamento, dentro de uma representada", () => {
  test("a consulta devolve os acabamentos da marca pedida, e não os de outra", async () => {
    const repA = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );
    const repB = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-b", "Marca B", fotoDaGaleria, fotoDeAbertura),
    );

    await criarAcabamentoPublicado({
      representada: repA.id,
      nome: "Olefina Areia",
      tipo: "tecido",
      amostra,
    });
    await criarAcabamentoPublicado({
      representada: repB.id,
      nome: "Grafite Texturizado",
      tipo: "pintura",
      amostra,
    });

    expect(
      (await buscarAcabamentosDaRepresentada("marca-a")).map((a) => a.nome),
    ).toEqual(["Olefina Areia"]);
    expect(
      (await buscarAcabamentosDaRepresentada("marca-b")).map((a) => a.nome),
    ).toEqual(["Grafite Texturizado"]);
  });

  test("acabamento salvo só como rascunho é invisível para a consulta pública", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );

    await payload.create({
      collection: "acabamentos",
      draft: true,
      data: { representada: rep.id, nome: "Rascunho", tipo: "tecido", amostra },
    });

    expect(await buscarAcabamentosDaRepresentada("marca-a")).toEqual([]);
  });
});

describe("o painel recusa, e explica em português", () => {
  test("acabamento sem representada é recusado", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "acabamentos",
        data: { nome: "Órfão", tipo: "tecido", amostra },
      } as never),
    );

    expect(recusa).not.toBe("");
  });

  test("acabamento sem amostra é recusado", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "acabamentos",
        data: { representada: rep.id, nome: "Sem amostra", tipo: "tecido" },
      } as never),
    );

    expect(recusa).toContain("amostra");
  });

  test("acabamento sem tipo é recusado", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "acabamentos",
        data: { representada: rep.id, nome: "Sem tipo", amostra },
      } as never),
    );

    expect(recusa).not.toBe("");
  });
});
