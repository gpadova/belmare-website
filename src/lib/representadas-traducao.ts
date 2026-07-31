import { descricaoDeImagem, posicaoDoFoco, type Imagem } from "@/lib/acervo";
import { lista, opcional, presente, texto } from "@/lib/campo-opcional";
import type {
  Catalogo,
  Declaracao,
  Designer,
  GrupoDeCategoria,
  ItemDeCategoria,
  Representada,
  Vocabulario,
} from "@/lib/representadas";
import type {
  Arquivo as ArquivoGerado,
  Imagen as ImagemGerada,
  Representada as RepresentadaGerada,
} from "@/payload-types";

/**
 * A camada de tradução: o documento do painel virando tipo de domínio.
 *
 * ⚠️ **ESTE ARQUIVO É A FRONTEIRA, E ELA EXISTE PORQUE O TIPO GERADO NÃO
 * CONSEGUE EXPRESSAR AS INVARIANTES DE QUE O DESENHO DEPENDE.** O Payload gera
 * o que o banco aceita; `lib/representadas.ts` declara o que a página pode
 * receber. Componente importa de `lib` e NUNCA de `payload-types` — se algum
 * dia importar, o estado que este arquivo existe para eliminar volta a ser
 * representável dentro do componente, e é lá que ele quebra a página.
 *
 * ⚠️ **O CASO QUE JUSTIFICA A CAMADA INTEIRA É O CATÁLOGO.** O tipo gerado tem
 * quatro estados; o domínio tem dois, e é aqui que quatro viram dois:
 *
 *   1. sem anexo                                → a pedir
 *   2. anexo só como referência (profundidade 0) → a pedir
 *   3. anexo carregado, sem endereço ou sem tamanho medido → a pedir
 *   4. anexo carregado, com endereço e tamanho medido      → publicado
 *
 * Só o quarto vira link. Um link sem peso medido é a promessa que este site
 * existe para não quebrar, e depois desta função ele é IRREPRESENTÁVEL — não
 * desencorajado, não validado em outro lugar: impossível de escrever.
 *
 * ⚠️ **AUSENTE É AUSENTE, NUNCA VAZIO.** Array vazio, string em branco e `null`
 * do banco viram `undefined` aqui, porque é `undefined` que faz a seção sumir
 * da página (`secoesDaRepresentada`). Um `designers: []` atravessando esta
 * função vira um título órfão sobre uma lista de nada — que é exatamente o modo
 * de falha que a seção anulável existe para não ter.
 */

/**
 * 1 MB = 1024 KB = 1 048 576 bytes.
 *
 * ⚠️ É a unidade em que o catálogo de 24 MB medido em PRA-115 tem 24,0 MB
 * (25 166 234 bytes) — a mesma que o gerenciador de arquivos mostra e a mesma
 * que a página já usa. Dividir por 1 000 000 daria "25,2 MB" para o mesmo
 * arquivo, e o número na página deixaria de bater com o que o visitante vê
 * depois de baixar.
 */
const BYTES_POR_MB = 1024 * 1024;

/**
 * O documento do painel, na forma do domínio.
 *
 * Aceita a profundidade em que a consulta trouxe os relacionamentos: se um
 * upload veio só como identificador, ele é tratado como ausente em vez de
 * derrubar a página — o mapper nunca inventa e nunca lança.
 */
export function representadaDoPainel(doc: RepresentadaGerada): Representada {
  return {
    slug: doc.slug,
    nome: doc.nome,
    resolve: doc.resolve,
    parte: doc.parte,
    fato: doc.fato,
    ...opcional("base", texto(doc.base)),
    ...opcional("imagem", imagemDoPainel(doc.imagem)),
    ...opcional("imagemLarga", imagemDoPainel(doc.imagemLarga)),
    ...opcional("declaracoes", declaracoesDoPainel(doc.declaracoes)),
    ...opcional("designers", designersDoPainel(doc.designers)),
    ...opcional("colecoes", listaDeTextos(doc.colecoes)),
    ...opcional("vocabulario", vocabularioDoPainel(doc.vocabulario)),
    ...opcional("catalogos", catalogosDoPainel(doc.catalogos)),
  };
}

/**
 * ⚠️ **`opcional`, `texto`, `lista` e `presente` moraram aqui até PRA-120.**
 * PRA-120 precisou da mesma regra ("ausente é ausente, nunca vazio") em três
 * mappers novos — Peça, Arquivo3D, Acabamento — e as quatro funções não têm
 * nada de específico de Representada: mudaram de endereço para
 * `lib/campo-opcional.ts`, sem mudar de comportamento, para que os quatro
 * mappers apontem para a MESMA definição em vez de quatro cópias divergindo
 * uma edição de cada vez. Ver aquele arquivo para a nota completa.
 */

function listaDeTextos(
  valores: string[] | null | undefined,
): string[] | undefined {
  return lista((valores ?? []).map(texto).filter(presente));
}

/**
 * A imagem do acervo, pronta para o componente.
 *
 * ⚠️ O `alt` é COMPOSTO aqui, e não lido do campo `alt` do documento. Os dois
 * dariam a mesma frase hoje, mas a regra da marcação de mock mora em
 * `lib/acervo.ts`, onde é testada — ler o campo virtual seria confiar num hook
 * de leitura do painel para cumprir uma promessa do `CONTEXT.md`. O ponto focal
 * vira `object-position` pelo mesmo caminho: o operador clica no assunto e
 * ninguém calcula porcentagem.
 *
 * ⚠️ **EXPORTADA A PARTIR DE PRA-120.** Peça e Acabamento têm cada um o próprio
 * campo de imagem (`foto`, `amostra`) e precisam exatamente desta composição —
 * não uma segunda que descubra de novo como juntar `descricaoDeImagem` e
 * `posicaoDoFoco`. Continua morando aqui, e não em `lib/acervo.ts`, porque
 * `ImagemGerada` é tipo do Payload: mover para `acervo.ts` levaria
 * `payload-types` para um arquivo que hoje nenhum componente enxerga por trás.
 */
export function imagemDoPainel(
  valor: number | ImagemGerada | null | undefined,
): Imagem | undefined {
  if (!valor || typeof valor !== "object") return undefined;

  const src = texto(valor.url);
  if (src === undefined) return undefined;

  return {
    src,
    alt: descricaoDeImagem({
      descricao: valor.descricao ?? "",
      mock: valor.mock,
    }),
    ...opcional(
      "posicao",
      posicaoDoFoco({ focoX: valor.focalX, focoY: valor.focalY }),
    ),
  };
}

function declaracoesDoPainel(
  linhas: RepresentadaGerada["declaracoes"],
): Declaracao[] | undefined {
  return lista(
    (linhas ?? [])
      .map((linha) => {
        const rotulo = texto(linha.rotulo);
        const valor = texto(linha.valor);
        /* Meia linha não é meia declaração: a ficha imprime rótulo e valor lado
           a lado, e uma célula vazia lê como dado faltando na fábrica. */
        return rotulo && valor ? { rotulo, valor } : undefined;
      })
      .filter(presente),
  );
}

/**
 * ⚠️ `colecoes` só sai onde a fábrica publica a ATRIBUIÇÃO. A GDA publica os
 * dois designers e publica as cinco coleções, e não diz quem assinou o quê —
 * ali o campo fica ausente, e as coleções saem sem atribuição no vocabulário.
 * Ligar as duas coisas aqui seria palpite com cara de ficha técnica.
 */
function designersDoPainel(
  linhas: RepresentadaGerada["designers"],
): Designer[] | undefined {
  return lista(
    (linhas ?? [])
      .map((linha) => {
        const nome = texto(linha.nome);
        if (nome === undefined) return undefined;

        return {
          nome,
          ...opcional("colecoes", listaDeTextos(linha.colecoes)),
          ...opcional("nota", texto(linha.nota)),
        };
      })
      .filter(presente),
  );
}

/**
 * ⚠️ O grupo é sempre um objeto no tipo gerado, e o domínio precisa de
 * `undefined` — é a diferença entre "a Bux não declarou taxonomia" e "a Bux tem
 * uma taxonomia vazia". A primeira faz a seção sumir; a segunda faz a página
 * abrir um título sobre uma grade sem nenhuma célula.
 *
 * ⚠️ Um grupo sem categoria nenhuma também cai fora: ele renderizaria um
 * subtítulo em mono sobre nada.
 */
function vocabularioDoPainel(
  grupo: RepresentadaGerada["vocabulario"],
): Vocabulario | undefined {
  const grupos = lista(
    (grupo?.grupos ?? []).map(grupoDoPainel).filter(presente),
  );
  if (grupos === undefined) return undefined;

  return { ...opcional("eixo", texto(grupo?.eixo)), grupos };
}

function grupoDoPainel(
  linha: NonNullable<NonNullable<RepresentadaGerada["vocabulario"]>["grupos"]>[number],
): GrupoDeCategoria | undefined {
  const nome = texto(linha.nome);
  const slug = texto(linha.slug);
  if (nome === undefined || slug === undefined) return undefined;

  const itens = lista(
    (linha.itens ?? [])
      .map((item): ItemDeCategoria | undefined => {
        const nomeDoItem = texto(item.nome);
        if (nomeDoItem === undefined) return undefined;
        return { nome: nomeDoItem, ...opcional("nota", texto(item.nota)) };
      })
      .filter(presente),
  );
  if (itens === undefined) return undefined;

  return { nome, slug, itens };
}

function catalogosDoPainel(
  linhas: RepresentadaGerada["catalogos"],
): Catalogo[] | undefined {
  return lista(
    (linhas ?? [])
      .map((linha) => {
        const titulo = texto(linha.titulo);
        return titulo === undefined ? undefined : catalogoDoPainel(linha, titulo);
      })
      .filter(presente),
  );
}

/**
 * Onde quatro estados viram dois.
 *
 * ⚠️ A ordem das recusas é a ordem em que os estados aparecem no mundo real, e
 * nenhuma delas lança: um catálogo que não pode ser baixado continua sendo um
 * catálogo declarado — vira pedido pela Belmare, com o documento e a fábrica
 * nomeados. É a diferença entre a página dizer a verdade e a página fingir que
 * a fábrica não tem catálogo.
 */
function catalogoDoPainel(
  linha: NonNullable<RepresentadaGerada["catalogos"]>[number],
  titulo: string,
): Catalogo {
  const base = { titulo, ...opcional("ano", ano(linha.ano)) };

  const arquivo = linha.arquivo;
  // Estados 1 e 2: sem anexo, ou anexo que veio só como identificador.
  if (!arquivo || typeof arquivo !== "object") return base;

  const endereco = enderecoDoArquivo(arquivo);
  const mb = pesoDoArquivo(arquivo);
  // Estado 3: o anexo existe e não pode ser prometido.
  if (endereco === undefined || mb === undefined) return base;

  // Estado 4: em mãos e medido.
  return { ...base, arquivo: endereco, mb };
}

function ano(valor: number | null | undefined): number | undefined {
  return typeof valor === "number" && Number.isInteger(valor)
    ? valor
    : undefined;
}

function enderecoDoArquivo(arquivo: ArquivoGerado): string | undefined {
  return texto(arquivo.url);
}

/**
 * O peso do arquivo ARMAZENADO, em MB.
 *
 * ⚠️ Gerado, nunca digitado (decisão 6 da spec). O Payload grava `filesize` em
 * bytes do arquivo que ele mesmo guardou; o número não passa por ninguém e por
 * isso não pode estar errado. Sem tamanho gravado, não há peso — e sem peso não
 * há linha publicada, que é a regra logo acima.
 *
 * ⚠️ **EXPORTADA A PARTIR DE PRA-120.** O peso de um arquivo 3D usa EXATAMENTE
 * esta derivação — mesma unidade, mesma regra de "sem tamanho gravado não há
 * peso" — porque é a mesma promessa (um link não pode declarar um peso que
 * ninguém mediu). Uma segunda função fazendo a mesma divisão por
 * `BYTES_POR_MB` é o tipo de duplicação que diverge sozinha na primeira vez que
 * alguém mexer numa das duas cópias e esquecer a outra.
 */
export function pesoDoArquivo(arquivo: ArquivoGerado): number | undefined {
  const bytes = arquivo.filesize;
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0)
    return undefined;

  return bytes / BYTES_POR_MB;
}
