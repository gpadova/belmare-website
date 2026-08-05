import { describe, expect, test } from "vitest";

import {
  arquivo3DDoPainel,
  arquivos3DDoSite,
  bibliotecaPorRepresentada,
  formatoDoArquivo,
  pacoteDoPainel,
  recorteDaBiblioteca,
  recortesDeFormato,
  recortesDeMarca,
  SEM_RECORTE,
  totalDeArquivos3D,
  type Arquivo3D,
} from "@/lib/arquivos3d";
import type {
  Arquivo as ArquivoGerado,
  Arquivos3D as Arquivo3DGerado,
  Pacote3D as PacoteGerado,
} from "@/payload-types";

/**
 * O formato lido da extensão — sozinho, sem Payload, sem banco.
 *
 * ⚠️ É esta derivação que sustenta o critério de aceite "SKP nunca é erro de
 * digitação": se ela errasse a extensão, ninguém digitando nada teria como
 * perceber, porque não há campo de formato para conferir contra.
 */
describe("formatoDoArquivo", () => {
  test("lê a extensão e devolve em caixa alta, exatamente como o site anuncia", () => {
    expect(formatoDoArquivo("cadeira-zuri.skp")).toBe("SKP");
    expect(formatoDoArquivo("catalogo-2026.PDF")).toBe("PDF");
    expect(formatoDoArquivo("mesa-vitta.dwg")).toBe("DWG");
  });

  test("nome com mais de um ponto usa a ÚLTIMA extensão, não a primeira", () => {
    expect(formatoDoArquivo("cadeira.v2.final.3ds")).toBe("3DS");
  });

  test("sem extensão nenhuma, o formato fica ausente — nunca um chute", () => {
    expect(formatoDoArquivo("cadeira-sem-extensao")).toBeUndefined();
  });

  test("nome vazio ou ausente não derruba a função", () => {
    expect(formatoDoArquivo("")).toBeUndefined();
    expect(formatoDoArquivo(null)).toBeUndefined();
    expect(formatoDoArquivo(undefined)).toBeUndefined();
  });

  test("ponto colado no início do nome não é extensão de verdade", () => {
    // Um nome ".skp" sem nada antes do ponto não tem um "nome de arquivo" que
    // a extensão qualifique — tratar como sem extensão é mais honesto que
    // devolver "SKP" para o que pode ser um arquivo de configuração oculto.
    expect(formatoDoArquivo(".skp")).toBeUndefined();
  });
});

const AGORA = "2026-07-31T00:00:00.000Z";

function arquivo(campos: Partial<ArquivoGerado> = {}): ArquivoGerado {
  return {
    id: 1,
    titulo: "Cadeira Zuri",
    filename: "cadeira-zuri.skp",
    url: "https://arquivos.belmare.com.br/cadeira-zuri.skp",
    filesize: 8_400_000,
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

function documento(campos: Partial<Arquivo3DGerado> = {}): Arquivo3DGerado {
  return {
    id: 1,
    representada: 1,
    nome: "Cadeira Zuri",
    arquivo: arquivo(),
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

/**
 * O mapper de Arquivo3D — mesma disciplina de `lib/representadas-traducao.ts`:
 * nenhum estado gerado é inventado, e o que não pode ser medido não vira
 * meio-objeto, vira ausência completa.
 */
describe("o arquivo 3D, do painel para a página", () => {
  test("em mãos e medido, formato e peso chegam junto do nome e do endereço", () => {
    const item = arquivo3DDoPainel(documento());

    expect(item).toEqual({
      nome: "Cadeira Zuri",
      url: "https://arquivos.belmare.com.br/cadeira-zuri.skp",
      formato: "SKP",
      mb: 8_400_000 / (1024 * 1024),
    });
  });

  test("arquivo que veio só como identificador não vira item pela metade", () => {
    // Profundidade 0: o upload volta como número, e nem endereço nem tamanho
    // existem ali. Diferente do catálogo, não há "a pedir" aqui — o item
    // inteiro fica ausente.
    expect(arquivo3DDoPainel(documento({ arquivo: 9 }))).toBeUndefined();
  });

  test("arquivo sem tamanho gravado não vira item com peso inventado", () => {
    expect(
      arquivo3DDoPainel(
        documento({ arquivo: arquivo({ filesize: null }) }),
      ),
    ).toBeUndefined();
  });

  test("arquivo sem extensão legível não vira item com formato inventado", () => {
    expect(
      arquivo3DDoPainel(
        documento({ arquivo: arquivo({ filename: "cadeira-sem-extensao" }) }),
      ),
    ).toBeUndefined();
  });
});

/* ------------------------------------------------------------------------- *
   PRA-127 — a biblioteca agrupada e o pacote completo.
 * ------------------------------------------------------------------------- */

function pacote(campos: Partial<PacoteGerado> = {}): PacoteGerado {
  return {
    id: 1,
    pacote: arquivo({
      titulo: "Pacote Belmare",
      filename: "pacote-belmare.zip",
      url: "https://arquivos.belmare.com.br/pacote-belmare.zip",
      filesize: 65_400_000,
    }),
    updatedAt: AGORA,
    createdAt: AGORA,
    ...campos,
  };
}

/**
 * O pacote completo — o ÚNICO download do site atrás de cadastro, e por isso o
 * que menos pode chegar pela metade.
 *
 * ⚠️ Um pacote sem peso ou sem formato legível tem que virar ausência COMPLETA,
 * porque é a ausência que apaga o formulário junto com a seção. Um pacote
 * "existente mas não declarável" seria a única forma de o site pedir nome,
 * e-mail, cidade e escritório em troca de um arquivo que ele não sabe descrever.
 */
describe("o pacote completo, do painel para a página", () => {
  test("em mãos e medido, formato e peso chegam com o endereço", () => {
    expect(pacoteDoPainel(pacote())).toEqual({
      url: "https://arquivos.belmare.com.br/pacote-belmare.zip",
      formato: "ZIP",
      mb: 65_400_000 / (1024 * 1024),
    });
  });

  test("sem pacote cadastrado não há pacote — e a seção inteira some com ele", () => {
    expect(pacoteDoPainel(pacote({ pacote: null }))).toBeUndefined();
    expect(pacoteDoPainel(pacote({ pacote: undefined }))).toBeUndefined();
  });

  test("pacote que veio só como identificador não vira download mudo", () => {
    expect(pacoteDoPainel(pacote({ pacote: 9 }))).toBeUndefined();
  });

  test("pacote sem peso medido não é oferecido em troca de cadastro", () => {
    // O peso vem ANTES do formulário. Um gate que só revela o tamanho depois de
    // a pessoa entregar os dados é a quebra de promessa na pior versão: já se
    // pagou.
    expect(
      pacoteDoPainel(pacote({ pacote: arquivo({ filesize: 0 }) })),
    ).toBeUndefined();
  });

  test("pacote sem extensão legível não é oferecido em troca de cadastro", () => {
    expect(
      pacoteDoPainel(pacote({ pacote: arquivo({ filename: "pacote" }) })),
    ).toBeUndefined();
  });
});

const ITEM: Arquivo3D = {
  nome: "Cadeira Zuri",
  url: "https://arquivos.belmare.com.br/cadeira-zuri.skp",
  formato: "SKP",
  mb: 8.4,
};

/**
 * O agrupamento por representada — **seção anulável aplicada a uma lista de
 * listas**.
 *
 * ⚠️ Hoje NENHUMA das quatro fábricas tem arquivo 3D cadastrado, então a
 * implementação literal do briefing ("lista por marca") renderiza quatro
 * cabeçalhos sobre nada. É o mesmo modo de falha que `/catalogos` já resolveu
 * uma vez, e a regra de `CONTEXT.md` é literal: o pior resultado de um dado
 * ausente é menos página, nunca página quebrada.
 */
describe("a biblioteca agrupada por representada", () => {
  test("a fábrica sem arquivo nenhum não vira cabeçalho órfão", () => {
    expect(
      bibliotecaPorRepresentada([
        { marca: "trisol", arquivos: [ITEM] },
        { marca: "bux-garden", arquivos: [] },
      ]),
    ).toEqual([{ marca: "trisol", arquivos: [ITEM] }]);
  });

  test("nenhuma fábrica com arquivo devolve lista vazia — a página escreve o estado", () => {
    // O estado real do acervo em 31/07/2026. A rota não pode desenhar quatro
    // títulos e um fio embaixo de cada.
    expect(
      bibliotecaPorRepresentada([
        { marca: "trisol", arquivos: [] },
        { marca: "bux-garden", arquivos: [] },
      ]),
    ).toEqual([]);
  });

  test("a ordem das marcas é preservada — agrupar não reordena", () => {
    // A ordem vem de `Representada.ordem`, que é decisão de apresentação da
    // Belmare. Reordenar aqui seria uma segunda opinião sobre um campo que já
    // tem dono.
    const grupos = bibliotecaPorRepresentada([
      { marca: "b", arquivos: [ITEM] },
      { marca: "a", arquivos: [ITEM] },
    ]);

    expect(grupos.map((g) => g.marca)).toEqual(["b", "a"]);
  });

  test("a contagem total é gerada dos grupos, nunca escrita à mão", () => {
    expect(
      totalDeArquivos3D([
        { arquivos: [ITEM, ITEM] },
        { arquivos: [ITEM] },
      ]),
    ).toBe(3);

    expect(totalDeArquivos3D([])).toBe(0);
  });
});

const skp = (nome: string): Arquivo3D => ({ ...ITEM, nome, formato: "SKP" });
const dwg = (nome: string): Arquivo3D => ({ ...ITEM, nome, formato: "DWG" });

const TRISOL = { slug: "trisol", nome: "Trisol" };
const GDA = { slug: "gda", nome: "GDA" };

/**
 * A biblioteca achatada em uma lista só — o que substituiu o agrupamento por
 * `<h2>` de fábrica e `<h3>` de formato em 05/08/2026.
 *
 * ⚠️ O que estes testes protegem é a ORDEM, que é a única coisa que o
 * agrupamento dava de graça e a lista plana precisa afirmar: a fábrica manda, o
 * nome da peça vem depois, e o formato desempata — para "Cadeira Zuri" em `.skp`
 * e em `.dwg` saírem encostadas uma na outra em vez de separadas por tudo que
 * caia entre elas no alfabeto.
 */
describe("a biblioteca inteira, achatada em lista", () => {
  test("a ordem das fábricas é a que chegou do painel, nunca alfabética", () => {
    // `Representada.ordem` é campo de painel, e é a mesma ordem da galeria da
    // home. Reordenar por nome aqui faria a mesma marca aparecer em primeiro num
    // lugar e em terceiro no outro.
    expect(
      arquivos3DDoSite([
        { marca: TRISOL, arquivos: [skp("Mesa Vitta")] },
        { marca: GDA, arquivos: [skp("Cadeira Zuri")] },
      ]).map(({ marca }) => marca.slug),
    ).toEqual(["trisol", "gda"]);
  });

  test("a mesma peça em dois formatos sai em linhas ENCOSTADAS, e é o caso que motivava o agrupamento", () => {
    expect(
      arquivos3DDoSite([
        {
          marca: TRISOL,
          arquivos: [skp("Cadeira Zuri"), dwg("Mesa Vitta"), dwg("Cadeira Zuri")],
        },
      ]).map(({ arquivo }) => `${arquivo.nome} ${arquivo.formato}`),
    ).toEqual(["Cadeira Zuri DWG", "Cadeira Zuri SKP", "Mesa Vitta DWG"]);
  });

  test("a marca é estreitada a slug e nome — a `Representada` inteira não atravessa para o cliente", () => {
    const [item] = arquivos3DDoSite([
      {
        // O excesso que uma `Representada` de verdade carrega: fotografia,
        // ficha, designers. Nada disso pode sair daqui.
        marca: { ...TRISOL, foto: "capa.jpg" } as typeof TRISOL,
        arquivos: [skp("Cadeira Zuri")],
      },
    ]);

    expect(item.marca).toEqual({ slug: "trisol", nome: "Trisol" });
  });

  test("sem grupo nenhum, lista vazia — e não uma linha sem dono", () => {
    expect(arquivos3DDoSite([])).toEqual([]);
  });
});

/**
 * Os dois eixos do filtro.
 *
 * ⚠️ O que estes testes protegem é a promessa que o número ao lado de cada opção
 * faz: ele é **quantas linhas sobram se você clicar aqui**, contado sobre a
 * lista já recortada pelo outro eixo. É a regra do `SKP · 8,4 MB` aplicada a um
 * controle — declarar o custo do clique antes do clique — e é ela que impede a
 * combinação que devolve tela vazia.
 */
describe("os recortes de cada eixo", () => {
  const BIBLIOTECA = arquivos3DDoSite([
    { marca: TRISOL, arquivos: [skp("Cadeira Zuri"), dwg("Cadeira Zuri")] },
    { marca: GDA, arquivos: [skp("Mesa Vitta")] },
  ]);

  test("as fábricas saem na ordem de aparição, com a contagem de cada uma", () => {
    expect(recortesDeMarca(BIBLIOTECA)).toEqual([
      { chave: "trisol", rotulo: "Trisol", quantidade: 2 },
      { chave: "gda", rotulo: "GDA", quantidade: 1 },
    ]);
  });

  test("os formatos saem em ordem alfabética — `formato` é gerado, não há campo de ordem a respeitar", () => {
    expect(recortesDeFormato(BIBLIOTECA)).toEqual([
      { chave: "DWG", rotulo: "DWG", quantidade: 1 },
      { chave: "SKP", rotulo: "SKP", quantidade: 2 },
    ]);
  });

  test("um eixo só oferece o que existe na lista que recebe — nunca uma opção que zera a tela", () => {
    // O caso do filtro por formato que a rota recusou duas vezes por escrito:
    // quatro botões sobre zero arquivo. Com as opções saindo da lista, ele não
    // tem como nascer.
    expect(recortesDeFormato([])).toEqual([]);
    expect(recortesDeMarca([])).toEqual([]);
  });

  test("o eixo do formato conta sobre a fábrica escolhida, e o da fábrica sobre o formato escolhido", () => {
    const { marcas, formatos } = recorteDaBiblioteca(
      BIBLIOTECA,
      "gda",
      SEM_RECORTE,
    );

    // Escolhida a GDA, o eixo do formato só oferece o que a GDA tem — DWG some,
    // porque `GDA + DWG` seria dois controles concordando em zerar a tela.
    expect(formatos).toEqual([{ chave: "SKP", rotulo: "SKP", quantidade: 1 }]);
    // Já o eixo da fábrica não se recorta por si mesmo: as duas continuam lá.
    expect(marcas.map((o) => o.chave)).toEqual(["trisol", "gda"]);
  });
});

/**
 * O recorte ativo, e a cascata que impede a tela presa.
 *
 * ⚠️ O estado guardado no navegador é a INTENÇÃO de quem clicou; o recorte de
 * fato é derivado. Uma marca que perde o último arquivo, ou um formato que some
 * quando o `.dwg` é despublicado, deixariam o estado apontando para uma chave
 * sem correspondente — e a tela ficaria vazia sem nada na página explicando por
 * quê.
 */
describe("o recorte ativo da biblioteca", () => {
  const BIBLIOTECA = arquivos3DDoSite([
    { marca: TRISOL, arquivos: [skp("Cadeira Zuri"), dwg("Cadeira Zuri")] },
    { marca: GDA, arquivos: [skp("Mesa Vitta")] },
  ]);

  test("sem recorte nenhum, tudo aparece", () => {
    const { visiveis } = recorteDaBiblioteca(
      BIBLIOTECA,
      SEM_RECORTE,
      SEM_RECORTE,
    );

    expect(visiveis).toHaveLength(3);
  });

  test("os dois eixos se cruzam — fábrica E formato, não fábrica OU formato", () => {
    const { visiveis } = recorteDaBiblioteca(BIBLIOTECA, "trisol", "SKP");

    expect(visiveis.map(({ arquivo }) => arquivo.nome)).toEqual([
      "Cadeira Zuri",
    ]);
  });

  test("um formato que recorta as fábricas todas de uma vez — o que agrupar nunca deu", () => {
    const { visiveis } = recorteDaBiblioteca(BIBLIOTECA, SEM_RECORTE, "SKP");

    expect(visiveis.map(({ marca }) => marca.slug)).toEqual(["trisol", "gda"]);
  });

  test("marca que deixou de existir cai fora, e o formato escolhido SOBREVIVE", () => {
    const { marca, formato, visiveis } = recorteDaBiblioteca(
      BIBLIOTECA,
      "marca-que-sumiu",
      "SKP",
    );

    expect(marca).toBe(SEM_RECORTE);
    expect(formato).toBe("SKP");
    expect(visiveis).toHaveLength(2);
  });

  test("formato que deixou de existir cai fora, e a marca escolhida SOBREVIVE", () => {
    const { marca, formato, visiveis } = recorteDaBiblioteca(
      BIBLIOTECA,
      "gda",
      "3DS",
    );

    expect(marca).toBe("gda");
    expect(formato).toBe(SEM_RECORTE);
    expect(visiveis).toHaveLength(1);
  });

  test("com os dois recortes inválidos a cascata chega ao fim e mostra tudo", () => {
    const { marca, formato, visiveis } = recorteDaBiblioteca(
      BIBLIOTECA,
      "marca-que-sumiu",
      "3DS",
    );

    expect(marca).toBe(SEM_RECORTE);
    expect(formato).toBe(SEM_RECORTE);
    expect(visiveis).toHaveLength(3);
  });
});
