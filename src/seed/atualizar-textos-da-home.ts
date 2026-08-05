import { getPayload } from "payload";

import config from "@payload-config";

import { REPRESENTADAS } from "@/lib/representadas";

/**
 * Reescreve, no banco, os textos da home que a revisão de acabamento derrubou
 * em 05/08/2026 — o `resolve` das fábricas e o parágrafo da galeria.
 *
 * ⚠️ **EXISTE PELA MESMA RAZÃO QUE `atualizar-galeria.ts`, E SUBSTITUI AQUELE.**
 * Nem `semear-representadas.ts` nem `semear-globais.ts` podem fazer isto: os
 * dois pulam o que já existe, e pulam com razão — um seed não pode passar por
 * cima de uma edição feita no painel. A consequência é que trocar o valor no
 * arquivo do seed **não muda um banco já semeado**, e foi exatamente esse o
 * defeito que a revisão pegou: os dois `resolve` já diziam "Móveis" no código e
 * a home continuava imprimindo "Mobiliário".
 *
 * ⚠️ **O QUE ESTE SCRIPT CORRIGE, E POR QUÊ:**
 *
 *   1. **`resolve` da Marê e da GDA.** Diziam "Mobiliário externo em coleções
 *      assinadas" e "Mobiliário em alumínio fundido". O h1 do site existe para
 *      dizer "móveis", e a palavra foi derrubada por leitura do cliente em
 *      05/08/2026: "mobiliário" é palavra de catálogo e de release, e ninguém
 *      do ramo a diz em voz alta (`components/abertura.tsx`). `resolve` é a voz
 *      do site — a linha impressa sob o cartão —, então obedece a regra.
 *      **`declaracoes` NÃO é tocado:** ali a fábrica fala, e o valor transcreve
 *      a declaração de posicionamento da própria Marê. Transcrição não se
 *      reescreve.
 *
 *   2. **`Home.galeria`.** Dizia "Nenhuma delas repete a linha da outra.", que
 *      é falso: `PRODUCT.md` lista sofás, poltronas, cadeiras, espreguiçadeiras
 *      e mesas na Marê **e** na GDA. O que não se repete é o papel de cada
 *      fábrica, e é isso que a frase nova diz — o campo `parte` guarda "Móvel",
 *      "Estrutura", "Estofado" e "Sombra", uma parte por fábrica.
 *
 * ⚠️ **A FONTE DO `resolve` É `lib/representadas.ts`, NÃO UM LITERAL AQUI.** Um
 * segundo lugar com o texto certo é o mesmo defeito de fonte dupla que criou
 * este problema. O script lê a constante e grava o que ela diz; corrigir o
 * texto uma vez, no arquivo, e rodar isto basta.
 *
 * Idempotente por construção: grava valores literais e não faz nada quando já
 * estão no ar.
 *
 * Rodar com:
 *
 *     pnpm payload run src/seed/atualizar-textos-da-home.ts
 */
const PARAGRAFO_DA_GALERIA = "Cada uma entra por uma parte diferente da área externa.";

const payload = await getPayload({ config });

let alteracoes = 0;

for (const esperada of REPRESENTADAS) {
  const { docs } = await payload.find({
    collection: "representadas",
    where: { slug: { equals: esperada.slug } },
    depth: 0,
    limit: 1,
  });

  const atual = docs[0];

  if (atual === undefined) {
    console.log(`- ${esperada.nome}: não está no banco — pulando.`);
    continue;
  }

  /* ⚠️ **AS LINHAS DE CATÁLOGO SEM ARQUIVO SAEM JUNTO, E NÃO É EFEITO
     COLATERAL — É O QUE DESTRAVA A ESCRITA.** Três representadas tinham uma
     linha `{ titulo: "Catálogo", arquivo: null }` gravada no banco, sobra do
     modelo anterior em que um catálogo podia existir sem o PDF em mãos. Esse
     modelo caiu em 05/08/2026 ("sobe o PDF, aparece a linha") e o campo virou
     obrigatório — o que tornou as linhas antigas INVÁLIDAS e, com elas, o
     documento inteiro impossível de salvar: qualquer gravação em Marê, GDA ou
     Trisol falhava na validação de um campo que ninguém estava editando,
     inclusive pelo painel. Elas já não apareciam em lugar nenhum do site (o
     mapper descarta catálogo sem arquivo), então o que se perde é zero pixel e
     o que se ganha é a fábrica voltar a ser editável.

     Só sai linha SEM arquivo. Linha com PDF é preservada como está. */
  const catalogos = (atual.catalogos ?? []) as Array<{ arquivo?: unknown }>;
  const comArquivo = catalogos.filter(
    (c) => c.arquivo !== null && c.arquivo !== undefined,
  );
  const orfas = catalogos.length - comArquivo.length;

  if (atual.resolve === esperada.resolve && orfas === 0) {
    console.log(`- ${esperada.nome}: já está em "${esperada.resolve}".`);
    continue;
  }

  console.log(`- ${esperada.nome}`);
  if (atual.resolve !== esperada.resolve) {
    console.log(`    resolve antes:  ${JSON.stringify(atual.resolve)}`);
  }
  if (orfas > 0) {
    console.log(`    ${orfas} linha(s) de catálogo sem arquivo — removendo`);
  }

  try {
    await payload.update({
      collection: "representadas",
      id: atual.id,
      draft: false,
      data: {
        resolve: esperada.resolve,
        catalogos: comArquivo,
        _status: "published",
      },
    } as never);
  } catch (erro) {
    console.log(JSON.stringify((erro as { data?: unknown }).data, null, 2));
    throw erro;
  }

  console.log(`    resolve depois: ${JSON.stringify(esperada.resolve)}`);
  alteracoes += 1;
}

const home = await payload.findGlobal({ slug: "home", depth: 0 });

if (home.galeria === PARAGRAFO_DA_GALERIA) {
  console.log(`- galeria: já está no valor novo.`);
} else {
  console.log(`- galeria`);
  console.log(`    antes:  ${JSON.stringify(home.galeria)}`);

  await payload.updateGlobal({
    slug: "home",
    draft: false,
    data: { galeria: PARAGRAFO_DA_GALERIA, _status: "published" },
  } as never);

  console.log(`    depois: ${JSON.stringify(PARAGRAFO_DA_GALERIA)}`);
  alteracoes += 1;
}

console.log(`\n${alteracoes} campo(s) alterado(s).`);

process.exit(0);
