import type { Field } from "payload";
import { describe, expect, test } from "vitest";

import { BLOCOS_DE_PAGINA } from "@/collections/blocos";
import { Paginas } from "@/collections/paginas";
import { Representadas } from "@/collections/representadas";
import { Home } from "@/globals/home";
import { QuemSomos } from "@/globals/quem-somos";

/**
 * A fronteira entre **página livre** e **espinha fixa**, afirmada sobre a
 * configuração do painel — PRA-124.
 *
 * ⚠️ **É A GUARDA DE UMA RECUSA, NÃO DE UMA FUNCIONALIDADE.** O construtor de
 * blocos existe em exatamente uma coleção, e a lista das que NÃO o têm é o que
 * o ticket protege: a sequência de `/quem-somos` é o argumento daquela página, e
 * ela carrega uma lista vinculante do que nunca pode aparecer nela — foto de
 * equipe, missão/visão/valores, contador animado. Uma biblioteca de blocos
 * genérica oferece exatamente esses três, e um array de blocos ali seria a
 * ferramenta que contorna a lista sem contrariá-la em lugar nenhum. Ver
 * `CONTEXT.md`, "Composição de página".
 *
 * Hoje a fronteira vale por construção — nenhuma outra superfície declara o
 * campo. É por isso que ela precisa de teste: "ninguém escreveu ainda" some no
 * dia em que alguém escrever, e some sem sintoma nenhum.
 */

/** Todo campo declarado numa superfície do painel, entrando nos aninhados. */
function camposEmProfundidade(campos: Field[]): Field[] {
  return campos.flatMap((campo) => [
    campo,
    ...("fields" in campo && Array.isArray(campo.fields)
      ? camposEmProfundidade(campo.fields)
      : []),
    ...("tabs" in campo && Array.isArray(campo.tabs)
      ? camposEmProfundidade(campo.tabs.flatMap((aba) => aba.fields))
      : []),
  ]);
}

function temConstrutorDeBlocos(campos: Field[]): boolean {
  return camposEmProfundidade(campos).some((campo) => campo.type === "blocks");
}

describe("o construtor de blocos", () => {
  test("existe na coleção Página, que é o único lugar onde se COMPÕE", () => {
    expect(temConstrutorDeBlocos(Paginas.fields)).toBe(true);
  });

  test("NÃO existe em nenhuma superfície de espinha fixa", () => {
    /* As três páginas desenhadas em código, na ordem em que o site as
       apresenta. Uma superfície nova de espinha fixa entra nesta lista junto
       com o arquivo dela. */
    const espinhaFixa = [
      { nome: "o global Home", campos: Home.fields },
      { nome: "o global QuemSomos", campos: QuemSomos.fields },
      { nome: "a coleção Representadas", campos: Representadas.fields },
    ];

    for (const { nome, campos } of espinhaFixa) {
      expect(temConstrutorDeBlocos(campos), `${nome} ganhou blocos`).toBe(false);
    }
  });

  test("a biblioteca tem quatro blocos, e são os quatro do ticket", () => {
    /* A lista do que NÃO virou bloco é mais longa que ela, e está em
       `collections/blocos.ts`. Um bloco a mais não acrescenta uma linha a
       preencher: acrescenta uma maneira nova de montar uma página que fica
       errada, e quem descobre o erro é o visitante. */
    expect(BLOCOS_DE_PAGINA.map((bloco) => bloco.slug)).toEqual([
      "prosa",
      "caminhos",
      "ficha",
      "fecho",
    ]);
  });

  test("o bloco de ficha não tem campo de conteúdo — ele LÊ o cadastro", () => {
    /* A ausência é o argumento: endereço, telefones, e-mail e CNPJ já são campo
       do cadastro da empresa. Um campo de conteúdo aqui seria a segunda cópia do
       mesmo telefone, e a segunda é a que ninguém lembra de corrigir. Sobra o
       título da seção, que é escolha de composição, não dado da empresa. */
    const ficha = BLOCOS_DE_PAGINA.find((bloco) => bloco.slug === "ficha");

    expect(ficha?.fields.map((campo) => "name" in campo && campo.name)).toEqual([
      "titulo",
    ]);
  });
});
