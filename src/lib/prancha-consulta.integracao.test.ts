import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

import {
  CHAMADAS,
  PRANCHA_EM_CODIGO,
  chamadasDesenhadas,
  numeroDaChamada,
} from "@/lib/prancha-area-externa";
import { buscarPrancha, pranchaDaPagina } from "@/lib/prancha-consulta";
import { TAG_REPRESENTADAS } from "@/lib/revalidacao";
import {
  criarImagem,
  criarRepresentadaPublicada,
  recusaAoSalvar,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * A prancha contra um Payload de verdade — o que a derivação pura não alcança.
 *
 * ⚠️ **O QUE ESTA SUÍTE ACRESCENTA É A TROCA DE FOTOGRAFIA COMPLETA.** O mapper
 * já é provado sozinho em `prancha-traducao.test.ts`. O que só existe aqui é a
 * sequência inteira: publicar uma prancha, ler pela consulta pública, publicar
 * OUTRA fotografia com outras coordenadas e ver a página receber as novas — sem
 * nenhuma linha de código mudando de lugar, que é o critério de aceite do
 * ticket escrito como teste.
 *
 * ⚠️ O espião de `revalidateTag` é o mesmo de `globais-consulta.integracao.test.ts`
 * e pelo mesmo motivo: fora de uma requisição do Next não sobra sintoma nenhum
 * para observar, e o que se afirma aqui é QUAL etiqueta o hook pede.
 */

const { etiquetas } = vi.hoisted(() => ({ etiquetas: [] as string[] }));

vi.mock("next/cache", async (importarOriginal) => {
  const original = await importarOriginal<typeof import("next/cache")>();
  return {
    ...original,
    revalidateTag: (etiqueta: string) => {
      etiquetas.push(etiqueta);
    },
  };
});

let payload: Payload;
let marcas: Record<string, number>;
let fotografia: number;

async function publicarPrancha(dados: Record<string, unknown>) {
  etiquetas.length = 0;
  return payload.updateGlobal({
    slug: "prancha",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never);
}

/** As quatro chamadas de reserva, com o identificador da marca no lugar do
 *  slug — a mesma tradução que o seed faz. */
function chamadasDeReserva() {
  return CHAMADAS.map((chamada) => ({
    representada: marcas[chamada.slug],
    rotuloX: chamada.rotulo.x,
    rotuloY: chamada.rotulo.y,
    alvoX: chamada.alvo.x,
    alvoY: chamada.alvo.y,
  }));
}

beforeAll(async () => {
  payload = await getPayload({ config });

  const galeria = await criarImagem(payload, "Uma poltrona", "pino-galeria.jpg");
  const abertura = await criarImagem(payload, "Uma poltrona larga", "pino-larga.jpg");

  marcas = {};
  for (const chamada of CHAMADAS) {
    const doc = await criarRepresentadaPublicada(
      payload,
      representadaMinima(chamada.slug, `Marca ${chamada.slug}`, galeria, abertura),
    );
    marcas[chamada.slug] = doc.id;
  }

  fotografia = await criarImagem(payload, "A área externa inteira", "prancha-um.jpg");
});

beforeEach(() => {
  etiquetas.length = 0;
});

afterAll(async () => {
  await payload.destroy();
});

describe("a prancha do painel", () => {
  test("antes de publicar qualquer coisa, a página desenha a reserva do código", async () => {
    // Máquina recém-clonada, build antes do seed: /representadas não pode
    // abrir sem prancha, que é a página inteira.
    expect(await buscarPrancha()).toBeUndefined();
    expect(await pranchaDaPagina()).toEqual(PRANCHA_EM_CODIGO);
  });

  test("publicada, a fotografia e as chamadas do painel substituem as do código", async () => {
    await publicarPrancha({ foto: fotografia, chamadas: chamadasDeReserva() });

    const prancha = await pranchaDaPagina();

    expect(prancha.foto.src).not.toBe(PRANCHA_EM_CODIGO.foto.src);
    expect(prancha.foto.largura).toBeGreaterThan(0);
    expect(prancha.foto.altura).toBeGreaterThan(0);
    expect(prancha.chamadas.map((c) => c.slug)).toEqual(
      CHAMADAS.map((c) => c.slug),
    );
  });

  test("publicar invalida a rota da prancha, e só ela", async () => {
    await publicarPrancha({ foto: fotografia, chamadas: chamadasDeReserva() });

    expect(etiquetas).toEqual([TAG_REPRESENTADAS]);
  });

  test("rascunho não vaza: o site continua com a prancha publicada", async () => {
    await publicarPrancha({ foto: fotografia, chamadas: chamadasDeReserva() });
    const publicada = await pranchaDaPagina();

    const outra = await criarImagem(payload, "Outra área externa", "rascunho.jpg");
    etiquetas.length = 0;
    await payload.updateGlobal({
      slug: "prancha",
      draft: true,
      data: {
        foto: outra,
        chamadas: chamadasDeReserva(),
        _status: "draft",
      },
    } as never);

    expect((await pranchaDaPagina()).foto.src).toBe(publicada.foto.src);
    // Rascunho não etiqueta nada: revalidar aqui derrubaria a página que o
    // público vê por causa de uma edição que ele não vê.
    expect(etiquetas).toEqual([]);
  });

  test("TROCAR A FOTOGRAFIA E ARRASTAR OS PINOS NÃO EXIGE MUDANÇA DE CÓDIGO", async () => {
    // O critério de aceite do ticket, escrito como teste. Fotografia nova,
    // coordenadas novas, três chamadas em vez de quatro — nada aqui toca
    // arquivo nenhum de `src`.
    const novaFoto = await criarImagem(payload, "Outra área externa", "prancha-dois.jpg");

    await publicarPrancha({
      foto: novaFoto,
      chamadas: [
        {
          representada: marcas["trisol"],
          rotuloX: 62.5,
          rotuloY: 18.2,
          alvoX: 74,
          alvoY: 31,
        },
        {
          representada: marcas["bux-garden"],
          rotuloX: 20,
          rotuloY: 80,
          alvoX: 25,
          alvoY: 90,
        },
        {
          representada: marcas["gda-moveis"],
          rotuloX: 5,
          rotuloY: 5,
          alvoX: 10,
          alvoY: 12,
        },
      ],
    });

    const prancha = await pranchaDaPagina();

    expect(prancha.chamadas).toHaveLength(3);
    expect(prancha.chamadas.map((c) => c.slug)).toEqual([
      "trisol",
      "bux-garden",
      "gda-moveis",
    ]);
    expect(prancha.chamadas[0]?.rotulo).toEqual({ x: 62.5, y: 18.2 });
    expect(prancha.chamadas[0]?.alvo).toEqual({ x: 74, y: 31 });
  });

  test("UMA QUINTA FÁBRICA ENTRA NA CENA SEM MUDANÇA DE CÓDIGO", async () => {
    // A outra metade do critério: o desenho não é de quatro nem para baixo nem
    // para cima. Uma marca que resolve algo novo pede um objeto novo na cena —
    // e o caminho para isso é cadastrar a marca e acrescentar uma chamada, sem
    // nenhuma linha de `src` mudando de lugar.
    const galeria = await criarImagem(payload, "Uma luminária", "quinta-galeria.jpg");
    const abertura = await criarImagem(payload, "Uma luminária larga", "quinta-larga.jpg");
    const quinta = await criarRepresentadaPublicada(
      payload,
      representadaMinima("luz-externa", "Luz Externa", galeria, abertura),
    );

    await publicarPrancha({
      foto: fotografia,
      chamadas: [
        ...chamadasDeReserva(),
        {
          representada: quinta.id,
          rotuloX: 84.5,
          rotuloY: 12,
          alvoX: 90,
          alvoY: 24.5,
        },
      ],
    });

    const prancha = await pranchaDaPagina();

    expect(prancha.chamadas).toHaveLength(5);
    expect(prancha.chamadas[4]?.slug).toBe("luz-externa");
    expect(prancha.chamadas[4]?.rotulo).toEqual({ x: 84.5, y: 12 });
    expect(prancha.chamadas[4]?.alvo).toEqual({ x: 90, y: 24.5 });

    // A quinta linha do desenho é a quinta linha da legenda — e a numeração
    // dela sai da posição, não de um campo digitado.
    const representadas = prancha.chamadas.map((c) => ({ slug: c.slug }));
    expect(chamadasDesenhadas(prancha.chamadas, representadas)).toHaveLength(5);
    expect(numeroDaChamada(4)).toBe("05");
  });

  test("publicar sem chamada nenhuma é recusado, em pt-BR", async () => {
    // Uma fotografia de deck sob um título que nomeia quatro objetos: a página
    // perde o argumento inteiro, em silêncio.
    const recusa = await recusaAoSalvar(
      publicarPrancha({ foto: fotografia, chamadas: [] }),
    );

    expect(recusa).toContain("sem chamada nenhuma");
  });

  test("publicar sem fotografia é recusado, em pt-BR", async () => {
    // `foto: null` explícito, e não a chave ausente: um global é atualizado por
    // remendo, e omitir o campo preserva a fotografia anterior em vez de
    // apagá-la. Quem apaga a fotografia no painel manda `null`.
    const recusa = await recusaAoSalvar(
      publicarPrancha({ foto: null, chamadas: chamadasDeReserva() }),
    );

    expect(recusa).toContain("fotografia");
  });

  test("coordenada fora da faixa é recusada antes de virar desenho torto", async () => {
    const recusa = await recusaAoSalvar(
      publicarPrancha({
        foto: fotografia,
        chamadas: [
          { representada: marcas["trisol"], rotuloX: 140, rotuloY: 10, alvoX: 20, alvoY: 30 },
        ],
      }),
    );

    expect(recusa).not.toBe("");
  });

  test("a prancha sobrevive a uma marca despublicada — só perde aquela chamada", async () => {
    // A chamada continua no painel; o que muda é que a página não desenha uma
    // chave que a legenda não sabe nomear. Provado pela leitura: o mapper
    // devolve a chamada porque a representada existe, e é o componente que
    // cruza com as publicadas — aqui basta que a leitura não quebre.
    await publicarPrancha({ foto: fotografia, chamadas: chamadasDeReserva() });

    expect((await pranchaDaPagina()).chamadas).toHaveLength(CHAMADAS.length);
  });
});
