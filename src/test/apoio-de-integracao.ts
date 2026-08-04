import sharp from "sharp";

import type { Payload } from "payload";

/**
 * Ajudantes de teste de integração compartilhados pelas suítes de PRA-120 —
 * Peça, Arquivo3D e Acabamento. As três precisam da MESMA fotografia de teste,
 * da MESMA representada mínima publicada e da MESMA leitura de recusa que
 * `lib/representadas-consulta.integracao.test.ts` já usa; centralizar aqui
 * evita a mesma dúzia de linhas divergindo em três arquivos.
 *
 * ⚠️ `representadas-consulta.integracao.test.ts` **não foi migrado para
 * importar daqui** — ele já tem as próprias cópias, testadas e em produção
 * desde PRA-116/117/118, e reescrevê-lo trocaria risco de regressão numa
 * suíte fechada por um ganho estético. Este arquivo é para as suítes NOVAS.
 */

/** Um JPEG minúsculo e de verdade: o Payload lê dimensão com o sharp, e um
 *  buffer inventado seria recusado antes de o teste começar. */
export async function jpegDeTeste(): Promise<Buffer> {
  return sharp({
    create: { width: 8, height: 8, channels: 3, background: "#101010" },
  })
    .jpeg()
    .toBuffer();
}

/**
 * ⚠️ `mock` tem padrão `true` para não mudar o comportamento das suítes que já
 * chamam esta função sem o quarto argumento (Peça, Arquivo3D, Acabamento —
 * nenhuma delas se importa com o estado de mock). PRA-121 precisa do oposto:
 * uma fotografia genuinamente `mock: false` para provar que um projeto com
 * foto de verdade PASSA pelo portão de três, e uma `mock: true` para provar
 * que ele é excluído mesmo publicado — ver `lib/projetos-consulta.integracao.test.ts`.
 */
export async function criarImagem(
  payload: Payload,
  descricao: string,
  nome: string,
  mock = true,
): Promise<number> {
  const dados = await jpegDeTeste();
  const doc = await payload.create({
    collection: "imagens",
    data: { descricao, mock },
    file: {
      data: dados,
      mimetype: "image/jpeg",
      name: nome,
      size: dados.byteLength,
    },
  });
  return doc.id;
}

/** Um arquivo binário qualquer, do tamanho e nome pedidos — para os testes de
 *  Arquivo3D, que precisam controlar tanto `filesize` quanto `filename`. */
export async function criarArquivo(
  payload: Payload,
  titulo: string,
  nome: string,
  bytes: number,
): Promise<number> {
  const dados = Buffer.alloc(bytes, 0);
  const doc = await payload.create({
    collection: "arquivos",
    data: { titulo },
    file: {
      data: dados,
      mimetype: "application/octet-stream",
      name: nome,
      size: dados.byteLength,
    },
  });
  return doc.id;
}

/** O mínimo que uma representada precisa declarar para existir — mesmos
 *  campos-base de `lib/representadas-consulta.integracao.test.ts`. */
export function representadaMinima(
  slug: string,
  nome: string,
  fotoDaGaleria: number,
  fotoDeAbertura: number,
) {
  return {
    slug,
    nome,
    resolve: "Estofados com têxtil de performance",
    parte: "Estofado",
    fato: "Têxtil de performance: repelência, proteção UVA/UVB, antimofo",
    imagem: fotoDaGaleria,
    imagemLarga: fotoDeAbertura,
  };
}

/**
 * Cria uma representada JÁ PUBLICADA.
 *
 * ⚠️ `draft: false` sozinho NÃO publica — o campo `_status` que o Payload gera
 * tem padrão `"draft"`, e é o `_status: "published"` explícito em `data` que
 * publica de fato. Achado de PRA-118, e a razão de esta função existir em vez
 * de um `payload.create` direto em cada teste.
 */
export async function criarRepresentadaPublicada(
  payload: Payload,
  dados: Record<string, unknown>,
): Promise<{ id: number }> {
  return payload.create({
    collection: "representadas",
    draft: false,
    data: { ...dados, _status: "published" },
  } as never) as unknown as Promise<{ id: number }>;
}

/** A mensagem que o painel devolve quando recusa — o `data.errors` do erro de
 *  validação do Payload, que é o que o operador de fato lê na tela. */
export async function recusaAoSalvar(operacao: Promise<unknown>): Promise<string> {
  try {
    await operacao;
  } catch (erro) {
    const detalhe = erro as {
      message?: string;
      data?: { errors?: { message?: string }[] };
    };
    return [
      detalhe.message ?? "",
      ...(detalhe.data?.errors ?? []).map((e) => e.message ?? ""),
    ].join(" | ");
  }

  throw new Error("O painel aceitou o que deveria ter recusado.");
}
