import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import { buscarPecasDaRepresentada } from "@/lib/pecas-consulta";
import {
  criarImagem,
  criarRepresentadaPublicada,
  recusaAoSalvar,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * As peças contra um Payload de verdade, sobre um Postgres descartável.
 *
 * ⚠️ **O QUE ESTE ARQUIVO PROVA E O PURO NÃO PODE.** Que a consulta nunca
 * atravessa marca — nem por acidente na leitura, nem por engano na escrita —,
 * e que o painel RECUSA uma categoria que não está no vocabulário da PRÓPRIA
 * representada, mesmo quando essa categoria existe no vocabulário de outra.
 * Isto é o critério de aceite mais fácil de quebrar em silêncio deste ticket,
 * e é exatamente o que um teste puro sobre o mapper não alcança: o mapper não
 * decide se uma categoria é válida, a coleção decide.
 */

let payload: Payload;
let fotoDaGaleria: number;
let fotoDeAbertura: number;

async function criarPecaPublicada(
  dados: Record<string, unknown>,
): Promise<{ id: number }> {
  return payload.create({
    collection: "pecas",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
}

beforeAll(async () => {
  payload = await getPayload({ config });

  fotoDaGaleria = await criarImagem(
    payload,
    "Ombrelone lateral de área externa com lona técnica",
    "galeria-peca.jpg",
  );
  fotoDeAbertura = await criarImagem(
    payload,
    "Ombrelone visto de baixo, projetando sombra sobre um deck",
    "abertura-peca.jpg",
  );
});

afterAll(async () => {
  await payload.delete({ collection: "pecas", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "imagens", where: {} });
  await payload.destroy();
});

beforeEach(async () => {
  // Ordem importa: a filha primeiro, ou a mãe some debaixo dela no meio do
  // teste seguinte.
  await payload.delete({ collection: "pecas", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
});

describe("a peça, dentro de uma representada", () => {
  test("a consulta devolve as peças da marca pedida, e não as de outra", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [
          {
            nome: "Categorias",
            slug: "todas",
            itens: [{ nome: "Sofás" }, { nome: "Poltronas" }],
          },
        ],
      },
    });
    const repB = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-b", "Marca B", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Vitta" }] }],
      },
    });

    await criarPecaPublicada({
      representada: repA.id,
      nome: "Jubarte",
      categoria: "Sofás",
      foto: fotoDaGaleria,
    });
    await criarPecaPublicada({
      representada: repB.id,
      nome: "Modelo Vitta",
      categoria: "Vitta",
      foto: fotoDaGaleria,
    });

    const daA = await buscarPecasDaRepresentada("marca-a");
    expect(daA.map((p) => p.nome)).toEqual(["Jubarte"]);

    const daB = await buscarPecasDaRepresentada("marca-b");
    expect(daB.map((p) => p.nome)).toEqual(["Modelo Vitta"]);
  });

  test("filtrar por categoria funciona dentro da marca, e não oferece a categoria de outra", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [
          {
            nome: "Categorias",
            slug: "todas",
            itens: [{ nome: "Sofás" }, { nome: "Poltronas" }],
          },
        ],
      },
    });

    await criarPecaPublicada({
      representada: repA.id,
      nome: "Jubarte",
      categoria: "Sofás",
      foto: fotoDaGaleria,
    });
    await criarPecaPublicada({
      representada: repA.id,
      nome: "Zoe",
      categoria: "Poltronas",
      foto: fotoDaGaleria,
    });

    expect(
      (await buscarPecasDaRepresentada("marca-a", "Sofás")).map((p) => p.nome),
    ).toEqual(["Jubarte"]);

    // "Vitta" nunca existiu no vocabulário desta marca — a consulta filtrada
    // por uma categoria estranha devolve vazio, nunca as peças da marca
    // inteira nem um erro.
    expect(await buscarPecasDaRepresentada("marca-a", "Vitta")).toEqual([]);
  });

  test("peça sem materiais salva e a consulta devolve o campo ausente, não vazio", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Sofás" }] }],
      },
    });

    await criarPecaPublicada({
      representada: repA.id,
      nome: "Jubarte",
      categoria: "Sofás",
      foto: fotoDaGaleria,
    });

    const [peca] = await buscarPecasDaRepresentada("marca-a");
    expect(peca.materiais).toBeUndefined();
  });

  test("peça salva só como rascunho é invisível para a consulta pública", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Sofás" }] }],
      },
    });

    await payload.create({
      collection: "pecas",
      draft: true,
      data: {
        representada: repA.id,
        nome: "Rascunho",
        categoria: "Sofás",
        foto: fotoDaGaleria,
      },
    });

    expect(await buscarPecasDaRepresentada("marca-a")).toEqual([]);
  });
});

describe("o painel recusa, e explica em português", () => {
  test("categoria fora do vocabulário da própria marca é recusada", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Sofás" }] }],
      },
    });

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "pecas",
        data: {
          representada: repA.id,
          nome: "Peça inválida",
          categoria: "Vitta",
          foto: fotoDaGaleria,
        },
      }),
    );

    expect(recusa).toContain("não está no vocabulário");
  });

  test("categoria de OUTRA marca é recusada mesmo existindo no vocabulário dela — não há atravessar marca", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Sofás" }] }],
      },
    });
    await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-b", "Marca B", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Vitta" }] }],
      },
    });

    // "Vitta" é uma categoria de verdade — só que da Marca B, não da A.
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "pecas",
        data: {
          representada: repA.id,
          nome: "Peça inválida",
          categoria: "Vitta",
          foto: fotoDaGaleria,
        },
      }),
    );

    expect(recusa).toContain("não está no vocabulário");
  });

  test("marca sem vocabulário nenhum recusa qualquer peça", async () => {
    const repSemVocabulario = await criarRepresentadaPublicada(
      payload,
      representadaMinima("sem-vocabulario", "Sem Vocabulário", fotoDaGaleria, fotoDeAbertura),
    );

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "pecas",
        data: {
          representada: repSemVocabulario.id,
          nome: "Peça inválida",
          categoria: "Sofás",
          foto: fotoDaGaleria,
        },
      }),
    );

    expect(recusa).toContain("vocabulário");
  });

  test("peça sem representada é recusada", async () => {
    const recusa = await recusaAoSalvar(
      // `as never`: o teste testa a ausência de um campo obrigatório, e o
      // tipo gerado (por causa de `versions.drafts`) só aceita `data`
      // incompleto ao lado de `draft: true` — o que desviaria do caminho de
      // "publicar" que este teste quer exercitar.
      payload.create({
        collection: "pecas",
        data: {
          nome: "Peça órfã",
          categoria: "Sofás",
          foto: fotoDaGaleria,
        },
      } as never),
    );

    expect(recusa).not.toBe("");
  });

  test("peça sem foto é recusada", async () => {
    const repA = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      vocabulario: {
        grupos: [{ nome: "Categorias", slug: "todas", itens: [{ nome: "Sofás" }] }],
      },
    });

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "pecas",
        data: { representada: repA.id, nome: "Sem foto", categoria: "Sofás" },
      } as never),
    );

    expect(recusa).toContain("fotografia");
  });
});
