import { describe, expect, test } from "vitest";

import { empresaDoPainel } from "@/lib/empresa-traducao";
import type { Empresa as EmpresaGerada } from "@/payload-types";

/**
 * O mapper sozinho — a fronteira onde o que o Payload aceita gravar vira o que
 * a página pode receber.
 *
 * ⚠️ Os estados testados aqui são os que um banco esconderia: um número de
 * WhatsApp gravado antes de a validação existir, um endereço com todas as
 * linhas em branco, um array de telefones com uma linha vazia no meio. A
 * validação da coleção recusa o primeiro na tela do operador; este arquivo
 * afirma que, se ele estiver gravado assim mesmo, ele não chega à página.
 */

function documento(campos: Partial<EmpresaGerada> = {}): EmpresaGerada {
  return {
    id: 1,
    nomeCompleto: "Belmare Representações",
    razaoSocial: "Bello Mare Mercantil Ltda",
    cnpj: "03.133.708/0001-09",
    abertura: "1999-04-22T00:00:00.000Z",
    ...campos,
  } as EmpresaGerada;
}

describe("a empresa vinda do painel", () => {
  test("o número digitado atravessa em E.164, pronto para virar link", () => {
    expect(empresaDoPainel(documento({ whatsapp: "5548991375030" })).whatsapp).toBe(
      "5548991375030",
    );
  });

  test("um número inválido gravado no banco NÃO atravessa — nem como texto", () => {
    /* A coleção recusa na tela; isto é a segunda camada, para o valor que
       chegou por outro caminho (um seed antigo, uma escrita direta, o mock que
       existia até este ticket). Depois desta função o estado "número escrito
       errado" é irrepresentável do lado da página. */
    expect(empresaDoPainel(documento({ whatsapp: "5548000000000" })).whatsapp).toBeUndefined();
    expect(empresaDoPainel(documento({ whatsapp: "48 9913" })).whatsapp).toBeUndefined();
    expect(empresaDoPainel(documento({ whatsapp: "" })).whatsapp).toBeUndefined();
    expect(empresaDoPainel(documento({ whatsapp: null })).whatsapp).toBeUndefined();
  });

  test("um e-mail malformado também não atravessa", () => {
    expect(empresaDoPainel(documento({ email: "comercial@" })).email).toBeUndefined();
    expect(empresaDoPainel(documento({ email: "Comercial@Belmare.com.br" })).email).toBe(
      "comercial@belmare.com.br",
    );
  });

  test("endereço sem nenhuma linha preenchida é endereço AUSENTE, não objeto vazio", () => {
    // É a diferença entre o rodapé não desenhar o bloco e o rodapé desenhar
    // três quebras de linha em cima de nada.
    expect(
      empresaDoPainel(
        documento({ endereco: { logradouro: null, bairro: "", cidade: null } }),
      ).endereco,
    ).toBeUndefined();

    expect(
      empresaDoPainel(documento({ endereco: { cidade: "Florianópolis" } })).endereco,
    ).toEqual({ cidade: "Florianópolis" });
  });

  test("lista de telefones vazia é ausente, e uma linha em branco no meio cai fora", () => {
    expect(empresaDoPainel(documento({ telefones: [] })).telefones).toBeUndefined();

    expect(
      empresaDoPainel(
        documento({
          telefones: [
            { numero: "(48) 3234-6004" },
            { numero: "   " },
            { numero: "(48) 99137-5030" },
          ],
        }),
      ).telefones,
    ).toEqual(["(48) 3234-6004", "(48) 99137-5030"]);
  });

  test("um global inteiramente vazio devolve um objeto sem chave nenhuma", () => {
    // Banco recém-criado, seed ainda não rodado: cada componente deixa de
    // desenhar o que não tem dado, e nada quebra.
    const vazia = empresaDoPainel({ id: 1 } as EmpresaGerada);
    expect(Object.keys(vazia)).toEqual([]);
  });
});
