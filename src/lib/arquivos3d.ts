import { texto } from "@/lib/campo-opcional";
import { pesoDoArquivo } from "@/lib/representadas-traducao";
import type { Arquivos3D as Arquivo3DGerado } from "@/payload-types";

/**
 * O formato de um arquivo 3D, lido da extensão do nome gravado.
 *
 * ⚠️ **GERADO, NUNCA DIGITADO (decisão 6 da spec) — "SKP" não pode ser erro de
 * digitação porque ninguém digita.** `.skp`, `.3ds` e `.dwg` chegam do
 * navegador como `application/octet-stream` na maior parte dos sistemas (ver
 * `collections/arquivos.ts`), então `mimeType` não serve para identificar o
 * formato — só a extensão do nome do arquivo é confiável aqui. A mesma função
 * é chamada pela coleção (para recusar um upload sem extensão antes de
 * publicar, `collections/arquivos3d.ts`) e por este mapper — uma segunda
 * leitura de extensão escrita à mão divergiria da primeira na primeira
 * mudança de regra.
 */
export function formatoDoArquivo(
  nomeDoArquivo: string | null | undefined,
): string | undefined {
  const nome = nomeDoArquivo?.trim();
  if (!nome) return undefined;

  const pontoFinal = nome.lastIndexOf(".");
  // Sem ponto, ou ponto colado no início do nome (sem nome antes dele): não
  // há extensão nenhuma para ler, e inventar "ARQUIVO" mentiria sobre um
  // formato que ninguém declarou.
  if (pontoFinal <= 0 || pontoFinal === nome.length - 1) return undefined;

  return nome.slice(pontoFinal + 1).toUpperCase();
}

/**
 * Um arquivo 3D, pronto para o componente.
 *
 * ⚠️ **FORMATO E PESO SÃO OS DOIS GERADOS, E OS DOIS TÊM QUE EXISTIR JUNTOS —
 * NÃO HÁ ESTADO "A PEDIR" AQUI.** Diferente do catálogo (que pode ser
 * declarado sem arquivo em mãos), um Arquivo3D É o arquivo: a biblioteca só
 * existe pelo que está em disco. Por isso este mapper devolve `undefined`
 * inteiro — não um objeto pela metade — quando o upload veio só como
 * identificador (profundidade errada), sem tamanho medido, ou sem extensão
 * legível. `collections/arquivos3d.ts` já recusa os dois últimos casos ANTES
 * de publicar; esta função é a segunda camada da mesma garantia (decisão 5:
 * validação de editor e segurança de tipo são dois trabalhos, os dois
 * existem), para o dia em que uma consulta populariza em profundidade 0 por
 * engano.
 *
 * `nome`, `formato` e `mb` sempre chegam juntos ao componente — é o tipo, não
 * uma convenção de UI, que garante que formato e peso "aparecem antes do link
 * de download": não existe como montar um `Arquivo3D` sem os três.
 */
export type Arquivo3D = {
  nome: string;
  url: string;
  formato: string;
  mb: number;
};

export function arquivo3DDoPainel(doc: Arquivo3DGerado): Arquivo3D | undefined {
  const nome = texto(doc.nome);
  if (nome === undefined) return undefined;

  const arquivo = doc.arquivo;
  // Veio só como identificador (profundidade 0): nem endereço nem tamanho
  // existem ali — mesmo estado que `catalogoDoPainel` trata em
  // `lib/representadas-traducao.ts`.
  if (!arquivo || typeof arquivo !== "object") return undefined;

  const url = texto(arquivo.url);
  const formato = formatoDoArquivo(arquivo.filename);
  const mb = pesoDoArquivo(arquivo);

  if (url === undefined || formato === undefined || mb === undefined)
    return undefined;

  return { nome, url, formato, mb };
}
