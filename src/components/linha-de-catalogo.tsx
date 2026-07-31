import { Seta } from "@/components/icones";
import {
  catalogoPublicado,
  pesoEmMB,
  type Catalogo,
  type Representada,
} from "@/lib/representadas";
import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";

/**
 * Uma linha de documento — em `/catalogos` e na seção "Para levar" da página de
 * marca, o mesmo componente.
 *
 * ⚠️ **É COMPARTILHADO DESDE A PRIMEIRA LINHA, E ISSO É DE PROPÓSITO.** O peso e
 * a edição são a promessa que a linha faz antes do clique, e promessa formatada
 * em dois lugares diverge: é assim que "24,0 MB" numa página vira "24MB" na
 * outra e o leitor deixa de acreditar nas duas. `/arquivos-3d` herda esta mesma
 * gramática — formato e tamanho declarados antes do clique, sempre.
 *
 * ⚠️ **DUAS ESCRITAS DA MESMA LINHA, e a diferença é o destino.**
 *
 *   publicado → `<a download>` para o PDF
 *   a pedir   → WhatsApp com o documento e a fábrica no contexto
 *
 * Nenhuma das duas diz "em breve" e nenhuma diz "aguarde". A segunda declara o
 * que existe e quem entrega — e é o funil real, não um consolo: todo lead passa
 * pela Belmare, e um pedido com a marca nomeada é o contato mais qualificado que
 * este site produz hoje. Preencher `arquivo` e `mb` vira a primeira na segunda
 * sem tocar em uma linha de layout.
 *
 * ⚠️ **NENHUMA DAS DUAS LINKA O SITE DA FÁBRICA.** A Trisol publica a edição
 * 2026 para download no site dela, e mandar o arquiteto para lá entrega o lead,
 * o e-mail comercial deles e a comissão de graça.
 *
 * ⚠️ A mono carrega só medida e código — `PDF · 24,0 MB · 2026`, `EDIÇÃO 2026`.
 * "Envio pela Belmare" é frase, e frase em mono versal é grito: vai em support,
 * caixa baixa, grafite. **Nome de fábrica também fica fora da mono versal**: a
 * Regra da Caixa Alta cita "nome de fábrica" pelo nome, e aqui ele nem precisa
 * de linha própria — entra dentro do título do documento.
 *
 * ⚠️ **O TÍTULO QUALIFICA COM A MARCA QUANDO A PÁGINA NÃO É DELA.** A primeira
 * versão punha "Catálogo" no corpo maior e a fábrica em mono pequena embaixo — e
 * as três linhas ficaram com a mesma palavra em h3, com a única informação que
 * as distinguia rebaixada a 11px. O leitor voltava a ler a lista pela marca, que
 * é exatamente a quarta enumeração que esta rota existe para não ser. "Catálogo
 * Trisol" é o nome do documento e não inventa nada: as duas metades já estão no
 * dado. Na página da própria marca a qualificação sai, porque ali ela é ruído.
 */
/**
 * A grade da linha, exportada porque o cabeçalho de colunas de `/catalogos` tem
 * que assentar exatamente sobre ela. Escrita duas vezes, ela desalinha na
 * primeira mudança — e um cabeçalho que não cai sobre a própria coluna é pior
 * que cabeçalho nenhum.
 */
export const GRADE_DA_LINHA =
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
export const TETO_DA_LISTA = "max-w-[52rem]";

export async function LinhaDeCatalogo({
  catalogo,
  representada,
  mostrarMarca = false,
}: {
  catalogo: Catalogo;
  representada: Representada;
  /** Na página da marca a atribuição é redundante — a página inteira é dela. */
  mostrarMarca?: boolean;
}) {
  const publicado = catalogoPublicado(catalogo);
  const { whatsapp } = await buscarEmpresa();

  const titulo = mostrarMarca
    ? `${catalogo.titulo} ${representada.nome}`
    : catalogo.titulo;

  /* Publicado sem edição conhecida termina na medida e para. Emendar "EDIÇÃO
     NÃO DECLARADA" no fim de `PDF · 24,0 MB ·` enfia uma frase dentro de uma
     string de código, e ainda escreve em versal o que a linha a pedir escreve
     sozinho — dois pesos para o mesmo dado ausente. */
  const medida = publicado
    ? `PDF · ${pesoEmMB(catalogo.mb)} MB${catalogo.ano ? ` · ${catalogo.ano}` : ""}`
    : catalogo.ano
      ? `Edição ${catalogo.ano}`
      : "Edição não declarada";

  /* O contexto nomeia o documento E a fábrica: quem responde do outro lado sabe
     qual arquivo anexar sem precisar perguntar. */
  const destino = publicado
    ? catalogo.arquivo
    : linkDeWhatsapp(
        whatsapp,
        `queria o catálogo da ${representada.nome}${catalogo.ano ? `, edição ${catalogo.ano}` : ""}`,
      );

  /* ⚠️ Um catálogo a pedir SEM número de WhatsApp cadastrado vira linha sem
     link, não linha com link quebrado: o documento e a edição continuam
     declarados — que é a informação —, e o gesto de clicar some junto com o
     destino que não existe. Prometer um canal que não abre é pior do que
     declarar o documento e parar aí. */

  /* ⚠️ AS DUAS ESCRITAS SAEM DO SITE, e por isso as duas abrem em aba nova.
     `download` sozinho não basta no caso publicado: o atributo é **ignorado em
     URL de outra origem**, e `arquivo` é URL de storage por decisão de
     infraestrutura — PDF pesado não vai para o git. Sem `target`, o dia em que o
     primeiro catálogo chegar o clique deixa de baixar, navega para o visualizador
     do navegador e leva o visitante para fora da página, sem sintoma nenhum em
     revisão porque hoje não há arquivo publicado para testar. O `download` fica
     porque volta a valer no dia em que o arquivo for servido da mesma origem. */
  const conteudo = (
    <>
      <span className="text-h3 col-start-1 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
        {titulo}
      </span>

      {/* No telefone a linha empilha e a medida cai colada no título. O
          respiro extra só existe abaixo de `md`, onde a coluna some. */}
      <span className="col-start-1 mt-1 md:col-start-2 md:mt-0">
        <span className="mono block uppercase text-graphite">{medida}</span>
        {/* Só o estado que exige explicação escreve uma. A linha publicada
            fica com a medida sozinha, e é assim que ela lê como resolvida. */}
        {!publicado && (
          <span className="text-support mt-1 block text-graphite">
            Envio pela Belmare
          </span>
        )}
      </span>

      {destino !== undefined && (
        <Seta
          className={`col-start-2 row-start-1 h-3 w-8 self-center transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none md:col-start-3 ${
            publicado ? "text-ink" : "text-graphite group-hover:text-ink"
          }`}
        />
      )}

      {/* Quem não enxerga a diferença entre uma linha que baixa e uma que
          pede precisa ouvi-la: as duas são o mesmo markup e o mesmo gesto. */}
      {destino !== undefined && (
        <span className="sr-only">
          {publicado ? "(abre o PDF)" : "(abre o WhatsApp)"}
        </span>
      )}
    </>
  );

  return (
    <li className="border-b border-line">
      {destino === undefined ? (
        <div className={`${GRADE_DA_LINHA} items-baseline gap-y-2 py-5`}>
          {conteudo}
        </div>
      ) : (
        <a
          href={destino}
          target="_blank"
          rel="noopener noreferrer"
          {...(publicado ? { download: true } : {})}
          className={`group ${GRADE_DA_LINHA} items-baseline gap-y-2 py-5 transition-colors hover:bg-surface`}
        >
          {conteudo}
        </a>
      )}
    </li>
  );
}
