/**
 * O envio por e-mail via Resend — a única chamada a um serviço de terceiro que
 * este site faz em tempo de execução (PRA-126).
 *
 * ⚠️ **CHAMADA HTTP DIRETA, SEM O PACOTE `resend`.** Uma dependência inteira,
 * com o próprio grafo de sub-dependências, por uma única requisição `POST` é o
 * mesmo custo que este projeto já recusa em outro lugar — nenhuma biblioteca
 * de formulário, nenhum date picker fora do que o Payload já traz (ver
 * `package.json`). `fetch` já está disponível em toda função da Vercel, e o
 * corpo da API do Resend é json simples.
 *
 * ⚠️ **`RESEND_API_KEY` NÃO EXISTE EM DESENVOLVIMENTO, DE PROPÓSITO** — ver
 * `.env.example`. Sem ela — ou sem `RESEND_FROM_EMAIL`, o remetente verificado
 * na conta —, esta função devolve `false` sem tentar a requisição: uma chamada
 * sem chave já devolveria 401 do lado de lá, e conferir antes economiza uma ida
 * à rede que já se sabe fadada a falhar.
 *
 * ⚠️ **NUNCA LANÇA.** Toda falha — chave ausente, remetente ausente, rede fora
 * do ar, a própria API recusando — volta como `false`, nunca como exceção.
 * Quem chama (`lib/lead-acao.ts`) já gravou o lead no painel ANTES de chamar
 * esta função; um envio que lançasse arriscaria a mensagem de erro chegar ao
 * visitante depois que o contato já foi salvo — a leitura errada ("não deu
 * certo") sobre um resultado que deu.
 */
export async function enviarEmail({
  para,
  assunto,
  texto,
  responderPara,
}: {
  para: string;
  assunto: string;
  texto: string;
  /** O `reply_to` da mensagem — o e-mail de quem preencheu o formulário, para
   *  a Belmare poder responder direto sem copiar o endereço à mão. */
  responderPara?: string;
}): Promise<boolean> {
  const chave = process.env.RESEND_API_KEY;
  const remetente = process.env.RESEND_FROM_EMAIL;
  if (!chave || !remetente) return false;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remetente,
        to: [para],
        subject: assunto,
        text: texto,
        ...(responderPara !== undefined ? { reply_to: responderPara } : {}),
      }),
    });

    return resposta.ok;
  } catch {
    // Rede fora do ar, DNS, timeout — qualquer um. Ver a nota "nunca lança"
    // acima: o chamador decide o que logar, esta função só devolve o fato.
    return false;
  }
}
