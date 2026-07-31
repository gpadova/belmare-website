import config from "@payload-config";
import { getPayload } from "payload";

import {
  arquivo3DDoPainel,
  bibliotecaPorRepresentada,
  pacoteDoPainel,
  type Arquivo3D,
  type Baixavel,
} from "@/lib/arquivos3d";
import { comCache } from "@/lib/cache-do-painel";
import { representadasDaPagina } from "@/lib/representadas-consulta";
import type { Representada } from "@/lib/representadas";
import { tagDaRepresentada, TAG_ARQUIVOS_3D } from "@/lib/revalidacao";

/**
 * Os arquivos 3D, já traduzidos para o domínio — mesma garantia de
 * `lib/pecas-consulta.ts`: uma representada por chamada, rascunho nunca vaza.
 *
 * ⚠️ `depth: 1` não é ajuste de desempenho: sem ele o upload de `arquivo` volta
 * como identificador, e o mapper — que trata identificador solto como arquivo
 * ausente — devolveria a lista vazia mesmo com arquivos cadastrados. Mesma
 * nota que `lib/representadas-consulta.ts` já registra para o catálogo.
 */

async function painel() {
  return getPayload({ config });
}

export async function buscarArquivos3DDaRepresentada(
  representadaSlug: string,
): Promise<Arquivo3D[]> {
  return comCache(
    async () => {
      const payload = await painel();

      const { docs } = await payload.find({
        collection: "arquivos3d",
        depth: 1,
        pagination: false,
        sort: "nome",
        where: {
          and: [
            { "representada.slug": { equals: representadaSlug } },
            { _status: { equals: "published" } },
          ],
        },
      });

      // `arquivo3DDoPainel` devolve `undefined` para o caso defensivo em que o
      // upload não pôde ser medido ou formatado — filtrado aqui, nunca
      // repassado como um item quebrado ao componente.
      return docs
        .map(arquivo3DDoPainel)
        .filter((item): item is Arquivo3D => item !== undefined);
    },
    ["arquivos3d-da-representada", representadaSlug],
    [tagDaRepresentada(representadaSlug)],
  );
}

/** Uma fábrica e o que ela tem em disco — a unidade que `/arquivos-3d`
 *  desenha. */
export type GrupoDaBiblioteca3D = {
  marca: Representada;
  arquivos: Arquivo3D[];
};

/**
 * A biblioteca inteira de `/arquivos-3d`, agrupada por representada — PRA-127.
 *
 * ⚠️ **ESTA É A CONSULTA QUE ATRAVESSA AS MARCAS, E ELA NÃO TEM UM `where`
 * TRANSVERSAL — DE PROPÓSITO.** É `buscarArquivos3DDaRepresentada` chamada N
 * vezes, uma por fábrica publicada, e nada mais. A alternativa óbvia — um
 * `find` sem escopo de `representada.slug`, ordenado por marca — daria o mesmo
 * pixel na tela e abriria por dentro a porta que o princípio 2 do `PRODUCT.md`
 * fecha: **"o filtro nunca sai da marca"**. Uma vez que exista no código uma
 * leitura de arquivos 3D sem pai, o filtro por formato que o briefing pede
 * ("SKETCHUP · DWG · REVIT · 3DS", `briefing/prompt-paper.md`) nasce dela em
 * três linhas, e o eixo transversal que a decisão 10 já matou uma vez volta
 * pela porta dos fundos. **Agrupar não é filtrar**: agrupar arruma na tela o
 * que veio separado; filtrar é a consulta perguntar por duas fábricas ao mesmo
 * tempo. Esta função faz a primeira e o código não tem como fazer a segunda.
 *
 * ⚠️ **N LEITURAS, N ENTRADAS DE CACHE, N ETIQUETAS — E ISSO É A FEATURE.**
 * Cada chamada carrega `tagDaRepresentada` da própria fábrica, então publicar
 * um arquivo da Trisol invalida a leitura da Trisol e só ela; as outras três
 * são servidas do cache. Uma consulta única traria uma entrada só, e uma
 * etiqueta só — que teria de ser inventada em `lib/revalidacao.ts`, onde a nota
 * de `MudancaNoPainel` diz explicitamente que nada precisava mudar. Nada mudou.
 *
 * ⚠️ **GRUPO VAZIO NÃO SAI DAQUI.** `bibliotecaPorRepresentada` (pura,
 * testada) descarta a fábrica sem arquivo, para a página não desenhar quatro
 * cabeçalhos sobre nada — que é literalmente o estado de hoje, com nenhum
 * arquivo 3D cadastrado. Seção anulável.
 */
export async function buscarBiblioteca3D(): Promise<GrupoDaBiblioteca3D[]> {
  const marcas = await representadasDaPagina();

  const grupos = await Promise.all(
    marcas.map(async (marca) => ({
      marca,
      arquivos: await buscarArquivos3DDaRepresentada(marca.slug),
    })),
  );

  return bibliotecaPorRepresentada(grupos);
}

/**
 * O pacote completo, ou `undefined` enquanto ele não existir.
 *
 * ⚠️ Mesma regra de rascunho de `lib/empresa-consulta.ts`, e num global ela tem
 * cara própria: enquanto nunca tiver sido publicado, `findGlobal` devolve o
 * rascunho como se fosse conteúdo no ar. Só `_status === "published"`
 * atravessa — o resto é lido como pacote ausente, e a seção inteira (formulário
 * incluído) não é desenhada.
 *
 * ⚠️ `depth: 1` pelo mesmo motivo das consultas acima: sem ele o upload volta
 * como identificador e o mapper trata identificador solto como arquivo ausente
 * — o pacote publicado sumiria da página sem nenhum sintoma no painel.
 */
export async function buscarPacote3D(): Promise<Baixavel | undefined> {
  return comCache(
    async () => {
      const payload = await painel();

      const doc = await payload.findGlobal({ slug: "pacote-3d", depth: 1 });

      return doc._status === "published" ? pacoteDoPainel(doc) : undefined;
    },
    ["pacote-3d"],
    [TAG_ARQUIVOS_3D],
  );
}
