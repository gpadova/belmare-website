import config from "@payload-config";
import { getPayload } from "payload";

import { PRIVACIDADE } from "@/seed/politica-de-privacidade-texto";

/**
 * Reescreve, no banco, a página `/politica-de-privacidade` inteira — resumo e
 * composição — com a redação de `seed/politica-de-privacidade-texto.ts`.
 *
 * ⚠️ **EXISTE PELA MESMA RAZÃO QUE `atualizar-textos-da-home.ts`.**
 * `semear-paginas.ts` PULA o que já existe, e pula com razão: uma composição
 * gravada é trabalho que alguém montou arrastando blocos no painel, e um seed
 * que passasse por cima o apagaria sem aviso. A consequência é que trocar o
 * texto no arquivo **não muda um banco já semeado** — e o banco deste projeto é
 * o mesmo em produção e em desenvolvimento (ver `.env.example`,
 * `TEST_DATABASE_URI`). Sem este script, a redação nova ficaria no repositório e
 * o site continuaria publicando a antiga.
 *
 * ⚠️ **ELE SOBRESCREVE DE PROPÓSITO, E ISSO É O CONTRÁRIO DO SEED.** Rodar isto
 * descarta a composição que estiver gravada em `/politica-de-privacidade`,
 * inclusive uma edição feita à mão no painel. É o comportamento certo para um
 * documento legal — a versão correta é uma só, e é a que está em código — mas
 * não é o comportamento de um seed, e por isso está num arquivo separado que
 * ninguém roda sem querer. `paginas` guarda versões
 * (`versions.maxPerDoc: 20`, `collections/paginas.ts`): a composição anterior
 * continua no histórico do painel, e voltar a ela é um clique.
 *
 * ⚠️ **PUBLICA, NÃO RASCUNHA.** `_status: "published"` explícito, pela mesma
 * razão do seed: `draft: false` sozinho não publica, o padrão do campo é
 * `"draft"` (achado de PRA-118). Sem esta linha a política nova entraria como
 * rascunho e o site continuaria servindo a antiga, sem erro nenhum e sem
 * ninguém perceber.
 *
 * Idempotente: rodar duas vezes grava o mesmo conteúdo duas vezes. A segunda
 * execução não muda o que o visitante lê — só acrescenta uma versão idêntica ao
 * histórico.
 *
 * Rodar com:
 *
 *     pnpm payload run src/seed/atualizar-politica-de-privacidade.ts
 */
const payload = await getPayload({ config });

const { docs } = await payload.find({
  collection: "paginas",
  where: { slug: { equals: PRIVACIDADE.slug } },
  limit: 1,
  depth: 0,
});

const atual = docs[0];

if (atual === undefined) {
  /* Banco ainda não semeado. O seed é quem cria — e ele já usa esta mesma
     constante, então rodá-lo publica exatamente este texto. */
  console.log(
    `Não existe página com o slug "${PRIVACIDADE.slug}" neste banco.\n` +
      "Rode `pnpm payload run src/seed/semear-paginas.ts` — ele cria a página\n" +
      "com esta mesma redação.",
  );
} else {
  await payload.update({
    collection: "paginas",
    id: atual.id,
    draft: false,
    data: {
      titulo: PRIVACIDADE.titulo,
      resumo: PRIVACIDADE.resumo,
      composicao: PRIVACIDADE.composicao,
      _status: "published",
    },
  } as never);

  const blocos = PRIVACIDADE.composicao
    .map((bloco) => (bloco as { blockType: string }).blockType)
    .join(", ");

  console.log(
    `Regravada e publicada: /${PRIVACIDADE.slug} — ${PRIVACIDADE.composicao.length} bloco(s) (${blocos}).`,
  );
  console.log(
    "\n⚠️  A composição anterior não sumiu: ela está no histórico de versões da\n" +
      "    página, no painel, em \"O site › Páginas › Política de privacidade\".",
  );
}

await payload.destroy();
