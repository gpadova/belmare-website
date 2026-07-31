import { describe, expect, test } from "vitest";

import { corpoDoAvisoPorEmail, emailValido, type DadosDoLead } from "@/lib/lead";

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
