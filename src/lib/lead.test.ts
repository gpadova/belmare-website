import { describe, expect, test } from "vitest";

import {
  corpoDoAvisoPorEmail,
  csvDeLeads,
  emailValido,
  type DadosDoLead,
  type LinhaDeExportacaoDoLead,
} from "@/lib/lead";

/**
 * O domínio do lead, sozinho — sem Payload, sem Next, sem Resend.
 *
 * ⚠️ O que este arquivo protege é a mesma promessa de `lib/empresa.test.ts`
 * para o e-mail de quem preenche o formulário: um endereço mal digitado nunca
 * vira uma linha gravada com cara de válida.
 */

describe("emailValido", () => {
  test("aceita um e-mail bem formado, e normaliza para minúsculas", () => {
    expect(emailValido("Arquiteto@Escritorio.com.br")).toBe(
      "arquiteto@escritorio.com.br",
    );
  });

  test("recusa o que não tem @, ponto de domínio, ou está em branco", () => {
    expect(emailValido("sem-arroba.com")).toBeUndefined();
    expect(emailValido("nome@dominio")).toBeUndefined();
    expect(emailValido("nome@ .com")).toBeUndefined();
    expect(emailValido("")).toBeUndefined();
    expect(emailValido("   ")).toBeUndefined();
    expect(emailValido(null)).toBeUndefined();
    expect(emailValido(undefined)).toBeUndefined();
  });

  test("tira espaço nas pontas antes de conferir", () => {
    expect(emailValido("  contato@belmare.com.br  ")).toBe("contato@belmare.com.br");
  });
});

describe("corpoDoAvisoPorEmail", () => {
  const base: DadosDoLead = {
    nome: "Ana Arquiteta",
    email: "ana@escritorio.com.br",
    cidade: "Florianópolis",
    escritorio: "Ana Arquitetura",
    consentimentoMarketing: false,
    origem: { pagina: "contato" },
  };

  test("lista os cinco campos e diz que já está salvo no painel", () => {
    const corpo = corpoDoAvisoPorEmail(base);

    expect(corpo).toContain("Nome: Ana Arquiteta");
    expect(corpo).toContain("E-mail: ana@escritorio.com.br");
    expect(corpo).toContain("Cidade: Florianópolis");
    expect(corpo).toContain("Empresa ou escritório: Ana Arquitetura");
    expect(corpo).toContain("Aceita novidades por e-mail: não");
    expect(corpo).toContain("Página de origem: contato");
    expect(corpo).toContain("já está salvo no painel");
  });

  test("consentimento marcado aparece como \"sim\"", () => {
    expect(
      corpoDoAvisoPorEmail({ ...base, consentimentoMarketing: true }),
    ).toContain("Aceita novidades por e-mail: sim");
  });

  test("marca só aparece quando a origem carrega uma", () => {
    expect(corpoDoAvisoPorEmail(base)).not.toContain("Marca:");

    const comMarca = corpoDoAvisoPorEmail({
      ...base,
      origem: { pagina: "representadas/trisol", marca: "trisol" },
    });
    expect(comMarca).toContain("Marca: trisol");
  });
});

describe("csvDeLeads", () => {
  const linha: LinhaDeExportacaoDoLead = {
    id: 1,
    nome: "Ana Arquiteta",
    email: "ana@escritorio.com.br",
    cidade: "Florianópolis",
    escritorio: "Ana Arquitetura",
    consentimentoMarketing: false,
    origem: { pagina: "contato" },
    criadoEm: "31/07/2026 15:30:00",
  };

  test("começa com o BOM, para o Excel ler o acento certo", () => {
    expect(csvDeLeads([linha])[0]).toBe("\uFEFF");
  });

  test("o cabeçalho tem as nove colunas, nesta ordem", () => {
    const [cabecalho] = csvDeLeads([]).slice(1).split("\r\n");
    expect(cabecalho).toBe(
      [
        "ID",
        "Nome",
        "E-mail",
        "Cidade",
        "Empresa ou escritório",
        "Aceita novidades por e-mail",
        "Página de origem",
        "Marca de origem",
        "Criado em",
      ].join(","),
    );
  });

  test("sem leads, só o cabeçalho sai — nenhuma linha de corpo vazia", () => {
    const csv = csvDeLeads([]);
    expect(csv.slice(1).split("\r\n")).toHaveLength(1);
  });

  test("uma linha traz os campos na ordem do cabeçalho, sim/não para o consentimento", () => {
    const [, corpo] = csvDeLeads([linha]).slice(1).split("\r\n");
    expect(corpo).toBe(
      [
        "1",
        "Ana Arquiteta",
        "ana@escritorio.com.br",
        "Florianópolis",
        "Ana Arquitetura",
        "não",
        "contato",
        "",
        "31/07/2026 15:30:00",
      ].join(","),
    );
  });

  test("consentimento marcado vira \"sim\"", () => {
    const [, corpo] = csvDeLeads([{ ...linha, consentimentoMarketing: true }])
      .slice(1)
      .split("\r\n");
    expect(corpo).toContain(",sim,");
  });

  test("a marca de origem aparece quando a origem carrega uma", () => {
    const [, corpo] = csvDeLeads([
      { ...linha, origem: { pagina: "representadas/trisol", marca: "trisol" } },
    ])
      .slice(1)
      .split("\r\n");
    expect(corpo).toContain(",representadas/trisol,trisol,");
  });

  test("uma célula com vírgula, aspas ou quebra de linha vai entre aspas, com aspas internas dobradas", () => {
    const [, corpo] = csvDeLeads([
      { ...linha, escritorio: 'Ateliê "Ana", Arquitetura\ne Design' },
    ])
      .slice(1)
      .split("\r\n");
    expect(corpo).toContain('"Ateliê ""Ana"", Arquitetura\ne Design"');
  });

  test("uma célula sem vírgula, aspas ou quebra de linha não ganha aspas", () => {
    const [, corpo] = csvDeLeads([linha]).slice(1).split("\r\n");
    expect(corpo).not.toContain('"');
  });

  test("duas linhas viram duas linhas de corpo, na ordem dada", () => {
    const outra: LinhaDeExportacaoDoLead = {
      ...linha,
      id: 2,
      nome: "Bruno Prado",
      email: "bruno@escritorioprado.com.br",
    };
    const linhas = csvDeLeads([linha, outra]).slice(1).split("\r\n");
    expect(linhas).toHaveLength(3); // cabeçalho + duas linhas de corpo
    expect(linhas[1]).toContain("Ana Arquiteta");
    expect(linhas[2]).toContain("Bruno Prado");
  });
});
