import type { Metadata } from "next";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import { ListaDeCatalogos } from "@/components/catalogos/lista-de-catalogos";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { emLista } from "@/lib/frase";
import { catalogosDoSite, marcasComCatalogo } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * ⚠️ A DESCRIÇÃO SAI DO DADO, e a razão é que ela é o texto que o arquiteto lê
 * no Google — a única superfície do site que aparece antes do site. Uma versão
 * anterior anunciava "os catálogos das 4 fábricas … em PDF, com formato e peso
 * declarados antes do clique" enquanto não havia um único PDF no site: prometer
 * no resultado de busca o que a própria página desmente é a pior versão de
 * inventar dado, porque quem clica chega já desmentido.
 *
 * ⚠️ **AS DUAS ESCRITAS SÃO O ESTADO REAL DO ACERVO, não uma variação de tom.**
 * Sem nenhum PDF hospedado, a descrição não promete download nenhum — ela diz o
 * que de fato acontece hoje, que é a Belmare mandar o arquivo.
 *
 * ⚠️ É `generateMetadata`, e não `metadata`, porque a fonte é o painel: leitura
 * de painel é assíncrona, e um `const` em escopo de módulo não espera por ela.
 */
export async function generateMetadata(): Promise<Metadata> {
  const catalogos = catalogosDoSite(await representadasDaPagina());
  const marcas = marcasComCatalogo(catalogos);

  return {
    title: "Catálogos",
    description:
      catalogos.length === 0
        ? "Os catálogos das fábricas de móveis para área externa representadas pela Belmare. Peça o catálogo da fábrica que você precisa pelo WhatsApp e ele chega direto de quem representa as fábricas no Sul do Brasil."
        : `Os catálogos de ${emLista(
            marcas.map((m) => m.nome),
          )} em PDF, com formato e peso declarados antes do clique e sem cadastro para baixar. Medida e acabamento de móveis para área externa, de quem representa as fábricas no Sul do Brasil.`,
  };
}

/**
 * `/catalogos` — a lista de catálogos, recortável por fábrica.
 *
 * ⚠️ **ESTA ROTA FOI REFEITA EM 05/08/2026, E A REFORMA REVERTE TRÊS DECISÕES
 * DECLARADAS DA PRIMEIRA VERSÃO.** Não são ajustes de layout; são inversões, e
 * ficam escritas aqui porque a versão anterior deixou os argumentos dela no
 * mesmo lugar.
 *
 * **1. A entrada volta a ser a fábrica.** A primeira versão fazia do DOCUMENTO o
 * assunto e rebaixava a marca a qualificador dentro do título ("Catálogo
 * Trisol"), para não ser a quarta enumeração das mesmas quatro marcas. O
 * argumento era bom e a prática o derrubou: uma fábrica tem N catálogos, não um.
 * Com seis da Marê e quatro da GDA numa lista ordenada por edição, as fábricas
 * se embaralham e ninguém acha o que veio buscar. Quem abre esta página abre
 * sabendo de que fábrica quer o catálogo — essa é a pergunta, e a página passa a
 * respondê-la.
 *
 * **2. O filtro por marca existe.** A primeira versão o listava entre o que
 * "NÃO ENTRA", junto com a grade de capas e a subpágina por marca. Ele entra, e
 * pelo mesmo motivo do item 1. Filtrar aqui **não** reabre taxonomia global nem
 * viola o princípio de que nada atravessa duas fábricas: é `Array.filter` sobre
 * uma leitura que a página já fazia, sem consulta nova e sem rota nova.
 *
 * **3. Um catálogo é um arquivo.** A primeira versão declarava documentos que a
 * Belmare ainda não tinha em mãos, com a linha virando um pedido pelo WhatsApp.
 * A intenção era honestidade — declarar o que existe no mundo em vez de fingir
 * que a fábrica não tem catálogo. O que chegou na tela foi o contrário: três
 * linhas anunciando documentos para zero uploads e, sem número de WhatsApp
 * cadastrado, a linha virava um `<div>` com título sublinhado e destino nenhum.
 * Um botão morto. **A regra agora é literal: sobe o PDF, aparece a linha.** Ver
 * a nota de `lib/representadas.ts#Catalogo`.
 *
 * ⚠️ **O ARGUMENTO EM COLUNA SAIU INTEIRO, e é a mudança que o cliente pediu
 * primeiro.** A coluna da esquerda explicava como a indústria funciona — quem
 * publica o catálogo, quem entrega o arquivo, o que não vem dentro dele, qual
 * fábrica ainda não declarou o dela. É informação de dentro do balcão, escrita
 * para quem monta o site, e nenhuma linha dela ajuda quem chegou querendo um
 * PDF. A página passa a ser: título, filtro, lista, pedido.
 *
 * A sequência:
 *
 *   Cabeçalho   o que é a página, em uma linha
 *   Filtro      as fábricas que têm catálogo, com a contagem de cada uma
 *   Lista       os catálogos, agrupados por fábrica na ordem do painel
 *   Fecho       o pedido pelo WhatsApp
 *
 * ⚠️ **CONTINUA SEM UMA ÚNICA IMAGEM, e continua sendo decisão.** Numa rota em
 * que o visitante veio buscar um arquivo, fotografia de ambiente é ruído entre
 * ele e o arquivo.
 *
 * ⚠️ O QUE NÃO ENTRA, e a lista continua vinculante: link para o site da
 * fábrica — o catálogo 2026 da Trisol está público lá, e linkar entrega o lead,
 * o e-mail comercial deles e a comissão de graça · "em breve", "aguarde" ou
 * travessão em campo vazio · peso ou edição estimados · capa de catálogo,
 * miniatura de PDF, visualizador embutido · nota de rodapé nomeando a fábrica
 * que ainda não tem catálogo, que era o "Origem não declarada" do ledger
 * aplicado onde não cabe: numa página de catálogos, uma fábrica sem catálogo
 * não é assunto.
 */
/* O contrato de direção desta rota, no HTML construído para poder ser auditado
   depois do build. Só decisão de design entra aqui; o rastro de processo vive
   em `.impeccable/surfaces/`. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: A lista é plana, a fábrica é a chave e o filtro é o único controle. Um
catálogo é um arquivo — sem PDF em mãos não há linha, não há opção de filtro e
não há promessa. Recusa a coluna de argumento, a grade de capas, o acordeão por
marca e a nota de rodapé sobre quem não tem catálogo.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0 — e aqui, imagem 0. Tipografia e fio sozinhos:
cabeçalho de colunas em mono, linhas regradas com medida à direita, e o recorte
ativo marcado por um fio de 1px em tinta sob o nome da fábrica.
STORY: o visitante vê tudo o que existe, encurta para a fábrica dele em um
clique, e leva o arquivo — ou pede à Belmare, que é quem entrega.
FIRST VIEWPORT: uma coluna de largura total — rótulo em mono, h1 de uma linha,
a fila de recortes, o cabeçalho de colunas e as linhas de catálogo com seta na
ponta.
FORM: "o índice de documentos" de /arquivos-3d, herdado e achatado — a mesma
gramática de linha, sem a coluna de argumento.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function Catalogos() {
  /* Uma leitura de painel só, compartilhada pela lista e pelo filtro.
     `representadasDaPagina` é cacheada por etiqueta, então `generateMetadata`
     acima não paga uma segunda ida ao banco.

     ⚠️ **A SEGUNDA LEITURA É DE GRAÇA E EXISTE PARA O ESTADO VAZIO NOMEAR O
     CANAL.** `buscarEmpresa` já foi chamada nesta requisição pelo cabeçalho e
     pelo rodapé, que moram no layout; a etiqueta é `TAG_SITE` e a resposta vem
     do cache. O que se ganha é a página SABER se existe WhatsApp antes de
     escrever a palavra — ver a nota do parágrafo vazio, abaixo. */
  const [representadas, { whatsapp }] = await Promise.all([
    representadasDaPagina(),
    buscarEmpresa(),
  ]);

  const catalogos = catalogosDoSite(representadas);
  const marcas = marcasComCatalogo(catalogos);

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />

      <section
        aria-labelledby="catalogos"
        className="px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-20"
      >
        <p className="mono uppercase text-graphite">Catálogos</p>

        {/* ⚠️ **O H1 MUDA COM O ESTADO DO ACERVO, e as duas escritas são
            verdadeiras onde aparecem.** "Baixe o catálogo de cada fábrica" sobre
            uma lista vazia é a mesma promessa quebrada que as linhas fantasma
            eram. Sem arquivo nenhum, o que a página de fato oferece é o pedido —
            e o fecho, logo abaixo, é o gesto que a cumpre. */}
        <h1
          id="catalogos"
          className="text-h1 mt-5 max-w-[20ch] font-normal text-balance"
        >
          {catalogos.length === 0
            ? "Peça o catálogo da fábrica que você precisa."
            : "Baixe o catálogo de cada fábrica."}
        </h1>

        <div className="mt-10 md:mt-12">
          {catalogos.length === 0 ? (
            /* ⚠️ Nem lista vazia, nem "em breve", nem travessão em célula — a
               mesma recusa de `/arquivos-3d`. O que existe hoje é o canal, e o
               canal é dito por extenso. O fecho da página é o gesto; este
               parágrafo é a explicação, e são duas frases porque a terceira já
               seria a coluna de argumento voltando pela porta dos fundos.

               ⚠️ **A PALAVRA "WHATSAPP" SÓ É ESCRITA QUANDO O NÚMERO EXISTE.**
               A faixa de fecho não se desenha sem número cadastrado — é a regra
               de `components/faixa-de-acao.tsx` — e um parágrafo mandando falar
               pelo WhatsApp acima de uma página que não oferece WhatsApp nenhum
               é a mesma classe de defeito que as linhas fantasma eram: prometer
               um canal que não abre. Com número, o texto nomeia o canal e o
               botão logo abaixo o cumpre; sem número, ele pede o contato sem
               inventar por onde, e o rodapé continua com telefone e endereço. */
            <p className="text-body max-w-[52ch] text-pretty text-graphite">
              {whatsapp === undefined
                ? "Ainda não há catálogo para baixar aqui. Diga de qual fábrica você precisa e a Belmare manda o arquivo."
                : "Ainda não há catálogo para baixar aqui. Chame a Belmare no WhatsApp e ela manda o catálogo da fábrica que você procura."}
            </p>
          ) : (
            <ListaDeCatalogos catalogos={catalogos} marcas={marcas} />
          )}
        </div>
      </section>

      <div className="px-5 pb-16 md:px-8 md:pb-24">
        <AcaoDeFecho
          rotulo={
            catalogos.length === 0
              ? "Pedir um catálogo"
              : "Pedir um catálogo que não está aqui"
          }
          contexto="queria o catálogo de uma das representadas"
        />
      </div>
    </>
  );
}
