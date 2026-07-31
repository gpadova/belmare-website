import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import { buscarProjetosPublicaveis } from "@/lib/projetos-consulta";
import {
  criarImagem,
  criarRepresentadaPublicada,
  recusaAoSalvar,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * Os projetos contra um Payload de verdade, sobre um Postgres descartável.
 *
 * ⚠️ **O QUE ESTE ARQUIVO PROVA E O PURO NÃO PODE.** Que `buscarProjetosPublicaveis`
 * de fato embrulha o `find` do painel com o portão de três — não uma lista
 * imaginada em teste —, que rascunho nunca conta para esse portão, e que uma
 * fotografia marcada como mock DEPOIS de o projeto já estar publicado tira o
 * projeto do conjunto na PRÓXIMA leitura, sem que ninguém tenha editado o
 * projeto. Também é aqui, e só aqui, que a recusa de publicação é provada
 * através da API Local — a mesma garantia que o operador vive como "não
 * salvou" — incluindo a recusa mais delicada deste ticket: publicar com uma
 * foto marcada como referência.
 */

let payload: Payload;
let fotoDaGaleria: number;
let fotoDeAbertura: number;
let fotoReal: number;
let fotoMock: number;
let marcaA: { id: number };
let marcaB: { id: number };

async function criarProjetoPublicado(
  dados: Record<string, unknown>,
): Promise<{ id: number }> {
  return payload.create({
    collection: "projetos",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
}

/** O mínimo que um projeto precisa declarar para ser publicável — uma marca,
 *  uma foto de verdade, o crédito. */
function obraMinima(sufixo: string, campos: Record<string, unknown> = {}) {
  return {
    obra: `Obra ${sufixo}`,
    cidade: "Florianópolis",
    uf: "SC",
    ano: 2025,
    marcas: [marcaA.id],
    foto: fotoReal,
    creditoArquiteto: "Estúdio Fake Arquitetura",
    ...campos,
  };
}

beforeAll(async () => {
  payload = await getPayload({ config });

  fotoDaGaleria = await criarImagem(
    payload,
    "Ombrelone lateral de área externa com lona técnica",
    "galeria-projeto.jpg",
  );
  fotoDeAbertura = await criarImagem(
    payload,
    "Ombrelone visto de baixo, projetando sombra sobre um deck",
    "abertura-projeto.jpg",
  );
  fotoReal = await criarImagem(
    payload,
    "Área externa entregue com sofá modular e ombrelone lateral",
    "foto-real.jpg",
    false,
  );
  fotoMock = await criarImagem(
    payload,
    "Área externa gerada, ainda sem fotografia real",
    "foto-mock.jpg",
    true,
  );

  marcaA = await criarRepresentadaPublicada(
    payload,
    representadaMinima("marca-a-projetos", "Marca A", fotoDaGaleria, fotoDeAbertura),
  );
  marcaB = await criarRepresentadaPublicada(
    payload,
    representadaMinima("marca-b-projetos", "Marca B", fotoDaGaleria, fotoDeAbertura),
  );
});

afterAll(async () => {
  await payload.delete({ collection: "projetos", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "imagens", where: {} });
  await payload.destroy();
});

beforeEach(async () => {
  // As duas representadas e as fotografias compartilhadas sobrevivem entre
  // testes deste arquivo — nenhum teste aqui depende de vocabulário ou de
  // outro dado específico de marca, diferente de `pecas-consulta.integracao.test.ts`.
  await payload.delete({ collection: "projetos", where: {} });
});

describe("o portão de três, contra o painel de verdade", () => {
  test("menos de três projetos publicados: a seção não recebe nada", async () => {
    await criarProjetoPublicado(obraMinima("Um"));
    await criarProjetoPublicado(obraMinima("Dois"));

    expect(await buscarProjetosPublicaveis()).toEqual([]);
  });

  test("três projetos publicados: os três chegam, com as marcas certas", async () => {
    await criarProjetoPublicado(obraMinima("Um", { marcas: [marcaA.id] }));
    await criarProjetoPublicado(
      obraMinima("Dois", { marcas: [marcaA.id, marcaB.id] }),
    );
    await criarProjetoPublicado(obraMinima("Três"));

    const projetos = await buscarProjetosPublicaveis();

    expect(projetos.map((p) => p.obra).sort()).toEqual([
      "Obra Dois",
      "Obra Três",
      "Obra Um",
    ]);

    // O critério de aceite "cita representadas sem pender de uma só": a
    // Obra Dois cita as duas marcas, e a consulta devolve as duas.
    expect(projetos.find((p) => p.obra === "Obra Dois")?.marcas).toEqual(
      expect.arrayContaining(["marca-a-projetos", "marca-b-projetos"]),
    );
  });

  test("projeto salvo só como rascunho não conta para o portão", async () => {
    await criarProjetoPublicado(obraMinima("Um"));
    await criarProjetoPublicado(obraMinima("Dois"));
    await payload.create({
      collection: "projetos",
      draft: true,
      data: obraMinima("Rascunho"),
    });

    // Dois publicados e um rascunho: o rascunho não é o terceiro.
    expect(await buscarProjetosPublicaveis()).toEqual([]);
  });

  test("fotografia marcada como mock DEPOIS de publicado tira o projeto do conjunto na próxima leitura", async () => {
    const fotoInstavel = await criarImagem(
      payload,
      "Deck de madeira com espreguiçadeiras, ainda sem confirmação de uso",
      "foto-instavel.jpg",
      false,
    );

    await criarProjetoPublicado(obraMinima("Um"));
    await criarProjetoPublicado(obraMinima("Dois"));
    await criarProjetoPublicado(obraMinima("Três", { foto: fotoInstavel }));

    expect(await buscarProjetosPublicaveis()).toHaveLength(3);

    /* ⚠️ Ninguém tocou no projeto "Três" — só a Imagem que ele cita mudou de
       marcação. A garantia de `lib/projetos.ts#projetoDoPainel` é que a
       exclusão se recalcula a cada leitura, não só quando alguém edita o
       projeto: é isso que este teste prova, e um teste puro sobre o mapper
       sozinho não alcançaria (ele não fala com o banco). */
    await payload.update({
      collection: "imagens",
      id: fotoInstavel,
      data: { mock: true },
    });

    expect(await buscarProjetosPublicaveis()).toEqual([]);
  });
});

describe("o painel recusa, e explica em português", () => {
  test("projeto sem crédito do arquiteto é recusado", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "projetos",
        data: { ...obraMinima("Sem crédito"), creditoArquiteto: "" },
      }),
    );

    expect(recusa).toContain("crédito");
  });

  test("projeto sem nenhuma marca é recusado — citar é obrigatório, mesmo sem pender de uma só", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "projetos",
        data: { ...obraMinima("Sem marca"), marcas: [] },
      }),
    );

    expect(recusa).toContain("representada");
  });

  test("projeto sem fotografia é recusado", async () => {
    const recusa = await recusaAoSalvar(
      // `as never`: o teste testa a ausência de um campo obrigatório — ver a
      // mesma nota em `pecas-consulta.integracao.test.ts`.
      payload.create({
        collection: "projetos",
        data: {
          obra: "Sem foto",
          cidade: "Florianópolis",
          uf: "SC",
          ano: 2025,
          marcas: [marcaA.id],
          creditoArquiteto: "Estúdio X",
        },
      } as never),
    );

    expect(recusa).toContain("fotografia");
  });

  test("publicar com fotografia marcada como mock é recusado, mesmo com todo o resto preenchido", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "projetos",
        data: obraMinima("Com mock", { foto: fotoMock }),
      }),
    );

    expect(recusa).toContain("referência");
  });

  test("salvar como RASCUNHO com fotografia mock é aceito — a recusa só vale na publicação", async () => {
    // Decisão 8 da spec: `validate` de campo não roda em rascunho por
    // padrão. É assim que o operador consegue rascunhar com um placeholder
    // antes da foto de verdade chegar, sem a recusa de publicação bloquear o
    // meio do caminho.
    const rascunho = await payload.create({
      collection: "projetos",
      draft: true,
      data: obraMinima("Rascunho com mock", { foto: fotoMock }),
    });

    expect(rascunho.id).toBeDefined();
  });
});
