import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * O catálogo de 24 MB — o arquivo que PRA-115 existe para fazer atravessar.
 *
 * ⚠️ O tamanho é o assunto, não o conteúdo. A função serverless da Vercel recusa
 * corpo de requisição acima de 4,5 MB, e o catálogo da Trisol tem 24 MB: é essa
 * distância, e só ela, que a prova mede. Um PDF de verdade com 24 MB não pode
 * entrar no repositório — seria 24 MB versionados para sempre —, então ele é
 * GERADO, e a geração é determinística: duas execuções produzem o mesmo arquivo,
 * byte a byte, e o mesmo resumo SHA-256. É isso que permite comparar o que
 * subiu com o que desceu sem guardar o original em lugar nenhum.
 *
 * O PDF é válido: catálogo, uma página, uma linha de texto desenhada. O peso
 * vem de um objeto de lastro — um fluxo legítimo, com `/Length` correto e
 * entrada própria na tabela `xref`, que nenhuma página referencia. É o jeito
 * mais honesto de pesar um PDF sem fingir que ele é um catálogo de verdade.
 */

/** 24 MiB. */
export const TAMANHO_DO_CATALOGO = 24 * 1024 * 1024;

/**
 * Enchimento determinístico, em ASCII visível.
 *
 * ⚠️ Não é uma sequência de zeros de propósito. Zeros comprimem a quase nada, e
 * um proxy ou um servidor que resolvesse comprimir o corpo faria os 24 MB
 * chegarem como alguns quilobytes — a prova mediria o compressor, não o
 * caminho. Um gerador congruente linear dá bytes que não comprimem e continua
 * reproduzível, que é o que o resumo SHA-256 exige.
 */
function lastro(bytes: number): Buffer {
  const alfabeto =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  const saida = Buffer.allocUnsafe(bytes);

  let estado = 20_260_115;
  for (let i = 0; i < bytes; i += 1) {
    estado = (estado * 1_103_515_245 + 12_345) >>> 0;
    saida[i] = alfabeto.charCodeAt((estado >>> 16) % alfabeto.length);
  }

  return saida;
}

/**
 * Monta o PDF com um lastro do tamanho pedido.
 *
 * ⚠️ Os deslocamentos da `xref` são medidos em BYTES sobre o buffer já montado,
 * não contados à mão sobre o texto. Um `xref` errado é um PDF que abre em um
 * leitor tolerante e é recusado por outro — e a prova ficaria discutindo o
 * arquivo em vez do caminho.
 */
function montar(bytesDeLastro: number): Buffer {
  const partes: Buffer[] = [];
  const deslocamentos: number[] = [];
  let total = 0;

  const escrever = (pedaco: Buffer | string) => {
    const buffer = Buffer.isBuffer(pedaco) ? pedaco : Buffer.from(pedaco, "latin1");
    partes.push(buffer);
    total += buffer.length;
  };

  const objeto = (numero: number, corpo: Buffer | string) => {
    deslocamentos[numero] = total;
    escrever(`${numero} 0 obj\n`);
    escrever(corpo);
    escrever("\nendobj\n");
  };

  const pagina = Buffer.from(
    "BT /F1 18 Tf 62 760 Td (Catalogo de prova — PRA-115 — 24 MB) Tj ET",
    "latin1",
  );
  const enchimento = lastro(bytesDeLastro);

  escrever("%PDF-1.7\n%\xe2\xe3\xcf\xd3\n");

  objeto(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objeto(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objeto(
    3,
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
      "/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
  );
  objeto(
    4,
    Buffer.concat([
      Buffer.from(`<< /Length ${pagina.length} >>\nstream\n`, "latin1"),
      pagina,
      Buffer.from("\nendstream", "latin1"),
    ]),
  );
  objeto(5, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objeto(
    6,
    Buffer.concat([
      Buffer.from(
        `<< /Type /EmbeddedFile /Subtype /application#2Foctet-stream /Length ${enchimento.length} >>\nstream\n`,
        "latin1",
      ),
      enchimento,
      Buffer.from("\nendstream", "latin1"),
    ]),
  );

  const inicioDaXref = total;
  const quantidade = 7;

  escrever(`xref\n0 ${quantidade}\n`);
  escrever("0000000000 65535 f \n");
  for (let numero = 1; numero < quantidade; numero += 1) {
    escrever(`${String(deslocamentos[numero]).padStart(10, "0")} 00000 n \n`);
  }
  escrever(
    `trailer\n<< /Size ${quantidade} /Root 1 0 R >>\nstartxref\n${inicioDaXref}\n%%EOF\n`,
  );

  return Buffer.concat(partes);
}

/**
 * O catálogo com exatamente `TAMANHO_DO_CATALOGO` bytes.
 *
 * ⚠️ O laço não é preciosismo. O tamanho do lastro entra no arquivo escrito por
 * extenso, em `/Length` e nos deslocamentos da `xref`, então mudar o lastro em
 * um byte pode mudar o arquivo em dois. Montar, medir e corrigir converge em
 * duas ou três voltas e devolve o tamanho EXATO — e é o tamanho exato que faz
 * "24 MB subiu, 24 MB desceu" ser uma comparação e não uma impressão.
 */
export function catalogoDe24MB(): Buffer {
  let bytesDeLastro = TAMANHO_DO_CATALOGO;

  for (let volta = 0; volta < 8; volta += 1) {
    const pdf = montar(bytesDeLastro);
    if (pdf.length === TAMANHO_DO_CATALOGO) {
      return pdf;
    }
    bytesDeLastro += TAMANHO_DO_CATALOGO - pdf.length;
  }

  throw new Error("O tamanho do catálogo de prova não convergiu.");
}

/** Escreve o catálogo em disco e devolve o caminho. */
export function escreverCatalogoDe24MB(destino: string): string {
  mkdirSync(path.dirname(destino), { recursive: true });
  writeFileSync(destino, catalogoDe24MB());
  return destino;
}

/* `node src/test/catalogo-de-24-mb.ts <destino>` — ver o README. */
if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const destino = path.resolve(
    process.argv[2] ?? ".uploads/prova/catalogo-de-24-mb.pdf",
  );
  escreverCatalogoDe24MB(destino);
  process.stdout.write(`${destino}\n`);
}
