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
 * Um catálogo. O catálogo é CAMPO da marca, não coleção — não tem página, não
 * tem rota, e `/catalogos` é uma VISTA sobre este mesmo dado.
 *
 * ⚠️ **UM CATÁLOGO É UM ARQUIVO. NÃO EXISTE CATÁLOGO SEM PDF.** O tipo teve dois
 * estados até 05/08/2026 — "publicado" e "a pedir" — para poder declarar um
 * documento que existia na fábrica e ainda não em disco. O que isso produziu na
 * tela foi o defeito que o cliente encontrou: três linhas com título sublinhado,
 * cada uma anunciando um documento que ninguém tinha subido, e o gesto de clicar
 * apontando para lugar nenhum quando o número de WhatsApp também estava em
 * branco. Uma lista de catálogos que enche sozinha, sem nenhum upload, é uma
 * lista que não responde à única pergunta que ela existe para responder.
 *
 * A regra agora é literal: **sobe o PDF, aparece a linha; não sobe, não
 * aparece.** O operador vê no site exatamente o que colocou no painel, e a
 * página nunca desenha um destino que não abre. O pedido pelo WhatsApp continua
 * existindo — mas como a ação de fecho da página, que é UMA e funciona, e não
 * como N linhas fantasma.
 *
 * ⚠️ **`arquivo` e `mb` andam juntos, e agora os dois são obrigatórios.** O peso
 * é a promessa que a linha faz antes do clique, e sai do arquivo medido pelo
 * Payload — nunca estimado, nunca digitado.
 *
 * ⚠️ `ano` continua opcional: só entra quando a fábrica declara a edição. Sem
 * ele a linha termina na medida e para, em vez de escrever a ausência.
 */
export type Catalogo = {
  /** Como o documento se chama. Distingue um catálogo dos outros da mesma
   *  fábrica — é o que a fábrica escreve na capa. */
  titulo: string;
  /** Só quando a edição é conhecida. */
  ano?: number;
  /** O endereço do PDF armazenado. */
  arquivo: string;
  /** Tamanho real do arquivo, medido. Nunca estimado. */
  mb: number;
};

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
  /** A marca da fábrica, quando o vetor já subiu no painel.
   *
   *  ⚠️ Só o endereço do arquivo — não há `alt` aqui, e a falta é a decisão.
   *  A marca é publicada com `alt=""` porque o nome da fábrica está escrito ao
   *  lado dela em toda superfície onde ela aparece; ver `components/logotipo.tsx`
   *  e a nota de `collections/logotipos.ts`. Ausente enquanto o vetor não
   *  chegar, e ausente é o estado normal hoje: nenhuma das quatro respondeu. */
  logotipo?: string;
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
   *  GDA publica "catálogos" no plural. Uma fábrica com seis catálogos é o caso
   *  normal, não a exceção — `/catalogos` lista os N de cada uma e filtra por
   *  fábrica. Ausente enquanto nenhum PDF dela subiu. */
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
    /* ⚠️ **SEM `catalogos`, E A AUSÊNCIA É O DADO.** O site da Marê tem seção de
       download, mas a Belmare não recebeu nenhum PDF — e catálogo, a partir de
       05/08/2026, é o arquivo. Declarar aqui um documento sem arquivo era o que
       fazia `/catalogos` mostrar três linhas para zero uploads. O dia em que os
       PDFs chegarem, eles entram pelo painel, um por coleção se for o caso
       (P22), e a página absorve os N sem mudar de forma. */
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
          "Cláudio, Minas Gerais, polo de fundição artesanal de alumínio",
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
    /* Sem `catalogos` pelo mesmo motivo da Marê: a GDA publica catálogo em PDF
       na navegação dela, e nenhum arquivo chegou à Belmare. */
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

       Sem `catalogos` como as outras três, e aqui por dois motivos somados: a
       Bux é a única que não declara catálogo em fonte nenhuma, e nenhum PDF
       chegou. Ela não aparece na lista, não aparece no filtro, e não vira nota
       de rodapé explicando a própria ausência — uma fábrica sem catálogo
       simplesmente não é assunto de uma página de catálogos. */
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
    /* Sem `catalogos`. A Trisol publica a edição 2026 para download no site
       dela, e o site da Belmare continua não linkando para lá — mandar o
       arquiteto à fábrica entrega o lead, o e-mail comercial deles e a comissão
       de graça. Enquanto o PDF não estiver hospedado aqui, não há catálogo da
       Trisol para listar: a linha voltará no minuto em que o arquivo subir. */
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
      rotulo: "O que informa",
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

  /* ⚠️ Com UM catálogo, o peso é a informação — a faixa existe para dizer o que
     custa o clique. Com vários, a quantidade volta a ser: "PDF 24,0 MB" ao lado
     de um rótulo no plural anunciaria o custo de um dos seis e esconderia os
     outros cinco. Não há mais o caso "declarado sem arquivo": um catálogo é um
     arquivo, então toda entrada aqui tem peso medido. */
  if (r.catalogos?.length) {
    const catalogos = r.catalogos;
    secoes.push({
      id: "levar",
      rotulo: catalogos.length === 1 ? "Catálogo" : "Catálogos",
      contagem:
        catalogos.length === 1
          ? `PDF ${pesoEmMB(catalogos[0].mb)} MB`
          : String(catalogos.length),
    });
  }

  secoes.push({ id: "falar", rotulo: "Falar" });

  return secoes.map((secao, i) => ({
    ...secao,
    numero: String(i + 1).padStart(2, "0"),
  }));
}

/**
 * A fábrica, reduzida ao que uma lista de catálogos precisa saber dela.
 *
 * ⚠️ **É PROPOSITALMENTE MAGRO, e o motivo é a fronteira do cliente.** A lista
 * de `/catalogos` filtra no navegador, então ela atravessa para o cliente como
 * props serializadas. Mandar a `Representada` inteira levaria junto fotografia,
 * ficha, oito designers e dezenove categorias por linha — dezenas de KB de JSON
 * para desenhar um nome. Duas strings é o que a linha usa e é o que ela recebe.
 */
export type MarcaDoCatalogo = {
  slug: string;
  nome: string;
};

/**
 * Um catálogo e a fábrica dele — a entrada da lista de `/catalogos`.
 *
 * ⚠️ **A MARCA VOLTOU A SER A CHAVE, e é uma reversão declarada.** A rota nasceu
 * organizada pelo documento, com a fábrica rebaixada a qualificador dentro do
 * título ("Catálogo Trisol"), para não ser a quarta enumeração das mesmas
 * marcas. O argumento caiu por dois motivos que a prática trouxe:
 *
 *   1. **Uma fábrica tem N catálogos, não um.** Com uma linha por marca a
 *      inversão era invisível; com seis linhas da Marê e quatro da GDA numa
 *      lista ordenada por edição, a lista embaralha as fábricas e ninguém acha
 *      o que veio buscar. Quem chega aqui chega sabendo de que fábrica quer o
 *      catálogo — essa é a pergunta real desta página.
 *   2. **Filtrar por fábrica passou a ser o pedido do cliente**, e um filtro só
 *      faz sentido sobre o eixo pelo qual a lista já se organiza.
 *
 * Isto NÃO reabre taxonomia global: a marca continua sendo a raiz, o recorte
 * continua sendo por marca, e nada atravessa duas fábricas.
 */
export type CatalogoNaLista = {
  catalogo: Catalogo;
  marca: MarcaDoCatalogo;
};

/** Uma opção do filtro: a fábrica e quantos catálogos ela tem aqui. */
export type FiltroDeMarca = MarcaDoCatalogo & {
  quantidade: number;
};

/**
 * Os catálogos que existem, na ordem em que a página os apresenta.
 *
 * A ordem é **fábrica, depois edição mais recente primeiro** — e o desempate
 * final é o título, para que a lista não reordene sozinha entre duas leituras.
 * A ordem das fábricas é a que chegou do painel (campo `ordem`), a mesma da
 * galeria da home: uma segunda ordenação por nome aqui faria a mesma marca
 * aparecer em terceiro num lugar e em primeiro no outro.
 *
 * ⚠️ Uma fábrica sem nenhum catálogo não produz entrada nenhuma — não há linha
 * vazia, nem cabeçalho órfão, nem nota explicando a ausência.
 *
 * ⚠️ A lista entra por parâmetro em vez de ser lida aqui dentro, e é isso que
 * mantém esta função pura. Quem decide de onde vêm as marcas é a rota —
 * `representadasDaPagina()` —, não este módulo.
 */
export function catalogosDoSite(
  representadas: Representada[],
): CatalogoNaLista[] {
  return representadas.flatMap((representada) =>
    [...(representada.catalogos ?? [])]
      .sort((a, b) => {
        /* Sem ano vai para o FIM da fábrica, e não para o começo, que é onde um
           `?? 0` numa comparação decrescente o colocaria. */
        const anoA = a.ano ?? -Infinity;
        const anoB = b.ano ?? -Infinity;
        if (anoA !== anoB) return anoB - anoA;
        return a.titulo.localeCompare(b.titulo, "pt-BR");
      })
      .map((catalogo) => ({
        catalogo,
        marca: { slug: representada.slug, nome: representada.nome },
      })),
  );
}

/**
 * As fábricas que o filtro oferece — só as que têm catálogo, com a contagem.
 *
 * ⚠️ **DERIVA DA LISTA JÁ MONTADA, e não de uma segunda passagem pelas marcas.**
 * Um filtro que oferece uma fábrica sem catálogo é um controle que leva a uma
 * tela vazia, que é a versão em miniatura do defeito que esta rota inteira
 * acabou de corrigir. Derivando da lista, a opção e o resultado dela não têm
 * como divergir.
 *
 * A ordem é a de aparição, que é a do painel — as opções ficam na mesma ordem
 * dos blocos que elas recortam.
 */
export function marcasComCatalogo(
  lista: CatalogoNaLista[],
): FiltroDeMarca[] {
  const porSlug = new Map<string, FiltroDeMarca>();

  for (const { marca } of lista) {
    const existente = porSlug.get(marca.slug);
    if (existente) existente.quantidade += 1;
    else porSlug.set(marca.slug, { ...marca, quantidade: 1 });
  }

  return [...porSlug.values()];
}
