import type { Metadata } from "next";
import Link from "next/link";

import { AcaoDeFecho } from "@/components/acao-de-fecho";
import { ListaDeArquivos3D } from "@/components/arquivos-3d/lista-de-arquivos";
import { PacoteCompleto } from "@/components/arquivos-3d/pacote-completo";
import { Seta } from "@/components/icones";
import { arquivos3DDoSite, totalDeArquivos3D } from "@/lib/arquivos3d";
import { buscarBiblioteca3D, buscarPacote3D } from "@/lib/arquivos3d-consulta";
import { emLista } from "@/lib/frase";

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
        ? "Os arquivos 3D das fábricas de móveis para área externa representadas pela Belmare. A biblioteca está sendo montada. Peça o bloco e o formato pelo WhatsApp e ele chega direto de quem representa as quatro fábricas no Sul do Brasil."
        : `Os arquivos 3D de ${marcas}, com formato e peso declarados antes do clique e sem cadastro para baixar. Blocos para especificar móveis para área externa, de quem representa as fábricas no Sul do Brasil.`,
  };
}

/**
 * `/arquivos-3d` — a biblioteca.
 *
 * ⚠️ **ESTA ROTA FOI REFEITA EM 05/08/2026 PARA SER A MESMA PÁGINA QUE
 * `/catalogos`, E A REFORMA REVERTE TRÊS DECISÕES DECLARADAS DA PRIMEIRA
 * VERSÃO.** Não são ajustes de layout; são inversões, e ficam escritas aqui
 * porque a versão anterior deixou os argumentos dela no mesmo lugar. As duas
 * rotas são índices de arquivo, e a promessa que elas fazem desde que a segunda
 * existe — "um arquiteto que aprendeu a ler uma não reaprende nada na outra" —
 * não estava sendo cumprida: uma tinha filtro e lista plana, a outra tinha
 * coluna de argumento e blocos empilhados.
 *
 * **1. A coluna de argumento saiu inteira.** Ela explicava o que a biblioteca é
 * e o que ela não cobra. É a mesma coluna que `/catalogos` deletou, e pelo mesmo
 * motivo: nenhuma linha dela ajuda quem chegou querendo um bloco. As duas frases
 * que interessavam desceram — "todos baixam sem cadastro" para a linha de
 * contagem, e a saída para os catálogos para baixo da lista.
 *
 * **2. A lista é plana, e a fábrica virou coluna.** Ela era agrupada por `<h2>`
 * de fábrica e, dentro dele, `<h3>` de formato. Os dois eixos não sumiram:
 * viraram os dois eixos do filtro. Ver a nota de topo de
 * `components/arquivos-3d/lista-de-arquivos.tsx`, onde as duas razões que
 * sustentavam o agrupamento estão respondidas uma a uma.
 *
 * **3. O filtro por formato existe.** A primeira versão o recusava por escrito,
 * em três arquivos. As duas razões da recusa continuam certas sobre o filtro que
 * elas viram, e nenhuma delas alcança este — a demonstração está por extenso em
 * `lib/arquivos3d.ts#recortesDeFormato`, e o resumo é que **filtrar na tela não
 * é filtrar na consulta**. `buscarBiblioteca3D` não mudou uma linha.
 *
 * ⚠️ **A DECISÃO QUE ESTA PÁGINA CARREGA CONTINUA INTEIRA: O ARQUIVO AVULSO NÃO
 * PEDE CADASTRO;
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
 * A sequência, que é a de `/catalogos` mais a seção que só esta rota tem:
 *
 *   Cabeçalho        o que é a página, em uma linha
 *   Filtro           fábrica e formato, com a contagem de cada recorte
 *   Lista            os arquivos, planos, com a fábrica na primeira coluna
 *   Saída            o que o bloco não traz, e onde isso está
 *   Seção do pacote  o único download com cadastro
 *   Fecho            o pedido pelo WhatsApp
 *
 * ⚠️ **NENHUMA CONSULTA PEDE ARQUIVOS DE DUAS FÁBRICAS AO MESMO TEMPO, E O
 * FILTRO NOVO NÃO ABRIU ESSA PORTA.** O princípio 2 do `PRODUCT.md` continua
 * inteiro: `buscarBiblioteca3D` é N leituras escopadas por `representada.slug`,
 * e a única coisa que atravessa as marcas é a ordem em que elas aparecem na
 * tela. Ver a nota em `lib/arquivos3d-consulta.ts`.
 *
 * ⚠️ **CONTINUA SEM UMA ÚNICA IMAGEM, e continua sendo decisão.** Numa rota em
 * que o visitante veio buscar um arquivo, fotografia de ambiente é ruído entre
 * ele e o arquivo. E um bloco 3D não tem miniatura honesta: o que apareceria ali
 * é um render, e render de bloco promete um acabamento que o `.skp` não carrega.
 *
 * ⚠️ **BIBLIOTECA VAZIA NÃO É PÁGINA EM BRANCO, e não é "em breve".** Mesma
 * saída de `/catalogos`: o estado do acervo É o dado. Sem arquivo nenhum a
 * página diz o que existe hoje — a Belmare manda o bloco por WhatsApp — em vez
 * de desenhar filtro, cabeçalho de colunas e tabela sobre nada (seção anulável,
 * `CONTEXT.md`).
 */
/* O contrato de direção desta rota, no HTML construído para poder ser auditado
   depois do build. Só decisão de design entra aqui; o rastro de processo vive
   em `.impeccable/surfaces/`. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: O arquivo avulso é aberto e o pacote é o que se paga. A página gateia
exatamente uma coisa — as quatro fábricas juntas —, porque é a única que a
Casoca não tem; gatear o resto doaria o lead em vez de capturá-lo. A lista é
plana, a linha é o arquivo, e os dois eixos que existem (fábrica e formato) são
filtro, não cabeçalho: um clique em SKP dá os .skp das quatro fábricas, que é o
que agrupar por formato dentro da marca nunca deu.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0 — e aqui, imagem 0, como em /catalogos.
Tipografia e fio sozinhos: rótulo de eixo em mono à esquerda das filas de
recorte, cabeçalho de colunas em mono, linhas regradas com medida à direita, e o
recorte ativo marcado por um fio de 1px em tinta sob o nome.
STORY: o arquiteto vê tudo o que existe, encurta para a fábrica dele ou para o
formato que ele abre em um clique, vê o que custa cada download em MB, baixa sem
dar nada, e decide se o conjunto vale um cadastro.
FIRST VIEWPORT: uma coluna de largura total — rótulo em mono, h1 de uma linha,
as duas filas de recorte rotuladas, o cabeçalho de colunas e as linhas de
arquivo com seta na ponta.
FORM: "o índice de documentos" de /catalogos, herdado e agora igual — mesma
gramática de linha, mesma sequência, um eixo de filtro a mais.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function Arquivos3D() {
  const [biblioteca, pacote] = await Promise.all([
    buscarBiblioteca3D(),
    buscarPacote3D(),
  ]);

  /* Uma leitura só, achatada em lista uma vez. A ordem inteira — fábrica, peça,
     formato — é decidida em `arquivos3DDoSite`, que é pura e testada. */
  const lista = arquivos3DDoSite(biblioteca);

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />

      <section
        aria-labelledby="arquivos-3d"
        className="px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-20"
      >
        <p className="mono uppercase text-graphite">Arquivos 3D</p>

        {/* ⚠️ **O H1 MUDA COM O ESTADO DO ACERVO, e as duas escritas são
            verdadeiras onde aparecem** — a mesma regra de `/catalogos`. "Baixe
            o bloco de cada peça" sobre uma lista vazia é uma promessa quebrada;
            sem arquivo nenhum, o que a página de fato oferece é o pedido, e o
            fecho lá embaixo é o gesto que o cumpre. */}
        <h1
          id="arquivos-3d"
          className="text-h1 mt-5 max-w-[20ch] font-normal text-balance"
        >
          {lista.length === 0
            ? "Peça o bloco que falta no seu projeto."
            : "Baixe o bloco de cada peça."}
        </h1>

        <div className="mt-10 md:mt-12">
          {lista.length === 0 ? (
            /* ⚠️ Nem lista vazia, nem "em breve", nem travessão em célula — a
               mesma recusa de `/catalogos`. O que existe hoje é o canal, e o
               canal é dito por extenso. O fecho da página é o gesto; este
               parágrafo é a explicação. */
            <p className="text-body max-w-[52ch] text-pretty text-graphite">
              Ainda não há arquivo publicado aqui. As fábricas disponibilizam
              blocos, e a Belmare pede o que faltar direto a elas. Diga qual é a
              peça e em que formato o seu projeto usa.
            </p>
          ) : (
            <ListaDeArquivos3D lista={lista} />
          )}
        </div>

        {/* ⚠️ **A SAÍDA SECUNDÁRIA DESCEU DA COLUNA DA ESQUERDA PARA CÁ, e é o
            único pedaço daquela coluna que sobreviveu.** Ela não é argumento: é
            a resposta à pergunta que a própria lista levanta — o arquiteto que
            acabou de baixar um `.skp` ainda não tem a cota nem o acabamento, e
            precisa saber que essas duas coisas existem em outro lugar do site.
            Depois da lista, e não antes, porque antes ela é um link para fora da
            página oferecido a quem ainda não viu o que veio ver. `/catalogos`
            não tem uma equivalente, e é por isso que a sequência das duas rotas
            não é idêntica: só uma delas manda o leitor para a outra. */}
        <div className="mt-16 max-w-[64rem]">
          <p className="text-support max-w-[46ch] text-pretty text-graphite">
            O bloco não traz a ficha cotada nem o acabamento. Essas duas coisas
            estão no catálogo de cada fábrica.
          </p>
          <Link
            href="/catalogos"
            className="mono uppercase group mt-5 inline-flex items-center gap-3 text-ink"
          >
            Ver os catálogos
            <Seta className="h-3 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
          </Link>
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
            lista.length === 0
              ? "Pedir um bloco 3D"
              : "Pedir um arquivo que não está aqui"
          }
          contexto="queria um arquivo 3D de uma das representadas"
        />
      </div>
    </>
  );
}
