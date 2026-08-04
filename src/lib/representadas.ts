import {
  IMAGEM_DA_MARCA,
  IMAGEM_LARGA_DA_MARCA,
  type Imagem,
} from "@/lib/acervo";

/**
 * As representadas.
 *
 * ⚠️ Cada campo aqui é fato verificado em fonte pública ou confirmado pelo
 * cliente. Nada é adjetivo, nada é estimativa. Se um dado não existe, o campo
 * fica ausente — não é preenchido. A voz da marca ("dado antes de adjetivo")
 * só funciona porque tudo aqui é verdade específica. A base da Trisol não é
 * conhecida (só o DDD 48), por isso ela não declara cidade.
 *
 * ⚠️ ESTE É O FORMATO QUE O CMS VAI PREENCHER, e ele espelha a decisão de
 * estrutura de 30/07/2026: o site é uma ÁRVORE COM RAIZ NA MARCA. Peça em
 * destaque, arquivo 3D e acabamento pendem daqui, cada um com um pai só; o
 * catálogo é um CAMPO da marca, não uma coleção. Nada atravessa — não existe
 * taxonomia global de material, e o filtro do catálogo nunca sai da marca.
 * Cada fábrica usa o próprio vocabulário de categoria, o que permite publicar
 * marca a marca sem esperar a lacuna da outra. Ver `briefing/estrutura.md` §4.
 *
 * A lista é um array e não um quarteto fixo: não se sabe se o portfólio cresce
 * (P18), e a home é composta em linhas justamente para aceitar N.
 *
 * ⚠️ **A ASSIMETRIA ENTRE AS QUATRO É DADO, NÃO LACUNA A PREENCHER.** A Marê
 * tem oito assinaturas e dezenove categorias e não declara um único material;
 * a Trisol declara a linha técnica inteira e não tem designer nem cidade; a Bux
 * não tem taxonomia (P30). Por isso todo campo abaixo do `fato` é opcional, e
 * por isso a página de marca é feita de seções que somem quando o dado não
 * existe. Preencher qualquer um deles por simetria é inventar.
 */

/** Um designer que assina para a fábrica. `colecoes` só onde a atribuição é
 *  pública — a GDA nomeia os designers e as coleções, mas não liga uma coisa à
 *  outra, e ligar aqui seria palpite com cara de ficha. */
export type Designer = {
  nome: string;
  colecoes?: string[];
  nota?: string;
};

/** O que a fábrica diz de si, em rótulo e valor. Sempre nas palavras dela. */
export type Declaracao = {
  rotulo: string;
  valor: string;
};

export type ItemDeCategoria = {
  nome: string;
  /** Só onde a fábrica publica a distinção. Nunca inferida do nome. */
  nota?: string;
};

export type GrupoDeCategoria = {
  nome: string;
  /** Entra na URL como `?grupo=` quando a marca tem eixo. Sem acento. */
  slug: string;
  itens: ItemDeCategoria[];
};

/**
 * O vocabulário da própria fábrica. `eixo` é o primeiro nível quando ela
 * declara um (a GDA separa por ambiente, a Trisol por tipo de haste); sem eixo,
 * é uma lista só e não há filtro para oferecer.
 */
export type Vocabulario = {
  eixo?: string;
  grupos: GrupoDeCategoria[];
};

/**
 * O catálogo é CAMPO da marca, não coleção — não tem página, não tem rota, e
 * `/catalogos` é uma VISTA sobre este mesmo dado, nunca uma segunda árvore.
 *
 * ⚠️ **DUAS ESCRITAS, NÃO DUAS ENTIDADES.** Um documento existe no mundo antes
 * de existir em disco: a Trisol publica a edição 2026 no site dela, e a Belmare
 * ainda não recebeu o arquivo. Se só o documento com PDF em mãos pudesse ser
 * declarado, a página teria que escolher entre mentir (link para um arquivo que
 * não existe) e mentir por omissão (fingir que a Trisol não tem catálogo). Por
 * isso `arquivo` e `mb` são o par que discrimina os dois estados, e um estado
 * vira o outro preenchendo dois campos — sem tipo novo, sem linha nova, sem
 * layout novo.
 *
 * ⚠️ **`arquivo` e `mb` andam juntos ou não andam.** O tipo impõe isso porque
 * peso é a promessa que a linha faz antes do clique, e um link sem peso medido
 * é exatamente a promessa que este site existe para não quebrar. O peso sai do
 * arquivo medido — nunca estimado, nunca copiado de wireframe.
 *
 * ⚠️ `ano` é opcional e só entra quando a edição é conhecida em fonte pública.
 * A Marê e a GDA publicam catálogo sem dizer de que ano (P22): a linha escreve
 * "Edição não declarada" com todas as letras, e não inventa um 2025 plausível.
 */
type CatalogoBase = {
  /** Como o documento se chama. Sem edição inventada dentro do título. */
  titulo: string;
  /** Só quando a edição é conhecida em fonte pública. */
  ano?: number;
};

/** Arquivo em mãos e medido: a linha baixa o PDF. */
export type CatalogoPublicado = CatalogoBase & {
  arquivo: string;
  /** Tamanho real do arquivo, medido. Nunca estimado. */
  mb: number;
};

/** Documento que existe na fábrica e ainda não em disco: a linha pede. */
export type CatalogoAPedir = CatalogoBase & {
  arquivo?: undefined;
  mb?: undefined;
};

export type Catalogo = CatalogoPublicado | CatalogoAPedir;

export function catalogoPublicado(c: Catalogo): c is CatalogoPublicado {
  return c.arquivo !== undefined;
}

/**
 * O peso de um arquivo, sempre com uma casa decimal.
 *
 * ⚠️ `toLocaleString("pt-BR")` sozinho devolve "8,4" para 8.4 e "24" para 24 —
 * e aí a mesma tabela mostra `PDF · 24 MB` embaixo de `SKP · 8,4 MB`, com as
 * casas desalinhadas numa coluna de numeral tabular. A casa fixa é o que faz a
 * coluna ler como medida em vez de como texto, e é por isso que existe uma
 * função e não uma chamada solta em cada lugar que imprime peso.
 */
export function pesoEmMB(mb: number): string {
  return mb.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export type Representada = {
  slug: string;
  nome: string;
  /** A linha que a fábrica produz, em uma frase — produto e matéria, nunca
   *  benefício. Já guardou "a sombra" e "o conforto", e o site escrevia
   *  "Resolve a sombra." com eles; ver a nota do campo em
   *  `collections/representadas.ts`, que também explica por que o nome
   *  continua `resolve`. Confirmado. */
  resolve: string;
  /** A mesma linha em uma palavra, para a chamada da prancha e a legenda. */
  parte: string;
  /** Cidade e UF da fábrica, quando conhecidos. */
  base?: string;
  /** Um fato técnico verificável. Sem superlativo. */
  fato: string;
  /** A fotografia da galeria e a vista larga que abre a página, quando vêm do
   *  painel. São OUTRAS uma da outra por desenho, e o painel recusa a mesma nas
   *  duas — ver `collections/representadas.ts`. Opcionais porque as quatro
   *  marcas escritas à mão ainda buscam a imagem no acervo central; ver
   *  `imagemDaRepresentada`. */
  imagem?: Imagem;
  imagemLarga?: Imagem;
  declaracoes?: Declaracao[];
  designers?: Designer[];
  colecoes?: string[];
  vocabulario?: Vocabulario;
  /** Lista, e não campo único: a Marê pode ter um PDF por coleção (P22), e a
   *  GDA publica "catálogos" no plural. Um array vazio hoje não custa nada; um
   *  campo único vira migração depois que o CMS estiver cadastrando. */
  catalogos?: Catalogo[];
};

export const REPRESENTADAS: Representada[] = [
  {
    slug: "mare-mobilia",
    nome: "Marê Mobília",
    /* A linha nas palavras da própria Marê: a declaração de posicionamento logo
       abaixo diz "Mobiliário externo, em coleções assinadas". */
    resolve: "Mobiliário externo em coleções assinadas",
    parte: "Móvel",
    base: "Cambé · PR",
    fato: "Mais de 30 coleções, 8 designers assinantes",
    declaracoes: [
      {
        rotulo: "Posicionamento",
        valor: "Mobiliário externo, em coleções assinadas",
      },
      { rotulo: "Coleções", valor: "Mais de 30, todas com assinatura" },
    ],
    /* As oito assinaturas e as coleções de cada uma, como a própria Marê
       publica. É o ativo editorial mais forte do portfólio inteiro e o eixo
       que o arquiteto valoriza: marca de autor não é fabricante genérico. */
    designers: [
      {
        nome: "Daniela Ferro",
        colecoes: [
          "Ânima",
          "Araçary",
          "Greta",
          "Halia",
          "Hibisco",
          "Jubarte",
          "Manacá",
          "Moana",
          "Pilar",
          "Zoe",
          "Aves Silvestres",
          "Caraúna",
        ],
      },
      {
        nome: "Fabrício Roncca",
        colecoes: ["Brasília", "Marumbi", "Pittá", "Villa", "Ypê", "Maresias"],
      },
      {
        nome: "Pepê Lima",
        colecoes: ["Carnival", "Griph", "Mono", "Orange", "Solstice"],
      },
      { nome: "Fernando Zanardi", colecoes: ["Saara", "Savana"] },
      { nome: "Claudia Mazzieri", colecoes: ["Velo", "Nemo"] },
      { nome: "Camila Forbeck", colecoes: ["Laos"] },
      { nome: "Estúdio Galho", colecoes: ["Conchego"] },
      { nome: "Estúdio Marê", colecoes: ["Petit"], nota: "Estúdio interno" },
    ],
    vocabulario: {
      grupos: [
        {
          nome: "Categorias",
          slug: "todas",
          itens: [
            { nome: "Sofás" },
            { nome: "Chaises" },
            { nome: "Poltronas" },
            { nome: "Bancos" },
            { nome: "Mesas de centro" },
            { nome: "Mesas laterais" },
            { nome: "Mesas de jantar" },
            { nome: "Mesas de apoio" },
            { nome: "Bases de mesa" },
            { nome: "Cadeiras" },
            { nome: "Banquetas" },
            { nome: "Bistrô" },
            { nome: "Aparadores" },
            { nome: "Espreguiçadeiras" },
            { nome: "Puffs" },
            { nome: "Recamier" },
            { nome: "Carrinho bar" },
            { nome: "Luminárias" },
            { nome: "Acessórios" },
          ],
        },
      ],
    },
    /* O site da Marê tem seção de catálogo/download — o documento existe. O que
       não se sabe é a edição, nem se é PDF único ou um por coleção (P22), e por
       isso não há `ano`: a linha escreve "Edição não declarada" em vez de um
       2025 plausível. Se a resposta for "um por coleção", isto vira trinta
       entradas neste array e a página absorve sem mudar de forma. */
    catalogos: [{ titulo: "Catálogo" }],
  },
  {
    slug: "gda-moveis",
    nome: "GDA Móveis",
    /* Não "a estrutura": a GDA fabrica móvel inteiro — sofá, poltrona, cadeira,
       mesa, espreguiçadeira, externo e interno, como o vocabulário dela lista
       aqui embaixo. O que a separa da Marê é a matéria, e é a matéria que a
       linha nomeia. */
    resolve: "Mobiliário em alumínio fundido",
    parte: "Estrutura",
    base: "Cláudio · MG",
    /* "Até 30 dias" — é o que a fábrica publica, e é o que a declaração logo
       abaixo já dizia. Um prazo apertado por uma palavra é a diferença entre
       dado e promessa, e prazo é exatamente o que o arquiteto usa para decidir. */
    fato: "Alumínio fundido 100% reciclado, personalizados em até 30 dias",
    declaracoes: [
      { rotulo: "Matéria", valor: "Alumínio fundido 100% reciclado" },
      {
        rotulo: "Fundição",
        valor:
          "Cláudio, Minas Gerais — polo de fundição artesanal de alumínio",
      },
      { rotulo: "Prazo", valor: "Personalizados em até 30 dias" },
      { rotulo: "Ambiente", valor: "Externo e interno" },
    ],
    /* Dois nomes, sem coleção atribuída: a GDA publica os designers e publica
       as coleções, mas não diz quem assinou o quê. */
    designers: [{ nome: "Sérgio Matos" }, { nome: "Guto Indio da Costa" }],
    colecoes: ["Esmeralda", "Campo Belo", "Riacho", "Bosque", "Jardim"],
    vocabulario: {
      eixo: "Ambiente",
      grupos: [
        {
          nome: "Externo",
          slug: "externo",
          itens: [
            { nome: "Sofás" },
            { nome: "Poltronas" },
            { nome: "Cadeiras" },
            { nome: "Banquetas" },
            { nome: "Espreguiçadeiras" },
            { nome: "Mesas" },
          ],
        },
        {
          nome: "Interno",
          slug: "interno",
          itens: [
            { nome: "Sofás" },
            { nome: "Poltronas" },
            { nome: "Cadeiras" },
            { nome: "Banquetas" },
            { nome: "Espreguiçadeiras" },
            { nome: "Mesas" },
          ],
        },
      ],
    },
    /* A GDA publica catálogo em PDF na própria navegação. Edição não declarada. */
    catalogos: [{ titulo: "Catálogo" }],
  },
  {
    slug: "bux-garden",
    nome: "Bux Garden",
    /* Era "o conforto", e o ledger escrevia "Resolve o conforto" — benefício,
       não linha. O têxtil de performance é o que a fábrica declara como
       diferencial e o que ela de fato vende. */
    resolve: "Estofados com têxtil de performance",
    /* `parte` é o rótulo da chamada na prancha, e ele precisa apontar para algo
       que se enxerga na foto. Uma seta escrita CONFORTO sobre uma chaise, ao
       lado de outra escrita MÓVEL sobre um sofá, não ensina nada: são dois
       estofados. "Estofado" é o que a seta de fato indica — e foi esta linha,
       decidida em PRA-123 para o desenho, que acabou corrigindo a prosa
       inteira quatro campos acima. */
    parte: "Estofado",
    base: "Birigui · SP",
    fato: "Têxtil de performance: repelência, proteção UVA/UVB, antimofo",
    declaracoes: [
      { rotulo: "Sigla", valor: "BUX, de Best User Experience" },
      {
        rotulo: "Têxtil",
        valor: "Repelência a líquidos, proteção UVA/UVB e antimofo",
      },
      {
        rotulo: "Uso",
        valor: "Pet friendly, resistente a crianças, fácil limpeza",
      },
    ],
    designers: [
      {
        nome: "Hugo Evandro",
        nota: "Repertório escandinavo e japonês com toque brasileiro",
      },
    ],
    /* Sem vocabulário: a taxonomia da Bux é a única em aberto (P30), e como o
       filtro nunca sai da marca, isso trava só esta página — as outras três
       vão ao ar sem esperar.

       Sem `catalogos` também, e é o mesmo tipo de silêncio: a Bux é a única das
       quatro que não declara catálogo em fonte nenhuma. Ela não vira linha em
       `/catalogos` com um documento inventado — sai numa nota por extenso
       abaixo da lista, que é a mesma regra do "Origem não declarada" no ledger
       de `/quem-somos`. */
  },
  {
    slug: "trisol",
    nome: "Trisol",
    /* Os dois grupos do vocabulário da própria Trisol — haste lateral e haste
       central — são a linha inteira dela, e cabem numa frase. */
    resolve: "Ombrelones laterais e centrais",
    parte: "Sombra",
    fato: "Ferragem em inox 304, resistência a vento de 30 a 80 km/h",
    /* A especificação mais completa do portfólio inteiro, e por isso a marca
       mais fácil de publicar. Os limites saem declarados como faixa — "de 30 a
       80 km/h, conforme o modelo" — porque é assim que a fábrica publica.
       Quebrar a faixa em número por modelo exigiria uma tabela que ninguém
       forneceu, e só o Pub tem o número atribuído em fonte pública. */
    declaracoes: [
      { rotulo: "Estrutura", valor: "Alumínio" },
      { rotulo: "Ferragens", valor: "Inox 304, em toda a linha" },
      { rotulo: "Lonas", valor: "Olefina ou poliéster pro" },
      { rotulo: "Reforço", valor: "Couro nos modelos premium" },
      { rotulo: "Vento", valor: "De 30 a 80 km/h, conforme o modelo" },
      { rotulo: "Garantia", valor: "De 6 a 36 meses, conforme o modelo" },
    ],
    vocabulario: {
      eixo: "Haste",
      grupos: [
        {
          nome: "Laterais",
          slug: "laterais",
          itens: [
            { nome: "Zuri", nota: "Entrada" },
            { nome: "Solene", nota: "Premium, LED opcional" },
          ],
        },
        {
          nome: "Centrais",
          slug: "centrais",
          itens: [
            { nome: "Vitta", nota: "Clássico, inclinação automática" },
            { nome: "Pub", nota: "Comercial, resiste a 80 km/h" },
            { nome: "Brisa", nota: "Econômico" },
          ],
        },
      ],
    },
    /* A única edição conhecida do portfólio inteiro. A Trisol publica a edição
       2026 para download no site dela — e é justamente por isso que ela NÃO é
       linkada: mandar o arquiteto ao site da fábrica entrega o lead, o e-mail
       comercial deles e a comissão de graça. O documento é declarado aqui com a
       edição que se conhece, e quem entrega é a Belmare. */
    catalogos: [{ titulo: "Catálogo", ano: 2026 }],
  },
];

export function representadaPorSlug(slug: string): Representada | undefined {
  return REPRESENTADAS.find((r) => r.slug === slug);
}

/**
 * A imagem de referência da marca.
 *
 * ⚠️ O painel primeiro, o acervo central depois. As duas fontes coexistem
 * enquanto a migração das quatro marcas escritas à mão não passou (PRA-119):
 * uma marca cadastrada no painel traz a própria fotografia, com o ponto focal
 * clicado pelo operador e a marcação de mock composta na leitura; as quatro
 * daqui continuam buscando o mock de `acervo.ts` pela chave do slug. Quando o
 * array `REPRESENTADAS` sair, o `??` sai com ele.
 */
export function imagemDaRepresentada(r: Representada): Imagem {
  return r.imagem ?? IMAGEM_DA_MARCA[r.slug];
}

/** A vista larga que abre a página da marca. Mesma regra de fonte dupla. */
export function imagemLargaDaRepresentada(r: Representada): Imagem {
  return r.imagemLarga ?? IMAGEM_LARGA_DA_MARCA[r.slug];
}

/**
 * O eixo que autoriza um filtro de categoria — e `undefined` quando não há
 * filtro a oferecer.
 *
 * ⚠️ **É A PRESENÇA DO EIXO QUE DECIDE SE EXISTE FILTRO, não a vontade de ter
 * um.** A GDA separa o catálogo por ambiente e a Trisol por tipo de haste: ali
 * há um primeiro nível pelo qual recortar. A Marê declara dezenove categorias
 * numa lista só, e uma lista só não se filtra — um controle que reduz uma lista
 * a ela mesma é teatro de interface. A regra mora aqui, e não dentro do
 * componente, porque é ela que a página promete: sem eixo, nenhum recorte é
 * oferecido, nem hoje na seção de vocabulário nem depois na grade de peças.
 *
 * Um grupo só também não é filtro: filtrar é escolher entre alternativas, e uma
 * alternativa sozinha é a lista inteira com um rótulo em cima.
 */
export function eixoDeFiltro(r: Representada): string | undefined {
  const vocabulario = r.vocabulario;
  if (!vocabulario?.eixo) return undefined;
  return vocabulario.grupos.length > 1 ? vocabulario.eixo : undefined;
}

/** Uma marca, uma página — e ela carrega tudo o que é da marca. */
export function paginaDaRepresentada(r: Representada): string {
  return `/representadas/${r.slug}`;
}

/**
 * As seções que ESTA marca de fato tem, numeradas na ordem do documento.
 *
 * ⚠️ Esta função é a espinha da rota `/representadas/[marca]`. A página e a
 * faixa de índice consomem a MESMA lista, e é isso que garante que o índice
 * nunca aponte para uma seção que não renderizou — o defeito clássico de
 * sumário escrito à mão. Seção sem dado não vira "em breve" nem título órfão:
 * ela simplesmente não existe, e a numeração fecha sem buraco.
 *
 * Abra a Trisol e o índice tem quatro entradas; abra a Marê e tem cinco. A
 * assimetria entre as fábricas deixa de ser problema de layout e vira a única
 * navegação de que a página precisa.
 */
export type Secao = {
  id: string;
  numero: string;
  rotulo: string;
  /** Contagem declarada antes do clique, como formato e peso de arquivo. */
  contagem?: string;
};

export function secoesDaRepresentada(r: Representada): Secao[] {
  const secoes: Omit<Secao, "numero">[] = [{ id: "identificacao", rotulo: "Identificação" }];

  if (r.declaracoes?.length) {
    secoes.push({
      id: "declara",
      rotulo: "O que declara",
      contagem: String(r.declaracoes.length),
    });
  }

  if (r.designers?.length) {
    secoes.push({
      id: "assina",
      rotulo: "Quem assina",
      contagem: String(r.designers.length),
    });
  }

  /* A seção existe se houver taxonomia OU coleções: as duas são vocabulário da
     fábrica, e amarrar as coleções à existência de taxonomia matava o dado
     justamente na Bux, a única marca sem taxonomia declarada (P30). Seria a
     mesma classe de campo morto que as coleções da GDA já foram. */
  if (r.vocabulario) {
    /* ⚠️ Itens DISTINTOS, não a soma dos grupos. Na GDA os dois ambientes
       repetem as mesmas seis categorias de propósito, e somar dava
       "VOCABULÁRIO 12" — o leitor comparava com "MARÊ 19" e concluía que a GDA
       tem o dobro do que tem. Numa faixa cujo argumento declarado é a contagem
       honesta antes do clique, um contador que conta duas vezes derruba a
       própria regra que a faixa existe para cumprir. */
    const itens = new Set(
      r.vocabulario.grupos.flatMap((grupo) =>
        grupo.itens.map((item) => item.nome),
      ),
    );
    secoes.push({
      id: "vocabulario",
      rotulo: "Vocabulário",
      contagem: String(itens.size),
    });
  } else if (r.colecoes?.length) {
    secoes.push({
      id: "vocabulario",
      rotulo: "Vocabulário",
      contagem: String(r.colecoes.length),
    });
  }

  /* ⚠️ A contagem só existe quando há PESO MEDIDO para declarar. Um documento
     que ainda vai chegar não anuncia "1" na faixa: a faixa existe para dizer o
     que custa o clique, e "1" não é custo de nada. Com um único publicado, o
     peso é a informação; com vários, a quantidade volta a ser. */
  if (r.catalogos?.length) {
    const publicados = r.catalogos.filter(catalogoPublicado);
    secoes.push({
      id: "levar",
      rotulo: "Para levar",
      contagem:
        publicados.length === 1
          ? `PDF ${pesoEmMB(publicados[0].mb)} MB`
          : publicados.length > 1
            ? String(publicados.length)
            : undefined,
    });
  }

  secoes.push({ id: "falar", rotulo: "Falar" });

  return secoes.map((secao, i) => ({
    ...secao,
    numero: String(i + 1).padStart(2, "0"),
  }));
}

/**
 * Um documento e a fábrica a quem ele pertence — a entrada de `/catalogos`.
 *
 * ⚠️ **O DOCUMENTO É O ASSUNTO; A MARCA É A ATRIBUIÇÃO.** Essa inversão é a
 * razão de a rota existir. O site já enumera as mesmas quatro fábricas três
 * vezes — galeria da home, ledger de `/quem-somos` 05, registros de
 * `/representadas` — e uma quarta lista de marcas não teria o que acrescentar.
 * Aqui a linha é o arquivo: ordena por edição, aceita duas entradas da mesma
 * fábrica sem nenhuma mudança de layout, e some da página quando o documento
 * não existe, em vez de deixar a marca ali com uma célula vazia.
 */
export type DocumentoDeCatalogo = {
  catalogo: Catalogo;
  representada: Representada;
};

/**
 * Os documentos declarados, na ordem em que servem a quem chegou.
 *
 * Publicado antes de a pedir — o que se baixa agora vem primeiro, sempre. Dentro
 * de cada bloco, edição mais recente primeiro, e edição desconhecida por último,
 * porque um documento sem ano é o que menos ajuda a decidir. Empate mantém a
 * ordem em que as marcas CHEGARAM, que é a do painel (campo `ordem`) e não
 * depende de dado ausente.
 *
 * ⚠️ A lista entra por parâmetro em vez de ser lida aqui dentro, e é isso que
 * mantém esta função pura enquanto a fonte passou a ser o painel. Quem decide de
 * onde vêm as marcas é a rota — `representadasDaPagina()` —, não este módulo.
 */
export function documentosDeCatalogo(
  representadas: Representada[],
): DocumentoDeCatalogo[] {
  const documentos = representadas.flatMap((representada) =>
    (representada.catalogos ?? []).map((catalogo) => ({
      catalogo,
      representada,
    })),
  );

  return documentos
    .map((documento, ordem) => ({ documento, ordem }))
    .sort((a, b) => {
      const publicado =
        Number(catalogoPublicado(b.documento.catalogo)) -
        Number(catalogoPublicado(a.documento.catalogo));
      if (publicado !== 0) return publicado;

      /* Sem ano vai para o fim dos dois blocos, e não para o começo, que é onde
         um `?? 0` numa comparação decrescente o colocaria. */
      const anoA = a.documento.catalogo.ano ?? -Infinity;
      const anoB = b.documento.catalogo.ano ?? -Infinity;
      if (anoA !== anoB) return anoB - anoA;

      return a.ordem - b.ordem;
    })
    .map(({ documento }) => documento);
}

/**
 * As fábricas que não declaram documento nenhum.
 *
 * ⚠️ Elas não viram linha com o campo vazio, e não somem em silêncio. Saem numa
 * nota escrita por extenso abaixo da lista — a mesma regra que faz o ledger de
 * `/quem-somos` escrever "Origem não declarada" em vez de um travessão. Quem lê
 * esta página repara na fábrica que faltou, e a resposta honesta é dizer qual é
 * e por quê.
 */
export function representadasSemCatalogo(
  representadas: Representada[],
): Representada[] {
  return representadas.filter((r) => !r.catalogos?.length);
}
