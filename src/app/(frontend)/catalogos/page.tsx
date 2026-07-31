import type { Metadata } from "next";
import Link from "next/link";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import { Seta } from "@/components/icones";
import {
  GRADE_DA_LINHA,
  LinhaDeCatalogo,
  TETO_DA_LISTA,
} from "@/components/linha-de-catalogo";
import {
  catalogoPublicado,
  documentosDeCatalogo,
  representadasSemCatalogo,
} from "@/lib/representadas";

/**
 * ⚠️ A DESCRIÇÃO SAI DO DADO, e a razão é que ela é o texto que o arquiteto lê
 * no Google — a única superfície do site que aparece antes do site. A primeira
 * versão anunciava "os catálogos das 4 fábricas … em PDF, com formato e peso
 * declarados antes do clique", e as três afirmações eram falsas ao mesmo tempo:
 * uma das quatro não declara catálogo, nenhum documento está em PDF aqui, e não
 * há um peso medido no site inteiro. Prometer no resultado de busca o que a
 * própria página desmente é a pior versão de inventar dado, porque quem clica
 * chega já desmentido.
 */
const documentos = documentosDeCatalogo();
const haPublicado = documentos.some((d) => catalogoPublicado(d.catalogo));

export const metadata: Metadata = {
  title: "Catálogos",
  description: `Os catálogos das fábricas de mobiliário de área externa representadas pela Belmare: ${documentos
    .map((d) => d.representada.nome)
    .join(", ")}. Medida, acabamento e ficha cotada — ${
    haPublicado
      ? "com formato e peso declarados antes do clique."
      : "peça o arquivo pelo WhatsApp."
  }`,
};

/**
 * `/catalogos` — o índice de documentos.
 *
 * Dois problemas nasceram junto com esta rota, e nenhum era de layout.
 *
 * O primeiro: **não existe um único PDF.** Nada foi recebido até 30/07/2026, e
 * a implementação literal do briefing — "os PDFs, lista plana" — renderiza uma
 * página em branco. Página em branco atrás de item de menu é pior que o 404 que
 * estava aqui antes. A saída não foi inventar arquivo nem escrever "em breve":
 * foi tratar **o estado do catálogo como o dado**. A Trisol declara edição 2026,
 * a Marê e a GDA publicam catálogo sem dizer de que ano, a Bux não declara nada.
 * Quatro fábricas, quatro estados de conhecimento diferentes — e isso é
 * informação real para quem vai decidir se pede.
 *
 * O segundo: esta seria a **quarta enumeração das mesmas quatro marcas** —
 * galeria da home, ledger de `/quem-somos` 05, registros de `/representadas`, e
 * agora. O que a tira da repetição é a inversão: **a linha é o documento, e a
 * marca só qualifica o título dele** — "Catálogo Trisol". A lista ordena por
 * edição, não por fábrica; aceita duas entradas da mesma fábrica sem mudar de
 * forma; e o dia em que a Marê responder "um PDF por coleção" (P22), ela absorve
 * trinta linhas sem redesenho.
 *
 * A sequência:
 *
 *   Coluna esquerda   o que é a página, e o que não está no arquivo
 *   Coluna direita    os documentos, ordenados por edição
 *   Fecho             o pedido coletivo
 *
 * ⚠️ **É A PRIMEIRA SUPERFÍCIE DO SITE SEM UMA ÚNICA IMAGEM, e é decisão.** O
 * DESIGN.md declara o teste sobre si mesmo: tire tudo menos tipografia, fio e
 * foto, e a página tem que ficar de pé. Aqui ela fica de pé sem a foto. Numa
 * rota em que o visitante veio buscar um arquivo, fotografia de ambiente é ruído
 * entre ele e o arquivo.
 *
 * ⚠️ O QUE NÃO ENTRA, e a lista é vinculante: link para o site da fábrica — o
 * catálogo 2026 da Trisol está público lá, e linkar entrega o lead, o e-mail
 * comercial deles e a comissão de graça · "em breve", "aguarde" ou travessão em
 * campo vazio · peso ou edição estimados · capa de catálogo, miniatura de PDF,
 * visualizador embutido · grade, filtro ou subpágina por marca, que é o segundo
 * índice das mesmas marcas voltando pela porta dos fundos · uma PRANCHA 03, que
 * seria maneirismo: as duas existentes desenham dado com geometria, e uma lista
 * de arquivos não tem geometria.
 */
/* O contrato de direção desta rota, no HTML construído para poder ser auditado
   depois do build. Só decisão de design entra aqui; o rastro de processo vive
   em `.impeccable/surfaces/`. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: A linha é o documento, não a marca — a fábrica qualifica o título
("Catálogo Trisol") e nunca é a entrada. Recusa a quarta lista das mesmas quatro
marcas, a grade de capas, o filtro e a subpágina por marca.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0 — e aqui, imagem 0. Tipografia e fio sozinhos:
fio vertical de altura total separando argumento de lista, cabeçalho de colunas
em mono, linhas regradas com medida à direita.
STORY: o visitante vê o que existe, o que custa o clique e o que ainda não está
em disco; leva o arquivo ou pede à Belmare, que é quem entrega.
FIRST VIEWPORT: duas colunas partidas por fio vertical — à esquerda rótulo em
mono, h1 de duas linhas, parágrafo e saída secundária; à direita o cabeçalho de
colunas e as linhas de documento com seta na ponta.
FORM: "o índice de documentos", comp aprovado catalogos-c-duas-colunas.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function Catalogos() {
  const semCatalogo = representadasSemCatalogo();

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />

      {/* ⚠️ `flex` no telefone, `grid` a partir de `md` — e não grid nas duas.
          Em grid, a saída secundária mora dentro da coluna do argumento e
          linearizava ANTES da lista: quem abre no telefone encontrava o link
          para fora da página antes do primeiro documento. Com flex, a ordem de
          empilhamento fica sob controle e a lista sobe para o lugar dela. */}
      <section
        aria-labelledby="catalogos"
        className="flex flex-col px-5 pt-12 pb-14 md:grid md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:px-8 md:pt-16 md:pb-20"
      >
        {/* A coluna do argumento. `md:pr-8` abre o respiro antes do fio, e a
            saída secundária desce com `mt-auto` para assentar na base da coluna
            — é o que dá altura ao fio vertical sem nenhum elemento de enchimento. */}
        <div className="contents md:flex md:flex-col md:pr-8">
          <p className="mono uppercase text-graphite">Catálogos</p>

          <h1
            id="catalogos"
            className="text-h1 mt-5 max-w-[16ch] font-normal text-balance"
          >
            Medida, acabamento e ficha cotada.
          </h1>

          <p className="text-body mt-6 max-w-[44ch] text-pretty text-graphite">
            {/* "abre daqui", e não "baixa daqui": `arquivo` é URL de storage, e
                em outra origem o clique abre o PDF em vez de baixar. A frase
                descreve o que de fato acontece nas duas situações. */}
            Cada fábrica publica o próprio catálogo, e quem entrega o arquivo é a
            Belmare. O que já está em disco abre daqui; o resto ela manda.
          </p>

          {/* No telefone ele é o último item da seção — a saída só aparece
              depois de o visitante ter visto o que veio buscar. E o afastamento
              é maior ali: empilhado, este bloco cai logo abaixo da nota da Bux,
              nos mesmos support e grafite, e dois parágrafos cinzentos a duas
              entrelinhas de distância lêem como um bloco só. O que separa não é
              fio, é distância. */}
          <div className="order-last mt-16 md:order-none md:mt-auto md:pt-16">
            <p className="text-support max-w-[40ch] text-pretty text-graphite">
              O que não vem no catálogo — quem assina cada coleção e o vocabulário
              de categorias de cada fábrica — está na página da representada.
            </p>
            <Link
              href="/representadas"
              className="mono uppercase group mt-5 inline-flex items-center gap-3 text-ink"
            >
              Ver as representadas
              <Seta className="h-3 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>

        {/* A coluna da lista. O fio vertical é a borda dela, e por isso tem
            exatamente a altura da linha da grade — sem altura escrita à mão. */}
        <div className="mt-12 md:mt-0 md:border-l md:border-line md:pl-8">
          {/* Cabeçalho de colunas de verdade, não rótulo decorativo: cada label
              assenta sobre a coluna que nomeia. Duas consequências disso: no
              telefone a linha empilha e só DOCUMENTO faz sentido, porque ARQUIVO
              nomearia uma coluna que ali não existe; e enquanto nada foi
              publicado a coluna carrega edição e estado de entrega, não arquivo
              nenhum — então ela se chama EDIÇÃO até existir um arquivo, pela
              mesma regra de declarar o estado em vez de prometer.

              ⚠️ EDIÇÃO em cima de três células que começam com "EDIÇÃO" repete a
              palavra quatro vezes, e a correção óbvia — tirar o prefixo da
              célula — quebra o telefone, onde o cabeçalho está oculto e a célula
              precisa se descrever sozinha. "2026" solto não diz o que é. A
              repetição custa menos que a máquina de prefixo condicional por
              breakpoint, e fica. */}
          <div
            aria-hidden
            className={`mono ${GRADE_DA_LINHA} ${TETO_DA_LISTA} border-b border-line pb-3 uppercase text-graphite`}
          >
            <span>Documento</span>
            <span className="hidden md:block">
              {haPublicado ? "Arquivo" : "Edição"}
            </span>
          </div>

          <ul aria-label="Documentos declarados" className={TETO_DA_LISTA}>
            {documentos.map((documento, i) => (
              <LinhaDeCatalogo
                /* O índice entra na chave porque o cenário planejado a colide:
                   se a Marê responder "um PDF por coleção" (P22), dois
                   documentos dela chegam com o mesmo título e sem ano. */
                key={`${documento.representada.slug}-${i}`}
                catalogo={documento.catalogo}
                representada={documento.representada}
                mostrarMarca
              />
            ))}
          </ul>

          {/* A fábrica que não declara catálogo não vira linha com célula vazia,
              e não some em silêncio: ela é nomeada por extenso. É a mesma regra
              do "Origem não declarada" no ledger de `/quem-somos`, e quem lê esta
              página é exatamente quem repara na marca que faltou. */}
          {semCatalogo.length > 0 && (
            <p className="text-support mt-6 max-w-[52ch] text-pretty text-graphite">
              {semCatalogo.map((r) => r.nome).join(", ")}{" "}
              {semCatalogo.length === 1 ? "não declara" : "não declaram"} catálogo
              em fonte pública. A Belmare pergunta à fábrica.
            </p>
          )}
        </div>
      </section>

      <div className="px-5 pb-16 md:px-8 md:pb-24">
        <AcaoDeFecho
          rotulo="Pedir os catálogos num pedido só"
          contexto="queria os catálogos das representadas"
        />
      </div>
    </>
  );
}
