import { describe, expect, test } from "vitest";

import { apenasAdministrador, ehAdministrador, estaAutenticado } from "@/collections/papeis";

/**
 * A fronteira operador × administrador, sozinha — sem Payload, sem banco.
 *
 * ⚠️ Este é o predicado que toda `access` de coleção e de campo do painel
 * chama; um erro aqui é um erro em toda gaveta que ele guarda ao mesmo tempo.
 * O teste de integração (`src/collections/papeis.integracao.test.ts`) prova a
 * mesma fronteira contra um Payload de verdade — este arquivo prova só a
 * regra pura, sem pagar o preço de subir um banco para testar um `if`.
 */
describe("ehAdministrador", () => {
  test("sem sessão nenhuma não é administrador", () => {
    expect(ehAdministrador(null)).toBe(false);
    expect(ehAdministrador(undefined)).toBe(false);
  });

  test("papel \"administrador\" é administrador", () => {
    expect(ehAdministrador({ papel: "administrador" })).toBe(true);
  });

  test("papel \"operador\" não é administrador", () => {
    expect(ehAdministrador({ papel: "operador" })).toBe(false);
  });

  test("conta anterior a este ticket — papel ausente — conta como administradora", () => {
    // A decisão do ticket: nenhuma conta de hoje foi criada pela Belmare, e
    // tratar o campo ausente como "operador" trancaria a única conta que
    // consegue entrar no painel fora de capacidades que ela sempre teve.
    expect(ehAdministrador({ papel: undefined })).toBe(true);
    expect(ehAdministrador({ papel: null })).toBe(true);
  });

  test("um valor gravado que não é nenhum dos dois papéis nega, não concede", () => {
    // Diferente de ausência de campo (estado esperado, coberto acima), um
    // valor estranho é corrupção ou migração malfeita — a negação é o lado
    // seguro para cair.
    expect(ehAdministrador({ papel: "o-que-for" })).toBe(false);
  });
});

describe("estaAutenticado", () => {
  test("sem usuário na requisição, nunca autenticado", () => {
    expect(estaAutenticado({ req: { user: undefined } })).toBe(false);
    expect(estaAutenticado({ req: { user: null } })).toBe(false);
  });

  test("qualquer um dos dois papéis conta como autenticado", () => {
    expect(estaAutenticado({ req: { user: { papel: "operador" } } })).toBe(true);
    expect(estaAutenticado({ req: { user: { papel: "administrador" } } })).toBe(true);
  });
});

describe("apenasAdministrador — a mesma regra, na forma que `access` espera", () => {
  test("recusa sem sessão e recusa operador", () => {
    expect(apenasAdministrador({ req: { user: undefined } })).toBe(false);
    expect(apenasAdministrador({ req: { user: { papel: "operador" } } })).toBe(false);
  });

  test("aceita administrador", () => {
    expect(apenasAdministrador({ req: { user: { papel: "administrador" } } })).toBe(true);
  });
});
