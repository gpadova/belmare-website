import { afterEach, describe, expect, test, vi } from "vitest";

import { enviarEmail } from "@/lib/resend";

/**
 * O envio por e-mail, sozinho — `fetch` é espionado, nunca chamado de verdade.
 *
 * ⚠️ **O CASO QUE MAIS IMPORTA AQUI É O DE DESENVOLVIMENTO: SEM CHAVE.**
 * `RESEND_API_KEY` não existe numa máquina que acabou de clonar o repositório
 * (`.env.example`), e o teste abaixo é o que prova que essa ausência não
 * derruba nada — nem tenta a rede, só devolve `false` honestamente.
 */
describe("enviarEmail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("sem RESEND_API_KEY, devolve false sem tentar a requisição", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM_EMAIL", "contato@belmare.com.br");
    const espiao = vi.spyOn(globalThis, "fetch");

    const enviado = await enviarEmail({ para: "a@b.com", assunto: "x", texto: "y" });

    expect(enviado).toBe(false);
    expect(espiao).not.toHaveBeenCalled();
  });

  test("sem RESEND_FROM_EMAIL, devolve false sem tentar a requisição", async () => {
    // O Resend recusa qualquer remetente cujo domínio não esteja verificado na
    // conta — não existe um remetente padrão que funcione para todo mundo.
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("RESEND_FROM_EMAIL", "");
    const espiao = vi.spyOn(globalThis, "fetch");

    const enviado = await enviarEmail({ para: "a@b.com", assunto: "x", texto: "y" });

    expect(enviado).toBe(false);
    expect(espiao).not.toHaveBeenCalled();
  });

  test("com as duas variáveis, chama a API do Resend com o corpo esperado", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("RESEND_FROM_EMAIL", "contato@belmare.com.br");
    const espiao = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const enviado = await enviarEmail({
      para: "comercial@belmare.com.br",
      assunto: "Novo lead pelo site",
      texto: "Nome: Ana",
      responderPara: "ana@escritorio.com.br",
    });

    expect(enviado).toBe(true);
    expect(espiao).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer re_teste" }),
      }),
    );

    const corpo = JSON.parse(espiao.mock.calls[0]?.[1]?.body as string);
    expect(corpo).toEqual({
      from: "contato@belmare.com.br",
      to: ["comercial@belmare.com.br"],
      subject: "Novo lead pelo site",
      text: "Nome: Ana",
      reply_to: "ana@escritorio.com.br",
    });
  });

  test("a API recusando (status não-2xx) devolve false", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("RESEND_FROM_EMAIL", "contato@belmare.com.br");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 401 }));

    expect(await enviarEmail({ para: "a@b.com", assunto: "x", texto: "y" })).toBe(false);
  });

  test("uma falha de rede nunca lança — devolve false", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("RESEND_FROM_EMAIL", "contato@belmare.com.br");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("rede fora do ar"));

    await expect(
      enviarEmail({ para: "a@b.com", assunto: "x", texto: "y" }),
    ).resolves.toBe(false);
  });
});
