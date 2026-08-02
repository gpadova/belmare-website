import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

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
import { DESTINOS_DE_CAMINHO, NAVEGACAO, ROTAS_LIVRES } from "@/lib/site";

/** O arquivo de rota que faria um endereço resolver, se ele existir. */
function arquivoDaRota(href: string): string {
  return fileURLToPath(
    new URL(`../app/(frontend)${href}/page.tsx`, import.meta.url),
  );
}

/**
 * O domínio da página livre, sozinho — sem Payload, sem Next, sem banco.
 *
 * ⚠️ O que estes testes protegem é o par "rota que existe em código" × "endereço
 * que o painel pode escolher". As duas listas são a MESMA (`lib/site.ts`), e o
 * dia em que deixarem de ser é o dia em que o painel publica uma página sem URL
 * ou o site abre uma URL sem página.
 */

/** A raiz que o lexical grava, com os nós que lhe forem entregues. */
function corpoDe(nos: Record<string, unknown>[]): ConteudoRico {
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: nos as ConteudoRico["root"]["children"],
    },
  };
}

/** Um parágrafo com texto dentro — a forma completa que o lexical grava. */
function paragrafo(texto: string): Record<string, unknown> {
  return {
    type: "paragraph",
    version: 1,
    children: [{ type: "text", version: 1, text: texto }],
  };
}

/**
 * Um corpo de texto formatado com `quantosNos` parágrafos ESCRITOS.
 *
 * ⚠️ Cada parágrafo carrega um nó de texto de verdade, e não só o nó de
 * parágrafo: um parágrafo sem filhos é como o lexical grava um campo TOCADO E
 * EM BRANCO, e usá-lo como fixture de "tem conteúdo" faria os testes abaixo
 * afirmarem o contrário do que dizem.
 */
function corpoCom(quantosNos: number): ConteudoRico {
  return corpoDe(
    Array.from({ length: quantosNos }, (_, i) => paragrafo(`Parágrafo ${i + 1}.`)),
  );
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
  test("/arquivos-3d entrou na lista no commit em que a rota nasceu — PRA-127", () => {
    /* A asserção INVERTEU, e a inversão é o critério de aceite do último ticket
       do projeto. Até PRA-126 este teste exigia a ausência: `/arquivos-3d` era o
       quarto link interno morto do site, e oferecê-lo no painel seria a Belmare
       montando com as próprias mãos um caminho para lugar nenhum. Com
       `app/(frontend)/arquivos-3d/page.tsx` no ar, manter a ausência passaria a
       esconder do painel a única rota que o menu sempre prometeu. A regra nunca
       foi "não oferecer /arquivos-3d" — é "só oferecer endereço que resolve". */
    expect(ehDestinoInterno("/arquivos-3d")).toBe(true);
    expect(DESTINOS_DE_CAMINHO.map((d) => d.href)).toContain("/arquivos-3d");
  });

  test("todo item do menu é também um destino oferecido no painel", () => {
    /* ⚠️ A guarda que fecha o projeto. O menu é fixo em código e não editável,
       então um item apontando para 404 é defeito de commit, nunca de operador —
       e por três tickets houve exatamente um. Este teste é o que impede o
       próximo item de menu de entrar antes da rota dele: `NAVEGACAO` e
       `DESTINOS_DE_CAMINHO` crescem juntas, ou o menu volta a prometer o que o
       site não tem. */
    for (const item of NAVEGACAO) {
      expect(ehDestinoInterno(item.href)).toBe(true);
    }
  });

  test("nenhum endereço prometido pelo site é 404 — o arquivo de rota existe", () => {
    /* ⚠️ **ESTE É O ÚNICO TESTE DO PROJETO QUE OLHA PARA O DISCO, E É POR ISSO
       QUE ELE VALE.** Os dois de cima provam que as duas listas de `lib/site.ts`
       concordam UMA COM A OUTRA — e duas listas erradas do mesmo jeito
       concordam perfeitamente. Foi exatamente esse o estado do site até
       PRA-127: `DESTINOS_DE_CAMINHO` sabia que `/arquivos-3d` não resolvia e o
       menu prometia mesmo assim, e nenhum teste podia ver a diferença porque
       nenhum teste sabia o que é uma rota. Aqui a asserção é contra o
       filesystem: existe `app/(frontend)/<href>/page.tsx`, ou o endereço é
       mentira. */
    for (const href of [
      ...NAVEGACAO.map((item) => item.href),
      ...DESTINOS_DE_CAMINHO.map((destino) => destino.href),
    ]) {
      expect(existsSync(arquivoDaRota(href)), `${href} não tem rota`).toBe(true);
    }
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

  test("um editor TOCADO e deixado em branco também não vai ao ar", () => {
    /* ⚠️ O caso que a contagem de filhos da raiz deixava passar, e o único
       alcançável enquanto se monta a página: o lexical grava um nó de parágrafo
       sem filhos assim que o campo recebe o foco. Contando a raiz, esse corpo
       tem UM filho e atravessava — desenhando uma seção com título, fio de 1px e
       um vão no lugar do texto, que é literalmente o que a seção anulável
       existe para não ter. É também o que o painel recusa ao publicar; aqui a
       pré-visualização passa a concordar com ele. */
    const tocado: Bloco = {
      tipo: "prosa",
      titulo: "Uma seção sem texto",
      corpo: corpoDe([{ type: "paragraph", version: 1 }]),
    };
    const comTextoVazio: Bloco = {
      tipo: "prosa",
      corpo: corpoDe([
        { type: "paragraph", version: 1, children: [{ type: "text", version: 1, text: "   " }] },
      ]),
    };

    expect(blocosPublicaveis([tocado, comTextoVazio])).toEqual([]);
  });

  test("título e item de lista contam como texto — não são filhos diretos da raiz", () => {
    /* A busca é recursiva de propósito: uma política de privacidade colada do
       advogado pode abrir num `h2`, e uma seção que fosse só uma lista de
       pontos é conteúdo tanto quanto um parágrafo. Uma contagem rasa de nós de
       texto na raiz apagaria as duas. */
    const soTitulo: Bloco = {
      tipo: "prosa",
      corpo: corpoDe([
        { type: "heading", tag: "h2", version: 1, children: [{ type: "text", version: 1, text: "Seus direitos" }] },
      ]),
    };
    const soLista: Bloco = {
      tipo: "prosa",
      corpo: corpoDe([
        {
          type: "list",
          version: 1,
          children: [
            {
              type: "listitem",
              version: 1,
              children: [{ type: "text", version: 1, text: "a sessão do painel;" }],
            },
          ],
        },
      ]),
    };

    expect(blocosPublicaveis([soTitulo, soLista])).toEqual([soTitulo, soLista]);
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
