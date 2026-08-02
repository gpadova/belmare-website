import { createHash } from "node:crypto";

import { beforeAll, describe, expect, test } from "vitest";

import { TAMANHO_DO_CATALOGO, catalogoDe24MB } from "@/test/catalogo-de-24-mb";

/**
 * O upload de 24 MB, medido de ponta a ponta contra um armazenamento de
 * verdade.
 *
 * ⚠️ **ISTO NÃO RODA EM `pnpm test`, E É DE PROPÓSITO.** Ele exige a pilha do
 * `docker-compose.yml` de pé e o painel servindo; numa máquina sem Docker ele
 * não tem como passar, e um teste que falha por falta de ambiente ensina a
 * ignorar o vermelho. Por isso mora fora do `vitest.config.ts`, num arquivo de
 * configuração próprio, e só roda quando alguém o chama pelo nome:
 *
 *     pnpm test:prova
 *
 * O passo a passo de subir a pilha está no README, em "A prova local do upload
 * de 24 MB".
 *
 * ⚠️ E ele **não substitui** `payload.config.test.ts`. Aquele arquivo prova que
 * a configuração montada TEM as duas peças do envio direto; este prova que as
 * duas peças, usadas na ordem em que o navegador as usa, movem 24 MB até o
 * bucket e os devolvem intactos. Um é barato e roda sempre; o outro é caro e
 * roda quando se quer a medida.
 *
 * ⚠️ Este teste percorre o caminho de duas etapas PROGRAMATICAMENTE — assina e
 * faz o `PUT`, como o navegador faria. Ele não é o painel: quem clica em
 * "Salvar" é o `S3ClientUploadHandler`, e a prova de que O PAINEL faz isso foi
 * feita à mão uma vez, com o navegador, e está registrada em PRA-115. O que
 * este arquivo guarda daqui para a frente é o contrato de que aquele caminho
 * depende — e a asserção que o segura é a primeira: o `PUT` sai para OUTRA
 * origem que não a da aplicação.
 */

const APLICACAO = process.env.PROVA_APLICACAO ?? "http://localhost:3000";
const PUBLICO = process.env.R2_PUBLIC_URL ?? "http://localhost:9000/belmare";
const EMAIL = process.env.PROVA_EMAIL ?? "prova@belmare.com.br";
const SENHA = process.env.PROVA_SENHA ?? "prova-pra-115-senha";

/** Nome próprio por execução: duas rodadas seguidas não disputam a mesma chave. */
const NOME_DO_ARQUIVO = `catalogo-de-prova-${Date.now()}.pdf`;

function resumo(bytes: Buffer | Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

let sessao = "";
let catalogo: Buffer;

beforeAll(async () => {
  catalogo = catalogoDe24MB();

  const resposta = await fetch(`${APLICACAO}/api/usuarios/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: SENHA }),
  }).catch(() => undefined);

  if (!resposta?.ok) {
    throw new Error(
      `Não consegui entrar no painel em ${APLICACAO}. Esta prova precisa da ` +
        "pilha de pé e do painel servindo com uma conta criada — ver o README, " +
        'em "A prova local do upload de 24 MB".',
    );
  }

  sessao = (await resposta.json()).token;
}, 120_000);

describe("o catálogo de 24 MB atravessa sem passar pela aplicação", () => {
  test("o catálogo de prova tem os 24 MB que o ticket mede", () => {
    expect(catalogo.length).toBe(TAMANHO_DO_CATALOGO);
    expect(catalogo.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  test("o bucket libera o PUT do navegador no preflight", async () => {
    /* ⚠️ O navegador manda um `OPTIONS` antes do `PUT` porque o painel e o
       bucket estão em origens diferentes. Sem `Access-Control-Allow-Origin` na
       resposta, o upload morre aqui e o painel só mostra um erro de rede — o
       modo de falha mais caro deste ticket, porque não diz o que houve. */
    const resposta = await fetch(`${PUBLICO}/${NOME_DO_ARQUIVO}`, {
      method: "OPTIONS",
      headers: {
        origin: APLICACAO,
        "access-control-request-method": "PUT",
        "access-control-request-headers": "content-type",
      },
    });

    expect(resposta.headers.get("access-control-allow-origin")).toBe(APLICACAO);
    expect(resposta.headers.get("access-control-allow-methods")).toContain("PUT");
  });

  test("a URL assinada aponta para FORA da aplicação", async () => {
    /* ⚠️ **É ESTA A ASSERÇÃO QUE DECIDE O TICKET.** A função serverless da
       Vercel recusa corpo acima de 4,5 MB; enquanto o destino do `PUT` for
       outra origem, os 24 MB não têm como passar por ela. No dia em que esta
       linha ficar vermelha, o site parou de subir catálogo — e é melhor
       descobrir aqui do que com o arquivo grande na mão. */
    const assinatura = await fetch(
      `${APLICACAO}/api/storage-s3-generate-signed-url`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `JWT ${sessao}`,
        },
        body: JSON.stringify({
          collectionSlug: "arquivos",
          filename: NOME_DO_ARQUIVO,
          filesize: catalogo.length,
          mimeType: "application/pdf",
        }),
      },
    );

    expect(assinatura.status).toBe(200);

    const { url } = await assinatura.json();
    expect(new URL(url).origin).not.toBe(new URL(APLICACAO).origin);
    expect(new URL(url).searchParams.get("X-Amz-Signature")).toBeTruthy();
  });

  test("os 24 MB sobem pela URL assinada e descem inteiros pela pública", async () => {
    const { url } = await (
      await fetch(`${APLICACAO}/api/storage-s3-generate-signed-url`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `JWT ${sessao}`,
        },
        body: JSON.stringify({
          collectionSlug: "arquivos",
          filename: NOME_DO_ARQUIVO,
          filesize: catalogo.length,
          mimeType: "application/pdf",
        }),
      })
    ).json();

    const subida = await fetch(url, {
      method: "PUT",
      body: new Uint8Array(catalogo),
      headers: {
        "content-type": "application/pdf",
        "content-length": String(catalogo.length),
        origin: APLICACAO,
      },
    });
    expect(subida.status).toBe(200);

    /* ⚠️ A descida vai SEM credencial nenhuma, e é isso que se quer provar: o
       `PUT` é assinado, mas quem clica em "baixar o catálogo" não assina nada.
       Sem leitura pública no bucket o arquivo sobe e não desce. */
    const descida = await fetch(`${PUBLICO}/${NOME_DO_ARQUIVO}`);
    expect(descida.status).toBe(200);

    const baixado = Buffer.from(await descida.arrayBuffer());
    expect(baixado.length).toBe(TAMANHO_DO_CATALOGO);
    expect(resumo(baixado)).toBe(resumo(catalogo));
  });
});
