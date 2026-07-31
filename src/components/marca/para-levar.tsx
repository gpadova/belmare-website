import {
  LinhaDeCatalogo,
  TETO_DA_LISTA,
} from "@/components/linha-de-catalogo";
import { SecaoDaMarca } from "@/components/marca/secao";
import type { Representada } from "@/lib/representadas";

/**
 * Para levar — o catálogo da marca.
 *
 * ⚠️ **ESTA SEÇÃO PASSOU A RENDERIZAR, e o motivo não é que o PDF chegou.** Ela
 * ficou em zero pixels enquanto "ter catálogo" e "ter o arquivo" eram a mesma
 * condição. Não são: a Trisol publica a edição 2026 no site dela e a Belmare
 * ainda não recebeu o arquivo. Com `/catalogos` declarando esse documento em
 * público, a página da própria Trisol escondendo-o seria o site sabendo de um
 * fato num lugar e fingindo ignorá-lo no outro — e é o leitor que abre as duas
 * telas em sequência que paga por isso.
 *
 * A seção segue anulável, e a regra só ficou mais precisa: ela some quando a
 * fábrica **não declara documento nenhum**, como a Bux. Sem markup vazio, sem
 * título órfão, sem "em breve".
 *
 * ⚠️ **Peso e formato antes do clique**, sempre — quem está em obra com internet
 * ruim precisa saber o que custa o toque. A linha vem de `LinhaDeCatalogo` e o
 * peso sai de `pesoEmMB()`, compartilhados com `/catalogos` justamente para que
 * a medida não seja formatada duas vezes e comece a divergir: sem a casa decimal
 * fixa, a mesma coluna mostra `24 MB` embaixo de `8,4 MB`.
 *
 * ⚠️ O site distribui o catálogo, não o replica: é lá dentro que vivem medida,
 * acabamento e ficha cotada, e é por isso que não existe página de produto.
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

  return (
    <SecaoDaMarca id="levar" numero={numero} titulo="Para levar.">
      <p className="text-body mt-6 max-w-[60ch] text-pretty text-graphite">
        O detalhamento da fábrica vem no arquivo. O site distribui, não reescreve
        — e é por isso que nenhuma medida desta página tenta substituí-lo.
      </p>

      <ul className={`mt-8 border-t border-line md:mt-10 ${TETO_DA_LISTA}`}>
        {catalogos.map((catalogo, i) => (
          <LinhaDeCatalogo
            /* Índice na chave pelo mesmo motivo de `/catalogos`: se a Marê vier
               com um PDF por coleção (P22), chegam N documentos com o mesmo
               título e sem ano. */
            key={`${representada.slug}-${i}`}
            catalogo={catalogo}
            representada={representada}
          />
        ))}
      </ul>
    </SecaoDaMarca>
  );
}
