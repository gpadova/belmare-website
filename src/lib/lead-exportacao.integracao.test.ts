import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { respostaDeExportacaoDeLeads } from "@/lib/lead-exportacao";

/**
 * O CSV de "Leads" contra um Payload de verdade — PRA-126, o critério "read,
 * filtered and exported from the panel".
 *
 * ⚠️ **A MESMA FRONTEIRA DE `lead-consulta.integracao.test.ts`, PROVADA NO
 * ENDPOINT.** Aquele arquivo prova `access.read` da COLEÇÃO; este prova que o
 * endpoint customizado (`collections/leads.ts#endpoints`) não abre um
 * caminho por fora dela — a checagem explícita em
 * `lib/lead-exportacao.ts#respostaDeExportacaoDeLeads` MAIS o
 * `overrideAccess: false` da consulta são as duas fechaduras que este arquivo
 * confere.
 *
 * ⚠️ **TAMBÉM PROVA A ORDEM DAS ROTAS, NÃO SÓ O HANDLER.** `handleEndpoints`
 * do Payload resolve `GET /api/leads/exportar` pelo PRIMEIRO `endpoint` da
 * lista cujo padrão bate — e o `/:id` embutido do Payload também bate com
 * `"exportar"` como se fosse um id. Chamar a função diretamente (como os
 * testes abaixo fazem) prova o comportamento dela, mas não prova que ela é a
 * que de fato responde; por isso o último `describe` confere a ORDEM real de
 * `payload.collections.leads.config.endpoints`, sem reimplementar o
 * `path-to-regexp` do Payload por baixo.
 */

let payload: Payload;
const criados: number[] = [];
let operador: { id: number };

beforeAll(async () => {
  payload = await getPayload({ config });

  operador = await payload.create({
    collection: "usuarios",
    data: {
      nome: "Exportadora de Leads",
      email: "exportadora@belmare.com.br",
      password: "senha-de-teste-126",
      papel: "operador",
    },
  });
});

afterAll(async () => {
  for (const id of criados) {
    await payload.delete({ collection: "leads", id, overrideAccess: true });
  }
  await payload.delete({ collection: "usuarios", id: operador.id, overrideAccess: true });
});

async function criarLeadAnonimo(dados: Record<string, unknown> = {}) {
  const doc = await payload.create({
    collection: "leads",
    overrideAccess: false,
    data: {
      nome: "Ana Prado",
      email: "ana-exportacao@escritorioprado.com.br",
      cidade: "Florianópolis",
      escritorio: "Escritório Prado",
      consentimentoMarketing: true,
      origem: { pagina: "contato" },
      ...dados,
    },
  });
  criados.push(doc.id as number);
  return doc;
}

describe("sem sessão, a exportação é recusada — a mesma fronteira de leitura", () => {
  test("devolve 401 e não grava CSV nenhum no corpo", async () => {
    await criarLeadAnonimo();

    const resposta = await respostaDeExportacaoDeLeads({ payload, user: null });

    expect(resposta.status).toBe(401);
    const corpo = await resposta.json();
    expect(corpo).toHaveProperty("erro");
    // Nenhum dado de lead vazou para quem não tem sessão.
    expect(JSON.stringify(corpo)).not.toContain("ana-exportacao@escritorioprado.com.br");
  });
});

describe("com sessão de painel, a exportação devolve o CSV", () => {
  test("200, Content-Type de CSV, e Content-Disposition de download", async () => {
    await criarLeadAnonimo();

    const resposta = await respostaDeExportacaoDeLeads({
      payload,
      user: operador as never,
    });

    expect(resposta.status).toBe(200);
    expect(resposta.headers.get("Content-Type")).toContain("text/csv");
    expect(resposta.headers.get("Content-Disposition")).toContain(
      'attachment; filename="leads.csv"',
    );
  });

  test("o corpo traz o cabeçalho e os leads gravados", async () => {
    await criarLeadAnonimo({
      email: "exportar-conteudo@escritorioprado.com.br",
      origem: { pagina: "representadas/trisol", marca: "trisol" },
    });

    const resposta = await respostaDeExportacaoDeLeads({
      payload,
      user: operador as never,
    });

    const csv = await resposta.text();

    expect(csv).toContain("Nome,E-mail,Cidade");
    expect(csv).toContain("exportar-conteudo@escritorioprado.com.br");
    expect(csv).toContain("representadas/trisol");
    expect(csv).toContain("trisol");
  });
});

describe("a ordem das rotas: /exportar vence o /:id embutido do Payload", () => {
  test("o endpoint customizado é o primeiro GET da lista cujo padrão bateria com \"exportar\"", () => {
    const endpoints = payload.collections.leads.config.endpoints;
    expect(endpoints).toBeTruthy();

    const indiceDoExportar = (endpoints || []).findIndex(
      (endpoint) => endpoint.method === "get" && endpoint.path === "/exportar",
    );
    const indiceDoPorId = (endpoints || []).findIndex(
      (endpoint) => endpoint.method === "get" && endpoint.path === "/:id",
    );

    expect(indiceDoExportar).toBeGreaterThanOrEqual(0);
    expect(indiceDoPorId).toBeGreaterThanOrEqual(0);
    // `handleEndpoints` usa `Array.prototype.find`, que devolve o primeiro
    // que bate — se o `/:id` do Payload viesse antes, `/exportar` nunca
    // seria alcançado de verdade, mesmo com o handler correto acima.
    expect(indiceDoExportar).toBeLessThan(indiceDoPorId);
  });
});
