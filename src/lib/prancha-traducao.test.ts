import { describe, expect, test } from "vitest";

import { pranchaDoPainel } from "@/lib/prancha-traducao";
import type { Imagen, Prancha, Representada } from "@/payload-types";

/**
 * O que a camada de tradução da prancha promete.
 *
 * Todos os estados abaixo são representáveis no tipo gerado e nenhum deles pode
 * chegar ao componente: fotografia sem dimensão, chamada com três coordenadas,
 * relacionamento que voltou como identificador.
 */

const FOTOGRAFIA = {
  id: 1,
  descricao: "Área externa em deck de madeira com sofá, mesa e ombrelone",
  mock: true,
  url: "/api/imagens/file/prancha.jpg",
  width: 2752,
  height: 1536,
} as unknown as Imagen;

const MARE = { id: 7, slug: "mare-mobilia" } as unknown as Representada;
const TRISOL = { id: 9, slug: "trisol" } as unknown as Representada;

function prancha(parcial: Partial<Prancha>): Prancha {
  return { id: 1, foto: FOTOGRAFIA, ...parcial } as Prancha;
}

function chamada(parcial: Record<string, unknown>) {
  return {
    representada: MARE,
    rotuloX: 11,
    rotuloY: 41,
    alvoX: 19,
    alvoY: 70,
    ...parcial,
  } as NonNullable<Prancha["chamadas"]>[number];
}

describe("a fotografia só vira prancha quando a página consegue desenhá-la", () => {
  test("com endereço e dimensões, atravessa com o aspecto do arquivo", () => {
    const resultado = pranchaDoPainel(prancha({ chamadas: [chamada({})] }));

    expect(resultado?.foto.src).toBe("/api/imagens/file/prancha.jpg");
    expect(resultado?.foto.largura).toBe(2752);
    expect(resultado?.foto.altura).toBe(1536);
  });

  test("sem dimensão gravada não há prancha — a página desenha a reserva", () => {
    // Um aspecto chutado recorta a fotografia por dentro da moldura, e as
    // chamadas saem todas de lugar de uma vez. Reserva coerente é melhor que
    // fotografia nova com as setas erradas.
    const semLargura = pranchaDoPainel(
      prancha({ foto: { ...FOTOGRAFIA, width: null } as unknown as Imagen }),
    );
    const semAltura = pranchaDoPainel(
      prancha({ foto: { ...FOTOGRAFIA, height: 0 } as unknown as Imagen }),
    );

    expect(semLargura).toBeUndefined();
    expect(semAltura).toBeUndefined();
  });

  test("fotografia que voltou só como identificador é fotografia ausente", () => {
    expect(pranchaDoPainel(prancha({ foto: 12 }))).toBeUndefined();
  });

  test("a marcação de imagem de referência é composta, nunca lida do campo", () => {
    const resultado = pranchaDoPainel(prancha({ chamadas: [chamada({})] }));

    // ⚠️ Vírgula, e não travessão: o separador do sufixo mudou em 05/08/2026
    // (`lib/acervo.ts`). A asserção é literal de propósito — é ela que prova
    // que a frase é COMPOSTA aqui, e não copiada do campo do painel.
    expect(resultado?.foto.alt).toBe(
      "Área externa em deck de madeira com sofá, mesa e ombrelone, imagem de referência.",
    );
  });

  test("desmarcar o mock tira a marcação da legenda da prancha", () => {
    const resultado = pranchaDoPainel(
      prancha({
        foto: { ...FOTOGRAFIA, mock: false } as unknown as Imagen,
        chamadas: [chamada({})],
      }),
    );

    expect(resultado?.foto.alt).not.toContain("imagem de referência");
  });
});

describe("uma chamada é dois pontos inteiros ou não é chamada", () => {
  test("as quatro coordenadas viram dois pontos", () => {
    const resultado = pranchaDoPainel(prancha({ chamadas: [chamada({})] }));

    expect(resultado?.chamadas).toEqual([
      { slug: "mare-mobilia", rotulo: { x: 11, y: 41 }, alvo: { x: 19, y: 70 } },
    ]);
  });

  test("coordenada faltando descarta a chamada, não a completa com zero", () => {
    // Zero é o canto superior esquerdo: uma seta saindo da moldura para lugar
    // nenhum é pior do que uma chamada a menos, porque parece proposital.
    const resultado = pranchaDoPainel(
      prancha({
        chamadas: [
          chamada({ alvoY: null }),
          chamada({ representada: TRISOL }),
        ],
      }),
    );

    expect(resultado?.chamadas).toHaveLength(1);
    expect(resultado?.chamadas[0]?.slug).toBe("trisol");
  });

  test("chamada sem representada carregada cai — a legenda não teria como nomeá-la", () => {
    const resultado = pranchaDoPainel(
      prancha({ chamadas: [chamada({ representada: 7 })] }),
    );

    expect(resultado?.chamadas).toEqual([]);
  });

  test("coordenada fora da faixa entra na faixa, e a chamada sobrevive", () => {
    const resultado = pranchaDoPainel(
      prancha({ chamadas: [chamada({ rotuloX: 130, alvoY: -8 })] }),
    );

    expect(resultado?.chamadas[0]?.rotulo.x).toBe(100);
    expect(resultado?.chamadas[0]?.alvo.y).toBe(0);
  });

  test("três ou cinco chamadas atravessam igual — o desenho não é de quatro", () => {
    const tres = pranchaDoPainel(
      prancha({ chamadas: [chamada({}), chamada({}), chamada({})] }),
    );
    const cinco = pranchaDoPainel(
      prancha({
        chamadas: [chamada({}), chamada({}), chamada({}), chamada({}), chamada({})],
      }),
    );

    expect(tres?.chamadas).toHaveLength(3);
    expect(cinco?.chamadas).toHaveLength(5);
  });

  test("prancha sem chamada nenhuma atravessa com a lista vazia, sem lançar", () => {
    // O painel recusa publicar assim, mas um rascunho chega nesta forma — e o
    // mapper nunca é o lugar onde a página quebra.
    expect(pranchaDoPainel(prancha({ chamadas: [] }))?.chamadas).toEqual([]);
    expect(pranchaDoPainel(prancha({}))?.chamadas).toEqual([]);
  });

  test("a chamada guarda o slug, e nunca uma cópia do nome da fábrica", () => {
    const resultado = pranchaDoPainel(
      prancha({
        chamadas: [
          chamada({
            representada: {
              ...MARE,
              nome: "Marê Mobília",
              parte: "Móvel",
            } as unknown as Representada,
          }),
        ],
      }),
    );

    // Corrigir o nome no cadastro tem que corrigir a legenda da prancha junto:
    // se o nome fosse copiado para cá, as duas passariam a discordar.
    expect(Object.keys(resultado?.chamadas[0] ?? {})).toEqual([
      "slug",
      "rotulo",
      "alvo",
    ]);
  });
});
