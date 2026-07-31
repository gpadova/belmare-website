import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { buscarHome, buscarQuemSomos } from "@/lib/espinha-consulta";
import { emLista } from "@/lib/frase";
import { representadasDaPagina } from "@/lib/representadas-consulta";
import { TAG_HOME, TAG_QUEM_SOMOS, TAG_SITE } from "@/lib/revalidacao";
import {
  criarImagem,
  criarRepresentadaPublicada,
  recusaAoSalvar,
  representadaMinima,
} from "@/test/apoio-de-integracao";

/**
 * Os três globais contra um Payload de verdade.
 *
 * ⚠️ **O QUE ESTA SUÍTE ACRESCENTA À DERIVAÇÃO PURA É A FIAÇÃO.**
 * `revalidacao.test.ts` já prova que mudar a identidade da empresa DERIVA a
 * etiqueta do site — o que ninguém tinha provado até PRA-122 é que existe um
 * hook chamando essa derivação, porque até então não existia global nenhum. É
 * exatamente a linha "⚠️ só no nível da função pura" que PRA-117 deixou aberta
 * na tabela de critérios dele.
 *
 * ⚠️ **O ESPIÃO É SOBRE `revalidateTag`, E SÓ SOBRE ELE.** Fora de uma
 * requisição do Next — que é este mundo — `revalidateTag` lança, e
 * `collections/apoio.ts#revalidarTags` absorve o lançamento de propósito
 * (garantia de PRA-117). Sem espião não sobra sintoma nenhum para observar: o
 * hook rodaria e o teste não teria como saber. O espião só REGISTRA a etiqueta
 * e não chama o original — a tolerância ao mundo sem requisição já é provada
 * em outro lugar, e o que se afirma aqui é qual etiqueta o hook pede.
 */

const { etiquetas } = vi.hoisted(() => ({ etiquetas: [] as string[] }));

vi.mock("next/cache", async (importarOriginal) => {
  const original = await importarOriginal<typeof import("next/cache")>();
  return {
    ...original,
    revalidateTag: (etiqueta: string) => {
      etiquetas.push(etiqueta);
    },
  };
});

let payload: Payload;

/** A identidade mínima que publica — os campos obrigatórios do global. */
const IDENTIDADE = {
  nomeCompleto: "Belmare Representações",
  razaoSocial: "Bello Mare Mercantil Ltda",
  cnpj: "03.133.708/0001-09",
  abertura: "1999-04-22T00:00:00.000Z",
};

async function publicarEmpresa(dados: Record<string, unknown> = {}) {
  etiquetas.length = 0;
  return payload.updateGlobal({
    slug: "empresa",
    draft: false,
    data: { ...IDENTIDADE, ...dados, _status: "published" },
  } as never);
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterAll(async () => {
  await payload.delete({ collection: "representadas", where: {} });
  await payload.delete({ collection: "imagens", where: {} });
  await payload.destroy();
});

beforeEach(async () => {
  etiquetas.length = 0;
});

describe("publicar a identidade da empresa invalida o site inteiro", () => {
  test("trocar o WhatsApp deriva a etiqueta do site — e o hook de fato a dispara", async () => {
    await publicarEmpresa({ whatsapp: "5548991375030" });

    /* Uma etiqueta, e a do site. Não há "as seis rotas onde a empresa
       aparece": o rodapé mora no layout, logo está em toda rota — inclusive a
       404, que não aparece em lista nenhuma de páginas. */
    expect(etiquetas).toEqual([TAG_SITE]);
  });

  test("salvar rascunho NÃO dispara etiqueta nenhuma", async () => {
    await publicarEmpresa({ whatsapp: "5548991375030" });
    etiquetas.length = 0;

    await payload.updateGlobal({
      slug: "empresa",
      draft: true,
      data: { whatsapp: "(48) 3234-6004" },
    } as never);

    // Revalidar em rascunho etiquetaria uma página que o público nem vê: o
    // ponto inteiro de ter rascunho deixaria de existir.
    expect(etiquetas).toEqual([]);
  });

  test("o rascunho não vaza — o site continua servindo o número publicado", async () => {
    await publicarEmpresa({ whatsapp: "(48) 99137-5030" });

    await payload.updateGlobal({
      slug: "empresa",
      draft: true,
      data: { whatsapp: "(48) 3234-6004" },
    } as never);

    expect((await buscarEmpresa()).whatsapp).toBe("5548991375030");
  });

  test("o número digitado com pontuação chega à página como link que abre", async () => {
    // A edição que o operador faz de verdade, ponta a ponta: ele escreve o
    // número como está no cartão e a página publica um wa.me que funciona.
    await publicarEmpresa({ whatsapp: "(48) 99137-5030" });

    const empresa = await buscarEmpresa();
    expect(empresa.whatsapp).toBe("5548991375030");

    const link = linkDeWhatsapp(empresa.whatsapp, "estava no rodapé");
    expect(link).toContain("https://wa.me/5548991375030");
    expect(decodeURIComponent(link ?? "")).toContain("estava no rodapé");
  });

  test("o e-mail comercial atravessa normalizado", async () => {
    await publicarEmpresa({ email: "Comercial@Belmare.com.br" });
    expect((await buscarEmpresa()).email).toBe("comercial@belmare.com.br");
  });

  test("sem canal preenchido não há link nenhum — e o resto da identidade continua de pé", async () => {
    /* O estado em que o site sobe hoje: o seed publica a identidade e deixa os
       dois canais vazios de propósito, porque os valores que existiam em
       código eram mocks. O rodapé perde o WhatsApp e mantém razão social,
       CNPJ e endereço. Menos página, nunca página quebrada. */
    await publicarEmpresa({ whatsapp: "", email: "" });

    const empresa = await buscarEmpresa();
    expect(empresa.whatsapp).toBeUndefined();
    expect(linkDeWhatsapp(empresa.whatsapp, "estava no rodapé")).toBeUndefined();
    expect(empresa.razaoSocial).toBe("Bello Mare Mercantil Ltda");
  });
});

describe("o painel recusa, e explica em português", () => {
  test("um WhatsApp incompleto é recusado", async () => {
    const recusa = await recusaAoSalvar(
      publicarEmpresa({ whatsapp: "48 99137" }),
    );
    expect(recusa).toContain("número de telefone brasileiro");
  });

  test("o número que estava mockado em produção é recusado", async () => {
    const recusa = await recusaAoSalvar(
      publicarEmpresa({ whatsapp: "5548000000000" }),
    );
    expect(recusa).not.toBe("");
  });

  test("um e-mail sem domínio é recusado", async () => {
    const recusa = await recusaAoSalvar(publicarEmpresa({ email: "comercial@" }));
    expect(recusa.toLowerCase()).toContain("@");
  });

  test("um CNPJ com um dígito trocado é recusado", async () => {
    const recusa = await recusaAoSalvar(
      publicarEmpresa({ cnpj: "03.133.708/0001-08" }),
    );
    expect(recusa).toContain("CNPJ");
  });

  test("publicar sem razão social é recusado", async () => {
    const recusa = await recusaAoSalvar(publicarEmpresa({ razaoSocial: "" }));
    expect(recusa).not.toBe("");
  });
});

describe("os outros dois globais invalidam uma página cada, e não o site", () => {
  test("publicar a home dispara só a etiqueta da home", async () => {
    etiquetas.length = 0;
    await payload.updateGlobal({
      slug: "home",
      draft: false,
      data: { galeria: "Móvel de autor, estrutura, conforto e sombra.", _status: "published" },
    } as never);

    expect(etiquetas).toEqual([TAG_HOME]);
    expect((await buscarHome()).galeria).toBe(
      "Móvel de autor, estrutura, conforto e sombra.",
    );
  });

  test("publicar quem-somos dispara só a etiqueta de /quem-somos", async () => {
    etiquetas.length = 0;
    await payload.updateGlobal({
      slug: "quem-somos",
      draft: false,
      data: { registro: "Um parágrafo de registro.", _status: "published" },
    } as never);

    expect(etiquetas).toEqual([TAG_QUEM_SOMOS]);
    expect((await buscarQuemSomos()).registro).toBe("Um parágrafo de registro.");
  });

  test("campo em branco vira parágrafo ausente, não parágrafo vazio", async () => {
    await payload.updateGlobal({
      slug: "home",
      draft: false,
      data: { galeria: "   ", _status: "published" },
    } as never);

    // A seção anulável: o parágrafo some da página em vez de abrir um vão.
    expect((await buscarHome()).galeria).toBeUndefined();
  });
});

describe("a lista de representadas do parágrafo de abertura", () => {
  test("muda quando uma marca entra, e reordenar reescreve a frase", async () => {
    /* O critério de aceite do ticket, no seam: a frase da abertura da home é
       montada da lista PUBLICADA, e não de um texto digitado. Cadastrar a
       quinta fábrica muda a frase; trocar a ordem de apresentação muda a
       frase. Ninguém edita prosa nenhuma nos dois casos. */
    await payload.delete({ collection: "representadas", where: {} });

    const galeria = await criarImagem(payload, "Deck com sofá modular", "g.jpg");
    const abertura = await criarImagem(payload, "Deck visto de longe", "a.jpg");

    await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-a", "Marca A", galeria, abertura),
      ordem: 1,
    });
    await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-b", "Marca B", galeria, abertura),
      ordem: 2,
    });

    expect(emLista((await representadasDaPagina()).map((r) => r.nome))).toBe(
      "Marca A e Marca B",
    );

    // Uma terceira entra: a frase ganha a vírgula sozinha.
    const terceira = await criarRepresentadaPublicada(payload, {
      ...representadaMinima("marca-c", "Marca C", galeria, abertura),
      ordem: 3,
    });

    expect(emLista((await representadasDaPagina()).map((r) => r.nome))).toBe(
      "Marca A, Marca B e Marca C",
    );

    // Reordenar no painel reescreve a frase — a ordem é campo da coleção.
    await payload.update({
      collection: "representadas",
      id: terceira.id,
      draft: false,
      data: { ordem: 0, _status: "published" },
    } as never);

    expect(emLista((await representadasDaPagina()).map((r) => r.nome))).toBe(
      "Marca C, Marca A e Marca B",
    );
  });
});
