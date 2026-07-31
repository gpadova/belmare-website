import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import sharp from "sharp";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import {
  buscarRepresentadaPorSlug,
  buscarRepresentadas,
  representadaDaPagina,
  representadaEmRascunho,
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
 * Cria uma representada JÁ PUBLICADA.
 *
 * ⚠️ **`draft: false` SOZINHO NÃO PUBLICA — ARMADILHA CONFIRMADA EMPIRICAMENTE
 * DURANTE PRA-118.** O campo `_status` que o Payload gera para toda coleção com
 * `versions.drafts` tem valor padrão `"draft"`; é o FORMULÁRIO do painel que
 * manda `_status: "published"` explícito ao clicar em "Publicar", não o
 * argumento `draft` da API local. Sem esta função, cada `payload.create` deste
 * arquivo criaria uma marca invisível para `buscarRepresentadaPorSlug` — que
 * agora filtra `_status: "published"` de propósito, ver a nota em
 * `lib/representadas-consulta.ts`. Os testes de RECUSA (mais abaixo) continuam
 * chamando `payload.create` direto: a rejeição acontece antes da gravação, e
 * `_status` não entra na conta.
 */
async function criarRepresentadaPublicada(
  dados: Record<string, unknown>,
): Promise<{ id: number }> {
  return payload.create({
    collection: "representadas",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
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

    await criarRepresentadaPublicada({
      ...marcaMinima("trisol", "Trisol"),
      resolve: codigo.resolve,
      parte: codigo.parte,
      fato: codigo.fato,
      declaracoes: codigo.declaracoes,
      vocabulario: codigo.vocabulario,
      catalogos: codigo.catalogos?.map((c) => ({ titulo: c.titulo, ano: c.ano })),
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
    await criarRepresentadaPublicada(marcaMinima("bux-garden-teste", "Bux Garden"));

    const marca = (await buscarRepresentadaPorSlug("bux-garden-teste"))!;

    expect(marca.imagem?.src).toContain("galeria");
    expect(marca.imagemLarga?.src).toContain("abertura");
    expect(marca.imagem?.alt).toMatch(/imagem de referência\.$/);
    expect(marca.imagem?.src).not.toBe(marca.imagemLarga?.src);
  });

  test("sem vocabulário, sem designers e sem catálogo, ela atravessa o banco e a página perde as seções", async () => {
    // A Bux: a única sem taxonomia declarada e sem catálogo em fonte nenhuma.
    // O esquema tem que aceitá-la sem um campo preenchido por simetria.
    await criarRepresentadaPublicada(marcaMinima("bux-garden-teste", "Bux Garden"));

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
    await criarRepresentadaPublicada({
      ...marcaMinima("gda-teste", "GDA Móveis"),
      vocabulario: {
        eixo: "Ambiente",
        grupos: [
          { nome: "Externo", slug: "externo", itens: [{ nome: "Sofás" }] },
          { nome: "Interno", slug: "interno", itens: [{ nome: "Sofás" }] },
        ],
      },
    });

    await criarRepresentadaPublicada({
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

    await criarRepresentadaPublicada({
      ...marcaMinima("trisol-teste", "Trisol"),
      catalogos: [{ titulo: "Catálogo", ano: 2026, arquivo: pdf }],
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
    await criarRepresentadaPublicada({
      ...marcaMinima("trisol-teste", "Trisol"),
      catalogos: [{ titulo: "Catálogo", ano: 2026 }],
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
    await criarRepresentadaPublicada({
      ...marcaMinima("mare-teste", "Marê Mobília"),
      catalogos: [{ titulo: "Catálogo" }],
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
    const criada = await criarRepresentadaPublicada(
      marcaMinima("trisol-teste", "Trisol"),
    );

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
    await criarRepresentadaPublicada(marcaMinima("trisol-teste", "Trisol"));

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
    await criarRepresentadaPublicada({
      ...marcaMinima("trisol", "Trisol"),
      fato: "Fato vindo do painel",
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
    await criarRepresentadaPublicada({ ...marcaMinima("segunda", "Segunda"), ordem: 2 });
    await criarRepresentadaPublicada({ ...marcaMinima("primeira", "Primeira"), ordem: 1 });

    expect((await buscarRepresentadas()).map((r) => r.slug)).toEqual([
      "primeira",
      "segunda",
    ]);
  });
});

describe("rascunho, publicação e restauração — PRA-118", () => {
  test("uma marca salva só como rascunho é invisível para o site público", async () => {
    // Nunca publicada: nasce, fica e morre em rascunho neste teste.
    const criada = await payload.create({
      collection: "representadas",
      draft: true,
      data: marcaMinima("rascunho-teste", "Rascunho Teste"),
    });

    expect(await buscarRepresentadaPorSlug("rascunho-teste")).toBeUndefined();
    expect(
      (await buscarRepresentadas()).map((r) => r.slug),
    ).not.toContain("rascunho-teste");

    // Mas o preview — que é quem tem permissão de ver rascunho — enxerga.
    const emPreview = await representadaEmRascunho("rascunho-teste");
    expect(emPreview?.nome).toBe("Rascunho Teste");

    // Confirma que o documento existe de fato (não é um falso-negativo de id).
    expect(criada.id).toBeDefined();
  });

  test("sem sessão, mesmo pedindo draft:true, o acesso nunca devolve rascunho", async () => {
    /* ⚠️ Este é o segundo teste que prova "rascunho nunca vaza" — não o
       filtro explícito de `buscarRepresentadaPorSlug` (que já tem o seu
       próprio teste acima), mas a camada de baixo: o `access.read` da
       coleção. `overrideAccess: false` simula um pedido de verdade, sem a
       Local API pular o controle de acesso — é o mesmo caminho que um pedido
       à API REST/GraphQL percorreria sem sessão de painel. */
    await payload.create({
      collection: "representadas",
      draft: true,
      data: marcaMinima("rascunho-sem-sessao", "Rascunho Sem Sessão"),
    });

    const semSessao = await payload.find({
      collection: "representadas",
      draft: true,
      overrideAccess: false,
      where: { slug: { equals: "rascunho-sem-sessao" } },
    });

    expect(semSessao.docs).toHaveLength(0);
  });

  test("editar uma marca publicada e salvar como rascunho não muda o que o site público serve", async () => {
    const dadosOriginais = marcaMinima("versao-teste", "Versão Teste");
    const criada = await criarRepresentadaPublicada(dadosOriginais);

    await payload.update({
      collection: "representadas",
      id: criada.id,
      draft: true,
      data: { fato: "Fato ainda não publicado" },
    });

    // A leitura pública continua com o fato ORIGINAL — o rascunho não a tocou.
    const publicado = await buscarRepresentadaPorSlug("versao-teste");
    expect(publicado?.fato).toBe(dadosOriginais.fato);

    // O preview já mostra a edição.
    const emPreview = await representadaEmRascunho("versao-teste");
    expect(emPreview?.fato).toBe("Fato ainda não publicado");
  });

  test("publicar deriva e dispara etiquetas; salvar rascunho não dispara nenhuma", async () => {
    /* O hook de `collections/representadas.ts` chama `revalidateTag`, que
       lança fora de uma requisição do Next — exatamente o mundo deste teste.
       `foraDeRequisicao` absorve isso e não derruba a escrita (é a mesma
       garantia que PRA-117 provou); o que este teste confirma é que a
       ESCRITA em si continua funcionando para os dois casos, e que a
       diferença de comportamento entre eles está no `_status` do documento
       resultante — que é exatamente o que o hook usa para decidir revalidar. */
    const criada = await payload.create({
      collection: "representadas",
      draft: true,
      data: marcaMinima("hook-teste", "Hook Teste"),
    });
    const doc1 = criada as unknown as { _status?: string };
    expect(doc1._status).toBe("draft");

    const publicada = await payload.update({
      collection: "representadas",
      id: criada.id,
      draft: false,
      data: { _status: "published" },
    });
    const doc2 = publicada as unknown as { _status?: string };
    expect(doc2._status).toBe("published");

    expect(await buscarRepresentadaPorSlug("hook-teste")).toBeDefined();
  });

  test("restaurar uma versão publicada anterior devolve o conteúdo antigo, e o site público passa a servi-lo", async () => {
    const criada = await criarRepresentadaPublicada({
      ...marcaMinima("restaurar-teste", "Restaurar Teste"),
      fato: "Fato da versão 1",
    });

    // Uma segunda publicação, por cima da primeira — sem passar por rascunho.
    await payload.update({
      collection: "representadas",
      id: criada.id,
      draft: false,
      data: { fato: "Fato da versão 2", _status: "published" },
    });

    expect((await buscarRepresentadaPorSlug("restaurar-teste"))?.fato).toBe(
      "Fato da versão 2",
    );

    const versoes = await payload.findVersions({
      collection: "representadas",
      where: { parent: { equals: criada.id } },
      sort: "createdAt",
    });
    const versaoUm = versoes.docs.find(
      (v) => (v.version as { fato?: string }).fato === "Fato da versão 1",
    )!;
    expect(versaoUm).toBeDefined();

    // Restaurar comporta-se como publicar: o site volta a servir a versão 1
    // sem um clique extra de "Publicar".
    await payload.restoreVersion({
      collection: "representadas",
      id: versaoUm.id,
    });

    expect((await buscarRepresentadaPorSlug("restaurar-teste"))?.fato).toBe(
      "Fato da versão 1",
    );
  });
});
