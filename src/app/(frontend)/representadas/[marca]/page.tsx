import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import { Seta } from "@/components/icones";
import { AberturaDaMarca } from "@/components/marca/abertura";
import { AssinaturasDaMarca } from "@/components/marca/assinaturas";
import { DeclaracoesDaMarca } from "@/components/marca/declaracoes";
import { FaixaIndice } from "@/components/marca/faixa-indice";
import { ParaLevarDaMarca } from "@/components/marca/para-levar";
import { SecaoDaMarca } from "@/components/marca/secao";
import { VocabularioDaMarca } from "@/components/marca/vocabulario";
import {
  representadaDaPagina,
  representadaEmRascunho,
  slugsDeRepresentadas,
} from "@/lib/representadas-consulta";
import { secoesDaRepresentada, type Representada } from "@/lib/representadas";
import { TERRITORIO } from "@/lib/empresa";
import { emLista } from "@/lib/frase";

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
 * ⚠️ A lista vem do painel — `slugsDeRepresentadas()` — e não mais de um array
 * em código. Enquanto a migração das quatro não passou (PRA-119), ela é a união
 * das duas fontes: quem já está cadastrado renderiza do CMS, quem ainda não
 * está continua renderizando do código, e nenhuma marca cai fora no meio da
 * travessia.
 *
 * `dynamicParams = false` fecha a rota nesses endereços: um slug que não existe
 * vira 404 estático, sem passar pelo servidor. Nada nesta página lê
 * `searchParams`, e é isso que a mantém estática — a decisão está em
 * `vocabulario.tsx`.
 */
export async function generateStaticParams(): Promise<Parametros[]> {
  const slugs = await slugsDeRepresentadas();
  return slugs.map((marca) => ({ marca }));
}

export const dynamicParams = false;

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
    description: `${representada.nome} — ${origem}${representada.fato}. Representada pela Belmare no Paraná, em Santa Catarina e no Rio Grande do Sul.`,
  };
}

/**
 * `/representadas/[marca]` — o índice da prancha.
 *
 * Uma marca, uma página, e ela carrega tudo o que é da marca. O arquiteto volta
 * muitas vezes: isto é ferramenta de trabalho, não peça de campanha.
 *
 * ⚠️ **O PROBLEMA DESTA ROTA É A ASSIMETRIA, E A DIREÇÃO É A RESPOSTA A ELA.**
 * A Marê tem oito assinaturas e dezenove categorias e não declara um material;
 * a Trisol declara a linha técnica inteira e não tem designer nem cidade; a Bux
 * não tem taxonomia. Um template rígido ou fica vazio na Trisol ou fica raso na
 * Marê. Aqui as seções somem quando o dado não existe, a numeração é calculada
 * sobre o que sobrou, e a faixa de índice lista só o que renderizou — de modo
 * que a diferença entre as fábricas deixa de ser buraco de layout e vira a
 * própria navegação. Abra a Trisol: quatro entradas. Abra a Marê: cinco.
 *
 * ⚠️ Nenhuma seção usa "em breve", markup vazio ou célula em branco. O que não
 * existe fica ausente.
 *
 * ⚠️ Todo lead passa pela Belmare. O e-mail comercial da fábrica não está aqui
 * nem em lugar nenhum do site.
 */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: A página de marca não é um folheto da fábrica — é a folha de trabalho
dela, e o sumário na faixa fixa declara o que existe antes do clique. Recusa o
template rígido que finge que as quatro fábricas têm o mesmo material.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0. Faixa de sumário em mono sob o cabeçalho,
seções abertas por fio com número na margem, ficha de rótulo e valor.
STORY: o arquiteto vê o que esta fábrica resolve, confere o que ela declara,
sabe quem assina, lê o vocabulário dela e fala com a Belmare.
FIRST VIEWPORT: faixa de sumário com contagens sob o cabeçalho; fotografia
sangrando de ponta a ponta com legenda visível; identificação em mono e o nome
em display.
FORM: "o índice da prancha", candidata 6 da lista ordenada, chave f587693a.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function PaginaDaMarca({
  params,
}: {
  params: Promise<Parametros>;
}) {
  const { marca } = await params;
  const representada = await marcaParaRenderizar(marca);
  if (!representada) notFound();

  const secoes = secoesDaRepresentada(representada);
  const numero = (id: string) =>
    secoes.find((secao) => secao.id === id)?.numero ?? "";

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />

      <FaixaIndice secoes={secoes} />

      <AberturaDaMarca
        representada={representada}
        numero={numero("identificacao")}
      />

      <DeclaracoesDaMarca
        representada={representada}
        numero={numero("declara")}
      />

      <AssinaturasDaMarca
        representada={representada}
        numero={numero("assina")}
      />

      <VocabularioDaMarca
        representada={representada}
        numero={numero("vocabulario")}
      />

      <ParaLevarDaMarca representada={representada} numero={numero("levar")} />

      <SecaoDaMarca
        id="falar"
        numero={numero("falar")}
        titulo={`Uma pergunta sobre a ${representada.nome}.`}
      >
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          Quem responde é quem representa, e é quem aciona a fábrica depois. O
          atendimento cobre{" "}
          {emLista(TERRITORIO)} — o
          mesmo território para todas as representadas.
        </p>

        {/* O contexto vai pré-preenchido na mensagem: quem clica aqui chega
            dizendo de qual fábrica veio, e isso é a única qualificação de lead
            que o site tem enquanto não existe formulário. */}
        <AcaoDeFecho
          contexto={`quero falar sobre a ${representada.nome}`}
          className="mt-10 md:mt-14"
        />

        <Link
          href="/representadas"
          className="mono uppercase group mt-10 inline-flex items-center gap-3 text-ink md:mt-12"
        >
          Ver todas as representadas
          <Seta className="h-3 w-8 rotate-180 transition-transform duration-300 ease-out group-hover:-translate-x-1.5 motion-reduce:transition-none" />
        </Link>
      </SecaoDaMarca>
    </>
  );
}
