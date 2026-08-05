import { describe, expect, test } from "vitest";

import type { Valores } from "@/lib/marcadores";
import { montarTextos, PADRAO } from "@/lib/quem-somos-consulta";

/**
 * A promessa: `/quem-somos` é editável por inteiro **e** não vai ao ar
 * quebrada. As duas metades disso são regras opostas para campo em branco —
 * título cai no padrão, parágrafo some — e é isso que este arquivo afirma, sem
 * banco no caminho.
 */

const HOJE: Valores = {
  anos: "27",
  fabricas: "quatro",
  cidade: "Florianópolis",
  estados: "Paraná, Santa Catarina e Rio Grande do Sul",
  quantosEstados: "três",
};

describe("o painel vazio", () => {
  test("ainda entrega uma página com todos os títulos", () => {
    // O estado no dia em que o global nasce, e o dia em que alguém apaga tudo.
    const textos = montarTextos({}, HOJE);

    expect(textos.titulo).toBe(PADRAO.titulo);
    expect(textos.atuacaoTitulo).toBe(PADRAO.atuacaoTitulo);
    expect(textos.acervoTitulo).toBe(PADRAO.acervoTitulo);
    expect(textos.territorioTitulo).toBe(PADRAO.territorioTitulo);
    expect(textos.projetosTitulo).toBe(PADRAO.projetosTitulo);
    expect(textos.contatoTitulo).toBe(PADRAO.contatoTitulo);
  });

  test("some com todo parágrafo, em vez de desenhar parágrafo vazio", () => {
    const textos = montarTextos({}, HOJE);

    expect(textos.apresentacao).toBeUndefined();
    expect(textos.atuacao).toBeUndefined();
    expect(textos.acervo).toBeUndefined();
    expect(textos.territorio).toBeUndefined();
    expect(textos.projetos).toBeUndefined();
    expect(textos.contato).toBeUndefined();
    expect(textos.atuacaoLinhas).toEqual([]);
  });

  test("mantém a legenda da foto, que é a única ausência que não é permitida", () => {
    // Sem ela, a foto de banco do fecho passa a valer como obra entregue.
    expect(montarTextos({}, HOJE).contatoLegenda).toBe(PADRAO.contatoLegenda);
  });
});

describe("o que o operador escreveu", () => {
  test("vence o padrão, em título e em legenda", () => {
    const textos = montarTextos(
      { titulo: "A Belmare em uma linha.", contatoLegenda: "Obra em Jurerê, 2025" },
      HOJE,
    );

    expect(textos.titulo).toBe("A Belmare em uma linha.");
    expect(textos.contatoLegenda).toBe("Obra em Jurerê, 2025");
  });

  test("chega na tela com os marcadores já trocados pelo dado", () => {
    const textos = montarTextos(
      {
        apresentacao: "São {anos} anos de atuação, com {fabricas} fábricas representadas.",
        territorio: "O atendimento cobre {estados}.",
      },
      HOJE,
    );

    expect(textos.apresentacao).toBe(
      "São 27 anos de atuação, com quatro fábricas representadas.",
    );
    expect(textos.territorio).toBe(
      "O atendimento cobre Paraná, Santa Catarina e Rio Grande do Sul.",
    );
  });
});

describe("as etapas de 'O que a Belmare faz'", () => {
  test("chegam na ordem do painel, com os marcadores trocados", () => {
    const textos = montarTextos(
      {
        atuacaoLinhas: [
          { rotulo: "Representação", texto: "Apresenta as linhas das {fabricas} fábricas." },
          { rotulo: "Pós-venda", texto: "Resolve a assistência depois da entrega." },
        ],
      },
      HOJE,
    );

    expect(textos.atuacaoLinhas).toEqual([
      { rotulo: "Representação", texto: "Apresenta as linhas das quatro fábricas." },
      { rotulo: "Pós-venda", texto: "Resolve a assistência depois da entrega." },
    ]);
  });

  test("a etapa cujo dado falta cai inteira, e não deixa o rótulo sozinho", () => {
    // Um rótulo com o vão vazio ao lado lê como etapa esquecida, não como
    // cadastro incompleto.
    const textos = montarTextos(
      {
        atuacaoLinhas: [
          { rotulo: "Sede", texto: "Atende a partir de {cidade}." },
          { rotulo: "Pedido", texto: "Acompanha o pedido junto com a loja." },
        ],
      },
      { ...HOJE, cidade: undefined },
    );

    expect(textos.atuacaoLinhas).toEqual([
      { rotulo: "Pedido", texto: "Acompanha o pedido junto com a loja." },
    ]);
  });
});

describe("o cadastro incompleto", () => {
  test("derruba só o parágrafo que dependia do dado que falta", () => {
    const painel = {
      apresentacao: "São {anos} anos de atuação, e a sede fica em {cidade}.",
      contato: "Quem atende é quem representa as fábricas.",
    };

    const textos = montarTextos(painel, { ...HOJE, cidade: undefined });

    expect(textos.apresentacao).toBeUndefined();
    expect(textos.contato).toBe("Quem atende é quem representa as fábricas.");
    // E o título continua de pé: a seção encolhe, não some nem quebra.
    expect(textos.titulo).toBe(PADRAO.titulo);
  });
});
