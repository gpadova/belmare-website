import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import {
  buscarArquivos3DDaRepresentada,
  buscarBiblioteca3D,
  buscarPacote3D,
} from "@/lib/arquivos3d-consulta";
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

/**
 * A biblioteca de `/arquivos-3d` contra um Payload de verdade — PRA-127.
 *
 * ⚠️ **O QUE ESTE BLOCO PROVA E O PURO NÃO PODE: QUE AGRUPAR NÃO VIROU
 * FILTRAR.** A página é agrupada por representada, e a tentação óbvia de
 * implementá-la é um `find` sem escopo de marca, ordenado por fábrica — o que
 * daria o mesmo pixel e abriria por dentro o eixo transversal que o princípio 2
 * do `PRODUCT.md` fecha. `buscarBiblioteca3D` é N leituras escopadas, e o teste
 * abaixo confere o resultado ARRUMADO sem que exista, em lugar nenhum do
 * caminho, uma consulta que peça duas fábricas ao mesmo tempo.
 */
describe("a biblioteca inteira, agrupada por representada", () => {
  test("cada fábrica traz os próprios arquivos, e a ordem de apresentação é preservada", async () => {
    /* ⚠️ `ordem` explícita, e as duas ao contrário da ordem de criação: o que
       este teste afirma é que a biblioteca respeita a ORDEM DE APRESENTAÇÃO da
       Belmare (`Representada.ordem`, campo do painel), não a ordem em que os
       documentos entraram no banco nem a ordem alfabética. Sem os dois números
       o `sort: "ordem"` compara dois nulos e o resultado é arbitrário — a
       asserção passaria ou falharia por sorte. */
    const primeira = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
      ordem: 2,
    });
    const segunda = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-b", "Marca B", fotoDaGaleria, fotoDeAbertura),
      ordem: 1,
    });

    const arquivoA = await criarArquivo(payload, "A", "modelo-a.dwg", 2 * 1024 * 1024);
    const arquivoB = await criarArquivo(payload, "B", "modelo-b.skp", 1024);

    await criarArquivo3DPublicado({
      representada: primeira.id,
      nome: "Modelo A",
      arquivo: arquivoA,
    });
    await criarArquivo3DPublicado({
      representada: segunda.id,
      nome: "Modelo B",
      arquivo: arquivoB,
    });

    const biblioteca = await buscarBiblioteca3D();

    // "marca-b" tem `ordem: 1` e vem primeiro, apesar de ter sido criada
    // depois e de vir depois no alfabeto.
    expect(biblioteca.map((grupo) => grupo.marca.slug)).toEqual([
      "marca-b",
      "marca-a",
    ]);
    expect(biblioteca[0].arquivos.map((a) => a.nome)).toEqual(["Modelo B"]);
    expect(biblioteca[1].arquivos.map((a) => a.nome)).toEqual(["Modelo A"]);

    // Formato e peso chegam junto do nome — é o tipo que garante, e aqui o
    // valor vem do arquivo ARMAZENADO, não do que o teste declarou.
    expect(biblioteca[1].arquivos[0].formato).toBe("DWG");
    expect(pesoEmMB(biblioteca[1].arquivos[0].mb)).toBe("2,0");
  });

  test("a fábrica sem arquivo nenhum não vira grupo — seção anulável", async () => {
    const comArquivo = await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );
    await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-b", "Marca B", fotoDaGaleria, fotoDeAbertura),
    );

    const arquivo = await criarArquivo(payload, "A", "modelo-a.dwg", 1024);
    await criarArquivo3DPublicado({
      representada: comArquivo.id,
      nome: "Modelo A",
      arquivo,
    });

    // A "Marca B" está publicada e é vizinha da "Marca A" em toda outra lista
    // do site — aqui ela some, porque um cabeçalho sobre nenhuma linha é
    // exatamente o que a regra proíbe.
    expect((await buscarBiblioteca3D()).map((g) => g.marca.slug)).toEqual([
      "marca-a",
    ]);
  });

  test("sem nenhum arquivo cadastrado, a biblioteca é uma lista vazia — não quatro cabeçalhos", async () => {
    await criarRepresentadaPublicada(
      payload,
      representadaMinima("marca-a", "Marca A", fotoDaGaleria, fotoDeAbertura),
    );

    // O estado REAL do acervo em 31/07/2026: nenhuma das quatro fábricas
    // entregou arquivo. A página escreve o estado; ela não desenha a tabela.
    expect(await buscarBiblioteca3D()).toEqual([]);
  });
});

/**
 * O pacote completo — o único download atrás de cadastro.
 *
 * ⚠️ O que se prova aqui é a garantia que protege o VISITANTE, não o layout:
 * enquanto não houver pacote publicado, a consulta devolve `undefined`, e é
 * esse `undefined` que apaga o formulário junto com a seção. Sem ele, o site
 * teria um estado em que pede nome, e-mail, cidade e escritório em troca de um
 * arquivo que não existe.
 */
describe("o pacote completo, do global até a consulta", () => {
  test("global em rascunho não vira download — e o formulário some com ele", async () => {
    const arquivo = await criarArquivo(
      payload,
      "Pacote Belmare",
      "pacote-belmare.zip",
      1024,
    );

    await payload.updateGlobal({
      slug: "pacote-3d",
      draft: true,
      data: { pacote: arquivo },
    });

    expect(await buscarPacote3D()).toBeUndefined();
  });

  test("publicado, formato e peso vêm do arquivo armazenado", async () => {
    const bytes = 62.4 * 1024 * 1024;

    /* ⚠️ **O NOME NÃO PODE TERMINAR EM NÚMERO.** O banco é descartável, mas os
       binários não são: sem R2 os uploads caem em `.uploads/` e sobrevivem a
       uma execução interrompida (o `afterAll` é quem os apaga). Quando o nome
       já existe em disco, o Payload não acrescenta sufixo — ele INCREMENTA o
       número final: `pacote-belmare-2026.zip` volta como
       `pacote-belmare-2027.zip`, e a asserção de endereço falha por faxina, não
       por defeito. As outras deste arquivo ("cadeira-zuri", "modelo-a") passam
       porque `-1` no fim preserva o trecho conferido. */
    const arquivo = await criarArquivo(
      payload,
      "Pacote Belmare",
      "pacote-belmare-completo.zip",
      bytes,
    );

    await payload.updateGlobal({
      slug: "pacote-3d",
      draft: false,
      data: { pacote: arquivo, _status: "published" },
    } as never);

    const pacote = await buscarPacote3D();

    expect(pacote?.formato).toBe("ZIP");
    expect(pesoEmMB(pacote?.mb ?? 0)).toBe("62,4");
    expect(pacote?.url).toContain("pacote-belmare-completo");
  });

  test("pacote sem extensão legível é recusado no painel — formato nunca vira chute", async () => {
    const arquivo = await criarArquivo(payload, "Pacote", "pacote-sem-extensao", 1024);

    const recusa = await recusaAoSalvar(
      payload.updateGlobal({
        slug: "pacote-3d",
        data: { pacote: arquivo, _status: "published" },
      } as never),
    );

    expect(recusa).toContain("extensão");
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
