import { readFile } from "node:fs/promises";
import path from "node:path";

import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { MARCACAO_DE_MOCK, descricaoDeImagem } from "@/lib/acervo";
import { PRANCHA_EM_CODIGO } from "@/lib/prancha-area-externa";

/**
 * O seed de PRA-123 — move a fotografia da PRANCHA 02 e as quatro chamadas
 * medidas à mão para dentro do painel.
 *
 * Como rodar: `pnpm payload run src/seed/semear-prancha.ts`, ou `pnpm db:seed`,
 * que roda este depois dos outros dois.
 *
 * ⚠️ **NADA É RETIPADO.** A fotografia e as quatro coordenadas saem de
 * `PRANCHA_EM_CODIGO`, importada. Não existe um segundo literal com os mesmos
 * números aqui — uma diferença entre o que o painel recebe e o que a página
 * desenhava antes seria, por definição, um defeito deste arquivo.
 *
 * ⚠️ **A CHAMADA É LIGADA À REPRESENTADA PELO `slug`**, que é o que o seed de
 * PRA-119 já gravou. Se uma marca não estiver cadastrada, este seed PARA em vez
 * de criar uma prancha com três chamadas — uma chamada a menos é a página
 * perdendo um quarto do argumento sem nada quebrar visivelmente, que é
 * exatamente a classe de falha silenciosa que este ticket existe para acabar.
 *
 * ⚠️ **REEXECUÇÃO: PULA SE JÁ ESTÁ PUBLICADA, NUNCA SOBRESCREVE.** Mesma
 * política dos outros dois seeds, e aqui ela é ainda mais literal: depois da
 * primeira execução, o que está gravado são pinos que alguém ARRASTOU. Uma
 * segunda execução que reescrevesse as coordenadas devolveria o desenho às
 * medidas antigas — contra uma fotografia que pode nem ser mais a mesma.
 */

/** O sufixo gerado, para DESFAZER — a mesma inversa do seed de PRA-119, e pelo
 *  mesmo motivo: gravar o `alt` inteiro dentro de `descricao` faz a página
 *  publicar "imagem de referência" duas vezes. */
const SUFIXO_DE_MOCK = new RegExp(`\\s*[—,]\\s*${MARCACAO_DE_MOCK}\\.?\\s*$`, "i");

function descricaoSemMarcacao(alt: string): string {
  const semSufixo = alt.replace(SUFIXO_DE_MOCK, "").trim();
  if (semSufixo === alt.trim()) {
    throw new Error(
      `A fotografia da prancha ("${alt}") não termina na marcação de mock esperada ("${MARCACAO_DE_MOCK}") — confira acervo.ts antes de semear.`,
    );
  }
  return semSufixo;
}

async function semearFotografia(payload: Payload): Promise<number> {
  const { foto } = PRANCHA_EM_CODIGO;
  const descricao = descricaoSemMarcacao(foto.alt);

  // Prova, não suposição: recompor tem que devolver o MESMO alt que a página
  // desenhava antes da migração.
  const recomposto = descricaoDeImagem({ descricao, mock: true });
  if (recomposto !== foto.alt) {
    throw new Error(
      `A marcação recomposta ("${recomposto}") não bate com o alt original ("${foto.alt}").`,
    );
  }

  const dados = await readFile(path.join(process.cwd(), "public", foto.src));

  const doc = (await payload.create({
    collection: "imagens",
    data: { descricao, mock: true },
    file: {
      data: dados,
      mimetype: "image/jpeg",
      name: path.basename(foto.src),
      size: dados.byteLength,
    },
  } as never)) as unknown as { id: number };

  return doc.id;
}

async function idDaRepresentada(
  payload: Payload,
  slug: string,
): Promise<number> {
  const { docs } = await payload.find({
    collection: "representadas",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });

  const doc = docs[0];
  if (doc === undefined) {
    throw new Error(
      `A representada "${slug}" não está cadastrada — rode \`pnpm payload run src/seed/semear-representadas.ts\` antes deste seed.`,
    );
  }

  return doc.id;
}

async function semear(): Promise<void> {
  const payload = await getPayload({ config });

  console.log("Semeando a prancha da área externa no Payload...\n");

  const atual = await payload.findGlobal({ slug: "prancha", depth: 0 });
  if (atual._status === "published") {
    console.log("  já publicada — pulando (os pinos gravados são de quem os arrastou).");
    await payload.destroy();
    return;
  }

  const foto = await semearFotografia(payload);
  console.log(`  fotografia enviada (${PRANCHA_EM_CODIGO.foto.src})`);

  const chamadas = [];
  for (const chamada of PRANCHA_EM_CODIGO.chamadas) {
    chamadas.push({
      representada: await idDaRepresentada(payload, chamada.slug),
      rotuloX: chamada.rotulo.x,
      rotuloY: chamada.rotulo.y,
      alvoX: chamada.alvo.x,
      alvoY: chamada.alvo.y,
    });
    console.log(`  chamada ${chamadas.length} — ${chamada.slug}`);
  }

  /* ⚠️ `_status: "published"` explícito: `draft: false` sozinho NÃO publica (o
     campo tem padrão `"draft"` — achado de PRA-118). Sem esta linha a prancha
     entra como rascunho, `lib/prancha-consulta.ts` não a deixa passar, e a
     página desenha a reserva do código como se o seed não tivesse rodado. */
  await payload.updateGlobal({
    slug: "prancha",
    draft: false,
    data: { foto, chamadas, _status: "published" },
  } as never);

  console.log(
    `\nPrancha publicada com ${chamadas.length} chamada(s). A partir daqui a fotografia e as posições são do painel — as do código viraram reserva.`,
  );

  await payload.destroy();
}

// `payload run` importa este módulo diretamente — daí o `await` de topo de
// nível, e não um export que outra coisa chama.
await semear();
