import { describe, expect, test } from "vitest";

import {
  TAG_CATALOGOS,
  TAG_HOME,
  TAG_QUEM_SOMOS,
  TAG_REPRESENTADAS,
  TAG_RODAPE,
  TAG_SITE,
  tagDaRepresentada,
  tagsDaMudanca,
} from "@/lib/revalidacao";

/**
 * A derivação de etiquetas, sozinha — sem Payload, sem Next, sem servidor.
 *
 * ⚠️ Isto é o que a spec chama de "o fan-out assertável sem simular
 * internals do framework": cada teste chama `tagsDaMudanca` com um objeto
 * comum e confere a lista que volta. Nenhum `unstable_cache`, nenhum
 * `revalidateTag`, nenhum mock de nada — se um destes testes precisasse
 * simular o Next, a derivação não estaria pura o bastante.
 */
describe("tagsDaMudanca", () => {
  test("mudar uma representada cobre as seis superfícies onde ela aparece, rodapé incluso", () => {
    const tags = tagsDaMudanca({ colecao: "representadas", slug: "trisol" });

    // As seis, conferidas contra o que o código de fato renderiza hoje: a
    // home, o ledger de /quem-somos, a prancha e os registros de
    // /representadas, a própria página, /catalogos e o rodapé — que vive no
    // layout e por isso está em toda rota do site, inclusive a 404.
    expect(new Set(tags)).toEqual(
      new Set([
        TAG_HOME,
        TAG_QUEM_SOMOS,
        TAG_REPRESENTADAS,
        TAG_CATALOGOS,
        TAG_RODAPE,
        tagDaRepresentada("trisol"),
      ]),
    );
  });

  test("cada marca recebe a própria etiqueta — editar a Trisol não invalida a página da Bux", () => {
    const trisol = tagsDaMudanca({ colecao: "representadas", slug: "trisol" });
    const bux = tagsDaMudanca({ colecao: "representadas", slug: "bux-garden" });

    expect(trisol).toContain(tagDaRepresentada("trisol"));
    expect(bux).toContain(tagDaRepresentada("bux-garden"));
    expect(trisol).not.toContain(tagDaRepresentada("bux-garden"));
  });

  test("mudar a identidade da empresa deriva a etiqueta do site inteiro, e só ela", () => {
    // Sem lista de seis aqui: a identidade da empresa mora no rodapé e
    // potencialmente em qualquer página, então a mudança já É o site
    // inteiro — uma etiqueta, não uma enumeração de rotas.
    expect(tagsDaMudanca({ colecao: "empresa" })).toEqual([TAG_SITE]);
  });

  test("os outros dois globais derivam UMA página cada, e não o site inteiro — PRA-122", () => {
    /* O contraste que dá sentido a `TAG_SITE`. Ser global não é o que põe a
       `Empresa` em toda rota — é o RODAPÉ, que mora no layout. A prosa da home
       não aparece em `/quem-somos` e vice-versa, e dar a etiqueta do site aos
       três invalidaria a página estática de quatro marcas que não mudaram toda
       vez que alguém corrigisse uma vírgula. */
    expect(tagsDaMudanca({ colecao: "home" })).toEqual([TAG_HOME]);
    expect(tagsDaMudanca({ colecao: "quem-somos" })).toEqual([TAG_QUEM_SOMOS]);

    expect(tagsDaMudanca({ colecao: "home" })).not.toContain(TAG_SITE);
    expect(tagsDaMudanca({ colecao: "quem-somos" })).not.toContain(TAG_SITE);
  });

  test("apagar deriva as mesmas etiquetas que mudar — a função nem recebe o tipo de operação", () => {
    // A assinatura de `MudancaNoPainel` não tem "operação": mudar e apagar
    // chamam a função com o mesmo evento, e por isso derivam a mesma lista
    // sempre. A paridade não é uma verificação em tempo de execução — é uma
    // ausência no tipo, a mesma tática de `lib/representadas.ts`.
    const evento = { colecao: "representadas" as const, slug: "gda-moveis" };
    expect(tagsDaMudanca(evento)).toEqual(tagsDaMudanca(evento));
  });

  test("é pura: a mesma entrada devolve a mesma lista, sempre", () => {
    const evento = { colecao: "representadas" as const, slug: "mare-mobilia" };
    const primeira = tagsDaMudanca(evento);
    const segunda = tagsDaMudanca(evento);

    expect(primeira).toEqual(segunda);
  });

  test("peça, arquivo 3D e acabamento derivam só a etiqueta da própria marca — PRA-120", () => {
    // Nenhum dos três aparece em outra superfície além da página da marca a
    // que pertence: sem galeria, sem ledger, sem /catalogos equivalente. O
    // fan-out inteiro é a etiqueta que já existe para a representada.
    expect(tagsDaMudanca({ colecao: "pecas", representadaSlug: "trisol" })).toEqual([
      tagDaRepresentada("trisol"),
    ]);
    expect(
      tagsDaMudanca({ colecao: "arquivos3d", representadaSlug: "gda-moveis" }),
    ).toEqual([tagDaRepresentada("gda-moveis")]);
    expect(
      tagsDaMudanca({ colecao: "acabamentos", representadaSlug: "bux-garden" }),
    ).toEqual([tagDaRepresentada("bux-garden")]);
  });

  test("projeto deriva só a etiqueta de /quem-somos — PRA-121, o caso sem slug de marca", () => {
    // Diferente de peça/arquivo3D/acabamento, um projeto não pende de UMA
    // representada — ele cita várias, e a única superfície onde aparece é a
    // seção anulável de /quem-somos. O evento nem carrega slug: mudar
    // qualquer projeto invalida a página inteira, porque o portão de três
    // depende do conjunto publicado, não de um documento isolado.
    expect(tagsDaMudanca({ colecao: "projetos" })).toEqual([TAG_QUEM_SOMOS]);
  });
});
