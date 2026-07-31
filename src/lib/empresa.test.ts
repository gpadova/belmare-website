import { describe, expect, test } from "vitest";

import {
  aberturaPorExtenso,
  anoDeFundacao,
  anosDeMercado,
  cnpjFormatado,
  emailComercial,
  linkDeTelefone,
  linkDeWhatsapp,
  numeroDeWhatsapp,
  TERRITORIO,
} from "@/lib/empresa";
import { ESTADOS } from "@/lib/territorio";

/**
 * O que este arquivo afirma são promessas do site, não detalhes de função:
 * que um número de WhatsApp errado nunca vira link, que o tempo de casa vira
 * no aniversário, e que o território escrito é o mesmo que a prancha desenha.
 *
 * ⚠️ Sem Payload e sem Next — os valores entram como argumento. É o que
 * permite afirmar, num teste de milissegundos, que o número que estava mockado
 * em produção até este ticket seria recusado hoje.
 */

describe("o número de WhatsApp", () => {
  test("aceita o número como uma pessoa o escreve e devolve o que o wa.me aceita", () => {
    // O operador digita do jeito que está no cartão dele. Exigir E.164 seria
    // transformar a primeira edição da vida dele num quebra-cabeça de formato.
    expect(numeroDeWhatsapp("(48) 99137-5030")).toBe("5548991375030");
    expect(numeroDeWhatsapp("48991375030")).toBe("5548991375030");
    expect(numeroDeWhatsapp("+55 48 99137-5030")).toBe("5548991375030");
    expect(numeroDeWhatsapp("5548991375030")).toBe("5548991375030");
  });

  test("linha fixa continua valendo — o WhatsApp Business roda nela", () => {
    // Dois dos telefones da própria Belmare são fixos de oito dígitos.
    expect(numeroDeWhatsapp("(48) 3234-6004")).toBe("554832346004");
  });

  test("RECUSA o número que estava mockado em produção até este ticket", () => {
    /* `5548000000000` era a constante de `lib/site.ts`, com um aviso de
       "trocar antes do lançamento". Ele tem treze dígitos, DDD válido e cara
       de telefone — e o `wa.me` dele abre o aplicativo e diz que o contato não
       existe. Nenhum assinante brasileiro começa em 0 ou 1, e é essa regra que
       o mata. Um link morto é pior do que link nenhum, porque quem descobre
       que ele está morto é o cliente que desiste. */
    expect(numeroDeWhatsapp("5548000000000")).toBeUndefined();
    expect(numeroDeWhatsapp("(48) 0000-00000")).toBeUndefined();
  });

  test("recusa número incompleto, DDD que não existe e campo vazio", () => {
    expect(numeroDeWhatsapp("48 99137")).toBeUndefined();
    expect(numeroDeWhatsapp("99137-5030")).toBeUndefined(); // sem DDD
    expect(numeroDeWhatsapp("(09) 99137-5030")).toBeUndefined(); // DDD < 11
    expect(numeroDeWhatsapp("")).toBeUndefined();
    expect(numeroDeWhatsapp(null)).toBeUndefined();
    expect(numeroDeWhatsapp("ligue já")).toBeUndefined();
  });
});

describe("o link de WhatsApp", () => {
  test("carrega de onde o visitante veio", () => {
    // A qualificação de lead do site inteiro enquanto não há formulário: quem
    // clica na página da Trisol chega dizendo isso.
    const link = linkDeWhatsapp("5548991375030", "estava na página da Trisol");

    expect(link).toContain("https://wa.me/5548991375030");
    expect(decodeURIComponent(link ?? "")).toContain(
      "Vim pelo site da Belmare — estava na página da Trisol.",
    );
  });

  test("sem contexto, a mensagem ainda diz que veio do site", () => {
    expect(decodeURIComponent(linkDeWhatsapp("5548991375030") ?? "")).toContain(
      "Olá! Vim pelo site da Belmare.",
    );
  });

  test("sem número cadastrado NÃO existe link — a ausência é visível no tipo", () => {
    // É isto que faz o botão sumir da página em vez de apontar para lugar
    // nenhum: quem chama recebe `undefined` e não tem como renderizar um href.
    expect(linkDeWhatsapp(undefined, "estava no rodapé")).toBeUndefined();
  });
});

describe("o e-mail comercial", () => {
  test("normaliza espaço e caixa", () => {
    expect(emailComercial("  Comercial@Belmare.com.br ")).toBe(
      "comercial@belmare.com.br",
    );
  });

  test("recusa o que nunca receberia mensagem nenhuma", () => {
    expect(emailComercial("comercial@")).toBeUndefined();
    expect(emailComercial("comercial@belmare")).toBeUndefined();
    expect(emailComercial("comercial belmare.com.br")).toBeUndefined();
    expect(emailComercial("")).toBeUndefined();
  });
});

describe("o CNPJ", () => {
  test("aceita o CNPJ real com ou sem pontuação e escreve no formato do cadastro", () => {
    expect(cnpjFormatado("03133708000109")).toBe("03.133.708/0001-09");
    expect(cnpjFormatado("03.133.708/0001-09")).toBe("03.133.708/0001-09");
  });

  test("recusa um dígito trocado — a página inteira depende de ele estar certo", () => {
    /* `/quem-somos` abre o registro em vez de afirmar que a empresa é séria, e
       este é o único número que o leitor de fato vai digitar na consulta
       oficial. Um dígito trocado tem a cara certa e falha exatamente ali. */
    expect(cnpjFormatado("03.133.708/0001-08")).toBeUndefined();
    expect(cnpjFormatado("03.133.709/0001-09")).toBeUndefined();
  });

  test("recusa tamanho errado e dígitos todos iguais", () => {
    expect(cnpjFormatado("0313370800010")).toBeUndefined();
    expect(cnpjFormatado("00000000000000")).toBeUndefined();
  });
});

describe("o tempo de casa", () => {
  test("vira no aniversário, não no Ano-Novo", () => {
    // Abertura registrada em 22/04/1999. Um dia antes do aniversário ainda
    // conta o ano anterior; no dia, o ano completa — é a diferença entre
    // contar por dia-e-mês e contar por ano-calendário, que erraria por um
    // durante quase quatro meses.
    expect(anosDeMercado("1999-04-22", new Date(2026, 3, 21))).toBe(26);
    expect(anosDeMercado("1999-04-22", new Date(2026, 3, 22))).toBe(27);
  });

  test("virar o ano não adianta a contagem", () => {
    expect(anosDeMercado("1999-04-22", new Date(2025, 11, 31))).toBe(
      anosDeMercado("1999-04-22", new Date(2026, 0, 1)),
    );
  });

  test("lê o instante completo que o painel grava, e conta pelo DIA escolhido", () => {
    // O seletor "só o dia" do Payload grava meia-noite UTC. Se a contagem
    // usasse o instante inteiro, em Brasília o aniversário viraria às 21h do
    // dia 21 — um dia cedo, no primeiro número da primeira tela.
    expect(anosDeMercado("1999-04-22T00:00:00.000Z", new Date(2026, 3, 21))).toBe(26);
    expect(anosDeMercado("1999-04-22T00:00:00.000Z", new Date(2026, 3, 22))).toBe(27);
  });

  test("sem data cadastrada não há número — e não há zero", () => {
    // "0 anos" no rodapé seria o site afirmando algo falso; ausente, a linha
    // inteira desaparece.
    expect(anosDeMercado(undefined)).toBeUndefined();
    expect(anosDeMercado("")).toBeUndefined();
    expect(anosDeMercado("data errada")).toBeUndefined();
  });
});

describe("o ano de fundação e a data por extenso", () => {
  test("saem da mesma data de abertura, nunca de um segundo campo", () => {
    // Eram `fundacao: 1999` e `abertura: "22.04.1999"` lado a lado em
    // `lib/site.ts` — dois campos para um fato só, e o segundo lugar onde um
    // erro de digitação passaria despercebido para sempre.
    expect(anoDeFundacao("1999-04-22T00:00:00.000Z")).toBe(1999);
    expect(aberturaPorExtenso("1999-04-22T00:00:00.000Z")).toBe("22.04.1999");
  });

  test("sem data, nenhum dos dois inventa nada", () => {
    expect(anoDeFundacao(undefined)).toBeUndefined();
    expect(aberturaPorExtenso(undefined)).toBeUndefined();
  });
});

describe("o território", () => {
  test("é exatamente o que a prancha desenha, e não uma segunda lista", () => {
    /* A prosa de `/quem-somos` nomeia os estados três centímetros acima do
       desenho que os traça. Se o território fosse campo de texto, o operador
       poderia escrever um quarto estado que a malha do IBGE não sabe desenhar,
       e a página passaria a contradizer o único gráfico que ela tem. */
    expect(TERRITORIO).toEqual(ESTADOS.map((estado) => estado.nome));
    expect(TERRITORIO).toEqual([
      "Paraná",
      "Santa Catarina",
      "Rio Grande do Sul",
    ]);
  });
});

describe("o link de discagem", () => {
  test("sai do número escrito como a Belmare o escreve", () => {
    expect(linkDeTelefone("(48) 3234-6004")).toBe("tel:+554832346004");
  });
});
