import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import { Seta } from "@/components/icones";
import { AberturaDaMarca } from "@/components/marca/abertura";
import { Arquivos3DDaMarca } from "@/components/marca/arquivos-3d";
import { CatalogosDaMarca } from "@/components/marca/catalogos";
import { FaixaIndice } from "@/components/marca/faixa-indice";
import { SecaoDaMarca } from "@/components/marca/secao";
import { buscarArquivos3DDaRepresentada } from "@/lib/arquivos3d-consulta";
import {
  representadaDaPagina,
  representadaEmRascunho,
  slugsDeRepresentadas,
} from "@/lib/representadas-consulta";
import { secoesDaRepresentada, type Representada } from "@/lib/representadas";

type Parametros = { marca: string };

/**
 * A marca que ESTA visita deve ver — decisão 8 da spec, o preview de
 * espinha fixa.
 *
 * ⚠️ **O DESVIO PARA RASCUNHO SÓ ACONTECE SOB `draftMode()` LIGADO, E SÓ
 * QUEM PASSOU PELO TOKEN DE `/preview` CHEGA COM ELE LIGADO.** Um visitante
 * comum nunca tem o cookie de rascunho do Next, então nunca cai neste ramo —
 * `representadaDaPagina` (a leitura publicada) é o único caminho que ele
 * percorre. Esta função é a ÚNICA ponte entre a rota e as duas leituras de
 * `lib/representadas-consulta.ts`; nenhum outro lugar nesta página decide
 * isso, e é por isso que a garantia de "rascunho não vaza" pode ser provada
 * num teste de `src/lib` sem precisar simular o Next inteiro.
 */
async function marcaParaRenderizar(
  slug: string,
): Promise<Representada | undefined> {
  const { isEnabled } = await draftMode();
  return isEnabled ? representadaEmRascunho(slug) : representadaDaPagina(slug);
}

/**
 * Uma URL canônica por marca, geradas no build.
 *
 * `dynamicParams = false` fecha a rota nesses endereços: um slug que não existe
 * vira 404 estático, sem passar pelo servidor. Nada nesta página lê
 * `searchParams`, e é isso que a mantém estática.
 */
export async function generateStaticParams(): Promise<Parametros[]> {
  const slugs = await slugsDeRepresentadas();
  return slugs.map((marca) => ({ marca }));
}

export const dynamicParams = false;

/**
 * ⚠️ **O `fato` VIVE AQUI, E ESTE É O ÚLTIMO LUGAR QUE O IMPRIME PARA ESTA
 * MARCA.** Ele saiu da abertura em PRA-131 porque era a terceira impressão da
 * mesma string no caminho até a página — cartão da home, ficha de
 * `/representadas`, e de novo no topo desta. Na `description` continua fazendo
 * trabalho de verdade: é o resumo que o buscador mostra, e ali ninguém acabou de
 * lê-lo duas telas antes.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Parametros>;
}): Promise<Metadata> {
  const { marca } = await params;
  const representada = await marcaParaRenderizar(marca);
  if (!representada) return {};

  const origem = representada.base ? `${representada.base}. ` : "";

  return {
    title: representada.nome,
    description: `${representada.nome}. ${origem}${representada.fato}. Representada pela Belmare no Paraná, em Santa Catarina e no Rio Grande do Sul.`,
  };
}

/**
 * `/representadas/[marca]` — quem é a fábrica, e o que a Belmare tem dela.
 *
 * ⚠️ **A ROTA ENCOLHEU DE SEIS SEÇÕES PARA QUATRO EM PRA-131, E O CORTE É O
 * TRABALHO.** A queixa foi "robotizada, muito storytelling, pouca informação", e
 * a leitura fácil seria reescrever as frases. Medida seção a seção, a página
 * tinha SEIS blocos numerados, seis títulos de 42px e seis fios estruturais para
 * transportar, na melhor marca, seis fatos técnicos e cinco nomes de modelo — e
 * na pior, três declarações e um nome. **O storytelling não estava nas frases:
 * estava na quantidade de estrutura construída para carregar tão pouco.**
 *
 * Saíram três seções, e a razão de fundo é uma só: **uma fábrica tem muitos
 * produtos, e ficha técnica é do produto, não da fábrica.**
 *
 *   · **"O que a fábrica informa"** deixou de ser seção e virou a ficha da
 *     abertura. O rótulo nomeava a proveniência do dado, não o dado; e o
 *     conteúdo — duas linhas na Marê, três na Bux — nunca justificou um bloco
 *     próprio com título de 42px e nota de rodapé.
 *   · **"Quem assina"** morreu. Oito nomes na Marê seguidos de trinta coleções
 *     em texto corrido cinza, dois nomes nus na GDA com a coluna da direita
 *     vazia. Os nomes viraram UMA linha da ficha, que é o que eles são.
 *   · **"O vocabulário da fábrica"** morreu, e o rótulo era o menor problema
 *     dela: o conteúdo era uma lista de substantivos que o arquiteto já conhece
 *     ("Sofás", "Mesas", "Poltronas"), impressa duas vezes na GDA porque a
 *     fábrica faz a mesma linha para dentro e para fora. Os cinco modelos da
 *     Trisol, que eram a exceção informativa, viraram linha de ficha.
 *   · **Entrou `Arquivos 3D`**, ligando uma consulta que existia, testada, e que
 *     nenhuma rota do site consumia.
 *   · **A numeração `01 02 03` e o título de 42px saíram.** Cada seção abre como
 *     cabeçalho de tabela: fio, rótulo em mono e a contagem à direita.
 *   · **Toda prosa de seção saiu.** Não sobrou nenhuma frase explicando ao
 *     visitante uma decisão editorial nossa.
 *
 * ⚠️ **A ASSIMETRIA CONTINUA SENDO A NAVEGAÇÃO.** As seções somem quando o dado
 * não existe e a faixa lista só o que renderizou — nenhuma usa "em breve",
 * markup vazio ou célula em branco. Hoje, sem nenhum PDF e nenhum bloco
 * publicados, as quatro páginas têm identificação e contato: é o estado honesto
 * do acervo, e ele muda no minuto em que o primeiro arquivo subir.
 *
 * ⚠️ Todo lead passa pela Belmare. O e-mail comercial da fábrica não está aqui
 * nem em lugar nenhum do site.
 */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: quem é a fábrica, e o que a Belmare tem dela. Ficha técnica é do
produto, não da marca — a página não finge ter uma.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0.
STORY: o arquiteto identifica a fábrica, lê algumas informações dela, e sai
com o catálogo e o bloco 3D — ou pede à Belmare o que ainda não existe.
FIRST VIEWPORT: marca, nome em display, o que ela produz, e a ficha.
FINISH: unreviewed and undocumented is unfinished.
-->`;

export default async function PaginaDaMarca({
  params,
}: {
  params: Promise<Parametros>;
}) {
  const { marca } = await params;
  const representada = await marcaParaRenderizar(marca);
  if (!representada) notFound();

  /* Os blocos desta fábrica, com a MESMA etiqueta de cache da representada —
     editar a Trisol invalida as duas leituras juntas. Vêm antes de montar as
     seções porque a faixa de índice declara a contagem antes do clique, e
     `secoesDaRepresentada` é pura: quem já buscou passa o número. */
  const blocos = await buscarArquivos3DDaRepresentada(representada.slug);

  const secoes = secoesDaRepresentada(representada, {
    blocos3d: blocos.length,
  });
  const contagem = (id: string) =>
    secoes.find((secao) => secao.id === id)?.contagem;

  /* ⚠️ **A MENSAGEM PRÉ-PREENCHIDA MUDA COM O ESTADO DA PÁGINA, e é a única
     qualificação de lead que o site tem.** Sem nenhum arquivo publicado — o
     estado das quatro fábricas hoje —, quem chega ao fecho chegou porque não
     encontrou o que veio buscar, e o pedido certo é o do arquivo. É o padrão que
     a pesquisa de referência de 05/08/2026 encontrou em toda plataforma do
     setor: a ausência nunca é escondida nem preenchida com linha fantasma, ela
     vira um canal de pedido ("Registrar pedido de arquivo para a marca",
     "Request files"). Aqui a ausência não desenha linha nenhuma, e o pedido é a
     ação de fecho que já existia. */
  const temArquivo =
    (representada.catalogos?.length ?? 0) > 0 || blocos.length > 0;

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />

      {/* ⚠️ **A FAIXA SÓ EXISTE QUANDO HÁ O QUE SUMARIZAR.** `identificacao` e
          `falar` são as duas seções incondicionais desta rota, então uma marca
          sem catálogo e sem bloco produz um sumário fixo, grudado no cabeçalho,
          dizendo "IDENTIFICAÇÃO · CONTATO" — que é a faixa anunciando que não há
          nada a anunciar, e ocupando 40px do topo em toda rolagem para isso. É o
          estado das quatro fábricas hoje. A faixa volta sozinha no minuto em que
          o primeiro PDF ou o primeiro bloco subir, que é quando ela passa a
          declarar contagem antes do clique — a única razão de ela existir. */}
      {secoes.length > 2 ? <FaixaIndice secoes={secoes} /> : null}

      <AberturaDaMarca representada={representada} />

      <CatalogosDaMarca
        catalogos={representada.catalogos ?? []}
        contagem={contagem("catalogos")}
      />

      <Arquivos3DDaMarca arquivos={blocos} contagem={contagem("arquivos-3d")} />

      <SecaoDaMarca id="falar" titulo="Contato">
        {/* ⚠️ **O PARÁGRAFO DE FECHO SAIU INTEIRO — PRA-131.** Ele dizia "Quem
            responde é a Belmare, e não a fábrica. O atendimento cobre Paraná,
            Santa Catarina e Rio Grande do Sul, o mesmo território para todas as
            representadas." As duas frases descrevem como a Belmare se organiza,
            e `PRODUCT.md` já recusou essa classe de copy por escrito: ninguém
            chega a um site de mobiliário querendo saber a estrutura do
            fornecedor. O território, que é a única parte disso que o arquiteto
            usa, virou linha de ficha na abertura — onde é fato, e não
            explicação. A regra de canal continua valendo inteira: nenhum e-mail
            de fábrica entra neste site. */}
        <AcaoDeFecho
          contexto={
            temArquivo
              ? `quero falar sobre a ${representada.nome}`
              : `quero o catálogo e os arquivos 3D da ${representada.nome}`
          }
          className="mt-6 md:mt-8"
        />

        <Link
          href="/representadas"
          className="mono uppercase group mt-8 inline-flex items-center gap-3 text-ink md:mt-10"
        >
          Ver todas as representadas
          <Seta className="h-3 w-8 rotate-180 transition-transform duration-300 ease-out group-hover:-translate-x-1.5 motion-reduce:transition-none" />
        </Link>
      </SecaoDaMarca>
    </>
  );
}
