import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import sharp from "sharp";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import {
  buscarRepresentadaPorSlug,
  buscarRepresentadas,
  representadaDaPagina,
  slugsDeRepresentadas,
} from "@/lib/representadas-consulta";
import {
  catalogoPublicado,
  eixoDeFiltro,
  pesoEmMB,
  representadaPorSlug,
  secoesDaRepresentada,
} from "@/lib/representadas";

/**
 * As consultas contra um Payload de verdade, sobre um Postgres descartável.
 *
 * ⚠️ **O QUE ESTE ARQUIVO PROVA E O PURO NÃO PODE.** Que o esquema aceita a
 * assimetria das quatro fábricas; que o dado atravessa o banco e volta na forma
 * que a página espera; e que o painel RECUSA o que não pode entrar — gravar
 * entrada inválida pela API local é a mesma porta por onde o operador salva, e
 * uma recusa aqui é a recusa que ele vê na tela.
 *
 * ⚠️ O banco nasce e morre com a execução; ver `test/banco-descartavel.ts`.
 */

let payload: Payload;

/** Duas fotografias distintas, criadas uma vez e reaproveitadas. */
let fotoDaGaleria: number;
let fotoDeAbertura: number;

/** Um JPEG minúsculo e de verdade: o Payload lê dimensão com o sharp, e um
 *  buffer inventado seria recusado antes de o teste começar. */
async function jpegDeTeste(): Promise<Buffer> {
  return sharp({
    create: { width: 8, height: 8, channels: 3, background: "#101010" },
  })
    .jpeg()
    .toBuffer();
}

async function criarImagem(descricao: string, nome: string): Promise<number> {
  const dados = await jpegDeTeste();
  const doc = await payload.create({
    collection: "imagens",
    data: { descricao, mock: true },
    file: {
      data: dados,
      mimetype: "image/jpeg",
      name: nome,
      size: dados.byteLength,
    },
  });
  return doc.id;
}

/** 1,5 MB exatos, para o peso ser conferível na casa decimal. */
const BYTES_DO_PDF = 1.5 * 1024 * 1024;

async function criarPdf(titulo: string, nome: string): Promise<number> {
  const dados = Buffer.alloc(BYTES_DO_PDF, 0);
  const doc = await payload.create({
    collection: "arquivos",
    data: { titulo },
    file: {
      data: dados,
      mimetype: "application/pdf",
      name: nome,
      size: dados.byteLength,
    },
  });
  return doc.id;
}

/** O mínimo que uma marca precisa declarar para existir. */
function marcaMinima(slug: string, nome: string) {
  return {
    slug,
    nome,
    resolve: "o conforto",
    parte: "Estofado",
    fato: "Têxtil de performance: repelência, proteção UVA/UVB, antimofo",
    imagem: fotoDaGaleria,
    imagemLarga: fotoDeAbertura,
  };
}

/**
 * A mensagem que o painel devolve quando recusa.
 *
 * O Payload embrulha as recusas de campo num erro de validação: a explicação
 * escrita à mão fica em `data.errors`, e é ela — não o embrulho — que o
 * operador lê na tela.
 */
async function recusaAoSalvar(operacao: Promise<unknown>): Promise<string> {
  try {
    await operacao;
  } catch (erro) {
    const detalhe = erro as {
      message?: string;
      data?: { errors?: { message?: string }[] };
    };
    return [
      detalhe.message ?? "",
      ...(detalhe.data?.errors ?? []).map((e) => e.message ?? ""),
    ].join(" | ");
  }

  throw new Error("O painel aceitou o que deveria ter recusado.");
}

beforeAll(async () => {
  payload = await getPayload({ config });

  fotoDaGaleria = await criarImagem(
    "Ombrelone lateral de área externa com lona técnica",
    "galeria.jpg",
  );
  fotoDeAbertura = await criarImagem(
    "Ombrelone lateral de lona escura visto de baixo, projetando sombra sobre uma parede de concreto",
    "abertura.jpg",
  );
});

afterAll(async () => {
  /* ⚠️ O banco morre com a execução, mas os binários NÃO estão nele: sem R2
     configurado os uploads caem em `.uploads/`, no disco, e ficariam para trás
     um PDF de 1,5 MB por execução. Apagar o documento é o que apaga o arquivo. */
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "arquivos", where: {} });
  await payload.delete({ collection: "imagens", where: {} });

  await payload.destroy();
});

beforeEach(async () => {
  await payload.delete({ collection: "representadas", where: {} });
});

describe("a marca cadastrada no painel", () => {
  test("volta pela consulta exatamente como a página a espera", async () => {
    /* A Trisol escrita à mão, campo por campo, agora vinda do painel. É a
       comparação que sustenta o critério "a página renderiza do CMS o mesmo que
       renderizava do código": os componentes são função pura do que esta
       consulta devolve. */
    const codigo = representadaPorSlug("trisol")!;

    await payload.create({
      collection: "representadas",
      data: {
        ...marcaMinima("trisol", "Trisol"),
        resolve: codigo.resolve,
        parte: codigo.parte,
        fato: codigo.fato,
        declaracoes: codigo.declaracoes,
        vocabulario: codigo.vocabulario,
        catalogos: codigo.catalogos?.map((c) => ({ titulo: c.titulo, ano: c.ano })),
      },
    });

    const doPainel = (await buscarRepresentadaPorSlug("trisol"))!;

    expect(doPainel.nome).toBe(codigo.nome);
    expect(doPainel.resolve).toBe(codigo.resolve);
    expect(doPainel.parte).toBe(codigo.parte);
    expect(doPainel.fato).toBe(codigo.fato);
    // A Trisol não publica cidade em fonte nenhuma. Continua não publicando.
    expect(doPainel.base).toBeUndefined();
    expect(doPainel.declaracoes).toEqual(codigo.declaracoes);
    expect(doPainel.vocabulario).toEqual(codigo.vocabulario);
    expect(doPainel.catalogos).toEqual(codigo.catalogos);

    // E o índice da página — os mesmos números sobre as mesmas seções.
    expect(secoesDaRepresentada(doPainel)).toEqual(secoesDaRepresentada(codigo));
  });

  test("traz as duas fotografias, com a marcação de referência composta", async () => {
    await payload.create({
      collection: "representadas",
      data: marcaMinima("bux-garden-teste", "Bux Garden"),
    });

    const marca = (await buscarRepresentadaPorSlug("bux-garden-teste"))!;

    expect(marca.imagem?.src).toContain("galeria");
    expect(marca.imagemLarga?.src).toContain("abertura");
    expect(marca.imagem?.alt).toMatch(/imagem de referência\.$/);
    expect(marca.imagem?.src).not.toBe(marca.imagemLarga?.src);
  });

  test("sem vocabulário, sem designers e sem catálogo, ela atravessa o banco e a página perde as seções", async () => {
    // A Bux: a única sem taxonomia declarada e sem catálogo em fonte nenhuma.
    // O esquema tem que aceitá-la sem um campo preenchido por simetria.
    await payload.create({
      collection: "representadas",
      data: marcaMinima("bux-garden-teste", "Bux Garden"),
    });

    const marca = (await buscarRepresentadaPorSlug("bux-garden-teste"))!;

    expect(marca.vocabulario).toBeUndefined();
    expect(marca.designers).toBeUndefined();
    expect(marca.catalogos).toBeUndefined();
    expect(secoesDaRepresentada(marca).map((s) => s.id)).toEqual([
      "identificacao",
      "falar",
    ]);
  });

  test("o eixo declarado é o que autoriza o filtro de categoria", async () => {
    await payload.create({
      collection: "representadas",
      data: {
        ...marcaMinima("gda-teste", "GDA Móveis"),
        vocabulario: {
          eixo: "Ambiente",
          grupos: [
            { nome: "Externo", slug: "externo", itens: [{ nome: "Sofás" }] },
            { nome: "Interno", slug: "interno", itens: [{ nome: "Sofás" }] },
          ],
        },
      },
    });

    await payload.create({
      collection: "representadas",
      data: {
        ...marcaMinima("mare-teste", "Marê Mobília"),
        vocabulario: {
          grupos: [
            {
              nome: "Categorias",
              slug: "todas",
              itens: [{ nome: "Sofás" }, { nome: "Chaises" }],
            },
          ],
        },
      },
    });

    expect(eixoDeFiltro((await buscarRepresentadaPorSlug("gda-teste"))!)).toBe(
      "Ambiente",
    );
    expect(
      eixoDeFiltro((await buscarRepresentadaPorSlug("mare-teste"))!),
    ).toBeUndefined();
  });
});

describe("o catálogo, do arquivo armazenado até a linha", () => {
  test("com o PDF anexado, o peso vem do arquivo e ninguém o digitou", async () => {
    const pdf = await criarPdf("Catálogo Trisol 2026", "catalogo.pdf");

    await payload.create({
      collection: "representadas",
      data: {
        ...marcaMinima("trisol-teste", "Trisol"),
        catalogos: [{ titulo: "Catálogo", ano: 2026, arquivo: pdf }],
      },
    });

    const [catalogo] = (await buscarRepresentadaPorSlug("trisol-teste"))!
      .catalogos!;

    expect(catalogoPublicado(catalogo)).toBe(true);
    if (!catalogoPublicado(catalogo)) return;

    /* 1 572 864 bytes gravados = 1,5 MB. Não existe campo de peso na coleção:
       o número só pode ter saído do arquivo. */
    expect(pesoEmMB(catalogo.mb)).toBe("1,5");
    expect(catalogo.arquivo).toContain("catalogo");
  });

  test("sem o PDF, o documento continua declarado e a faixa não anuncia peso", async () => {
    await payload.create({
      collection: "representadas",
      data: {
        ...marcaMinima("trisol-teste", "Trisol"),
        catalogos: [{ titulo: "Catálogo", ano: 2026 }],
      },
    });

    const marca = (await buscarRepresentadaPorSlug("trisol-teste"))!;
    const [catalogo] = marca.catalogos!;

    expect(catalogoPublicado(catalogo)).toBe(false);
    expect(catalogo.mb).toBeUndefined();
    expect(catalogo.ano).toBe(2026);

    // A seção existe — o documento existe —, mas não há custo a declarar.
    const secao = secoesDaRepresentada(marca).find((s) => s.id === "levar");
    expect(secao?.contagem).toBeUndefined();
  });

  test("sem edição declarada, a linha não ganha ano nenhum para inventar em cima", async () => {
    await payload.create({
      collection: "representadas",
      data: {
        ...marcaMinima("mare-teste", "Marê Mobília"),
        catalogos: [{ titulo: "Catálogo" }],
      },
    });

    const [catalogo] = (await buscarRepresentadaPorSlug("mare-teste"))!
      .catalogos!;

    expect(catalogo.ano).toBeUndefined();
  });
});

describe("o painel recusa, e explica em português", () => {
  test("a mesma fotografia nos dois lugares é recusada", async () => {
    // A página da marca abriria com o quadro que o visitante acabou de ver na
    // galeria da home, e a rota inteira leria como a galeria de novo.
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "representadas",
        data: {
          ...marcaMinima("trisol-teste", "Trisol"),
          imagemLarga: fotoDaGaleria,
        },
      }),
    );

    expect(recusa).toContain("mesma fotografia");
  });

  test("trocar a abertura pela foto da galeria depois também é recusado", async () => {
    const criada = await payload.create({
      collection: "representadas",
      data: marcaMinima("trisol-teste", "Trisol"),
    });

    const recusa = await recusaAoSalvar(
      payload.update({
        collection: "representadas",
        id: criada.id,
        data: { imagem: fotoDaGaleria, imagemLarga: fotoDaGaleria },
      }),
    );

    expect(recusa).toContain("mesma fotografia");
  });

  test("endereço com acento e maiúscula é recusado antes de virar URL", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "representadas",
        data: { ...marcaMinima("Marê Mobília", "Marê Mobília") },
      }),
    );

    expect(recusa).toContain("letras minúsculas");
  });

  test("marca sem o fato técnico é recusada", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "representadas",
        data: { ...marcaMinima("trisol-teste", "Trisol"), fato: "" },
      }),
    );

    expect(recusa).toContain("fato técnico");
  });

  test("edição com ano impossível é recusada", async () => {
    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "representadas",
        data: {
          ...marcaMinima("trisol-teste", "Trisol"),
          catalogos: [{ titulo: "Catálogo", ano: 26 }],
        },
      }),
    );

    expect(recusa).toContain("quatro dígitos");
  });

  test("dois cadastros no mesmo endereço são recusados", async () => {
    await payload.create({
      collection: "representadas",
      data: marcaMinima("trisol-teste", "Trisol"),
    });

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "representadas",
        data: marcaMinima("trisol-teste", "Trisol II"),
      }),
    );

    expect(recusa).not.toBe("");
  });
});

describe("a travessia entre o código e o painel", () => {
  test("a rota prefere o painel e não perde quem ainda não migrou", async () => {
    /* Enquanto PRA-119 não passa, as quatro marcas escritas à mão continuam no
       ar. Cadastrar uma no painel não pode derrubar as outras três. */
    await payload.create({
      collection: "representadas",
      data: { ...marcaMinima("trisol", "Trisol"), fato: "Fato vindo do painel" },
    });

    expect((await representadaDaPagina("trisol"))?.fato).toBe(
      "Fato vindo do painel",
    );
    expect((await representadaDaPagina("bux-garden"))?.fato).toBe(
      representadaPorSlug("bux-garden")!.fato,
    );
    expect(await representadaDaPagina("fabrica-que-nao-existe")).toBeUndefined();

    const slugs = await slugsDeRepresentadas();
    expect(slugs).toContain("trisol");
    expect(slugs).toContain("bux-garden");
    // Cadastrada e escrita à mão são a mesma marca, não duas rotas.
    expect(slugs.filter((s) => s === "trisol")).toHaveLength(1);
  });

  test("a lista do painel sai na ordem que a Belmare escolheu", async () => {
    await payload.create({
      collection: "representadas",
      data: { ...marcaMinima("segunda", "Segunda"), ordem: 2 },
    });
    await payload.create({
      collection: "representadas",
      data: { ...marcaMinima("primeira", "Primeira"), ordem: 1 },
    });

    expect((await buscarRepresentadas()).map((r) => r.slug)).toEqual([
      "primeira",
      "segunda",
    ]);
  });
});
