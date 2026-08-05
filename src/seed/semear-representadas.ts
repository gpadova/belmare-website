import { readFile } from "node:fs/promises";
import path from "node:path";

import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import {
  IMAGEM_DA_MARCA,
  IMAGEM_LARGA_DA_MARCA,
  MARCACAO_DE_MOCK,
  descricaoDeImagem,
  type Imagem,
} from "@/lib/acervo";
import { REPRESENTADAS, type Representada } from "@/lib/representadas";

/**
 * O seed de PRA-119 — move as quatro representadas escritas à mão em
 * `lib/representadas.ts`, e as oito fotografias que `lib/acervo.ts` associa a
 * elas, para dentro do Payload. Roda uma vez, contra o banco de
 * desenvolvimento, pela API local — não existe rota HTTP nem passo manual no
 * painel.
 *
 * Como rodar: `pnpm payload run src/seed/semear-representadas.ts`, ou
 * `pnpm db:seed`.
 *
 * ⚠️ **NADA É RETIPADO.** Este arquivo lê `REPRESENTADAS` e os mapas de
 * `acervo.ts` programaticamente; não existe um segundo literal com os mesmos
 * fatos escrito à mão aqui. Uma diferença entre o que o painel recebe e o que
 * `lib/representadas.ts` já declarava seria, por definição, um bug deste
 * arquivo — não uma correção de dado.
 *
 * ⚠️ **RE-EXECUÇÃO: PULA QUEM JÁ EXISTE, NUNCA SOBRESCREVE.** A identidade é o
 * `slug` — único na coleção. Se a marca já está cadastrada, o seed loga e
 * segue para a próxima, sem tocar no documento. A alternativa óbvia seria
 * atualizar (upsert): foi descartada de propósito, porque depois da primeira
 * execução o painel passa a ser a fonte da verdade, e o operador pode ter
 * editado o documento à mão — sobrescrever apagaria essa edição sem aviso
 * nenhum. "Semeado uma vez" (história 55 da spec) é uma garantia sobre a
 * PRIMEIRA execução; nas seguintes, o seed só preenche o que ainda falta.
 *
 * ⚠️ **LIMITE ACEITO: uma execução que falha NO MEIO de uma marca (depois de
 * subir as duas fotografias e antes de criar o documento da representada)
 * deixa duas imagens órfãs no banco.** A checagem de "já existe" olha o `slug`
 * da representada, não as imagens — então rodar de novo recria duas fotos e
 * completa a marca, e as duas primeiras ficam sem nenhum documento
 * referenciando-as. Aceitável aqui porque (a) é uma migração de uma vez só,
 * não um processo recorrente, e (b) uma imagem órfã não aparece em nenhuma
 * página — ela só ocupa uma linha a mais na lista de Imagens do painel, onde o
 * operador a apaga se reparar. Uma segunda execução bem-sucedida não piora
 * nada: encontra as quatro marcas e para.
 *
 * ⚠️ **TODA IMAGEM ENTRA COM `mock: true`.** `acervo.ts` é explícito: hoje o
 * acervo inteiro é geração de IA. Nenhuma fotografia daqui é real.
 *
 * ⚠️ **A DESCRIÇÃO GRAVADA NÃO CARREGA O SUFIXO DE MOCK.** O `alt` escrito à
 * mão em `acervo.ts` já termina em "— imagem de referência.": esse sufixo é
 * GERADO (decisão 3 da spec) e `descricaoDeImagem` o recompõe sozinho a partir
 * do campo `descricao` e da marcação `mock`. Gravar o `alt` inteiro dentro de
 * `descricao` faria a página publicar a frase em dobro — exatamente o defeito
 * que o critério de aceite "nenhuma descrição contém a marcação duas vezes"
 * existe para pegar. Por isso o seed TIRA o sufixo antes de gravar, e depois
 * RECOMPÕE com `descricaoDeImagem` para conferir que bate com o `alt`
 * original — é prova, não suposição.
 *
 * ⚠️ **PONTO FOCAL: `object-position` do CSS vira `focalX`/`focalY` do
 * painel.** Só a Marê e a GDA declaram `posicao` em `acervo.ts` ("30% center",
 * "65% center"); as outras seis fotografias (galeria das quatro + abertura da
 * Bux e da Trisol) não têm posição hand-tuned e ficam com o centro padrão do
 * campo — o mesmo que `posicaoDoFoco` já assume quando nada foi clicado.
 *
 * ⚠️ **NENHUMA MARCA GANHA CATÁLOGO AQUI, e a ausência é o ponto.** Até
 * 05/08/2026 o seed criava três linhas de catálogo sem arquivo — a Trisol com
 * edição 2026, a Marê e a GDA sem edição — porque o domínio admitia um catálogo
 * "a pedir". Era isso que fazia `/catalogos` mostrar três documentos para zero
 * uploads, com um deles virando um link sem destino quando o número de WhatsApp
 * também estava em branco. Um catálogo agora é um arquivo: `lib/representadas.ts`
 * não declara `catalogos` em nenhuma das quatro marcas, e um banco recém-semeado
 * sobe com a página de catálogos honestamente vazia, oferecendo o pedido.
 *
 * ⚠️ **BANCO SEMEADO ANTES DESTA DATA PODE TER AS TRÊS LINHAS ÓRFÃS.** Elas já
 * não aparecem no site — o mapper as descarta —, mas continuam no painel até
 * alguém apagá-las, e a validação do campo pede isso na primeira republicação
 * da marca.
 *
 * A classificação gerado/fixo/campo de cada campo tocado aqui está registrada
 * em `docs/classificacao-de-texto.md` — não repetida string por string a cada
 * ticket futuro que mexer em Peça, Arquivo3D, Acabamento ou Projeto.
 */

/** Uma chave que só existe quando tem valor — mesma razão de `opcional` em
 *  `lib/representadas-traducao.ts`: `base: undefined` sobrevive em
 *  `Object.keys` mesmo sem valor, e uma marca sem cidade declarada (a Bux, a
 *  Trisol) não pode gravar uma chave `base` vazia no painel. */
function opcional<C extends string, V>(
  chave: C,
  valor: V | undefined,
): { [K in C]?: V } {
  return (valor === undefined ? {} : { [chave]: valor }) as { [K in C]?: V };
}

/** O sufixo gerado, como padrão — a mesma frase que `lib/acervo.ts` compõe,
 *  aqui para DESFAZER em vez de compor. */
const SUFIXO_DE_MOCK = new RegExp(`\\s*[—,]\\s*${MARCACAO_DE_MOCK}\\.?\\s*$`, "i");

/**
 * A inversa de `descricaoDeImagem`: tira o sufixo gerado do `alt` escrito à
 * mão para recuperar o que teria sido o campo `descricao` do operador. É a
 * única vez que este texto atravessa nessa direção — dali em diante quem
 * compõe o sufixo é sempre a função do painel, nunca de novo este seed.
 *
 * Lança se o `alt` não terminar na marcação esperada: todo `alt` de
 * `IMAGEM_DA_MARCA`/`IMAGEM_LARGA_DA_MARCA` termina nela hoje (`acervo.ts` é
 * explícito — "TUDO AQUI É MOCK"), e um `alt` que não termina é sinal de que o
 * acervo mudou sob os pés deste seed.
 */
function descricaoSemMarcacao(alt: string): string {
  const semSufixo = alt.replace(SUFIXO_DE_MOCK, "").trim();
  if (semSufixo === alt.trim()) {
    throw new Error(
      `A imagem "${alt}" não termina na marcação de mock esperada ("${MARCACAO_DE_MOCK}") — confira acervo.ts antes de semear.`,
    );
  }
  return semSufixo;
}

/** Um componente do `object-position` do CSS ("30%", "center", "left") virando
 *  o número que o campo nativo de foco do Payload espera (0–100). */
function componenteDoFoco(valor: string): number {
  if (valor === "center") return 50;
  if (valor === "left" || valor === "top") return 0;
  if (valor === "right" || valor === "bottom") return 100;
  const numero = Number.parseFloat(valor);
  return Number.isFinite(numero) ? numero : 50;
}

/**
 * `object-position` → `{ focalX, focalY }`.
 *
 * ⚠️ Sem `posicao` declarada, devolve objeto vazio — não `{focalX: 50, focalY:
 * 50}`. O campo nativo fica sem valor (equivalente a "ninguém clicou ainda"),
 * e é o próprio padrão do campo que já resolve para centro; escrever 50/50
 * explícito gravaria uma decisão que nunca foi tomada.
 */
function focoDaPosicao(posicao: string | undefined): {
  focalX?: number;
  focalY?: number;
} {
  if (!posicao) return {};
  const [x, y] = posicao.trim().split(/\s+/);
  return { focalX: componenteDoFoco(x), focalY: componenteDoFoco(y ?? x) };
}

/** Sobe uma fotografia do acervo central para a coleção Imagens, com a
 *  marcação de mock e o ponto focal traduzido. Devolve o `id` para o
 *  documento da representada referenciar. */
async function semearImagem(payload: Payload, imagem: Imagem): Promise<number> {
  const descricao = descricaoSemMarcacao(imagem.alt);

  // Prova, não suposição: recompor tem que devolver o MESMO alt que
  // `acervo.ts` escrevia à mão, ou este seed está calculando a marcação
  // errado — e é melhor parar aqui do que publicar a frase errada.
  const recomposto = descricaoDeImagem({ descricao, mock: true });
  if (recomposto !== imagem.alt) {
    throw new Error(
      `A marcação recomposta ("${recomposto}") não bate com o alt original ("${imagem.alt}") para "${imagem.src}".`,
    );
  }

  const nomeDoArquivo = path.basename(imagem.src);
  const dados = await readFile(path.join(process.cwd(), "public", imagem.src));

  const doc = (await payload.create({
    collection: "imagens",
    data: {
      descricao,
      mock: true,
      ...focoDaPosicao(imagem.posicao),
    },
    file: {
      data: dados,
      mimetype: "image/jpeg",
      name: nomeDoArquivo,
      size: dados.byteLength,
    },
  } as never)) as unknown as { id: number };

  return doc.id;
}

/**
 * Semeia uma representada — as duas fotografias primeiro, o documento depois.
 *
 * ⚠️ `_status: "published"` é explícito e não opcional: o campo que o Payload
 * gera para `versions.drafts` tem padrão `"draft"`, e `draft: false` sozinho
 * NÃO publica (achado de PRA-118, confirmado empiricamente e registrado no
 * `⚠️` de `collections/representadas.ts`). Sem esta linha as quatro marcas
 * "publicadas" entrariam como rascunho e sumiriam do site.
 */
async function semearRepresentada(
  payload: Payload,
  r: Representada,
  ordem: number,
  imagemDaGaleria: Imagem,
  imagemDeAbertura: Imagem,
): Promise<"criada" | "existente"> {
  const existente = await payload.find({
    collection: "representadas",
    where: { slug: { equals: r.slug } },
    limit: 1,
  });

  if (existente.docs.length > 0) {
    console.log(`  já existe — pulando ("${r.slug}")`);
    return "existente";
  }

  const idDaGaleria = await semearImagem(payload, imagemDaGaleria);
  const idDeAbertura = await semearImagem(payload, imagemDeAbertura);

  await payload.create({
    collection: "representadas",
    draft: false,
    data: {
      slug: r.slug,
      nome: r.nome,
      ordem,
      resolve: r.resolve,
      parte: r.parte,
      fato: r.fato,
      imagem: idDaGaleria,
      imagemLarga: idDeAbertura,
      ...opcional("base", r.base),
      ...opcional("declaracoes", r.declaracoes),
      ...opcional("designers", r.designers),
      ...opcional("colecoes", r.colecoes),
      ...opcional("vocabulario", r.vocabulario),
      ...opcional("catalogos", r.catalogos),
      _status: "published",
    },
  } as never);

  console.log(`  criada ("${r.slug}")`);
  return "criada";
}

async function semear(): Promise<void> {
  const payload = await getPayload({ config });

  console.log(
    `Semeando ${REPRESENTADAS.length} representada(s) de \`lib/representadas.ts\` no Payload...\n`,
  );

  const resultados = { criada: 0, existente: 0 };

  for (const [indice, r] of REPRESENTADAS.entries()) {
    console.log(`- ${r.nome} (${r.slug})`);

    // As duas fontes duplas de `imagemDaRepresentada`/`imagemLargaDaRepresentada`
    // em `lib/representadas.ts`: as quatro marcas escritas à mão nunca têm
    // `r.imagem`/`r.imagemLarga` preenchidos, e buscam sempre em `acervo.ts`.
    const imagemDaGaleria = r.imagem ?? IMAGEM_DA_MARCA[r.slug];
    const imagemDeAbertura = r.imagemLarga ?? IMAGEM_LARGA_DA_MARCA[r.slug];
    if (!imagemDaGaleria || !imagemDeAbertura) {
      throw new Error(`Faltam as duas fotografias de acervo para "${r.slug}".`);
    }

    const resultado = await semearRepresentada(
      payload,
      r,
      indice + 1,
      imagemDaGaleria,
      imagemDeAbertura,
    );
    resultados[resultado]++;
  }

  console.log(
    `\n${resultados.criada} criada(s), ${resultados.existente} já existia(m) e foi(ram) preservada(s) sem alteração.`,
  );

  await payload.destroy();
}

// A necessidade de rodar via `payload run` (que importa este módulo
// diretamente) e não via um runner de teste é o que exige o `await` de topo
// de nível aqui, em vez de um export que outra coisa chama.
await semear();
