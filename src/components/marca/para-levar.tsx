import {
  LinhaDeCatalogo,
  TETO_DA_LISTA,
} from "@/components/linha-de-catalogo";
import { SecaoDaMarca } from "@/components/marca/secao";
import type { Representada } from "@/lib/representadas";

/**
 * Para levar — os catálogos da marca.
 *
 * ⚠️ **A SEÇÃO É ANULÁVEL, e a condição ficou de novo a mais simples possível:
 * ela existe quando há PDF para baixar.** Houve um período em que "ter catálogo"
 * e "ter o arquivo" eram condições diferentes — a fábrica declarava o documento,
 * a Belmare ainda não o tinha, e a linha virava um pedido pelo WhatsApp. Isso
 * caiu em 05/08/2026 junto com a reforma de `/catalogos`: um catálogo é um
 * arquivo, e o que não está hospedado aqui não é listado em lugar nenhum. As
 * duas telas voltam a dizer exatamente a mesma coisa sobre a mesma fábrica, que
 * é o que o leitor que abre as duas em sequência precisa.
 *
 * ⚠️ **UMA FÁBRICA TEM N CATÁLOGOS.** O título e a prosa são escritos no plural
 * quando são vários — a Marê pode ter um PDF por coleção (P22), e um h2 no
 * singular sobre seis linhas é a página não olhando para o próprio conteúdo.
 *
 * ⚠️ **Peso e formato antes do clique**, sempre — quem está em obra com internet
 * ruim precisa saber o que custa o toque. A linha vem de `LinhaDeCatalogo`,
 * compartilhada com `/catalogos` justamente para que a medida não seja formatada
 * duas vezes e comece a divergir: sem a casa decimal fixa, a mesma coluna mostra
 * `24 MB` embaixo de `8,4 MB`.
 *
 * ⚠️ **A COLUNA DA FÁBRICA NÃO VEM AQUI** — `marca` fica de fora da linha de
 * propósito. A página inteira é da Trisol; repetir "Trisol" em cada linha de uma
 * tela que se chama Trisol é ruído, e ainda abriria um vão de onze rem antes de
 * cada título.
 *
 * ⚠️ O site distribui o catálogo, não o replica: é lá dentro que vivem medida e
 * acabamento, e é por isso que não existe página de produto.
 */
export function ParaLevarDaMarca({
  representada,
  numero,
}: {
  representada: Representada;
  numero: string;
}) {
  const catalogos = representada.catalogos;
  if (!catalogos?.length) return null;

  const varios = catalogos.length > 1;

  return (
    <SecaoDaMarca
      id="levar"
      numero={numero}
      titulo={varios ? "Os catálogos da fábrica." : "O catálogo da fábrica."}
    >
      {/* ⚠️ "O site distribui, não reescreve — e é por isso que nenhuma medida
          desta página tenta substituí-lo" saiu inteiro: era a página
          justificando ao visitante uma regra editorial que ele nunca
          questionou. O que ele precisa saber é o que tem dentro do arquivo. */}
      <p className="text-body mt-6 max-w-[60ch] text-pretty text-graphite">
        {varios ? "São documentos" : "É o documento"} da própria fábrica, com o
        detalhamento que não cabe nesta página.
      </p>

      <ul className={`mt-8 border-t border-line md:mt-10 ${TETO_DA_LISTA}`}>
        {catalogos.map((catalogo, i) => (
          <LinhaDeCatalogo
            /* Índice na chave pelo mesmo motivo de `/catalogos`: se a Marê vier
               com um PDF por coleção (P22), chegam N documentos com o mesmo
               título e sem ano. */
            key={`${representada.slug}-${i}`}
            catalogo={catalogo}
          />
        ))}
      </ul>
    </SecaoDaMarca>
  );
}
