import { revalidarTags } from "@/collections/apoio";
import { apenasAdministrador, estaAutenticado } from "@/collections/papeis";
import { urlDoBotaoDePreview } from "@/lib/preview";
import type { CollectionConfig } from "payload";

import { tagsDaMudanca } from "@/lib/revalidacao";

/**
 * As representadas, dentro do painel.
 *
 * ⚠️ ESTA COLEÇÃO É A RAIZ DA ÁRVORE. Peça, arquivo 3D e acabamento vão pender
 * daqui, cada um com um pai só, e nada atravessa — não existe taxonomia global
 * de material e o filtro nunca sai da marca. O catálogo é CAMPO daqui, não
 * coleção: ele não tem página, não tem rota, e `/catalogos` é uma vista sobre
 * este mesmo dado. Ver `briefing/estrutura.md` §4 e `lib/representadas.ts`.
 *
 * ⚠️ **A ASSIMETRIA ENTRE AS FÁBRICAS É DADO, NÃO LACUNA A PREENCHER.** A Marê
 * tem oito assinaturas e dezenove categorias e não declara um único material; a
 * Trisol declara a linha técnica inteira e não tem designer nem cidade; a Bux
 * não tem taxonomia nenhuma. Por isso tudo abaixo do fato é OPCIONAL de
 * propósito, e a página é feita de seções que somem quando o dado não existe.
 * Tornar um campo obrigatório por simetria força o operador a inventar — e
 * inventar é exatamente o que a voz desta marca não pode fazer.
 *
 * ⚠️ **VALIDAÇÃO AQUI É UX DE EDITOR, NÃO SEGURANÇA DE TIPO.** O que estas
 * recusas fazem é explicar o problema em pt-BR para quem está salvando. Quem
 * protege os componentes de um estado impossível é a união de `Catalogo` em
 * `lib/representadas.ts`, aplicada pelo mapper. São dois trabalhos diferentes e
 * os dois existem: o painel recusa, o tipo torna irrepresentável.
 *
 * ⚠️ Peso de arquivo NÃO é campo. Ele sai do `filesize` que o Payload gravou do
 * arquivo armazenado — decisão 6 da spec. Número digitado à mão é como o site
 * passa a prometer um download que não pode medir.
 */

/** O endereço da marca no site. Sem acento, sem maiúscula, sem espaço: ele vira
 *  URL, e URL que muda depois quebra link que já foi mandado por e-mail. */
const FORMATO_DE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** O que sobra de um campo de upload quando o painel manda o documento inteiro
 *  em vez do identificador. As duas formas chegam, e comparar sem normalizar
 *  deixaria a guarda passar batido justamente quando ela é necessária. */
function identidadeDoUpload(valor: unknown): string | number | undefined {
  if (typeof valor === "string" || typeof valor === "number") return valor;
  if (valor && typeof valor === "object" && "id" in valor) {
    const id = (valor as { id?: unknown }).id;
    if (typeof id === "string" || typeof id === "number") return id;
  }
  return undefined;
}

/** Texto obrigatório, com a explicação de por que ele não pode faltar. */
function exigeTexto(recusa: string) {
  return (valor: string | null | undefined) =>
    valor && valor.trim() !== "" ? true : recusa;
}

export const Representadas: CollectionConfig = {
  slug: "representadas",
  labels: { singular: "Representada", plural: "Representadas" },
  admin: {
    useAsTitle: "nome",
    defaultColumns: ["nome", "slug", "base", "updatedAt"],
    group: "Marcas",
    description:
      "As fábricas que a Belmare representa. Cada uma tem uma página no site, e essa página mostra só o que a fábrica de fato declara — o que não existe fica ausente, sem \"em breve\" e sem espaço em branco.",

    /* ⚠️ O botão "Visualizar" do painel abre a ROTA DE VERDADE sob o modo de
       rascunho do Next — nunca o iframe de live preview do Payload, que a
       decisão 8 da spec reserva às páginas livres (PRA-124, que ainda não
       existem). Espinha fixa é texto e foto dentro de um layout que não se
       move: abrir a rota real já mostra tudo o que o operador precisa ver. */
    preview: (doc) =>
      urlDoBotaoDePreview({
        colecao: "representadas",
        slug: typeof doc.slug === "string" ? doc.slug : "",
        segredo: process.env.PREVIEW_SECRET,
      }),
  },
  access: {
    /* ⚠️ **A LEITURA PÚBLICA NUNCA VÊ RASCUNHO, MESMO QUE PEÇAM `draft=true`
       DIRETO NA API REST/GraphQL.** Sem sessão de painel (`req.user` ausente),
       o acesso já sai filtrado por `_status: published` aqui — não é o
       chamador quem decide se quer rascunho, é o acesso quem recusa mostrar
       um. Isto é a segunda camada da garantia de PRA-118 ("rascunho nunca
       vaza"): a primeira é o filtro explícito nas consultas de
       `lib/representadas-consulta.ts`, que é por onde o SITE de fato lê; esta
       aqui cobre quem tentar ler o painel por fora do site.
       Quem tem sessão (o operador no admin) continua vendo tudo, rascunho
       incluso — é assim que a tela de edição funciona.

       ⚠️ **NADA AQUI MUDA COM PRA-125.** Os dois papéis leem exatamente igual
       — a fronteira entre eles é sobre ESCREVER a estrutura (criar, apagar,
       endereço), nunca sobre ver o conteúdo publicado ou o próprio rascunho. */
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },

    /* ⚠️ **A RAIZ DA ÁRVORE SÓ NASCE E SÓ MORRE PELA MÃO DE UM ADMINISTRADOR
       — decisão 14 da spec (PRA-125).** Apagar uma representada tira do ar
       seis superfícies de conteúdo de uma vez (ela mesma, mais peça, arquivo
       3D e acabamento que pendem dela — a árvore da decisão 10), e criar uma
       nova é abrir uma URL nova que passa a existir no mundo. O operador
       continua com leitura e escrita completas nos campos de conteúdo logo
       abaixo (`update`); o que ele não tem aqui é o começo e o fim da marca.
       Antes deste ticket nem `create` nem `delete` tinham `access` próprio —
       o padrão do Payload para os dois é liberar geral, e qualquer chamada
       sem sessão nenhuma conseguia criar ou apagar uma representada direto
       pela API. */
    create: apenasAdministrador,
    delete: apenasAdministrador,

    /* Editar continua aberto aos dois papéis autenticados — é o trabalho
       inteiro do operador: prosa, fotografia, catálogo, vocabulário. A única
       exceção é o campo `slug`, que tem a própria guarda logo abaixo, porque
       acesso de campo é independente do acesso de documento e as duas
       guardas precisam concordar. Sem este `access.update`, a mesma lacuna de
       `create`/`delete` valia aqui: qualquer chamada sem sessão conseguia
       editar uma representada publicada. */
    update: estaAutenticado,
  },

  /**
   * ⚠️ **OS HOOKS SÃO CHAMADORES FINOS DE `tagsDaMudanca`, NUNCA A LISTA DE
   * ROTAS.** Publicar ou editar e apagar chamam a MESMA função pura de
   * `lib/revalidacao.ts` — é ela que sabe que uma representada aparece em seis
   * lugares, não este hook. Isso é literalmente o critério "apagar invalida as
   * mesmas etiquetas que mudar": os dois hooks abaixo derivam a partir do
   * mesmo `slug`, e nenhum dos dois lista uma rota sequer.
   */
  hooks: {
    afterChange: [
      ({ doc, operation, previousDoc }) => {
        /* ⚠️ **A MESMA ESCRITA GRAVA TANTO O RASCUNHO QUANTO A PUBLICAÇÃO, E
           `_status` É O QUE DIFERENCIA OS DOIS NESTE MESMO HOOK.** Salvar
           rascunho passa por `afterChange` igual a publicar — é a mesma
           operação de update, com `draft: true` — e revalidar aqui de
           qualquer jeito seria etiquetar uma página que o público nem vê
           ainda: o ponto inteiro de ter rascunho deixaria de existir. Só
           `_status === "published"` deriva e dispara etiqueta; ver PRA-118. */
        if (doc._status !== "published") return;

        revalidarTags(tagsDaMudanca({ colecao: "representadas", slug: doc.slug }));

        /* Endereço mudou: a página do endereço ANTIGO continua no ar até o
           próximo build — a rota é estática e `dynamicParams` é falso — e
           ficaria servindo o documento velho para sempre sem isto.

           `operation` continua `"update"` mesmo quando a escrita é uma
           RESTAURAÇÃO de versão — o Payload chama os hooks de coleção com o
           mesmo rótulo de update nos dois casos — então este ramo também
           cobre "restaurar uma versão com slug antigo" sem precisar de um
           terceiro caso. */
        if (
          operation === "update" &&
          typeof previousDoc?.slug === "string" &&
          previousDoc.slug !== doc.slug
        ) {
          revalidarTags(
            tagsDaMudanca({ colecao: "representadas", slug: previousDoc.slug }),
          );
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidarTags(tagsDaMudanca({ colecao: "representadas", slug: doc.slug }));
      },
    ],
  },

  /**
   * ⚠️ **DECISÃO 8 DA SPEC — RASCUNHO E VERSÃO, AUTOSAVE DESLIGADO.**
   * `autosave: false` é explícito e não é o padrão por acaso: rascunho junto
   * com autosave dá ao operador duas transições de estado invisíveis para
   * raciocinar sobre — ele não sabe se o painel salvou sozinho, nem se o que
   * salvou sozinho é o que está no ar. Dois botões nomeados ("Salvar
   * rascunho", "Publicar") não deixam essa dúvida existir. NÃO ligar isto é
   * decisão deliberada, não lacuna — não mexer aqui sem reabrir a decisão 8.
   *
   * `validate` fica no padrão (`false` para rascunho): o operador precisa
   * poder salvar um rascunho pela metade entre duas sessões (história 17 da
   * spec) sem que a validação de campo obrigatório— que é UX de PUBLICAÇÃO —
   * bloqueie o meio do caminho. Publicar continua exigindo tudo, porque
   * `beforeChange`/`validate` de cada campo correm do mesmo jeito quando
   * `_status` vira `published`.
   *
   * ⚠️ **ARMADILHA PARA QUEM CHAMAR A API LOCAL FORA DO PAINEL (seed, script,
   * teste): `draft: false` SOZINHO NÃO PUBLICA.** O campo `_status` que o
   * Payload gera tem valor padrão `"draft"` — é o formulário do painel que
   * manda `_status: "published"` explícito no clique de "Publicar", não o
   * argumento `draft`. Um `payload.create({ collection: "representadas", data
   * })` sem `_status: "published"` em `data` cria um documento invisível para
   * o site público, MESMO passando `draft: false`. Confirmado empiricamente
   * durante PRA-118 — não é suposição. Quem semear as quatro marcas (PRA-119)
   * precisa desta linha em cada `data`, ou a marca "publicada" some do site.
   */
  versions: {
    drafts: {
      autosave: false,
    },
  },

  /* A ordem em que a galeria da home e as listas apresentam as marcas. Fica no
     banco e não no mapper: é decisão de apresentação da Belmare, e o operador
     precisa poder mudá-la sem pedir deploy. */
  defaultSort: "ordem",

  fields: [
    {
      name: "nome",
      type: "text",
      required: true,
      label: "Nome da fábrica",
      admin: {
        description:
          "Como a fábrica se chama, escrito como ela mesma escreve — \"Marê Mobília\", \"GDA Móveis\". É o título da página dela no site.",
      },
      validate: exigeTexto(
        "Escreva o nome da fábrica antes de salvar. Ele é o título da página inteira e o nome que aparece na galeria da home.",
      ),
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Endereço no site",
      admin: {
        position: "sidebar",
        description:
          "O fim do endereço da página: com \"trisol\" aqui, a página fica em belmare.com.br/representadas/trisol. Só letras minúsculas sem acento, números e hífen. Depois que a página estiver no ar, mudar isto quebra todo link que já foi enviado. ⚠️ Só uma conta administradora grava este campo — o Payload mostra o valor a quem for operador, mas mantém o campo travado para leitura.",
      },

      /* ⚠️ **A GUARDA DE CAMPO, INDEPENDENTE DA GUARDA DE DOCUMENTO ACIMA.**
         `access.update` da coleção libera edição geral para quem está
         logado — é o que o operador precisa para trocar prosa e fotografia.
         Sem esta segunda guarda, um operador autenticado poderia mandar
         `{ slug: "..." }` dentro de um `PATCH` de qualquer outro campo e
         mudar a URL de qualquer jeito. O Payload aplica as duas
         independentemente: só passa quem satisfizer as duas ao mesmo tempo.
         Quando a guarda recusa, o valor ENVIADO é descartado e o gravado
         permanece — a escrita do resto do documento não falha por causa
         disto (comportamento do Payload, não suposição; provado em
         `collections/papeis.integracao.test.ts`). */
      access: {
        update: apenasAdministrador,
      },

      validate: (valor: string | null | undefined) => {
        const texto = valor?.trim() ?? "";
        if (texto === "")
          return "Escreva o endereço da página. Sem ele a marca não tem URL, e é a URL que o arquiteto salva nos favoritos.";
        if (!FORMATO_DE_SLUG.test(texto))
          return "Use só letras minúsculas sem acento, números e hífen — \"mare-mobilia\", não \"Marê Mobília\". Acento e espaço viram código na barra do navegador e o endereço deixa de ser legível.";
        return true;
      },
    },
    {
      name: "ordem",
      type: "number",
      label: "Posição nas listas",
      admin: {
        position: "sidebar",
        description:
          "Em que ordem esta marca aparece na galeria da home e nas listas do site. Menor vem primeiro. Deixe em branco e ela vai para o fim.",
      },
    },
    /* ⚠️ **É A LINHA DA FÁBRICA, NÃO O BENEFÍCIO DELA.** Este campo já guardou
       "a sombra", "o conforto", "a estrutura" — e o site escrevia "Resolve a
       sombra." com eles. Quatro linhas seguidas de "Resolve …" transformavam
       uma lista de representadas em manifesto: o arquiteto que abre esta página
       quer saber o que cada fábrica FABRICA, e "conforto" não se especifica em
       projeto nenhum. É o mesmo teste que o campo `parte` já tinha aprendido
       uma vez, três campos abaixo — uma seta escrita CONFORTO sobre uma chaise
       não ensina nada porque não nomeia objeto. Aqui valia igual, e demorou
       mais para aparecer porque em prosa o vazio soa como posicionamento.

       ⚠️ O nome da COLUNA continua `resolve`, do primeiro desenho do campo. O
       painel, a ajuda e as três telas que leem daqui falam em linha; só o
       identificador no banco ficou para trás, e renomeá-lo é uma migração
       própria. Não reescreva a ajuda para casar com o nome antigo — é o nome
       que está atrasado, não o texto. */
    {
      name: "resolve",
      type: "text",
      required: true,
      label: "A linha que ela fabrica",
      admin: {
        description:
          "A linha desta fábrica, como se escreve numa lista de representadas — \"Ombrelones laterais e centrais\", \"Estofados com têxtil de performance\", \"Mobiliário em alumínio fundido\". Com inicial maiúscula e sem ponto final: o site põe o ponto onde precisa. Nomeie produto e matéria, nunca benefício — \"a sombra\" e \"o conforto\" dizem o que o cliente sente, e o arquiteto especifica o que a fábrica faz.",
      },
      validate: exigeTexto(
        "Escreva a linha da fábrica. É o que o arquiteto lê logo depois do nome dela, e é o que separa uma fábrica das outras três.",
      ),
    },
    {
      name: "parte",
      type: "text",
      required: true,
      label: "A mesma linha em uma palavra",
      admin: {
        description:
          "A palavra que a seta da prancha aponta e que legenda a galeria — \"Sombra\", \"Estrutura\", \"Estofado\". Tem que ser algo que se enxerga na fotografia: duas setas escritas \"conforto\" e \"móvel\" sobre dois estofados não ensinam nada.",
      },
      validate: exigeTexto(
        "Escreva a palavra da chamada. Ela rotula a seta que aponta para esta marca na prancha de /representadas.",
      ),
    },
    {
      name: "base",
      type: "text",
      label: "Cidade e estado da fábrica",
      admin: {
        description:
          "Onde a fábrica fica, no formato \"Cambé · PR\". Deixe em branco se a fábrica não publica isso em lugar nenhum — a página escreve \"Origem não declarada\" com todas as letras, e é melhor do que um chute que o leitor desta página repara.",
      },
    },
    {
      name: "fato",
      type: "text",
      required: true,
      label: "Um fato técnico verificável",
      admin: {
        description:
          "Um dado que qualquer um pode conferir na fonte da própria fábrica — \"Ferragem em inox 304, resistência a vento de 30 a 80 km/h\". Sem superlativo e sem adjetivo: \"a melhor\", \"referência no mercado\" e \"alta qualidade\" não são fatos e derrubam a autoridade de tudo o mais que a página diz.",
      },
      validate: exigeTexto(
        "Escreva um fato técnico da fábrica. Ele é a linha que sustenta a página inteira — sem ele sobra elogio, e elogio o arquiteto não confere.",
      ),
    },

    {
      name: "imagem",
      type: "upload",
      relationTo: "imagens",
      required: true,
      label: "Fotografia da galeria",
      admin: {
        description:
          "A imagem que representa esta marca na galeria da home e nos registros de /representadas. Mostre a linha da fábrica — não uma peça do catálogo dela, que o site não tem autorização para apresentar como acervo.",
      },
      validate: (valor: unknown) =>
        identidadeDoUpload(valor) !== undefined
          ? true
          : "Escolha a fotografia da galeria. Sem ela a marca aparece como um quadro vazio na primeira tela do site.",
    },
    {
      name: "imagemLarga",
      type: "upload",
      relationTo: "imagens",
      required: true,
      label: "Fotografia de abertura da página",
      admin: {
        description:
          "A imagem larga que abre a página desta marca, sangrando de ponta a ponta. Precisa ser OUTRA fotografia, e num enquadramento panorâmico: é a mesma marca vista de outro jeito, não a foto da galeria em tamanho maior.",
      },

      /* ⚠️ A GUARDA CONTRA A MESMA FOTOGRAFIA NOS DOIS LUGARES. O visitante vê a
         galeria da home e clica; se a página abrir com o quadro que ele acabou
         de ver duas telas atrás, a rota inteira lê como a galeria de novo, em
         tamanho maior — e o motivo da visita (o que ESTA fábrica resolve)
         desaparece. É recusa e não aviso, porque um aviso aqui é lido como
         sugestão. A validação de campo põe a explicação embaixo do próprio
         campo errado, que é onde o operador está olhando quando salva. */
      validate: (valor: unknown, opcoes: { siblingData?: unknown }) => {
        const escolhida = identidadeDoUpload(valor);
        if (escolhida === undefined)
          return "Escolha a fotografia de abertura. É a primeira coisa que se vê na página da marca, e sem ela a página começa pelo texto.";

        const irma = identidadeDoUpload(
          (opcoes.siblingData as { imagem?: unknown } | undefined)?.imagem,
        );

        return escolhida !== irma
          ? true
          : "Esta é a mesma fotografia da galeria. Escolha outra: quem clica na galeria da home chega aqui e veria o mesmo quadro em tamanho maior, e a página da marca leria como a galeria de novo em vez de mostrar a linha desta fábrica.";
      },
    },

    {
      name: "declaracoes",
      type: "array",
      label: "O que a fábrica declara",
      labels: { singular: "Declaração", plural: "Declarações" },
      admin: {
        description:
          "A ficha técnica nas palavras da própria fábrica: matéria, prazo, garantia, ambiente. Só o que ela publica — não complete a lista de uma marca para igualar a de outra, porque a autoridade desta seção é o leitor poder conferir cada linha na fonte.",
      },
      fields: [
        {
          name: "rotulo",
          type: "text",
          required: true,
          label: "Rótulo",
          admin: {
            description:
              "O que está sendo declarado, em uma ou duas palavras — \"Matéria\", \"Prazo\", \"Vento\".",
          },
          validate: exigeTexto(
            "Escreva o rótulo desta linha. Sem ele o valor fica na página sem dizer do que é.",
          ),
        },
        {
          name: "valor",
          type: "text",
          required: true,
          label: "Valor",
          admin: {
            description:
              "O que a fábrica declara, como ela declara — \"De 30 a 80 km/h, conforme o modelo\". Faixa continua faixa: quebrar em número por modelo dá uma tabela mais bonita e inventada.",
          },
          validate: exigeTexto(
            "Escreva o valor desta declaração, ou apague a linha inteira. Rótulo sem valor vira uma linha vazia na ficha.",
          ),
        },
      ],
    },

    {
      name: "designers",
      type: "array",
      label: "Quem assina",
      labels: { singular: "Designer", plural: "Designers" },
      admin: {
        description:
          "Os designers que assinam para esta fábrica, quando ela publica os nomes. É o que separa marca de autor de fabricante genérico, e é o que o arquiteto usa para defender a escolha dele. Nome e coleção, e nada além: retrato e biografia são de terceiros e não são nossos para publicar.",
      },
      fields: [
        {
          name: "nome",
          type: "text",
          required: true,
          label: "Nome",
          admin: {
            description:
              "O nome como a fábrica o publica, incluindo estúdio — \"Estúdio Galho\".",
          },
          validate: exigeTexto(
            "Escreva o nome de quem assina, ou apague a linha. Uma assinatura sem nome não credita ninguém.",
          ),
        },
        {
          name: "colecoes",
          type: "text",
          hasMany: true,
          label: "Coleções que assina",
          admin: {
            description:
              "Só onde a própria fábrica liga o designer à coleção. A GDA publica os designers e publica as coleções, mas não diz quem assinou o quê — nesse caso deixe vazio, porque adivinhar por afinidade é palpite com cara de ficha técnica. As coleções sem atribuição vão no campo \"Coleções da fábrica\", mais abaixo.",
          },
        },
        {
          name: "nota",
          type: "text",
          label: "Nota",
          admin: {
            description:
              "Uma linha curta que a fábrica publica sobre o designer — \"Estúdio interno\". Deixe em branco se ela não publica nada.",
          },
        },
      ],
    },

    {
      name: "colecoes",
      type: "text",
      hasMany: true,
      label: "Coleções da fábrica",
      admin: {
        description:
          "As coleções que a fábrica publica sem dizer quem as assinou. Elas aparecem na seção de vocabulário, sem atribuição — que é onde de fato pertencem. Se a fábrica atribui cada coleção a um designer, use o campo de coleções dentro de \"Quem assina\" e deixe este vazio.",
      },
    },

    {
      name: "vocabulario",
      type: "group",
      label: "Vocabulário da fábrica",
      admin: {
        description:
          "As categorias de produto nas palavras desta fábrica. O site não normaliza vocabulário entre marcas: cada uma usa as suas, e o filtro nunca sai da marca. Uma fábrica que ainda não declarou taxonomia fica sem esta seção e as outras vão ao ar sem esperar por ela.",
      },
      fields: [
        {
          name: "eixo",
          type: "text",
          label: "Eixo — o primeiro nível, quando a fábrica declara um",
          admin: {
            description:
              "Como a fábrica divide o catálogo dela antes de chegar na categoria: a GDA separa por ambiente, a Trisol por tipo de haste. É a presença deste eixo que decide se a página oferece um filtro de categoria. Sem eixo é uma lista só, e uma lista só não se filtra.",
          },
        },
        {
          name: "grupos",
          type: "array",
          label: "Grupos",
          labels: { singular: "Grupo", plural: "Grupos" },
          admin: {
            description:
              "Um grupo por valor do eixo — \"Externo\" e \"Interno\" na GDA. Sem eixo declarado, use um grupo só com todas as categorias dentro.",
          },
          fields: [
            {
              name: "nome",
              type: "text",
              required: true,
              label: "Nome do grupo",
              admin: {
                description:
                  "Como a fábrica chama este recorte — \"Laterais\", \"Centrais\", \"Externo\".",
              },
              validate: exigeTexto(
                "Escreva o nome do grupo, ou apague o grupo inteiro. É ele que titula a lista de categorias na página.",
              ),
            },
            {
              name: "slug",
              type: "text",
              required: true,
              label: "Endereço do grupo",
              admin: {
                description:
                  "O que entra na barra do navegador quando o visitante filtrar por este grupo: \"laterais\", \"area-externa\". Só letras minúsculas sem acento, números e hífen.",
              },
              validate: (valor: string | null | undefined) => {
                const texto = valor?.trim() ?? "";
                if (texto === "")
                  return "Escreva o endereço do grupo. Ele vira parte da URL do filtro, e sem ele o recorte não pode ser compartilhado por link.";
                if (!FORMATO_DE_SLUG.test(texto))
                  return "Use só letras minúsculas sem acento, números e hífen — \"area-externa\", não \"Área Externa\".";
                return true;
              },
            },
            {
              name: "itens",
              type: "array",
              label: "Categorias",
              labels: { singular: "Categoria", plural: "Categorias" },
              admin: {
                description:
                  "As categorias deste grupo, uma por linha, nas palavras da fábrica. Um grupo sem nenhuma categoria não aparece na página — não vira título vazio.",
              },
              fields: [
                {
                  name: "nome",
                  type: "text",
                  required: true,
                  label: "Categoria",
                  admin: {
                    description:
                      "O nome da categoria como a fábrica a chama — \"Espreguiçadeiras\", \"Bistrô\", \"Vitta\".",
                  },
                  validate: exigeTexto(
                    "Escreva o nome da categoria, ou apague a linha vazia.",
                  ),
                },
                {
                  name: "nota",
                  type: "text",
                  label: "Nota",
                  admin: {
                    description:
                      "Uma distinção que a fábrica publica sobre esta categoria — \"Comercial, resiste a 80 km/h\". Só onde ela publica: deduzir a diferença pelo nome é inventar especificação.",
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "catalogos",
      type: "array",
      label: "Catálogos",
      labels: { singular: "Catálogo", plural: "Catálogos" },
      admin: {
        description:
          "Os catálogos que esta fábrica publica. Declare o documento mesmo quando a Belmare ainda não recebeu o arquivo: com o PDF anexado a página oferece o download, sem ele a página diz que o envio é pela Belmare e leva o visitante ao WhatsApp. Os dois são verdade; o que não pode é a página fingir que o catálogo não existe.",
      },
      fields: [
        {
          name: "titulo",
          type: "text",
          required: true,
          label: "Título do documento",
          admin: {
            description:
              "Como o documento se chama — \"Catálogo\". Não escreva a edição aqui: o ano tem campo próprio logo abaixo e o site compõe a linha sozinho.",
          },
          validate: exigeTexto(
            "Escreva o título do documento antes de salvar. É o texto que o visitante lê para decidir se baixa.",
          ),
        },
        {
          name: "ano",
          type: "number",
          label: "Edição",
          admin: {
            description:
              "O ano da edição, só quando a fábrica o declara. Em branco, a página escreve \"Edição não declarada\" com todas as letras — que é o certo. Um 2025 plausível inventado aqui é o site mentindo sobre a única coisa que o arquiteto usa para saber se o documento está velho.",
          },
          validate: (valor: number | null | undefined) => {
            if (valor === null || valor === undefined) return true;
            if (!Number.isInteger(valor) || valor < 1900 || valor > 2200)
              return "Escreva o ano com quatro dígitos — 2026 — ou deixe em branco. A página escreve \"Edição não declarada\" quando o campo está vazio, e isso é preferível a um ano que não existe.";
            return true;
          },
        },
        {
          name: "arquivo",
          type: "upload",
          relationTo: "arquivos",
          label: "O PDF, quando a Belmare já tem o arquivo",
          admin: {
            description:
              "Anexe o PDF só quando ele estiver em mãos. O peso aparece sozinho na página, lido do arquivo — não há o que preencher e não há o que estimar. Sem anexo, a linha continua existindo e vira um pedido pelo WhatsApp.",
          },

          /* ⚠️ Um arquivo sem tamanho medido não pode virar link. O peso é a
             promessa que a linha faz antes do clique, e é a promessa que este
             site existe para não quebrar: quem está em obra com sinal ruim
             decide pelo número. O mapper já protege o componente devolvendo um
             catálogo a pedir; esta recusa existe para o operador não sair da
             tela achando que publicou um download que a página não vai
             oferecer. */
          validate: async (
            valor: unknown,
            opcoes: {
              req?: { payload?: { findByID: (args: never) => Promise<unknown> } };
            },
          ) => {
            const id = identidadeDoUpload(valor);
            if (id === undefined) return true;

            const payload = opcoes.req?.payload;
            if (!payload) return true;

            /* Arquivo apagado por baixo do documento também cai aqui: o
               `findByID` lança, e a recusa escrita é melhor resposta do que uma
               tela de erro do servidor para quem só queria salvar. */
            const documento = await payload
              .findByID({ collection: "arquivos", id, depth: 0 } as never)
              .then((doc) => doc as { filesize?: number | null } | null)
              .catch(() => null);

            const bytes = documento?.filesize;
            return typeof bytes === "number" && bytes > 0
              ? true
              : "Este arquivo subiu sem tamanho e o site não conseguiria declarar o peso antes do clique. Envie o PDF de novo, ou tire o anexo: a linha continua na página como pedido pela Belmare, que é honesto, enquanto um download sem peso não é.";
          },
        },
      ],
    },
  ],
};
