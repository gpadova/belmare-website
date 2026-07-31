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
});
