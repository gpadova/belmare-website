import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ComposicaoEmPreview } from "@/components/paginas/composicao-em-preview";
import { PaginaLivreDesenhada } from "@/components/paginas/pagina-livre";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import {
  buscarPaginaLivre,
  documentoDePaginaEmRascunho,
} from "@/lib/paginas-consulta";
import { paginaDoPainel } from "@/lib/paginas-traducao";
import type { RotaLivre as Endereco } from "@/lib/paginas";

/**
 * A ponte entre um arquivo de rota e a composição do painel — as três rotas
 * livres a usam, e nenhuma delas repete a lógica.
 *
 * ⚠️ **AS TRÊS ROTAS SÃO ARQUIVOS DE VERDADE, E NÃO UM `[pagina]` DINÂMICO.**
 * Um segmento coringa teria dado as três de graça e mais uma consequência: o
 * painel passaria a poder inventar endereço, e um endereço inventado é uma
 * página que existe no CMS e em nenhuma URL — ou pior, uma URL que ninguém
 * revisou. `lib/site.ts` já diz por que a navegação não é editável ("uma rota
 * nova exige uma página nova, que é código"); três arquivos de rota são a mesma
 * regra aplicada do outro lado. O custo é um arquivo de dez linhas por rota; o
 * ganho é que o conjunto de URLs do site continua sendo uma coisa que se lê no
 * repositório.
 *
 * ⚠️ **DOIS CAMINHOS, UM DESENHO.** Publicado: leitura do banco, tradução,
 * `PaginaLivreDesenhada` — tudo no servidor, rota estática. Sob rascunho: o
 * documento cru vai para o cliente, onde o hook de live preview o funde com o
 * que está no formulário a cada mudança de campo, passa pelo MESMO mapper e
 * desenha o MESMO componente. A composição nunca tem duas escritas — um preview
 * que desenha por outro caminho mostra uma página que o site não publica.
 *
 * ⚠️ **O DESVIO PARA RASCUNHO SÓ ACONTECE SOB `draftMode()` LIGADO**, e só quem
 * passou pelo token de `/preview` chega com ele ligado — a mesma ponte única de
 * `app/(frontend)/representadas/[marca]/page.tsx`. Um visitante comum nunca tem
 * o cookie, então percorre só a leitura publicada e nunca baixa o JavaScript do
 * preview.
 *
 * ⚠️ **O CADASTRO DA EMPRESA É LIDO UMA VEZ, AQUI, E DESCE POR PARÂMETRO.** Os
 * blocos de caminhos, ficha e fecho precisam dele e o buscavam cada um por si
 * até este ticket. Além de economizar três leituras do mesmo global numa página
 * que use os três, é o que torna os blocos SÍNCRONOS — e um bloco síncrono é o
 * que o cliente consegue redesenhar enquanto o operador arrasta.
 *
 * ⚠️ **SEM COMPOSIÇÃO PUBLICADA, A ROTA É 404 — não uma casca vazia.** Não há
 * reserva em código para cair, e não deveria haver: estas três páginas nascem
 * CMS-nativas, ao contrário da prancha e das representadas, que existiam em
 * código antes de existir painel. Um título sobre o nada numa rota que a home
 * linka é pior do que o 404 desenhado que estava ali antes deste ticket — e
 * despublicar tem que ser um poder real do painel, não um gesto sem efeito. As
 * três são publicadas pelo seed (`src/seed/semear-paginas.ts`).
 */

async function documentoParaRenderizar(slug: Endereco) {
  const { isEnabled } = await draftMode();
  return isEnabled ? documentoDePaginaEmRascunho(slug) : undefined;
}

/**
 * O `<title>` e a descrição de busca de uma rota livre — os dois são campo.
 *
 * ⚠️ Mora aqui, ao lado do componente, e não em `lib`: ele precisa da MESMA
 * decisão de rascunho que o corpo da página. Metadata lida do publicado
 * enquanto o corpo mostra rascunho faria a aba do navegador discordar da página
 * durante o preview, que é exatamente onde o operador está conferindo se o
 * título ficou bom.
 */
export async function metadataDaRotaLivre(slug: Endereco): Promise<Metadata> {
  const rascunho = await documentoParaRenderizar(slug);
  const pagina =
    rascunho === undefined
      ? await buscarPaginaLivre(slug)
      : paginaDoPainel(rascunho);

  if (pagina === undefined) return {};

  return {
    title: pagina.titulo,
    ...(pagina.resumo === undefined ? {} : { description: pagina.resumo }),
  };
}

export async function RotaLivre({ slug }: { slug: Endereco }) {
  const rascunho = await documentoParaRenderizar(slug);
  const empresa = await buscarEmpresa();

  if (rascunho !== undefined) {
    return <ComposicaoEmPreview documento={rascunho} empresa={empresa} />;
  }

  const pagina = await buscarPaginaLivre(slug);
  if (pagina === undefined) notFound();

  return <PaginaLivreDesenhada pagina={pagina} empresa={empresa} />;
}
