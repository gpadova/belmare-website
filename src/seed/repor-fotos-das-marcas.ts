import { readFile } from "node:fs/promises";
import path from "node:path";

import { getPayload } from "payload";

import config from "@payload-config";

/**
 * Sobe as fotografias novas das quatro representadas para o bucket e aponta o
 * campo `imagem` de cada marca para elas.
 *
 * ⚠️ **EXISTE PORQUE TROCAR O ARQUIVO EM `public/acervo/` NÃO TROCA A FOTO DO
 * TRILHO — e essa descoberta custou uma rodada inteira.** `imagemDaRepresentada`
 * é `r.imagem ?? IMAGEM_DA_MARCA[r.slug]`, e as quatro marcas TÊM `imagem`
 * cadastrada no painel: o site serve o arquivo do R2, e o mock de `acervo.ts`
 * é só a reserva de quem ainda não subiu nada. Regenerar o JPEG local deixava
 * `public/acervo/marca-*.jpg` novo e a home exatamente igual.
 *
 * ⚠️ **A DESCRIÇÃO É REESCRITA JUNTO, e não é detalhe.** O `alt` sai do campo
 * `descricao` do painel, com a marcação de mock composta na leitura
 * (`descricaoDeImagem`). Trocar a fotografia sem trocar a descrição publica um
 * `alt` que descreve outra cena — foi o caso da GDA, cuja descrição dizia
 * "poltrona" para uma espreguiçadeira. `alt` que descreve a peça errada é pior
 * do que `alt` genérico, e também é SEO de imagem errado.
 *
 * ⚠️ **O PONTO FOCAL É ZERADO DE PROPÓSITO.** `focalX`/`focalY` foram clicados
 * pelo operador sobre a fotografia ANTIGA; mantê-los aponta o corte para um
 * lugar que não existe mais na cena nova. `null` devolve o centro, que é o
 * padrão do CSS, e o operador reclica quando quiser.
 *
 * ⚠️ **`mock: true` continua.** Nenhuma destas é fotografia real de produto de
 * nenhuma das quatro fábricas, e é a marcação que garante o "imagem de
 * referência" no fim de todo `alt`. Desligar isso é o site passando a mentir.
 *
 * Rodar com:
 *
 *     pnpm payload run src/seed/repor-fotos-das-marcas.ts
 */
const FOTOS = [
  {
    slug: "mare-mobilia",
    arquivo: "marca-mare-mobilia.jpg",
    descricao:
      "Poltrona de área externa com assento e encosto trançados em corda náutica, sozinha num deck de madeira ao fim da tarde, com o mar ao fundo",
  },
  {
    slug: "gda-moveis",
    arquivo: "marca-gda-moveis.jpg",
    descricao:
      "Espreguiçadeira de área externa com estrutura em alumínio fundido e tela tensionada, sobre piso de pedra clara à beira de uma piscina",
  },
  {
    slug: "bux-garden",
    arquivo: "marca-bux-garden.jpg",
    descricao:
      "Sofá modular de área externa estofado em tecido de performance, num terraço sombreado cercado de vegetação densa",
  },
  {
    slug: "trisol",
    arquivo: "marca-trisol.jpg",
    descricao:
      "Ombrelone lateral de lona escura aberto sobre piso de pedra clara ao sol forte, com a mesa e as cadeiras inteiramente dentro da sombra projetada",
  },
] as const;

const payload = await getPayload({ config });

for (const foto of FOTOS) {
  const { docs } = await payload.find({
    collection: "representadas",
    where: { slug: { equals: foto.slug } },
    depth: 0,
    limit: 1,
  });

  const marca = docs[0];

  if (marca === undefined) {
    console.log(`- ${foto.slug}: não está no banco — pulando.`);
    continue;
  }

  const caminho = path.join(process.cwd(), "public", "acervo", foto.arquivo);
  const data = await readFile(caminho);

  console.log(`- ${foto.slug}: subindo ${foto.arquivo}…`);

  const imagem = await payload.create({
    collection: "imagens",
    data: {
      descricao: foto.descricao,
      mock: true,
    },
    file: {
      data,
      name: foto.arquivo,
      mimetype: "image/jpeg",
      size: data.byteLength,
    },
  } as never);

  await payload.update({
    collection: "representadas",
    id: marca.id,
    draft: false,
    data: {
      imagem: (imagem as { id: number | string }).id,
      focalX: null,
      focalY: null,
      _status: "published",
    },
  } as never);

  console.log(`    ok — imagem #${(imagem as { id: number | string }).id}`);
}

console.log("\npronto.");

process.exit(0);
