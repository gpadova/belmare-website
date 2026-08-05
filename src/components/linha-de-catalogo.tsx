import { Seta } from "@/components/icones";
import { pesoEmMB, type Catalogo } from "@/lib/representadas";

/**
 * Uma linha de catálogo — em `/catalogos` e na seção do catálogo da página de
 * marca, o mesmo componente.
 *
 * ⚠️ **É COMPARTILHADO DESDE A PRIMEIRA LINHA, E ISSO É DE PROPÓSITO.** O peso e
 * a edição são a promessa que a linha faz antes do clique, e promessa formatada
 * em dois lugares diverge: é assim que "24,0 MB" numa página vira "24MB" na
 * outra e o leitor deixa de acreditar nas duas. `/arquivos-3d` herda esta mesma
 * gramática — formato e tamanho declarados antes do clique, sempre.
 *
 * ⚠️ **UMA ESCRITA SÓ, E É ESSA A MUDANÇA DE 05/08/2026.** A linha teve duas até
 * aqui: baixava o PDF quando havia arquivo, e abria o WhatsApp quando não havia.
 * A segunda escrita tinha um terceiro estado que ninguém desenhou de propósito —
 * sem arquivo E sem número de WhatsApp cadastrado, ela virava um `<div>` com
 * título sublinhado e nenhum destino. Foi exatamente o que o cliente encontrou
 * na tela: três documentos anunciados para zero uploads, um deles parecendo
 * clicável e não sendo. Agora `Catalogo` só existe com arquivo, então a linha só
 * tem uma escrita e ela sempre abre. O pedido pelo WhatsApp virou a ação de
 * fecho da página, que é uma e funciona.
 *
 * ⚠️ **NÃO LINKA O SITE DA FÁBRICA.** A Trisol publica a edição 2026 para
 * download no site dela, e mandar o arquiteto para lá entrega o lead, o e-mail
 * comercial deles e a comissão de graça. O arquivo é servido daqui ou não é
 * servido.
 *
 * ⚠️ A mono carrega só medida e código — `PDF · 24,0 MB · 2026`. **Nome de
 * fábrica fica fora da mono versal**: a Regra da Caixa Alta cita "nome de
 * fábrica" pelo nome, e por isso a coluna da marca é grotesca caixa baixa.
 *
 * ⚠️ **NÃO É COMPONENTE DE SERVIDOR, e a fronteira importa.** A lista de
 * `/catalogos` filtra no navegador, então esta linha é desenhada do lado do
 * cliente. Ela não importa nada além do ícone e de duas funções puras — nenhum
 * `await`, nenhuma consulta ao painel. Trazer de volta uma leitura de cadastro
 * aqui dentro arrastaria o Payload inteiro para o grafo do cliente.
 */

/**
 * A grade da linha, exportada porque o cabeçalho de colunas de `/catalogos` tem
 * que assentar exatamente sobre ela. Escrita duas vezes, ela desalinha na
 * primeira mudança — e um cabeçalho que não cai sobre a própria coluna é pior
 * que cabeçalho nenhum.
 *
 * ⚠️ **DUAS GRADES, PORQUE SÃO DUAS TABELAS.** Em `/catalogos` a fábrica é uma
 * coluna própria — é por ela que a lista se organiza e é ela que o filtro
 * recorta. Na página da marca essa coluna não existe: a página inteira é dela, e
 * repetir "Trisol" em cada linha de uma tela que se chama Trisol é ruído. Uma
 * grade só, com a primeira coluna vazia na página da marca, deixaria um vão de
 * onze rem antes do título em toda linha.
 */
export const GRADE_DA_LINHA =
  "grid grid-cols-[minmax(0,1fr)_2rem] gap-x-4 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,13rem)_2rem] md:gap-x-8";

/** A mesma linha sem a coluna da fábrica — a da página de marca. */
export const GRADE_DA_LINHA_SEM_MARCA =
  "grid grid-cols-[minmax(0,1fr)_2rem] gap-x-4 md:grid-cols-[minmax(0,1fr)_minmax(0,13rem)_2rem] md:gap-x-8";

/**
 * O teto da lista.
 *
 * ⚠️ Sem ele, a coluna da direita estica até a margem e a linha abre centenas de
 * pixels de vão entre o título e a medida em 1440px. Isso não é "margem direita
 * aberta", que é regra de página: é buraco dentro de uma linha, e faz a tabela
 * parecer quebrada. O teto empacota título, medida e seta, e a sobra vira
 * margem.
 */
export const TETO_DA_LISTA = "max-w-[64rem]";

export function LinhaDeCatalogo({
  catalogo,
  marca,
}: {
  catalogo: Catalogo;
  /** O nome da fábrica, quando a lista atravessa várias. Na página da própria
   *  marca ele é omitido — ali a atribuição é a página inteira. */
  marca?: string;
}) {
  /* A medida termina no que se sabe: sem edição declarada ela para no peso, em
     vez de escrever a ausência. "EDIÇÃO NÃO DECLARADA" era o site contando ao
     arquiteto uma lacuna do cadastro da fábrica — informação de dentro da
     indústria, não do lado dele do balcão. */
  const medida = `PDF · ${pesoEmMB(catalogo.mb)} MB${
    catalogo.ano ? ` · ${catalogo.ano}` : ""
  }`;

  const grade = marca === undefined ? GRADE_DA_LINHA_SEM_MARCA : GRADE_DA_LINHA;

  return (
    <li className="border-b border-line">
      {/* ⚠️ **`download` SOZINHO NÃO BASTA, e por isso o `target` também está
          aqui.** O atributo é **ignorado em URL de outra origem**, e `arquivo` é
          URL de storage por decisão de infraestrutura — PDF pesado não vai para
          o git. Sem `target`, o clique navegaria para o visualizador do
          navegador e levaria o visitante para fora da página. O `download` fica
          porque volta a valer no dia em que o arquivo for servido da mesma
          origem. */}
      <a
        href={catalogo.arquivo}
        target="_blank"
        rel="noopener noreferrer"
        download
        className={`group ${grade} items-baseline gap-y-1 py-5 transition-colors hover:bg-surface`}
      >
        {/* ⚠️ **A FÁBRICA VEM PRIMEIRO NO DOM E SEGUNDA NA TELA DO TELEFONE, e
            as duas coisas são de propósito.** Em leitura linear "Trisol,
            Catálogo Geral, PDF 24,0 MB" é a ordem que responde à pergunta de
            quem está aqui. Já no telefone, onde a linha empilha, é o TÍTULO que
            precisa ficar em cima: é sobre ele que a seta se alinha, e uma seta
            centrada num rótulo de onze pixels lê como se apontasse para a
            fábrica em vez de para o arquivo. Por isso a colocação é explícita
            linha a linha, em vez de sair da ordem do markup. */}
        {marca !== undefined && (
          <span className="text-support col-start-1 row-start-2 text-graphite md:row-start-1">
            {marca}
          </span>
        )}

        <span
          className={`text-h3 col-start-1 row-start-1 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink ${
            marca === undefined ? "" : "md:col-start-2"
          }`}
        >
          {catalogo.titulo}
        </span>

        {/* No telefone a linha empilha e a medida cai colada no título. O
            respiro extra só existe abaixo de `md`, onde a coluna some.

            ⚠️ Sem `block`: a caixa de bloco alinha pela última linha do próprio
            conteúdo, e a medida assentava três pixels abaixo da linha de base do
            título ao lado. Numa tabela de uma linha por arquivo, três pixels de
            desalinho entre duas colunas é o que faz a coluna parecer torta. */}
        <span
          className={`mono col-start-1 mt-1 uppercase text-graphite md:row-start-1 md:mt-0 ${
            marca === undefined ? "row-start-2 md:col-start-2" : "row-start-3 md:col-start-3"
          }`}
        >
          {medida}
        </span>

        <Seta
          className={`col-start-2 row-start-1 h-3 w-8 self-center text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none ${
            marca === undefined ? "md:col-start-3" : "md:col-start-4"
          }`}
        />

        <span className="sr-only">(baixa o PDF)</span>
      </a>
    </li>
  );
}
