import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

import { buscarPaginaLivre, paginaLivreEmRascunho } from "@/lib/paginas-consulta";
import { tagDaPaginaLivre } from "@/lib/revalidacao";
import { recusaAoSalvar } from "@/test/apoio-de-integracao";

/**
 * As páginas livres contra um Payload de verdade — PRA-124.
 *
 * ⚠️ **O QUE ESTA SUÍTE ACRESCENTA AO TESTE PURO É A FIAÇÃO.**
 * `revalidacao.test.ts` já prova que mudar uma página DERIVA a etiqueta da rota
 * dela, e `paginas-traducao.test.ts` já prova o que o mapper faz com cada estado
 * pela metade. O que nenhum dos dois alcança é: existe um hook chamando aquela
 * derivação, o filtro de rascunho está de fato na consulta, e o painel recusa o
 * que ele promete recusar.
 *
 * ⚠️ O espião é sobre `revalidateTag` e só sobre ele — fora de uma requisição do
 * Next a função lança e `collections/apoio.ts#revalidarTags` absorve o
 * lançamento de propósito. Sem espião não sobra sintoma nenhum para observar.
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

/** O mínimo que uma página livre precisa para publicar. */
function paginaMinima(slug: string, titulo: string) {
  return {
    slug,
    titulo,
    resumo: "O resumo que aparece no resultado de busca.",
    composicao: [
      {
        blockType: "caminhos",
        itens: [
          { rotulo: "Ver os catálogos", destino: "rota", rota: "/catalogos" },
        ],
      },
    ],
  };
}

/**
 * ⚠️ `draft: false` sozinho NÃO publica — o campo `_status` que o Payload gera
 * tem padrão `"draft"`. Achado de PRA-118, e a razão de esta função existir.
 */
async function publicar(dados: Record<string, unknown>) {
  etiquetas.length = 0;
  return payload.create({
    collection: "paginas",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
}

async function limpar() {
  await payload.delete({ collection: "paginas", where: {} });
  etiquetas.length = 0;
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

beforeEach(limpar);

afterAll(async () => {
  await limpar();
  await payload.destroy();
});

describe("a leitura pública", () => {
  test("devolve a composição publicada, traduzida para o domínio", async () => {
    await publicar(paginaMinima("arquitetos", "Catálogos, arquivos 3D e cartas."));

    const pagina = await buscarPaginaLivre("arquitetos");

    expect(pagina?.titulo).toBe("Catálogos, arquivos 3D e cartas.");
    expect(pagina?.composicao).toEqual([
      {
        tipo: "caminhos",
        itens: [{ destino: "rota", rotulo: "Ver os catálogos", href: "/catalogos" }],
      },
    ]);
  });

  test("endereço sem página publicada devolve `undefined` — e a rota vira 404", async () => {
    /* Não há reserva em código para uma página livre cair: as três nascem
       CMS-nativas. Despublicar tem que ser um poder real do painel, e um título
       sobre o nada numa rota que a home linka é pior do que o 404 desenhado que
       estava ali antes deste ticket. */
    expect(await buscarPaginaLivre("contato")).toBeUndefined();
  });

  test("RASCUNHO NUNCA VAZA: a leitura pública não vê o que não foi publicado", async () => {
    /* Confirmado em PRA-118 e afirmado de novo aqui: uma leitura `find` comum
       NÃO filtra `_status` sozinha — o Payload devolveria o rascunho junto com
       os publicados se ninguém pedisse filtro. Quem garante é o `where`
       explícito de `lib/paginas-consulta.ts`. */
    await payload.create({
      collection: "paginas",
      data: paginaMinima("contato", "Rascunho que não pode vazar") as never,
    });

    expect(await buscarPaginaLivre("contato")).toBeUndefined();
    expect((await paginaLivreEmRascunho("contato"))?.titulo).toBe(
      "Rascunho que não pode vazar",
    );
  });

  test("o rascunho mais recente ganha do publicado — é o que o preview promete", async () => {
    const { id } = await publicar(paginaMinima("contato", "Título publicado"));

    await payload.update({
      collection: "paginas",
      id,
      draft: true,
      data: { titulo: "Título em rascunho" } as never,
    });

    expect((await buscarPaginaLivre("contato"))?.titulo).toBe("Título publicado");
    expect((await paginaLivreEmRascunho("contato"))?.titulo).toBe(
      "Título em rascunho",
    );
  });
});

describe("a fiação da revalidação", () => {
  test("publicar dispara a etiqueta da própria rota, e só ela", async () => {
    await publicar(paginaMinima("contato", "Onde comprar, e como revender."));

    expect(etiquetas).toEqual([tagDaPaginaLivre("contato")]);
  });

  test("salvar rascunho NÃO dispara etiqueta nenhuma", async () => {
    // Revalidar ao salvar rascunho etiquetaria uma página que o público nem vê
    // — o ponto inteiro de ter rascunho deixaria de existir.
    etiquetas.length = 0;

    await payload.create({
      collection: "paginas",
      data: paginaMinima("arquitetos", "Ainda montando") as never,
    });

    expect(etiquetas).toEqual([]);
  });

  test("apagar dispara as MESMAS etiquetas que publicar", async () => {
    const { id } = await publicar(paginaMinima("contato", "Contato"));
    etiquetas.length = 0;

    await payload.delete({ collection: "paginas", id });

    expect(etiquetas).toEqual([tagDaPaginaLivre("contato")]);
  });

  test("mudar o endereço derruba a rota nova E a antiga", async () => {
    /* A rota antiga é estática: sem isto ela continuaria servindo a composição
       velha até o próximo build, num endereço que a home linka. */
    const { id } = await publicar(paginaMinima("contato", "Contato"));
    etiquetas.length = 0;

    await payload.update({
      collection: "paginas",
      id,
      draft: false,
      data: { slug: "arquitetos", _status: "published" } as never,
    });

    expect(new Set(etiquetas)).toEqual(
      new Set([tagDaPaginaLivre("arquitetos"), tagDaPaginaLivre("contato")]),
    );
  });
});

describe("o que o painel recusa", () => {
  test("um endereço que não é rota do site", async () => {
    /* A recusa mais importante da coleção: uma página publicada num endereço sem
       arquivo de rota existiria no CMS e em URL nenhuma. O `select` já impede o
       gesto na tela; esta afirmação é sobre a API local, que é por onde um seed
       ou um script entra. */
    const recusa = await recusaAoSalvar(
      publicar({ ...paginaMinima("contato", "Contato"), slug: "promocoes" }),
    );

    expect(recusa).toMatch(/endereços da lista|URL/i);
  });

  test("publicar sem nenhum bloco", async () => {
    const recusa = await recusaAoSalvar(
      publicar({ ...paginaMinima("contato", "Contato"), composicao: [] }),
    );

    expect(recusa).toMatch(/ao menos um bloco/i);
  });

  test("mas SALVAR RASCUNHO sem bloco nenhum é aceito", async () => {
    /* História 17 da spec: o operador precisa poder guardar uma montagem pela
       metade entre duas sessões. A validação é UX de PUBLICAÇÃO, não de
       salvamento.

       ⚠️ `draft: true` é o que o botão "Salvar rascunho" do painel manda, e é
       ELE que desliga a validação — não o `_status`. Uma escrita pela API local
       sem esta bandeira roda a validação inteira mesmo gravando um rascunho,
       que é justamente a armadilha em que um seed ou um script cai. */
    const doc = await payload.create({
      collection: "paginas",
      draft: true,
      data: { slug: "contato", titulo: "Começando" } as never,
    });

    expect(doc.id).toBeDefined();
    expect(await buscarPaginaLivre("contato")).toBeUndefined();
  });

  test("dois documentos para o mesmo endereço", async () => {
    // Uma rota, uma composição. Duas seria a rota escolhendo uma delas em
    // silêncio, e a outra sendo editada sem nunca aparecer.
    await publicar(paginaMinima("contato", "Primeira"));

    const recusa = await recusaAoSalvar(
      publicar(paginaMinima("contato", "Segunda")),
    );

    expect(recusa.length).toBeGreaterThan(0);
  });
});
