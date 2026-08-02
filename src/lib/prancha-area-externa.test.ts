import { describe, expect, test } from "vitest";

import {
  CHAMADAS,
  CHAMADA_EM_BRANCO,
  PASSO,
  PASSO_LARGO,
  PRANCHA_EM_CODIGO,
  chamadasDesenhadas,
  deslocarPonto,
  linhaDaChamada,
  numeroDaChamada,
  pontoNaCaixa,
  porcentagemDaPrancha,
} from "@/lib/prancha-area-externa";

/**
 * O que a prancha promete, afirmado sem DOM e sem painel.
 *
 * A conversão de ponteiro para porcentagem, o corte na faixa e o passo do
 * teclado são a parte do campo de pinos que um teste consegue segurar; o resto
 * — arrastar de fato, o pino chegar por Tab — é comportamento de navegador e
 * foi verificado no painel de verdade.
 */

describe("a posição do pino é porcentagem, e ela nunca sai da fotografia", () => {
  test("um pino arrastado para fora da moldura pousa na borda, não fora dela", () => {
    // O gesto real: o operador puxa o pino para além da imagem. Sem o corte,
    // grava -12 e o número some do desenho na página publicada.
    expect(porcentagemDaPrancha(-12)).toBe(0);
    expect(porcentagemDaPrancha(140)).toBe(100);
  });

  test("guarda uma casa decimal — em 2752 px, 0,1% é menos de 3 px", () => {
    expect(porcentagemDaPrancha(19.44)).toBe(19.4);
    expect(porcentagemDaPrancha(19.46)).toBe(19.5);
  });

  test("caixa sem largura medida não vira NaN gravado", () => {
    // A imagem ainda carregando: a divisão vira infinito. O que não pode
    // acontecer é `NaN` atravessar até o banco e a chamada sumir do desenho.
    const ponto = pontoNaCaixa(
      { x: 120, y: 80 },
      { esquerda: 0, topo: 0, largura: 0, altura: 0 },
    );

    expect(Number.isFinite(ponto.x)).toBe(true);
    expect(Number.isFinite(ponto.y)).toBe(true);
  });

  test("o ponteiro no meio da caixa é 50% por 50%, seja qual for o tamanho na tela", () => {
    // O ponto do ticket: a mesma fotografia exibida em três tamanhos (painel,
    // desktop, telefone) tem que produzir a MESMA porcentagem.
    const noPainel = pontoNaCaixa(
      { x: 400, y: 250 },
      { esquerda: 100, topo: 100, largura: 600, altura: 300 },
    );
    const noTelefone = pontoNaCaixa(
      { x: 180, y: 190 },
      { esquerda: 20, topo: 100, largura: 320, altura: 180 },
    );

    expect(noPainel).toEqual({ x: 50, y: 50 });
    expect(noTelefone).toEqual({ x: 50, y: 50 });
  });

  test("o canto superior esquerdo da caixa é a origem, não o canto da janela", () => {
    const ponto = pontoNaCaixa(
      { x: 100, y: 100 },
      { esquerda: 100, topo: 100, largura: 600, altura: 300 },
    );

    expect(ponto).toEqual({ x: 0, y: 0 });
  });
});

describe("o caminho de teclado move o pino de verdade", () => {
  const ponto = { x: 40, y: 40 };

  test("cada seta move um eixo, no sentido que o nome dela diz", () => {
    expect(deslocarPonto(ponto, { tecla: "ArrowLeft" })).toEqual({
      x: 40 - PASSO,
      y: 40,
    });
    expect(deslocarPonto(ponto, { tecla: "ArrowRight" })).toEqual({
      x: 40 + PASSO,
      y: 40,
    });
    expect(deslocarPonto(ponto, { tecla: "ArrowUp" })).toEqual({
      x: 40,
      y: 40 - PASSO,
    });
    expect(deslocarPonto(ponto, { tecla: "ArrowDown" })).toEqual({
      x: 40,
      y: 40 + PASSO,
    });
  });

  test("com Shift o passo é dez vezes maior — atravessar a foto sem sessenta toques", () => {
    expect(deslocarPonto(ponto, { tecla: "ArrowRight", largo: true })).toEqual({
      x: 40 + PASSO_LARGO,
      y: 40,
    });
  });

  test("o teclado respeita a mesma borda que o arrasto", () => {
    expect(deslocarPonto({ x: 0.5, y: 50 }, { tecla: "ArrowLeft" })).toEqual({
      x: 0,
      y: 50,
    });
    expect(
      deslocarPonto({ x: 96, y: 50 }, { tecla: "ArrowRight", largo: true }),
    ).toEqual({ x: 100, y: 50 });
  });

  test("tecla que não é seta devolve nada, e é assim que Tab continua saindo do pino", () => {
    // Se esta função devolvesse o mesmo ponto, o componente não teria como
    // saber quando engolir a tecla — e engolir Tab tranca o foco no pino.
    expect(deslocarPonto(ponto, { tecla: "Tab" })).toBeUndefined();
    expect(deslocarPonto(ponto, { tecla: "Enter" })).toBeUndefined();
    expect(deslocarPonto(ponto, { tecla: "a" })).toBeUndefined();
  });
});

describe("o desenho é o mesmo no painel e na página", () => {
  test("o traço liga a etiqueta ao objeto, nessa ordem", () => {
    expect(
      linhaDaChamada({ rotulo: { x: 11, y: 41 }, alvo: { x: 19, y: 70 } }),
    ).toBe("M11 41 L19 70");
  });

  test("a numeração é a posição na lista, nunca um número digitado", () => {
    expect(numeroDaChamada(0)).toBe("01");
    expect(numeroDaChamada(2)).toBe("03");
    expect(numeroDaChamada(4)).toBe("05");
  });

  test("uma chamada nova não nasce no canto da moldura", () => {
    // (0,0) nasceria metade fora do quadro, em cima do registro de canto, e
    // leria como campo quebrado antes de o operador tocar em nada.
    expect(CHAMADA_EM_BRANCO.rotulo.x).toBeGreaterThan(0);
    expect(CHAMADA_EM_BRANCO.rotulo.y).toBeGreaterThan(0);

    // E nasce com a linha já visível: o alvo abaixo e à direita da etiqueta é
    // o que ensina, sem texto nenhum, que são dois pinos ligados.
    expect(CHAMADA_EM_BRANCO.alvo.x).toBeGreaterThan(CHAMADA_EM_BRANCO.rotulo.x);
    expect(CHAMADA_EM_BRANCO.alvo.y).toBeGreaterThan(CHAMADA_EM_BRANCO.rotulo.y);
  });
});

describe("o desenho aceita três ou cinco chamadas, não só quatro", () => {
  /** Uma chamada qualquer da marca `slug` — a geometria não importa aqui. */
  function de(slug: string) {
    return { slug, rotulo: { x: 10, y: 10 }, alvo: { x: 20, y: 20 } };
  }

  const marca = (slug: string) => ({ slug, nome: `Marca ${slug}` });

  test("três chamadas viram três linhas, numeradas 01–03", () => {
    const desenhadas = chamadasDesenhadas(
      [de("a"), de("b"), de("c")],
      [marca("a"), marca("b"), marca("c"), marca("d")],
    );

    expect(desenhadas).toHaveLength(3);
    expect(desenhadas.map((_, i) => numeroDaChamada(i))).toEqual([
      "01",
      "02",
      "03",
    ]);
  });

  test("cinco chamadas viram cinco linhas, numeradas 01–05", () => {
    // A quinta fábrica que resolve algo novo na cena: nada no desenho é de
    // quatro — nem a numeração, nem o cruzamento, nem a ordem.
    const desenhadas = chamadasDesenhadas(
      [de("a"), de("b"), de("c"), de("d"), de("e")],
      [marca("a"), marca("b"), marca("c"), marca("d"), marca("e")],
    );

    expect(desenhadas).toHaveLength(5);
    expect(desenhadas.map((_, i) => numeroDaChamada(i))).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);
  });

  test("a ordem é a do painel, e não a do cadastro de representadas", () => {
    // É a ordem das chamadas que numera o desenho: o operador arrasta os pinos
    // na ordem em que quer que a legenda seja lida.
    const desenhadas = chamadasDesenhadas(
      [de("c"), de("a"), de("b")],
      [marca("a"), marca("b"), marca("c")],
    );

    expect(desenhadas.map(({ representada }) => representada.slug)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  test("marca despublicada cai do desenho E da legenda, e a numeração fecha o buraco", () => {
    // Sumir só da legenda deixaria o número 02 sobre a fotografia apontando
    // para uma linha que não existe — uma chave sem entrada.
    const desenhadas = chamadasDesenhadas(
      [de("a"), de("sumiu"), de("c")],
      [marca("a"), marca("c")],
    );

    expect(desenhadas.map(({ representada }) => representada.slug)).toEqual([
      "a",
      "c",
    ]);
    // A chamada da marca despublicada não deixa 02 vago: `c` passa a ser 02.
    expect(numeroDaChamada(1)).toBe("02");
  });

  test("duas chamadas para a mesma fábrica atravessam as duas", () => {
    // Uma marca que resolve dois objetos da cena. Nada no painel impede, e o
    // desenho não pode fundir as duas numa só — são dois alvos.
    const desenhadas = chamadasDesenhadas(
      [de("a"), de("a")],
      [marca("a"), marca("b")],
    );

    expect(desenhadas).toHaveLength(2);
  });

  test("sem representada publicada nenhuma, o desenho fica vazio em vez de quebrar", () => {
    expect(chamadasDesenhadas([de("a"), de("b")], [])).toEqual([]);
    expect(chamadasDesenhadas([], [marca("a")])).toEqual([]);
  });
});

describe("a prancha de reserva continua desenhável sozinha", () => {
  test("a fotografia do código declara as dimensões do arquivo", () => {
    // Sem elas a página não sabe o aspecto da caixa, e a porcentagem deixa de
    // valer — é a mesma exigência que o mapper faz da fotografia do painel.
    expect(PRANCHA_EM_CODIGO.foto.largura).toBe(2752);
    expect(PRANCHA_EM_CODIGO.foto.altura).toBe(1536);
  });

  test("toda chamada de reserva tem os dois pontos dentro da fotografia", () => {
    for (const chamada of CHAMADAS) {
      for (const ponto of [chamada.rotulo, chamada.alvo]) {
        expect(ponto.x).toBeGreaterThanOrEqual(0);
        expect(ponto.x).toBeLessThanOrEqual(100);
        expect(ponto.y).toBeGreaterThanOrEqual(0);
        expect(ponto.y).toBeLessThanOrEqual(100);
      }
    }
  });

  test("a marcação de imagem de referência sobrevive na reserva", () => {
    // A cena mostra uma área externa inteira resolvida; sem a marcação, um
    // arquiteto a lê como obra entregue.
    expect(PRANCHA_EM_CODIGO.foto.alt).toContain("imagem de referência");
  });
});
