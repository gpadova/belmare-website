import { afterAll, describe, expect, test, vi } from "vitest";

/**
 * O caminho do upload direto para o bucket, conferido na configuração montada.
 *
 * ⚠️ **ESTE ARQUIVO GUARDA A ÚNICA SUPOSIÇÃO QUE PODERIA INVALIDAR A ESCOLHA DE
 * PLATAFORMA INTEIRA.** A função serverless da Vercel recusa corpo de requisição
 * acima de 4,5 MB e os catálogos têm 24 MB: se o navegador parar de enviar
 * direto para o bucket, o site não sobe mais catálogo nenhum — e o sintoma
 * aparece só em produção, no dia do upload, com o arquivo grande na mão.
 *
 * O que se afirma aqui NÃO é que `clientUploads: true` está escrito em
 * `payload.config.ts`. Isso seria reler a linha ao lado. O que se afirma é o que
 * aquela linha PRODUZ na configuração montada, que são as duas peças de que o
 * navegador depende:
 *
 *   1. A rota `POST /storage-s3-generate-signed-url` — é ela que o painel chama
 *      para receber a URL assinada antes de fazer o PUT.
 *   2. O `S3ClientUploadHandler` ligado (`enabled: true`) para cada coleção de
 *      upload — é ele que troca o envio pelo formulário pelo PUT direto.
 *
 * Faltando qualquer uma, o arquivo volta a atravessar a função.
 */

/** As cinco variáveis do R2, preenchidas — o estado de produção. */
const R2_PREENCHIDO = {
  R2_BUCKET: "belmare",
  R2_ACCOUNT_ID: "conta-de-teste",
  R2_ACCESS_KEY_ID: "chave-de-teste",
  R2_SECRET_ACCESS_KEY: "segredo-de-teste",
  R2_PUBLIC_URL: "https://pub-teste.r2.dev",
};

/** As mesmas cinco vazias — a máquina nova, sem conta de nuvem nenhuma. */
const R2_VAZIO = Object.fromEntries(
  Object.keys(R2_PREENCHIDO).map((nome) => [nome, ""]),
) as Record<keyof typeof R2_PREENCHIDO, string>;

const ambienteOriginal = { ...process.env };

type ConfiguracaoMontada = {
  endpoints?: { method?: string; path?: string }[];
  admin?: {
    components?: {
      providers?: { path?: string; clientProps?: Record<string, unknown> }[];
    };
  };
  collections: { slug: string; upload?: Record<string, unknown> }[];
};

/**
 * Monta a configuração com o ambiente pedido.
 *
 * ⚠️ `vi.resetModules()` antes do `import` não é cerimônia: `payload.config.ts`
 * lê `process.env` no momento em que o módulo é avaliado — a mesma razão que
 * põe a atribuição de `DATABASE_URI` num `setupFiles` em `test/ambiente.ts`.
 * Sem o reset, o segundo caso deste arquivo leria a configuração do primeiro e
 * passaria sem provar nada.
 */
async function configuracaoCom(
  r2: Record<string, string>,
): Promise<ConfiguracaoMontada> {
  vi.resetModules();
  Object.assign(process.env, r2);
  process.env.PAYLOAD_SECRET ??= "segredo-de-teste-sem-valor-nenhum";

  const modulo = await import("@payload-config");
  return (await (modulo.default as unknown)) as ConfiguracaoMontada;
}

function rotaDeAssinatura(config: ConfiguracaoMontada) {
  return (config.endpoints ?? []).find(
    (rota) => rota.path === "/storage-s3-generate-signed-url",
  );
}

function entregadoresDoNavegador(config: ConfiguracaoMontada) {
  return (config.admin?.components?.providers ?? []).filter((provedor) =>
    provedor.path?.includes("S3ClientUploadHandler"),
  );
}

function upload(config: ConfiguracaoMontada, slug: string) {
  return config.collections.find((colecao) => colecao.slug === slug)?.upload;
}

/**
 * Toda coleção que guarda arquivo, lida da própria configuração.
 *
 * ⚠️ **DERIVADA, E NÃO ESCRITA À MÃO — É ISSO QUE FAZ O TESTE VALER.** A lista
 * era literal (`["imagens", "arquivos"]`) e o modo de falha era silencioso: uma
 * coleção de upload nova que ficasse fora do mapa do R2 em `payload.config.ts`
 * passaria por todos os testes e gravaria no disco da função — que na Vercel é
 * efêmero, então o arquivo sobreviveria até o próximo deploy e sumiria sem
 * ninguém mexer em nada. Com a lista derivada, esquecer o mapa quebra o teste
 * no mesmo commit em que a coleção nasce. Foi assim que `logotipos` entrou.
 */
function colecoesDeUpload(config: ConfiguracaoMontada): string[] {
  return config.collections
    .filter((colecao) => colecao.upload)
    .map((colecao) => colecao.slug);
}

afterAll(() => {
  process.env = ambienteOriginal;
});

describe("com o R2 configurado, o arquivo vai do navegador para o bucket", () => {
  test("o painel expõe a rota que assina o PUT do navegador", async () => {
    const rota = rotaDeAssinatura(await configuracaoCom(R2_PREENCHIDO));

    expect(rota).toBeDefined();
    expect(rota?.method).toBe("post");
  });

  test("toda coleção de upload envia pelo navegador, não pelo formulário", async () => {
    const config = await configuracaoCom(R2_PREENCHIDO);
    const entregadores = entregadoresDoNavegador(config);

    /* Imagem E arquivo: o catálogo de 24 MB é o caso que dói, mas uma
       fotografia em alta também passa dos 4,5 MB sem esforço nenhum.

       ⚠️ `logotipos` entra por outro motivo, e o teste é o mesmo. Um logotipo
       tem alguns kilobytes e caberia folgado no corpo da requisição — o que ele
       não pode é cair no disco da função, que é efêmero. A pergunta que este
       teste faz não é "o arquivo é grande?", é "o R2 assumiu a coleção?", e a
       resposta precisa ser sim para todas. */
    /* Ordenados dos dois lados: a ordem do mapa do R2 em `payload.config.ts` e
       a ordem do array `collections` são independentes uma da outra, e nenhuma
       das duas é promessa nenhuma. O que este teste afirma é que os dois
       conjuntos têm exatamente os mesmos membros. */
    expect(
      entregadores
        .map((provedor) => provedor.clientProps?.collectionSlug)
        .sort(),
    ).toEqual(colecoesDeUpload(config).sort());

    for (const entregador of entregadores) {
      expect(entregador.clientProps?.enabled).toBe(true);
      expect(entregador.clientProps?.serverHandlerPath).toBe(
        "/storage-s3-generate-signed-url",
      );
    }
  });

  test("nada toca o disco da função", async () => {
    // O contrapeso do envio direto: o arquivo não passa pela função, então a
    // função não tem o que gravar. `disableLocalStorage` ligado é o que prova
    // que o adaptador do R2 assumiu a coleção.
    const config = await configuracaoCom(R2_PREENCHIDO);

    for (const slug of colecoesDeUpload(config)) {
      expect(upload(config, slug)?.disableLocalStorage).toBe(true);
    }
  });
});

describe("sem o R2 configurado, o painel continua de pé", () => {
  test("não há rota de assinatura para chamar", async () => {
    // É o que permite rodar o projeto numa máquina nova sem conta de nuvem:
    // sem credencial, o plugin fica desligado inteiro em vez de assinar URL
    // para um bucket que não existe.
    expect(rotaDeAssinatura(await configuracaoCom(R2_VAZIO))).toBeUndefined();
  });

  test("o upload cai no disco local, e o entregador do navegador fica desligado", async () => {
    const config = await configuracaoCom(R2_VAZIO);

    for (const entregador of entregadoresDoNavegador(config)) {
      expect(entregador.clientProps?.enabled).toBe(false);
    }

    expect(upload(config, "imagens")?.disableLocalStorage).toBeFalsy();
    expect(upload(config, "imagens")?.staticDir).toBe(".uploads/imagens");
    expect(upload(config, "arquivos")?.staticDir).toBe(".uploads/arquivos");
    expect(upload(config, "logotipos")?.staticDir).toBe(".uploads/logotipos");
  });
});

describe("o ponto focal chega ao painel", () => {
  test("a coleção de imagens declara o ponto focal explicitamente", async () => {
    /* ⚠️ `focalPoint: true` EXPLÍCITO, e não a ausência do campo. O painel só
       desenha o seletor quando `uploadConfig.focalPoint === true` ou quando há
       `imageSizes`/`resizeOptions` — e os dois últimos estão desligados de
       propósito, porque exigiriam que o servidor tivesse os bytes da imagem
       para processá-la com sharp, que é exatamente o que o envio direto para o
       bucket evita. Trocar isto por `undefined` tira o seletor da tela sem
       quebrar teste nenhum em nenhum outro lugar. */
    const config = await configuracaoCom(R2_PREENCHIDO);

    expect(upload(config, "imagens")?.focalPoint).toBe(true);
  });
});
