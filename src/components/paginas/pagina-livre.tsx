import { FaixaDeAcao } from "@/components/faixa-de-acao";
import { BlocoCaminhos } from "@/components/paginas/caminhos";
import { BlocoFicha } from "@/components/paginas/ficha-belmare";
import { BlocoProsa } from "@/components/paginas/prosa";
import { linkDeWhatsapp, type Empresa } from "@/lib/empresa";
import { rotuloDaRotaLivre, type Bloco, type PaginaLivre } from "@/lib/paginas";

/**
 * A página livre desenhada — o cabeçalho fixo e a composição do painel.
 *
 * ⚠️ **UMA PÁGINA LIVRE TEM ESPINHA, E ELA TEM DUAS LINHAS.** Sobretítulo em
 * mono e `h1`, na mesma abertura de `/catalogos`. O sobretítulo é **gerado** do
 * registro de rotas (`lib/site.ts#ROTAS_LIVRES`) e não é campo: ele nomeia a
 * ROTA, e a rota é decisão de código. O `h1` é campo, ao contrário do da home —
 * aqui não há argumento de desenho a proteger, que é justamente o critério pelo
 * qual estas três rotas viraram páginas livres e a home não.
 *
 * ⚠️ **TODO ESTE COMPONENTE É SÍNCRONO E NÃO LÊ NADA — E ISSO É O QUE FAZ O
 * LIVE PREVIEW EXISTIR.** A composição e o cadastro da empresa entram por
 * parâmetro. No site publicado quem os lê é a rota; no iframe do painel quem
 * fornece a composição é o hook de live preview, a cada mudança de campo, sem
 * nenhuma ida ao servidor — e é por isso que arrastar um bloco redesenha o
 * quadro na hora. Um único componente serve os dois mundos: se a composição
 * fosse desenhada por dois caminhos diferentes, o preview passaria a mostrar
 * uma página que o site não publica, que é o pior defeito possível num preview.
 *
 * ⚠️ **O `switch` É EXAUSTIVO, E O `satisfies never` É O AVISO.** Um bloco novo
 * na biblioteca sem caso aqui vira erro de build, nunca um vão silencioso na
 * página. É também onde PRA-126 entra: o caminho de formulário é um caso novo
 * dentro de `BlocoCaminhos`, não um bloco novo aqui.
 */
export function PaginaLivreDesenhada({
  pagina,
  empresa,
}: {
  pagina: PaginaLivre;
  empresa: Empresa;
}) {
  return (
    <>
      <section className="px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-20">
        <p className="mono uppercase text-graphite">
          {rotuloDaRotaLivre(pagina.slug)}
        </p>
        <h1 className="text-h1 mt-5 max-w-[20ch] font-normal text-balance">
          {pagina.titulo}
        </h1>
      </section>

      {pagina.composicao.map((bloco, i) => (
        /* O índice entra na chave porque a mesma página pode ter dois blocos de
           texto sem título — dois blocos idênticos em conteúdo são um arranjo
           legítimo, e nada mais neles distingue um do outro. */
        <BlocoDesenhado
          key={`${bloco.tipo}-${i}`}
          bloco={bloco}
          empresa={empresa}
          pagina={pagina.slug}
        />
      ))}
    </>
  );
}

function BlocoDesenhado({
  bloco,
  empresa,
  pagina,
}: {
  bloco: Bloco;
  empresa: Empresa;
  /** O endereço da rota, para o bloco de caminhos gravar a origem do lead. */
  pagina: string;
}) {
  switch (bloco.tipo) {
    case "prosa":
      return <BlocoProsa titulo={bloco.titulo} corpo={bloco.corpo} />;
    case "caminhos":
      return (
        <BlocoCaminhos
          titulo={bloco.titulo}
          itens={bloco.itens}
          empresa={empresa}
          pagina={pagina}
        />
      );
    case "ficha":
      return <BlocoFicha titulo={bloco.titulo} empresa={empresa} />;
    /* ⚠️ A ação de fecho NÃO entra numa `SecaoLivre`: ela já traz o próprio fio
       em tinta em cima e embaixo, e um fio de divisor logo acima do fio de tinta
       são dois traços paralelos a 28px de distância — a mesma leitura de
       "pendência" que o número sem fio de `/quem-somos` produzia. O respiro é o
       mesmo do fecho de `/catalogos`. */
    case "fecho":
      return (
        <div className="px-5 pt-4 pb-16 md:px-8 md:pt-8 md:pb-24">
          <FaixaDeAcao
            rotulo={bloco.rotulo}
            link={linkDeWhatsapp(empresa.whatsapp, bloco.contexto)}
          />
        </div>
      );
    default:
      return bloco satisfies never;
  }
}
