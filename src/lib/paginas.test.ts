import { describe, expect, test } from "vitest";

import {
  blocosPublicaveis,
  ehDestinoInterno,
  ehRotaLivre,
  enderecoDaPaginaLivre,
  rotuloDaRotaLivre,
  type Bloco,
  type ConteudoRico,
} from "@/lib/paginas";
import { DESTINOS_DE_CAMINHO, ROTAS_LIVRES } from "@/lib/site";

/**
 * O domínio da página livre, sozinho — sem Payload, sem Next, sem banco.
 *
 * ⚠️ O que estes testes protegem é o par "rota que existe em código" × "endereço
 * que o painel pode escolher". As duas listas são a MESMA (`lib/site.ts`), e o
 * dia em que deixarem de ser é o dia em que o painel publica uma página sem URL
 * ou o site abre uma URL sem página.
 */

/** Um corpo de texto formatado mínimo, na forma que o lexical grava. */
function corpoCom(quantosNos: number): ConteudoRico {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: Array.from({ length: quantosNos }, () => ({
        type: "paragraph",
        version: 1,
      })),
    },
  };
}

describe("o registro de rotas livres", () => {
  test("as três rotas do ticket estão declaradas, e só elas", () => {
    expect(ROTAS_LIVRES.map((rota) => rota.slug)).toEqual([
      "arquitetos",
      "contato",
      "politica-de-privacidade",
    ]);
  });

  test("o endereço de uma rota livre é o slug na raiz do site", () => {
    expect(enderecoDaPaginaLivre("arquitetos")).toBe("/arquitetos");
    expect(enderecoDaPaginaLivre("politica-de-privacidade")).toBe(
      "/politica-de-privacidade",
    );
  });

  test("o sobretítulo é gerado do registro, nunca um campo", () => {
    expect(rotuloDaRotaLivre("contato")).toBe("Contato");
    expect(rotuloDaRotaLivre("politica-de-privacidade")).toBe(
      "Política de privacidade",
    );
  });

  test("um endereço fora do registro não é rota livre", () => {
    // A guarda existe para o dia em que uma rota SAIR do código com um
    // documento gravado ainda apontando para ela: o certo é a composição
    // desaparecer, nunca renderizar numa URL que não existe.
    expect(ehRotaLivre("quem-somos")).toBe(false);
    expect(ehRotaLivre("arquivos-3d")).toBe(false);
    expect(ehRotaLivre("")).toBe(false);
    expect(ehRotaLivre(null)).toBe(false);
    expect(ehRotaLivre("contato")).toBe(true);
  });

  test("toda rota livre é também um destino que um caminho pode apontar", () => {
    // Se uma rota livre existisse e não fosse oferecida como destino, o painel
    // não teria como ligar `/contato` a `/arquitetos` — que é exatamente a
    // ligação que a porta B da home espera encontrar do outro lado.
    for (const rota of ROTAS_LIVRES) {
      expect(ehDestinoInterno(`/${rota.slug}`)).toBe(true);
    }
  });
});

describe("os destinos internos de um caminho", () => {
  test("/arquivos-3d fica FORA da lista enquanto a rota não existe", () => {
    /* É o quarto link interno morto do site e continua 404 até PRA-127. Está na
       NAVEGACAO porque o menu é decisão de estrutura; num campo do painel ele
       seria a Belmare montando com as próprias mãos um caminho para lugar
       nenhum, sem ter como saber disso. */
    expect(ehDestinoInterno("/arquivos-3d")).toBe(false);
    expect(DESTINOS_DE_CAMINHO.map((d) => d.href)).not.toContain("/arquivos-3d");
  });

  test("um endereço inventado não vira link", () => {
    expect(ehDestinoInterno("/promocoes")).toBe(false);
    expect(ehDestinoInterno("https://exemplo.com")).toBe(false);
    expect(ehDestinoInterno(undefined)).toBe(false);
  });
});

describe("blocosPublicaveis", () => {
  test("um bloco de texto com o editor vazio não vai ao ar", () => {
    /* O lexical grava a raiz com zero filhos quando não há nada escrito. Sem
       este portão, o bloco desenharia um fio horizontal e um vão — o oposto de
       seção anulável. */
    const vazio: Bloco = { tipo: "prosa", corpo: corpoCom(0) };
    const escrito: Bloco = { tipo: "prosa", corpo: corpoCom(2) };

    expect(blocosPublicaveis([vazio, escrito])).toEqual([escrito]);
  });

  test("um bloco de caminhos sem nenhum caminho não vai ao ar", () => {
    const vazio: Bloco = { tipo: "caminhos", titulo: "Por onde seguir", itens: [] };
    expect(blocosPublicaveis([vazio])).toEqual([]);
  });

  test("ficha e fecho atravessam sempre — não têm conteúdo próprio para estar vazio", () => {
    /* O que os dois mostram vem de outro lugar: a ficha lê o cadastro da
       empresa, e o fecho é uma ação. Quando o cadastro está vazio quem some é o
       componente, pela mesma regra — não este portão. */
    const ficha: Bloco = { tipo: "ficha" };
    const fecho: Bloco = { tipo: "fecho", contexto: "vim pelo site" };

    expect(blocosPublicaveis([ficha, fecho])).toEqual([ficha, fecho]);
  });

  test("preserva a ordem — a composição é do operador, não da função", () => {
    const primeiro: Bloco = { tipo: "prosa", corpo: corpoCom(1) };
    const segundo: Bloco = { tipo: "ficha" };
    const terceiro: Bloco = { tipo: "fecho", contexto: "vim pelo site" };

    expect(blocosPublicaveis([terceiro, primeiro, segundo])).toEqual([
      terceiro,
      primeiro,
      segundo,
    ]);
  });

  test("é pura: a mesma composição devolve a mesma lista, sempre", () => {
    const blocos: Bloco[] = [{ tipo: "prosa", corpo: corpoCom(1) }, { tipo: "ficha" }];
    expect(blocosPublicaveis(blocos)).toEqual(blocosPublicaveis(blocos));
  });
});
