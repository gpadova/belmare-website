import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

/**
 * A fronteira do lead contra um Payload de verdade — PRA-126.
 *
 * ⚠️ **`overrideAccess: false` EM TODA CHAMADA DESTE ARQUIVO**, pelo mesmo
 * motivo de `collections/papeis.integracao.test.ts`: sem isso a Local API
 * ignora `access` e o teste estaria confirmando que os campos batem, não que
 * a fronteira existe. E aqui a fronteira é assimétrica de um jeito que nenhuma
 * outra coleção do projeto é — **criar é aberto, ler não é** —, então provar
 * as duas direções é o ponto do arquivo.
 *
 * O risco que estes testes existem para pegar não é o formulário parar de
 * funcionar: é o inverso, uma tabela de nome, e-mail e cidade de quem contatou
 * a empresa ficar legível sem login. Isso é vazamento de dado pessoal, e é o
 * tipo de coisa que ninguém descobre olhando o site.
 */

let payload: Payload;
const criados: number[] = [];

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  for (const id of criados) {
    await payload.delete({ collection: "leads", id, overrideAccess: true });
  }
});

async function criarLeadAnonimo(dados: Record<string, unknown> = {}) {
  const doc = await payload.create({
    collection: "leads",
    overrideAccess: false,
    data: {
      nome: "Ana Prado",
      email: "ana@escritorioprado.com.br",
      cidade: "Florianópolis",
      escritorio: "Escritório Prado",
      consentimentoMarketing: false,
      origem: { pagina: "contato" },
      ...dados,
    },
  });
  criados.push(doc.id as number);
  return doc;
}

describe("o visitante anônimo consegue mandar o contato", () => {
  test("criar um lead sem sessão nenhuma é aceito — é a única escrita anônima do projeto", async () => {
    const lead = await criarLeadAnonimo();

    expect(lead.nome).toBe("Ana Prado");
    expect(lead.origem?.pagina).toBe("contato");
  });

  test("o consentimento de marketing chega como a pessoa deixou, e o padrão é não", async () => {
    // A promessa: contatar a empresa não inscreve ninguém em lista nenhuma.
    const recusou = await criarLeadAnonimo({ consentimentoMarketing: false });
    const aceitou = await criarLeadAnonimo({
      email: "outra@escritorioprado.com.br",
      consentimentoMarketing: true,
    });

    expect(recusou.consentimentoMarketing).toBe(false);
    expect(aceitou.consentimentoMarketing).toBe(true);
  });

  test("a marca de origem fica ausente fora de uma página de marca", async () => {
    const lead = await criarLeadAnonimo();
    expect(lead.origem?.marca ?? undefined).toBeUndefined();
  });

  test("a marca de origem é gravada quando o formulário nasce numa página de marca", async () => {
    // É o seam que PRA-127 usa para o pacote completo.
    const lead = await criarLeadAnonimo({
      origem: { pagina: "representadas/trisol", marca: "trisol" },
    });
    expect(lead.origem?.marca).toBe("trisol");
  });
});

describe("a lista de leads NUNCA é legível sem sessão", () => {
  test("listar sem sessão é recusado", async () => {
    await criarLeadAnonimo();

    await expect(
      payload.find({ collection: "leads", overrideAccess: false }),
    ).rejects.toThrow();
  });

  test("ler um lead pelo id, sem sessão, é recusado", async () => {
    const lead = await criarLeadAnonimo();

    await expect(
      payload.findByID({
        collection: "leads",
        id: lead.id,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });

  test("apagar sem sessão é recusado", async () => {
    const lead = await criarLeadAnonimo();

    await expect(
      payload.delete({
        collection: "leads",
        id: lead.id,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
  });

  test("com sessão de painel, a Belmare lê os próprios leads", async () => {
    const lead = await criarLeadAnonimo();

    /* Sem `overrideAccess: false` aqui de propósito: criar a conta é MONTAR o
       cenário, não o que está sendo provado. O que se prova é a leitura logo
       abaixo, e essa vai com a fronteira ligada. */
    const operador = await payload.create({
      collection: "usuarios",
      data: {
        nome: "Leitora de Leads",
        email: `leitor-${lead.id}@belmare.com.br`,
        password: "senha-de-teste-126",
        papel: "operador",
      },
    });

    const { docs } = await payload.find({
      collection: "leads",
      overrideAccess: false,
      user: operador,
      where: { id: { equals: lead.id } },
    });

    expect(docs).toHaveLength(1);
    expect(docs[0]?.email).toBe("ana@escritorioprado.com.br");

    await payload.delete({
      collection: "usuarios",
      id: operador.id,
      overrideAccess: true,
    });
  });
});

describe("a coleção recusa o que o formulário também recusaria", () => {
  test("um e-mail sem arroba é recusado, mesmo entrando direto pela API", async () => {
    await expect(
      criarLeadAnonimo({ email: "ana-arroba-nenhuma" }),
    ).rejects.toThrow();
  });

  test("sem nome, não há lead", async () => {
    await expect(criarLeadAnonimo({ nome: "" })).rejects.toThrow();
  });

  test("sem a empresa ou o escritório, não há lead", async () => {
    // Decisão 11: é o mínimo para a Belmare qualificar o contato.
    await expect(criarLeadAnonimo({ escritorio: "" })).rejects.toThrow();
  });
});
