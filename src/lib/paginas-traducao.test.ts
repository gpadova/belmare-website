import { describe, expect, test } from "vitest";

import { paginaDoPainel } from "@/lib/paginas-traducao";
import type { Pagina as PaginaGerada } from "@/payload-types";

/**
 * O mapper de página livre, sozinho — sem banco e sem painel.
 *
 * ⚠️ **É AQUI QUE OS ESTADOS QUE O BANCO ESCONDE SÃO AFIRMADOS.** O tipo gerado
 * pelo Payload declara os campos condicionais de um caminho como opcionais —
 * `destino: "rota"` com `rota` nulo é uma linha que o banco aceita, porque a
 * regra que os torna obrigatórios vive na validação do painel (UX de editor) e
 * não no esquema. Um teste de integração não alcança esses estados sem burlar a
 * própria validação; um teste puro os escreve à mão em três linhas.
 *
 * ⚠️ E é a garantia que o live preview depende: sob o iframe, este mapper roda a
 * cada tecla, sobre um documento que está sendo montado agora. Um mapper que
 * lançasse com `destino` ainda não escolhido derrubaria o quadro no primeiro
 * clique em "adicionar bloco".
 */

/** Um corpo de texto formatado com um parágrafo dentro. */
const CORPO = {
  root: {
    type: "root",
    version: 1,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    children: [{ type: "paragraph", version: 1 }],
  },
};

function documento(campos: Partial<PaginaGerada> = {}): PaginaGerada {
  return {
    id: 1,
    slug: "contato",
    titulo: "Onde comprar, e como revender.",
    resumo: "A Belmare não vende direto.",
    composicao: [],
    updatedAt: "2026-07-31T12:00:00.000Z",
    createdAt: "2026-07-31T12:00:00.000Z",
    _status: "published",
    ...campos,
  } as PaginaGerada;
}

describe("paginaDoPainel", () => {
  test("traduz os campos da página e a composição vazia", () => {
    const pagina = paginaDoPainel(documento());

    expect(pagina).toEqual({
      slug: "contato",
      titulo: "Onde comprar, e como revender.",
      resumo: "A Belmare não vende direto.",
      composicao: [],
    });
  });

  test("resumo em branco é resumo AUSENTE, não string vazia", () => {
    // "Ausente é ausente, nunca vazio": uma descrição em branco no `<meta>` é
    // pior do que nenhuma — o Google mostra a tag vazia em vez de compor um
    // trecho da própria página.
    const pagina = paginaDoPainel(documento({ resumo: "   " }));
    expect(pagina && "resumo" in pagina).toBe(false);
  });

  test("sem título não há página — o h1 é o que a rota desenha primeiro", () => {
    expect(paginaDoPainel(documento({ titulo: "  " }))).toBeUndefined();
  });

  test("endereço fora do registro de rotas não vira página", () => {
    /* Só acontece se uma rota for retirada do código com um documento ainda
       apontando para ela. Nesse dia o certo é a composição desaparecer, não
       renderizar numa URL que não existe. */
    const fora = documento({ slug: "quem-somos" as PaginaGerada["slug"] });
    expect(paginaDoPainel(fora)).toBeUndefined();
  });
});

describe("os caminhos — a união que o tipo gerado não consegue expressar", () => {
  function comCaminhos(itens: unknown[]) {
    return paginaDoPainel(
      documento({
        composicao: [
          { blockType: "caminhos", itens } as never,
        ] as PaginaGerada["composicao"],
      }),
    );
  }

  test("um caminho de rota vira link; um de WhatsApp vira contexto", () => {
    const pagina = comCaminhos([
      { rotulo: "Ver os catálogos", destino: "rota", rota: "/catalogos" },
      {
        rotulo: "Quero revender",
        apoio: "Mande a cidade e o perfil da operação.",
        destino: "whatsapp",
        contexto: "quero propor uma revenda",
      },
    ]);

    expect(pagina?.composicao).toEqual([
      {
        tipo: "caminhos",
        itens: [
          { destino: "rota", rotulo: "Ver os catálogos", href: "/catalogos" },
          {
            destino: "whatsapp",
            rotulo: "Quero revender",
            apoio: "Mande a cidade e o perfil da operação.",
            contexto: "quero propor uma revenda",
          },
        ],
      },
    ]);
  });

  test("um caminho de formulário atravessa sem precisar de campo nenhum (PRA-126)", () => {
    // Diferente de rota e whatsapp, o formulário não tem dado próprio para
    // faltar — os campos dele são fixos em `lib/lead.ts`, não neste bloco.
    const pagina = comCaminhos([
      {
        rotulo: "Quero revender",
        apoio: "Mande a cidade e o perfil da operação.",
        destino: "formulario",
      },
    ]);

    expect(pagina?.composicao).toEqual([
      {
        tipo: "caminhos",
        itens: [
          {
            destino: "formulario",
            rotulo: "Quero revender",
            apoio: "Mande a cidade e o perfil da operação.",
          },
        ],
      },
    ]);
  });

  test("caminho de rota sem rota escolhida é DESCARTADO, nunca apontado para a home", () => {
    // Um rascunho salvo no meio da montagem chega exatamente assim. Completar
    // com um destino plausível seria o site inventando navegação.
    const pagina = comCaminhos([
      { rotulo: "Pela metade", destino: "rota" },
      { rotulo: "Inteiro", destino: "rota", rota: "/representadas" },
    ]);

    expect(pagina?.composicao).toEqual([
      {
        tipo: "caminhos",
        itens: [{ destino: "rota", rotulo: "Inteiro", href: "/representadas" }],
      },
    ]);
  });

  test("caminho de rota apontando para endereço que não existe é descartado", () => {
    /* `/arquivos-3d` é o caso real: a rota continua 404 até PRA-127, e a lista
       de destinos do painel não a oferece. Um documento gravado antes de uma
       rota sair do código cai aqui. */
    expect(comCaminhos([
      { rotulo: "Arquivos 3D", destino: "rota", rota: "/arquivos-3d" },
    ])?.composicao).toEqual([]);
  });

  test("caminho de WhatsApp sem contexto é descartado", () => {
    // Sem contexto a conversa chega em branco e ninguém sabe de que página o
    // contato veio — que é a única qualificação de lead que o site tem.
    expect(comCaminhos([
      { rotulo: "Falar", destino: "whatsapp", contexto: "  " },
    ])?.composicao).toEqual([]);
  });

  test("um bloco de caminhos que perdeu todos os caminhos sai da composição", () => {
    // Seção anulável: título e fio sobre uma lista vazia é um bloco quebrado.
    expect(comCaminhos([{ rotulo: "Só o rótulo" }])?.composicao).toEqual([]);
  });
});

describe("os outros três blocos", () => {
  function comBlocos(blocos: unknown[]) {
    return paginaDoPainel(
      documento({ composicao: blocos as PaginaGerada["composicao"] }),
    );
  }

  test("um bloco de texto com o editor vazio não vai ao ar", () => {
    const vazio = { root: { ...CORPO.root, children: [] } };

    expect(comBlocos([{ blockType: "prosa", corpo: vazio }])?.composicao).toEqual(
      [],
    );
  });

  test("um corpo que não é árvore de texto formatado não derruba a página", () => {
    /* Não é paranoia: é a mesma leitura defensiva do resto de `lib`. O campo
       chega do banco, e o pior resultado de um valor inesperado é menos página,
       nunca uma rota que lança. */
    expect(comBlocos([{ blockType: "prosa", corpo: null }])?.composicao).toEqual(
      [],
    );
    expect(
      comBlocos([{ blockType: "prosa", corpo: { root: {} } }])?.composicao,
    ).toEqual([]);
  });

  test("a ficha não tem conteúdo próprio — atravessa mesmo sem título", () => {
    expect(comBlocos([{ blockType: "ficha" }])?.composicao).toEqual([
      { tipo: "ficha" },
    ]);
  });

  test("o fecho sem contexto é descartado; com contexto, atravessa", () => {
    expect(comBlocos([{ blockType: "fecho", contexto: "" }])?.composicao).toEqual(
      [],
    );

    expect(
      comBlocos([
        { blockType: "fecho", rotulo: "Falar com quem representa", contexto: "vim pelo site" },
      ])?.composicao,
    ).toEqual([
      { tipo: "fecho", rotulo: "Falar com quem representa", contexto: "vim pelo site" },
    ]);
  });

  test("um bloco de tipo desconhecido é ignorado, e a página continua de pé", () => {
    // Um bloco retirado da biblioteca deixa documentos gravados com o tipo
    // antigo. A composição perde aquele bloco; a rota não quebra.
    const pagina = comBlocos([
      { blockType: "galeria" },
      { blockType: "prosa", corpo: CORPO },
    ]);

    expect(pagina?.composicao).toEqual([{ tipo: "prosa", corpo: CORPO }]);
  });

  test("a ordem da composição é preservada — ela é o único desenho da página", () => {
    const pagina = comBlocos([
      { blockType: "fecho", contexto: "vim pelo site" },
      { blockType: "prosa", corpo: CORPO },
      { blockType: "ficha" },
    ]);

    expect(pagina?.composicao.map((bloco) => bloco.tipo)).toEqual([
      "fecho",
      "prosa",
      "ficha",
    ]);
  });
});
