import { getPayload } from "payload";

import config from "@payload-config";

/**
 * Reescreve o parágrafo da galeria no global `home`, no banco.
 *
 * ⚠️ **EXISTE PORQUE `semear-globais.ts` NÃO PODE FAZER ISSO.** Aquele seed
 * pula todo global que já está publicado (`_status === "published"`), e é certo
 * que pule: ele não pode passar por cima de uma edição feita no painel. Mas
 * isso também significa que trocar o valor no arquivo do seed NÃO muda o site
 * de um banco já semeado — o texto no ar continua sendo o antigo, e a diferença
 * só aparece para quem for ler a página.
 *
 * Este script é a exceção declarada: uma escrita pontual, de um campo só,
 * pedida pelo cliente em 05/08/2026. Ele não é idempotente por acaso — é
 * idempotente por construção, porque grava um valor literal.
 *
 * Rodar com:
 *
 *     pnpm payload run src/seed/atualizar-galeria.ts
 */
const PARAGRAFO = "Nenhuma delas repete a linha da outra.";

const payload = await getPayload({ config });

const antes = await payload.findGlobal({ slug: "home", depth: 0 });
console.log(`antes:  ${JSON.stringify(antes.galeria)}`);

if (antes.galeria === PARAGRAFO) {
  console.log("já está no valor novo — nada a fazer.");
} else {
  await payload.updateGlobal({
    slug: "home",
    draft: false,
    data: { galeria: PARAGRAFO, _status: "published" },
  } as never);

  const depois = await payload.findGlobal({ slug: "home", depth: 0 });
  console.log(`depois: ${JSON.stringify(depois.galeria)}`);
}

process.exit(0);
