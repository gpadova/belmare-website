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
    /* ⚠️ **"MÓVEIS" AQUI, "MOBILIÁRIO" NA DECLARAÇÃO LOGO ABAIXO — e a diferença
       é de quem está falando.** `resolve` é a voz DO SITE: é a linha que a home
       imprime sob o cartão da fábrica, e ela obedece a regra que derrubou a
       palavra no h1 em 05/08/2026 — "mobiliário" é palavra de catálogo e de
       release, e ninguém do ramo a diz em voz alta (`components/abertura.tsx`).
       `declaracoes` é outra coisa: ali a Marê fala, e o valor é transcrição da
       declaração de posicionamento dela, que diz "Mobiliário externo, em
       coleções assinadas". Transcrição não se reescreve, pela mesma razão que a
       razão social não vira nome fantasia. Alinhado com `PRODUCT.md`, onde o
       que a Marê resolve é "o móvel de autor". */
    resolve: "Móveis externos em coleções assinadas",
    parte: "Móvel",
    base: "Cambé · PR",
    fato: "Mais de 30 coleções, 8 designers assinantes",
    /* ⚠️ **AS DUAS DECLARAÇÕES DA MARÊ SAÍRAM, E AS DUAS ERAM REPETIÇÃO —
       PRA-131.** "Posicionamento: Mobiliário externo, em coleções assinadas" era
       o `resolve` reescrito com a palavra de release que `abertura.tsx` já
       derrubou do h1 em 05/08/2026. "Coleções: Mais de 30, todas com assinatura"
       era o `fato` impresso quatro campos acima. Numa ficha de sete linhas isso
       passa; numa de duas, a ficha inteira é o leitor recebendo de volta o que
       acabou de ler.

       A Marê é a marca com mais peças do portfólio e a que menos declara — não
       publica material em fonte nenhuma. As linhas nascem aqui no dia em que ela
       declarar.

       ⚠️ Sobrou UMA linha, e ela é a única coisa que "Quem assina" carregava de
       fato: os NOMES. A contagem não — "8 designers" é o `fato` outra vez, e
       contar assinaturas não ajuda ninguém a especificar. O nome ajuda: é com
       ele que o arquiteto defende a escolha para o cliente dele. As trinta
       coleções atribuídas não cabem numa linha e não entram: elas voltam quando
       existir onde pendurá-las, que é a peça. */
    declaracoes: [
      {
        rotulo: "Design",
        valor:
          "Daniela Ferro · Fabrício Roncca · Pepê Lima · Fernando Zanardi · Claudia Mazzieri · Camila Forbeck · Estúdio Galho · Estúdio Marê",
      },
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
    /* "Móveis", e não "mobiliário", pela mesma razão da Marê acima: esta é a
       voz do site, e a palavra do ramo é a que o ramo escreve na própria porta. */
    resolve: "Móveis em alumínio fundido",
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
      /* Os dois nomes que a GDA publica. Ela divulga os designers e divulga as
         coleções, e não diz quem assinou o quê — sem atribuição, o dado é o
         nome, e nome cabe numa linha. Era uma seção inteira com dois nomes e a
         coluna da direita vazia até PRA-131. */
      { rotulo: "Design", valor: "Sérgio Matos · Guto Indio da Costa" },
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
    /* ⚠️ **"SIGLA: BUX, DE BEST USER EXPERIENCE" SAIU — PRA-131.** Era verdade e
       era fonte pública, e mesmo assim não é dado: não muda uma especificação,
       não responde nenhuma das perguntas que o arquiteto faz, e ocupava a
       primeira linha de uma ficha de três. Trivia de marca no topo de uma tabela
       técnica é o que faz o leitor parar de acreditar nas linhas de baixo. */
    declaracoes: [
      {
        rotulo: "Têxtil",
        valor: "Repelência a líquidos, proteção UVA/UVB e antimofo",
      },
      {
        rotulo: "Uso",
        valor: "Pet friendly, resistente a crianças, fácil limpeza",
      },
      /* O designer interno, pelo mesmo critério da GDA: a Bux publica o nome e
         não atribui coleção nenhuma a ele. */
      {
        rotulo: "Design",
        valor:
          "Hugo Evandro, designer interno — repertório escandinavo e japonês com toque brasileiro",
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
      /* ⚠️ Os cinco modelos entram como LINHA porque são nomes próprios de
         produto — a única fábrica das quatro cuja taxonomia nomeia peças em vez
         de categorias. "Sofás, mesas, poltronas" da Marê e da GDA não voltam por
         aqui: são substantivos que o arquiteto já conhece, e uma linha com
         dezenove deles informa menos que a frase que já está sob o nome da
         fábrica. */
      {
        rotulo: "Modelos",
        valor: "Laterais: Zuri e Solene · Centrais: Vitta, Pub e Brisa",
      },
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
  rotulo: string;
  /** Contagem declarada antes do clique, como formato e peso de arquivo. */
  contagem?: string;
};

/**
 * Os blocos 3D desta fábrica — a única contagem que NÃO mora em `Representada`.
 *
 * ⚠️ **ENTRA POR PARÂMETRO PARA ESTA FUNÇÃO CONTINUAR PURA.** `Arquivo3D` é
 * coleção própria no painel, com consulta assíncrona escopada por marca; a faixa
 * de índice precisa da contagem ANTES do clique, que é a mesma regra que faz um
 * arquivo declarar "SKP · 8,4 MB" antes do download. Quem já buscou passa o
 * número — a rota lê uma vez e usa duas —, e esta função não aprende a ler o
 * painel só para contar.
 */
export type AcervoDaMarca = {
  blocos3d: number;
};

const SEM_ACERVO: AcervoDaMarca = { blocos3d: 0 };

/**
 * As seções que ESTA marca de fato tem, na ordem do documento.
 *
 * ⚠️ **A PÁGINA ENCOLHEU DE SEIS SEÇÕES PARA QUATRO — PRA-131, E O CORTE É O
 * TRABALHO.** Saíram "O que a fábrica informa", "Quem assina" e "O vocabulário
 * da fábrica". A razão de fundo é uma só, e ela é do cliente: **uma fábrica tem
 * muitos produtos, e ficha técnica é do produto, não da fábrica.** Uma tabela de
 * matéria e desempenho pendurada na MARCA só pode dizer o que vale para a linha
 * inteira — e o que vale para a linha inteira ou é generalidade ("alumínio") ou
 * é faixa ("de 30 a 80 km/h, conforme o modelo"), que é justamente o que não
 * fecha uma especificação. A cota, o acabamento e o desempenho por modelo vivem
 * no catálogo em PDF, e o site distribui esse catálogo em vez de replicá-lo.
 *
 * O que sobrou é o que a página de fato consegue responder: que fábrica é esta,
 * algumas informações dela, e os arquivos que a Belmare tem para entregar.
 *
 * ⚠️ **A NUMERAÇÃO `01 02 03` SAIU JUNTO.** Ela existia para dar cadência de
 * prancha a uma página de registro, e o que produzia era cerimônia: seis blocos
 * numerados e seis títulos de 42px para carregar de três a seis fatos. A
 * sequência nunca informou nada — ninguém precisa saber que os catálogos são a
 * segunda seção, ainda mais numa rota onde a numeração é calculada e a mesma
 * seção cai em posições diferentes conforme a fábrica.
 */
export function secoesDaRepresentada(
  r: Representada,
  acervo: AcervoDaMarca = SEM_ACERVO,
): Secao[] {
  const secoes: Secao[] = [{ id: "identificacao", rotulo: "Identificação" }];

  /* ⚠️ Com UM catálogo, o peso é a informação — a faixa existe para dizer o que
     custa o clique. Com vários, a quantidade volta a ser: "PDF 24,0 MB" ao lado
     de um rótulo no plural anunciaria o custo de um dos seis e esconderia os
     outros cinco. Não há o caso "declarado sem arquivo": um catálogo é um
     arquivo, então toda entrada aqui tem peso medido. */
  if (r.catalogos?.length) {
    const catalogos = r.catalogos;
    secoes.push({
      id: "catalogos",
      rotulo: catalogos.length === 1 ? "Catálogo" : "Catálogos",
      contagem:
        catalogos.length === 1
          ? `PDF ${pesoEmMB(catalogos[0].mb)} MB`
          : String(catalogos.length),
    });
  }

  /* ⚠️ **SEÇÃO PRÓPRIA, E NÃO JUNTO DO CATÁLOGO.** São dois trabalhos: um PDF se
     lê para decidir, um bloco se baixa para desenhar hoje. As referências do
     setor nomeiam os downloads pelo trabalho que fazem — `Data sheet`,
     `3D(CAD)`, `Fabrics` —, não por um genérico "arquivos". */
  if (acervo.blocos3d > 0) {
    secoes.push({
      id: "arquivos-3d",
      rotulo: "Arquivos 3D",
      contagem: String(acervo.blocos3d),
    });
  }

  secoes.push({ id: "falar", rotulo: "Contato" });

  return secoes;
}

/**
 * As informações da fábrica — a ficha que abre a página, em rótulo e valor.
 *
 * ⚠️ **É A ÚNICA COISA QUE SOBROU DE "O QUE A FÁBRICA INFORMA", E ELA DEIXOU DE
 * SER SEÇÃO PARA VIRAR PARTE DA IDENTIFICAÇÃO.** Como seção, ela tinha título de
 * 42px, fio, número e uma nota de rodapé — todo esse aparato para transportar
 * duas linhas na Marê e três na Bux. Como ficha de abertura, as mesmas linhas
 * saem coladas no nome da fábrica, que é onde quem chega já está olhando.
 *
 * ⚠️ **AS DUAS PRIMEIRAS LINHAS SÃO DO SITE, O RESTO É DA FÁBRICA.** Origem e
 * atendimento respondem "de onde sai" e "vocês atendem aqui?" — as duas
 * perguntas que todo visitante faz e que nenhuma fábrica declara por nós. Da
 * terceira linha em diante é transcrição: nas palavras dela, sem completar por
 * simetria e sem reescrever para soar melhor.
 *
 * ⚠️ A Trisol não declara cidade em fonte nenhuma, só o DDD 48. "Não declarada"
 * com todas as letras: preencher com "Florianópolis" porque o DDD bate seria
 * inventar, e o leitor desta página é exatamente quem repara nisso.
 */
export function informacoesDaRepresentada(
  r: Representada,
  territorio: string,
): Declaracao[] {
  return [
    { rotulo: "Origem", valor: r.base ?? "Não declarada" },
    { rotulo: "Atendimento", valor: territorio },
    ...(r.declaracoes ?? []),
  ];
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
