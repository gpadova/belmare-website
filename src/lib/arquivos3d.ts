import { texto } from "@/lib/campo-opcional";
import { pesoDoArquivo } from "@/lib/representadas-traducao";
import type {
  Arquivo as ArquivoGerado,
  Arquivos3D as Arquivo3DGerado,
  Pacote3D as PacoteGerado,
} from "@/payload-types";

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
 * Um download, pronto para o componente — o item da biblioteca (`Arquivo3D`) e
 * o pacote completo (`Baixavel` sozinho) saem os dois daqui.
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
 *
 * ⚠️ **PRA-127 NÃO ABRE UMA EXCEÇÃO PARA O DOWNLOAD COM CADASTRO.** O pacote
 * completo é o único arquivo do site atrás de um formulário, e ele atravessa
 * exatamente este mesmo tipo: sem peso medido e sem extensão legível ele não
 * existe, e o formulário que o pediria não é desenhado. Um gate que esconde o
 * tamanho até depois do cadastro é a versão pior da mesma quebra de promessa —
 * a pessoa paga com o dado dela e só então descobre que são 60 MB.
 */
export type Baixavel = {
  url: string;
  formato: string;
  mb: number;
};

export type Arquivo3D = Baixavel & {
  nome: string;
};

/**
 * O upload traduzido em endereço, formato e peso — os três juntos ou nenhum.
 *
 * ⚠️ **EXTRAÍDA EM PRA-127 PORQUE O PACOTE COMPLETO FAZ A MESMA PROMESSA QUE UM
 * ARQUIVO SOLTO.** O gate de cadastro muda QUEM baixa; não muda o que a página
 * declara antes do clique. Se esta leitura fosse escrita duas vezes — uma para
 * o item da biblioteca, outra para o pacote —, o dia em que a regra de peso
 * mudasse deixaria as duas discordando na mesma tela, que é exatamente o modo
 * de falha que `components/linha-de-catalogo.tsx` já registra para "24,0 MB"
 * virando "24MB" na página ao lado.
 */
function baixavelDoUpload(
  arquivo: number | ArquivoGerado | null | undefined,
): Baixavel | undefined {
  // Veio só como identificador (profundidade 0): nem endereço nem tamanho
  // existem ali — mesmo estado que `catalogoDoPainel` trata em
  // `lib/representadas-traducao.ts`.
  if (!arquivo || typeof arquivo !== "object") return undefined;

  const url = texto(arquivo.url);
  const formato = formatoDoArquivo(arquivo.filename);
  const mb = pesoDoArquivo(arquivo);

  if (url === undefined || formato === undefined || mb === undefined)
    return undefined;

  return { url, formato, mb };
}

export function arquivo3DDoPainel(doc: Arquivo3DGerado): Arquivo3D | undefined {
  const nome = texto(doc.nome);
  if (nome === undefined) return undefined;

  const baixavel = baixavelDoUpload(doc.arquivo);
  if (baixavel === undefined) return undefined;

  return { nome, ...baixavel };
}

/**
 * O pacote completo — as quatro marcas, mais acabamentos e tecidos, num
 * download só (PRA-127).
 *
 * ⚠️ **É O ÚNICO DOWNLOAD DO SITE ATRÁS DE CADASTRO, E A EXCEÇÃO TEM MOTIVO
 * ECONÔMICO, NÃO DE PRODUTO.** A GDA já está na Casoca — gratuita, sem
 * cadastro, dominante. Pedir os dados de um arquiteto em troca de um arquivo
 * que a Casoca entrega ungated não captura o lead: **doa** o lead, porque a
 * pessoa fecha a aba e baixa do outro lado em dez segundos. O que a Casoca
 * estruturalmente não tem é o conjunto — quatro fábricas juntas, com as cartas
 * de acabamento e tecido —, e é só sobre esse conjunto que o cadastro se
 * sustenta. Ver `lib/arquivos3d-consulta.ts` e a nota de topo de
 * `app/(frontend)/arquivos-3d/page.tsx`.
 *
 * ⚠️ **SEM PACOTE PUBLICADO, A SEÇÃO INTEIRA SOME — E ISSO É A GARANTIA, NÃO A
 * DEGRADAÇÃO.** `undefined` aqui apaga o formulário junto: um cadastro em troca
 * de um arquivo que não existe é a única forma de o site pedir dado pessoal sem
 * dar nada em troca, e nenhum estado de painel pode produzi-la. Seção anulável
 * aplicada ao único lugar onde ela protege o visitante em vez do layout.
 *
 * ⚠️ **O PACOTE NÃO TEM `nome`, DE PROPÓSITO.** Um item da biblioteca precisa
 * dizer QUAL peça é ("Cadeira Zuri"); o pacote é um só, e o título dele é fixo
 * no desenho da seção. Ler `Arquivo.titulo` daqui daria uma segunda escrita do
 * mesmo cabeçalho — a que continua dizendo "Pacote 2026" em 2027.
 */
export function pacoteDoPainel(doc: PacoteGerado): Baixavel | undefined {
  return baixavelDoUpload(doc.pacote);
}

/**
 * A biblioteca agrupada por representada, sem grupo vazio.
 *
 * ⚠️ **AGRUPAR NÃO É FILTRAR, E A DISTINÇÃO É O PRINCÍPIO 2 DO `PRODUCT.md`
 * INTEIRO.** "O filtro nunca sai da marca" continua valendo ao pé da letra:
 * nenhuma consulta deste projeto pede arquivos de duas fábricas ao mesmo tempo
 * (ver `buscarBiblioteca3D` em `lib/arquivos3d-consulta.ts`, que é N leituras
 * escopadas por `representada.slug`, nunca uma leitura sem escopo). O que esta
 * função faz é ORDENAR na tela o que já veio separado — e é por isso que ela é
 * pura e recebe os grupos prontos: não existe aqui um lugar onde um `where`
 * transversal pudesse nascer.
 *
 * ⚠️ **UMA FÁBRICA SEM ARQUIVO NÃO VIRA TÍTULO ÓRFÃO.** Seção anulável
 * (`CONTEXT.md`): hoje NENHUMA das quatro tem arquivo 3D cadastrado, então a
 * implementação literal — um `<h2>` por representada — renderiza quatro
 * cabeçalhos sobre nada. Menos página, nunca página quebrada.
 */
export function bibliotecaPorRepresentada<M>(
  grupos: readonly { marca: M; arquivos: Arquivo3D[] }[],
): { marca: M; arquivos: Arquivo3D[] }[] {
  return grupos.filter((grupo) => grupo.arquivos.length > 0);
}

/**
 * Quantos arquivos a biblioteca inteira tem — **gerado**, nunca digitado.
 *
 * A mesma regra de toda contagem em prosa do site (`lib/frase.ts`): o dia em
 * que o segundo lote de blocos entrar pelo painel, um número escrito à mão
 * continuaria dizendo o do primeiro.
 */
export function totalDeArquivos3D(
  grupos: readonly { arquivos: Arquivo3D[] }[],
): number {
  return grupos.reduce((soma, grupo) => soma + grupo.arquivos.length, 0);
}
