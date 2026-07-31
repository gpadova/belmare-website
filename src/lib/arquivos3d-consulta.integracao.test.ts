import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import { buscarArquivos3DDaRepresentada } from "@/lib/arquivos3d-consulta";
import { pesoEmMB } from "@/lib/representadas";
import {
  criarArquivo,
  criarImagem,
  criarRepresentadaPublicada,
  recusaAoSalvar,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * Os arquivos 3D contra um Payload de verdade.
 *
 * ⚠️ **O QUE ESTE ARQUIVO PROVA E O PURO NÃO PODE.** Que o esquema aceita o
 * arquivo de verdade e devolve formato e peso lidos do que foi ARMAZENADO —
 * não do que o teste declarou —, e que o painel recusa um arquivo sem
 * extensão legível antes de publicar. A recusa de "arquivo sem tamanho
 * gravado" não tem teste aqui pela MESMA razão documentada em
 * `lib/representadas-traducao.test.ts`/PRA-116: o Payload não cria documento
 * de upload sem medir o arquivo que recebeu, então esse estado não é
 * produzível pela Local API — só pelo mapper, que já está coberto em
 * `lib/arquivos3d.test.ts`.
 */

let payload: Payload;
let fotoDaGaleria: number;
let fotoDeAbertura: number;

async function criarArquivo3DPublicado(
  dados: Record<string, unknown>,
): Promise<{ id: number }> {
  return payload.create({
    collection: "arquivos3d",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
}

beforeAll(async () => {
  payload = await getPayload({ config });

  fotoDaGaleria = await criarImagem(
    payload,
    "Ombrelone lateral de área externa com lona técnica",
    "galeria-arquivo3d.jpg",
  );
  fotoDeAbertura = await criarImagem(
    payload,
    "Ombrelone visto de baixo, projetando sombra sobre um deck",
    "abertura-arquivo3d.jpg",
  );
});

afterAll(async () => {
  /* O banco morre com a execução, mas os binários não: sem R2 configurado os
     uploads caem em `.uploads/` no disco — apagar o documento é o que apaga
     o arquivo. */
  await payload.delete({ collection: "arquivos3d", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "arquivos", where: {} });
  await payload.delete({ collection: "imagens", where: {} });
  await payload.destroy();
});

beforeEach(async () => {
  await payload.delete({ collection: "arquivos3d", where: {} });
  await payload.delete({ collection: "representadas", where: {} });
});

describe("o arquivo 3D, do arquivo armazenado até a consulta", () => {
  test("com o arquivo em mãos, formato e peso vêm do que foi medido — ninguém digitou nenhum dos dois", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("trisol-teste", "Trisol", fotoDaGaleria, fotoDeAbertura),
    );

    /* 8,4 MB exatos, para o peso ser conferível na casa decimal. */
    const bytes = 8.4 * 1024 * 1024;
    const arquivo = await criarArquivo(payload, "Cadeira Zuri", "cadeira-zuri.skp", bytes);

    await criarArquivo3DPublicado({
      representada: rep.id,
      nome: "Cadeira Zuri",
      arquivo,
    });

    const [item] = await buscarArquivos3DDaRepresentada("trisol-teste");

    expect(item.nome).toBe("Cadeira Zuri");
    expect(item.formato).toBe("SKP");
    expect(pesoEmMB(item.mb)).toBe("8,4");
    expect(item.url).toContain("cadeira-zuri");
  });

  test("a consulta devolve os arquivos da marca pedida, e não os de outra", async () => {
    const repA = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );
    const repB = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-b", "Marca B", fotoDaGaleria, fotoDeAbertura),
    );

    const arquivoA = await criarArquivo(payload, "A", "modelo-a.dwg", 1024);
    const arquivoB = await criarArquivo(payload, "B", "modelo-b.3ds", 1024);

    await criarArquivo3DPublicado({ representada: repA.id, nome: "Modelo A", arquivo: arquivoA });
    await criarArquivo3DPublicado({ representada: repB.id, nome: "Modelo B", arquivo: arquivoB });

    expect(
      (await buscarArquivos3DDaRepresentada("marca-a")).map((i) => i.nome),
    ).toEqual(["Modelo A"]);
    expect(
      (await buscarArquivos3DDaRepresentada("marca-b")).map((i) => i.nome),
    ).toEqual(["Modelo B"]);
  });

  test("arquivo salvo só como rascunho é invisível para a consulta pública", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("trisol-teste", "Trisol", fotoDaGaleria, fotoDeAbertura),
    );
    const arquivo = await criarArquivo(payload, "Cadeira Zuri", "cadeira-zuri.skp", 1024);

    await payload.create({
      collection: "arquivos3d",
      draft: true,
      data: { representada: rep.id, nome: "Rascunho", arquivo },
    });

    expect(await buscarArquivos3DDaRepresentada("trisol-teste")).toEqual([]);
  });
});

describe("o painel recusa, e explica em português", () => {
  test("arquivo sem extensão legível é recusado — formato nunca vira chute", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("trisol-teste", "Trisol", fotoDaGaleria, fotoDeAbertura),
    );
    const arquivo = await criarArquivo(payload, "Sem extensão", "cadeira-sem-extensao", 1024);

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "arquivos3d",
        data: { representada: rep.id, nome: "Sem extensão", arquivo },
      }),
    );

    expect(recusa).toContain("extensão");
  });

  test("arquivo 3D sem representada é recusado", async () => {
    const arquivo = await criarArquivo(payload, "Órfão", "orfao.skp", 1024);

    const recusa = await recusaAoSalvar(
      // `as never`: o teste testa exatamente a ausência de um campo
      // obrigatório, e o tipo gerado (por causa de `versions.drafts`) só
      // aceita `data` incompleto ao lado de `draft: true` — o que
      // desviaria do caminho de "publicar" que este teste quer exercitar.
      payload.create({
        collection: "arquivos3d",
        data: { nome: "Órfão", arquivo },
      } as never),
    );

    expect(recusa).not.toBe("");
  });

  test("arquivo 3D sem o arquivo em si é recusado", async () => {
    const rep = await criarRepresentadaPublicada(
      payload,
      representadaMinima("trisol-teste", "Trisol", fotoDaGaleria, fotoDeAbertura),
    );

    const recusa = await recusaAoSalvar(
      payload.create({
        collection: "arquivos3d",
        data: { representada: rep.id, nome: "Sem arquivo" },
      } as never),
    );

    expect(recusa).not.toBe("");
  });
});
