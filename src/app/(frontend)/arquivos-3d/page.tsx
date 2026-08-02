import type { Metadata } from "next";
import Link from "next/link";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import {
  GRADE_DO_ARQUIVO,
  LinhaDeArquivo3D,
  TETO_DA_BIBLIOTECA,
} from "@/components/arquivos-3d/linha-de-arquivo";
import { PacoteCompleto } from "@/components/arquivos-3d/pacote-completo";
import { Seta } from "@/components/icones";
import { arquivosPorFormato, totalDeArquivos3D } from "@/lib/arquivos3d";
import { buscarBiblioteca3D, buscarPacote3D } from "@/lib/arquivos3d-consulta";
import { comInicialMaiuscula, emLista, porExtenso } from "@/lib/frase";

/**
 * ⚠️ **A DESCRIÇÃO SAI DO DADO, PELA MESMA RAZÃO DE `/catalogos`.** É o texto
 * que o arquiteto lê no Google — a única superfície do site que aparece antes
 * do site — e a primeira redação óbvia ("os blocos 3D das quatro fábricas, em
 * SketchUp, DWG, Revit e 3ds") é falsa hoje em todas as suas partes: não há um
 * único arquivo cadastrado, e nenhum formato foi confirmado. Prometer no
 * resultado de busca o que a própria página desmente é a pior versão de
 * inventar dado, porque quem clica chega já desmentido.
 *
 * ⚠️ E ela **não** promete "sem cadastro" quando não há o que baixar: a frase
 * que diferencia a Belmare da Casoca só vale a partir do primeiro arquivo em
 * disco.
 */
export async function generateMetadata(): Promise<Metadata> {
  const biblioteca = await buscarBiblioteca3D();
  const total = totalDeArquivos3D(biblioteca);
  const marcas = emLista(biblioteca.map((grupo) => grupo.marca.nome));

  return {
    title: "Arquivos 3D",
    description:
      total === 0
        ? "Os arquivos 3D das fábricas de mobiliário de área externa representadas pela Belmare. A biblioteca está sendo montada — peça o bloco e o formato pelo WhatsApp e ele chega direto de quem representa as quatro fábricas no Sul do Brasil."
        : `Os arquivos 3D de ${marcas}, com formato e peso declarados antes do clique e sem cadastro para baixar. Blocos para especificar mobiliário de área externa, de quem representa as fábricas no Sul do Brasil.`,
  };
}

/**
 * `/arquivos-3d` — a biblioteca, e a última rota que faltava.
 *
 * É **espinha fixa**, não página livre: a sequência abaixo é o argumento, e o
 * argumento é uma inversão econômica que um construtor de blocos desfaria numa
 * tarde de edição. Mesma família de `/catalogos`, e de propósito — as duas são
 * índices de arquivo, e um arquiteto que aprendeu a ler uma tem que reconhecer
 * a outra sem reaprender nada.
 *
 * ⚠️ **A DECISÃO QUE ESTA PÁGINA CARREGA: O ARQUIVO AVULSO NÃO PEDE CADASTRO;
 * SÓ O PACOTE COMPLETO PEDE.** Ela reverte a recomendação do briefing (P11,
 * `briefing/audiencias.md`: "cadastro leve em troca do pacote 3D") na parte que
 * o próprio briefing desmente três parágrafos abaixo. A **Casoca** é gratuita,
 * dominante no Brasil e **já distribui a GDA**. Um formulário na frente de um
 * bloco que a Casoca entrega sem pedir nada não captura o lead — **doa** o
 * lead: a pessoa fecha a aba, baixa do outro lado, e o que fica é que a Belmare
 * cobra pedágio. O gate migra inteiro para a única coisa que a Casoca
 * estruturalmente não tem — as quatro fábricas juntas, com acabamentos e
 * tecidos, num download só (`components/arquivos-3d/pacote-completo.tsx`).
 *
 * É também o princípio 5 do `PRODUCT.md` aplicado sem desconto: "ficha aberta
 * sem cadastro, arquivo com formato e peso declarados antes do clique, e nada
 * que encante na primeira visita e irrite na décima". O arquiteto volta muitas
 * vezes; um formulário por download é o que irrita na décima.
 *
 * A sequência:
 *
 *   Coluna esquerda   o que é a biblioteca, e o que ela não cobra
 *   Coluna direita    os arquivos, agrupados por fábrica e por formato
 *   Seção do pacote   o único download com cadastro
 *   Fecho             o pedido pelo WhatsApp
 *
 * ⚠️ **AGRUPAR POR REPRESENTADA NÃO É FILTRAR POR REPRESENTADA.** O princípio 2
 * do `PRODUCT.md` continua inteiro: nenhuma consulta pede arquivos de duas
 * fábricas ao mesmo tempo — `buscarBiblioteca3D` é N leituras escopadas por
 * `representada.slug`, e a única coisa que atravessa as marcas é a ordem em que
 * elas aparecem na tela. Ver a nota em `lib/arquivos3d-consulta.ts`.
 *
 * ⚠️ **O FORMATO É O SEGUNDO EIXO DO AGRUPAMENTO — dentro de cada fábrica, e
 * nunca por cima delas.** A mesma peça vem em `.skp` e em `.dwg`, e numa lista
 * plana as duas linhas têm o mesmo nome: quem só abre SketchUp lê tudo para
 * achar metade. `lib/arquivos3d.ts#arquivosPorFormato` é puro e recebe os
 * arquivos de UMA fábrica que a consulta escopada já devolveu — agrupar de novo
 * não abre nenhuma leitura sem pai.
 *
 * ⚠️ **O FILTRO POR FORMATO, ESSE NÃO EXISTE, e a ausência é decisão.**
 * `briefing/prompt-paper.md` desenha "SKETCHUP · DWG · REVIT · 3DS" no topo.
 * Ele é o eixo transversal que a decisão 10 já matou uma vez para material, com
 * o mesmo argumento e o mesmo dado: **nenhuma estrutura do site deve depender
 * de dado que as fábricas não têm**, e hoje não há um único formato confirmado
 * em nenhuma das quatro. Um filtro de quatro botões sobre zero arquivo é a
 * matriz vazia de novo. E ele exigiria a consulta sem pai que a nota acima
 * recusa. Quando existirem arquivos, `formato` já é gerado e o filtro cabe
 * dentro de um grupo — nunca por cima deles.
 *
 * ⚠️ **BIBLIOTECA VAZIA NÃO É PÁGINA EM BRANCO, e não é "em breve".** Mesma
 * saída de `/catalogos`: o estado do acervo É o dado. Sem arquivo nenhum a
 * página diz o que existe hoje — a Belmare manda o bloco por WhatsApp — em vez
 * de desenhar quatro cabeçalhos de marca sobre nada (seção anulável,
 * `CONTEXT.md`).
 */
/* O contrato de direção desta rota, no HTML construído para poder ser auditado
   depois do build. Só decisão de design entra aqui; o rastro de processo vive
   em `.impeccable/surfaces/`. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: O arquivo avulso é aberto e o pacote é o que se paga. A página gateia
exatamente uma coisa — as quatro fábricas juntas —, porque é a única que a
Casoca não tem; gatear o resto doaria o lead em vez de capturá-lo.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0 — e aqui, imagem 0, como em /catalogos. Fio
vertical de altura total separando argumento de lista; medida em mono à direita
de cada linha.
STORY: o arquiteto vê o que existe, o que custa cada clique em MB, baixa o que
precisa sem dar nada, e decide se o conjunto vale um cadastro.
FIRST VIEWPORT: duas colunas partidas por fio vertical — à esquerda rótulo em
mono, h1 de duas linhas, parágrafo e saída secundária; à direita o cabeçalho de
colunas e os arquivos agrupados por fábrica e, dentro dela, por formato.
FORM: "o índice de documentos" de /catalogos, herdado — a gramática é a mesma e
o reconhecimento entre as duas rotas é o objetivo.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function Arquivos3D() {
  const [biblioteca, pacote] = await Promise.all([
    buscarBiblioteca3D(),
    buscarPacote3D(),
  ]);

  const total = totalDeArquivos3D(biblioteca);

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />

      {/* `flex` no telefone, `grid` a partir de `md` — mesma razão de
          `/catalogos`: em grid a saída secundária linearizava ANTES da lista, e
          quem abre no telefone encontrava o link para fora da página antes do
          primeiro arquivo. */}
      <section
        aria-labelledby="arquivos-3d"
        className="flex flex-col px-5 pt-12 pb-14 md:grid md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:px-8 md:pt-16 md:pb-20"
      >
        <div className="contents md:flex md:flex-col md:pr-8">
          <p className="mono uppercase text-graphite">Arquivos 3D</p>

          <h1
            id="arquivos-3d"
            className="text-h1 mt-5 max-w-[16ch] font-normal text-balance"
          >
            O bloco entra no projeto hoje.
          </h1>

          <p className="text-body mt-6 max-w-[44ch] text-pretty text-graphite">
            {total === 0
              ? "A Belmare está reunindo os arquivos das quatro fábricas. Enquanto eles não estão aqui, ela manda o bloco no formato que o seu projeto pede."
              : "Formato e peso antes do clique, e nenhum formulário no caminho: quem está em obra decide se o toque cabe no sinal que tem."}
          </p>

          <div className="order-last mt-16 md:order-none md:mt-auto md:pt-16">
            <p className="text-support max-w-[40ch] text-pretty text-graphite">
              A ficha cotada e o acabamento não vêm no bloco — eles estão no
              catálogo de cada fábrica.
            </p>
            <Link
              href="/catalogos"
              className="mono uppercase group mt-5 inline-flex items-center gap-3 text-ink"
            >
              Ver os catálogos
              <Seta className="h-3 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>

        {/* A coluna da lista. O fio vertical é a borda dela, e por isso tem
            exatamente a altura da linha da grade — sem altura escrita à mão. */}
        <div className="mt-12 md:mt-0 md:border-l md:border-line md:pl-8">
          {biblioteca.length === 0 ? (
            /* ⚠️ Nem lista vazia, nem "em breve", nem travessão em célula — a
               mesma recusa de `/catalogos`. O que existe hoje é o canal, e o
               canal é dito por extenso. O fecho da página, logo abaixo, é o
               gesto; este parágrafo é a explicação. */
            <p className="text-body max-w-[52ch] text-pretty text-graphite">
              Nenhum arquivo está em disco ainda. As quatro fábricas
              disponibilizam blocos, e a Belmare pede o que faltar direto a
              elas — diga a peça e o formato que o seu projeto usa.
            </p>
          ) : (
            <>
              {/* Cabeçalho de colunas de verdade, não rótulo decorativo: cada
                  label assenta sobre a coluna que nomeia. No telefone a linha
                  empilha e só ARQUIVO faz sentido, porque FORMATO E PESO
                  nomearia uma coluna que ali não existe. */}
              <div
                aria-hidden
                className={`mono ${GRADE_DO_ARQUIVO} ${TETO_DA_BIBLIOTECA} border-b border-line pb-3 uppercase text-graphite`}
              >
                <span>Arquivo</span>
                <span className="hidden md:block">Formato e peso</span>
              </div>

              {biblioteca.map(({ marca, arquivos }) => (
                /* ⚠️ A fábrica sem arquivo nenhum não chega aqui — ela é
                   descartada em `bibliotecaPorRepresentada`, para não abrir um
                   cabeçalho sobre uma lista sem células. */
                <section
                  key={marca.slug}
                  aria-labelledby={`marca-${marca.slug}`}
                  className={`${TETO_DA_BIBLIOTECA} mt-12 first:mt-8`}
                >
                  {/* ⚠️ **GROTESCA, CAIXA BAIXA — A REGRA DA CAIXA ALTA CITA
                      "NOME DE FÁBRICA" PELO NOME.** A primeira escrita desta
                      linha era `mono uppercase`, que é exatamente a violação
                      que o DESIGN.md registra ter acontecido uma vez e sido
                      corrigida em `/catalogos`. Versal é para medida, código,
                      sigla e rótulo de campo — o cabeçalho de colunas logo
                      acima é um deles. Nome próprio fica fora POR CURTO QUE
                      SEJA. E aqui a correção não podia ser "apagar a linha",
                      como foi lá: sem o nome da fábrica, "Cadeira Zuri" não diz
                      de quem é, e a página é agrupada por marca de propósito.
                      Então a caixa é que muda — `text-h2` põe o grupo um degrau
                      acima do `text-h3` das linhas, que é a hierarquia real. */}
                  <h2
                    id={`marca-${marca.slug}`}
                    className="text-h2 font-normal"
                  >
                    {marca.nome}
                  </h2>

                  {/* ⚠️ O SEGUNDO EIXO DO AGRUPAMENTO. A mesma peça vem em
                      `.skp` e em `.dwg`, e numa lista plana as duas linhas
                      levam o mesmo nome, separadas por tudo que estiver entre
                      elas no alfabeto — quem só abre SketchUp lê a lista
                      inteira para achar metade dela. Agrupar por formato é
                      TypeScript puro sobre o que a consulta escopada já
                      devolveu (`lib/arquivos3d.ts#arquivosPorFormato`); o
                      filtro transversal do briefing continua não existindo,
                      pelas razões da nota de topo. */}
                  {arquivosPorFormato(arquivos).map(
                    ({ formato, arquivos: doFormato }) => (
                      <div
                        key={`${marca.slug}-${formato}`}
                        className="mt-8 first:mt-4"
                      >
                        {/* ⚠️ Versal aqui NÃO é a violação que o `h2` acima
                            corrigiu: a Regra da Caixa Alta reserva mono
                            caixa-alta para medida, código, **sigla** e rótulo
                            de campo. "Trisol" é nome próprio e fica em
                            grotesca; "SKP" é sigla, e é o mesmo desenho da
                            medida que ela nomeia na coluna ao lado. */}
                        <h3 className="mono uppercase text-graphite">
                          {formato}
                        </h3>

                        <ul className="mt-3 border-t border-line">
                          {doFormato.map((arquivo) => (
                            <LinhaDeArquivo3D
                              key={`${marca.slug}-${formato}-${arquivo.nome}`}
                              arquivo={arquivo}
                            />
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </section>
              ))}

              {/* A contagem é **gerada** — `lib/frase.ts`, a mesma regra de toda
                  contagem em prosa do site. Um número escrito à mão aqui
                  continuaria dizendo o do primeiro lote no dia do segundo. */}
              <p
                className={`text-support ${TETO_DA_BIBLIOTECA} mt-8 text-pretty text-graphite`}
              >
                {comInicialMaiuscula(porExtenso(total, "m"))}{" "}
                {total === 1 ? "arquivo" : "arquivos"} de{" "}
                {porExtenso(biblioteca.length)}{" "}
                {biblioteca.length === 1 ? "fábrica" : "fábricas"}. Todos abrem
                sem cadastro.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ⚠️ **A SEÇÃO INTEIRA SOME SEM PACOTE PUBLICADO, E O FORMULÁRIO SOME
          COM ELA.** Não é degradação de layout: é a garantia de que o site
          nunca pede nome, e-mail, cidade e escritório em troca de um arquivo
          que não existe. Hoje é o estado real — nenhum pacote foi montado. */}
      {pacote !== undefined && <PacoteCompleto pacote={pacote} />}

      <div className="px-5 pb-16 md:px-8 md:pb-24">
        <AcaoDeFecho
          rotulo={
            total === 0 ? "Pedir um bloco 3D" : "Pedir um arquivo que não está aqui"
          }
          contexto="queria um arquivo 3D de uma das representadas"
        />
      </div>
    </>
  );
}
