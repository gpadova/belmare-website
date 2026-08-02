import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

import { enviarLead } from "@/lib/lead-acao";
import { ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD } from "@/lib/lead";

/**
 * O Server Action de ponta a ponta — PRA-126.
 *
 * ⚠️ **O QUE ESTA SUÍTE ACRESCENTA À FRONTEIRA DE `collections/leads.ts`
 * (`lead-consulta.integracao.test.ts`).** Aquele arquivo prova que a COLEÇÃO
 * aceita escrita anônima e recusa leitura anônima. Este prova a função que o
 * FORMULÁRIO de fato chama: lê `FormData`, grava com `overrideAccess: false`,
 * e — o ponto central do ticket — nunca devolve "erro" depois de gravar,
 * mesmo quando o aviso por e-mail não tem para onde ir (sem e-mail comercial
 * cadastrado) ou não tem como sair (sem `RESEND_API_KEY`, o caso de qualquer
 * máquina recém-clonada). As duas ausências são o padrão local, não o caso
 * raro — e `ambiente.ts` não define `RESEND_API_KEY`, então esta suíte já
 * roda no mesmo silêncio que `pnpm test` encontra numa máquina nova.
 */

let payload: Payload;

const IDENTIDADE_MINIMA = {
  nomeCompleto: "Belmare Representações",
  razaoSocial: "Bello Mare Mercantil Ltda",
  cnpj: "03.133.708/0001-09",
  abertura: "1999-04-22T00:00:00.000Z",
};

/** Publica o global `empresa` só com o que o teste precisa — sem e-mail
 *  comercial por padrão, que é o estado real de um banco recém-semeado
 *  (PRA-122 deixou o campo vazio de propósito). */
async function publicarEmpresa(dados: Record<string, unknown> = {}) {
  return payload.updateGlobal({
    slug: "empresa",
    draft: false,
    data: { ...IDENTIDADE_MINIMA, ...dados, _status: "published" },
  } as never);
}

/** O `FormData` que o `<form>` de verdade envia — os quatro campos visíveis
 *  mais os dois ocultos de origem, exatamente como
 *  `components/formulario-de-lead.tsx` monta o envio. */
function formularioPreenchido(
  campos: Partial<{
    nome: string;
    email: string;
    cidade: string;
    escritorio: string;
    consentimentoMarketing: boolean;
    pagina: string;
    marca: string;
  }> = {},
) {
  const dados = {
    nome: "Ana Prado",
    email: "ana@escritorioprado.com.br",
    cidade: "Florianópolis",
    escritorio: "Escritório Prado",
    pagina: "contato",
    ...campos,
  };

  const formulario = new FormData();
  formulario.set("nome", dados.nome);
  formulario.set("email", dados.email);
  formulario.set("cidade", dados.cidade);
  formulario.set("escritorio", dados.escritorio);
  formulario.set("pagina", dados.pagina);
  if (campos.marca !== undefined) formulario.set("marca", campos.marca);
  // A caixa de consentimento só entra no FormData quando marcada — um
  // checkbox desmarcado simplesmente não manda o campo, e é essa ausência que
  // `lead-acao.ts#lerFormulario` lê como recusa.
  if (dados.consentimentoMarketing === true) {
    formulario.set("consentimentoMarketing", "on");
  }

  return formulario;
}

async function leadPorEmail(email: string) {
  const { docs } = await payload.find({
    collection: "leads",
    overrideAccess: true,
    where: { email: { equals: email } },
  });
  return docs[0];
}

beforeAll(async () => {
  payload = await getPayload({ config });
});

afterEach(async () => {
  await payload.delete({ collection: "leads", where: {}, overrideAccess: true });
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("gravar primeiro, avisar depois — a ordem é a garantia do ticket", () => {
  test("sem e-mail comercial cadastrado, o lead é gravado e o retorno é sucesso mesmo assim", async () => {
    await publicarEmpresa(); // sem `email` — o estado real de PRA-122

    const espiao = vi.spyOn(console, "error").mockImplementation(() => {});

    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "sem-comercial@escritorioprado.com.br" }),
    );

    expect(resultado).toEqual({ status: "sucesso" });

    const lead = await leadPorEmail("sem-comercial@escritorioprado.com.br");
    expect(lead).toBeTruthy();
    expect(lead?.nome).toBe("Ana Prado");

    // O visitante nunca soube, mas a ausência de destinatário foi registrada
    // para quem for configurar o painel não ficar adivinhando.
    expect(espiao).toHaveBeenCalledWith(
      expect.stringContaining("e-mail comercial ainda não foi cadastrado"),
    );
  });

  test("com e-mail comercial cadastrado mas sem RESEND_API_KEY, o lead é gravado e o retorno continua sucesso", async () => {
    // O caso de qualquer máquina recém-clonada: `.env.example` não traz a
    // chave, e `ambiente.ts` não a define para os testes.
    expect(process.env.RESEND_API_KEY ?? "").toBe("");

    await publicarEmpresa({ email: "comercial@belmare.com.br" });

    const espiao = vi.spyOn(console, "error").mockImplementation(() => {});
    const buscaDeRede = vi.spyOn(globalThis, "fetch");

    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "com-comercial@escritorioprado.com.br" }),
    );

    expect(resultado).toEqual({ status: "sucesso" });
    expect(await leadPorEmail("com-comercial@escritorioprado.com.br")).toBeTruthy();

    // Sem chave, `lib/resend.ts#enviarEmail` devolve `false` sem tentar a
    // rede — a mesma garantia provada isoladamente em `resend.test.ts`, aqui
    // vista de ponta a ponta a partir do envio do formulário.
    expect(buscaDeRede).not.toHaveBeenCalled();
    expect(espiao).toHaveBeenCalledWith(
      expect.stringContaining("aviso por e-mail não saiu"),
    );
  });

  test("com RESEND_API_KEY configurada, a API do Resend recusando a requisição ainda grava o lead e devolve sucesso", async () => {
    // ⚠️ Diferença do teste acima: ali `enviarEmail` devolve `false` ANTES de
    // tentar a rede (sem chave). Aqui a chave existe, `fetch` É chamado, e é a
    // resposta dele que falha — o caminho que `resend.test.ts` prova isolado
    // ("a API recusando... devolve false") e que este arquivo ainda não via
    // disparado a partir do envio do formulário de ponta a ponta.
    await publicarEmpresa({ email: "comercial@belmare.com.br" });
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("RESEND_FROM_EMAIL", "contato@belmare.com.br");

    const espiao = vi.spyOn(console, "error").mockImplementation(() => {});
    const buscaDeRede = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 401 }));

    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "resend-recusou@escritorioprado.com.br" }),
    );

    expect(resultado).toEqual({ status: "sucesso" });
    expect(await leadPorEmail("resend-recusou@escritorioprado.com.br")).toBeTruthy();
    expect(buscaDeRede).toHaveBeenCalled();
    expect(espiao).toHaveBeenCalledWith(
      expect.stringContaining("aviso por e-mail não saiu"),
    );
  });

  test("com RESEND_API_KEY configurada, uma falha de rede do Resend (fetch rejeitando) ainda grava o lead e devolve sucesso", async () => {
    await publicarEmpresa({ email: "comercial@belmare.com.br" });
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("RESEND_FROM_EMAIL", "contato@belmare.com.br");

    const espiao = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("rede fora do ar"));

    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "rede-fora-do-ar@escritorioprado.com.br" }),
    );

    expect(resultado).toEqual({ status: "sucesso" });
    expect(await leadPorEmail("rede-fora-do-ar@escritorioprado.com.br")).toBeTruthy();
    expect(espiao).toHaveBeenCalledWith(
      expect.stringContaining("aviso por e-mail não saiu"),
    );
  });

  test("se a própria CONSULTA da empresa lançar (falha de banco, não de Resend), o lead é gravado e o retorno continua sucesso", async () => {
    // ⚠️ O caso que a nota grande de `lib/lead-acao.ts` (o novo `catch` em
    // torno de `avisarPorEmail`) existe para cobrir: `enviarEmail` nunca
    // lança, por contrato (`resend.test.ts`), mas `buscarEmpresa`
    // (`lib/empresa-consulta.ts`) chama `payload.findGlobal` por baixo, e ISSO
    // pode lançar de verdade. Sem aquele `catch`, esta exceção atravessaria
    // `enviarLead` depois de o lead já estar gravado — a mesma mentira
    // inversa que a ordem "gravar primeiro" existe para evitar.
    await publicarEmpresa({ email: "comercial@belmare.com.br" });

    const espiao = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(payload, "findGlobal").mockRejectedValue(new Error("banco indisponível"));

    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "consulta-falhou@escritorioprado.com.br" }),
    );

    expect(resultado).toEqual({ status: "sucesso" });
    expect(await leadPorEmail("consulta-falhou@escritorioprado.com.br")).toBeTruthy();
    expect(espiao).toHaveBeenCalledWith(
      expect.stringContaining("lançou uma exceção"),
      expect.any(Error),
    );
  });
});

describe("validação — a mesma mensagem da coleção, sem gravar nada quando recusa", () => {
  test("sem nome, o retorno aponta o campo e nenhum lead é gravado", async () => {
    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ nome: "", email: "sem-nome@escritorioprado.com.br" }),
    );

    expect(resultado).toEqual({
      status: "erro",
      mensagem: "Confira os campos marcados abaixo.",
      campos: { nome: "Escreva seu nome." },
    });
    expect(await leadPorEmail("sem-nome@escritorioprado.com.br")).toBeUndefined();
  });

  test("e-mail malformado é recusado com a mensagem da coleção, apontando o campo certo", async () => {
    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "sem-arroba-nenhuma" }),
    );

    expect(resultado.status).toBe("erro");
    expect(resultado.status === "erro" && resultado.campos?.email).toBe(
      "Confira o e-mail: falta o @, falta o ponto do domínio, ou sobrou um espaço.",
    );
  });

  test("sem a empresa ou o escritório, o retorno aponta o campo e nenhum lead é gravado", async () => {
    const resultado = await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({
        escritorio: "",
        email: "sem-escritorio@escritorioprado.com.br",
      }),
    );

    expect(resultado.status).toBe("erro");
    expect(await leadPorEmail("sem-escritorio@escritorioprado.com.br")).toBeUndefined();
  });
});

describe("os dois campos ocultos de origem, e o consentimento nunca pré-marcado", () => {
  test("consentimento ausente do FormData grava como false — a promessa do checkbox nunca marcado", async () => {
    await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "consentimento-ausente@escritorioprado.com.br" }),
    );

    const lead = await leadPorEmail("consentimento-ausente@escritorioprado.com.br");
    expect(lead?.consentimentoMarketing).toBe(false);
  });

  test("consentimento marcado grava como true", async () => {
    await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({
        email: "consentimento-marcado@escritorioprado.com.br",
        consentimentoMarketing: true,
      }),
    );

    const lead = await leadPorEmail("consentimento-marcado@escritorioprado.com.br");
    expect(lead?.consentimentoMarketing).toBe(true);
  });

  test("página e marca chegam do campo oculto, não de escolha do visitante", async () => {
    await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({
        email: "origem-com-marca@escritorioprado.com.br",
        pagina: "representadas/trisol",
        marca: "trisol",
      }),
    );

    const lead = await leadPorEmail("origem-com-marca@escritorioprado.com.br");
    expect(lead?.origem?.pagina).toBe("representadas/trisol");
    expect(lead?.origem?.marca).toBe("trisol");
  });

  test("sem marca no envio, o campo fica ausente — nunca uma string vazia", async () => {
    await enviarLead(
      ESTADO_INICIAL_DO_FORMULARIO_DE_LEAD,
      formularioPreenchido({ email: "origem-sem-marca@escritorioprado.com.br" }),
    );

    const lead = await leadPorEmail("origem-sem-marca@escritorioprado.com.br");
    expect(lead?.origem?.pagina).toBe("contato");
    expect(lead?.origem?.marca ?? undefined).toBeUndefined();
  });
});
