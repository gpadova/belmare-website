import Link from "next/link";

import { Seta } from "@/components/icones";
import { LinhaDeCatalogo, TETO_DA_LISTA } from "@/components/linha-de-catalogo";
import { catalogosDoSite } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * Os catálogos, na home — **seção anulável, e hoje ela renderiza zero pixels**.
 *
 * ⚠️ **NÃO HÁ UM ÚNICO PDF HOSPEDADO EM 05/08/2026, ENTÃO ESTA SEÇÃO NÃO
 * EXISTE NA TELA.** Isso é o comportamento correto, não uma pendência: `Catalogo`
 * só existe com arquivo (`lib/representadas.ts`), e a regra do projeto é
 * literal — **sobe o PDF, aparece a linha**. A seção foi construída inteira e
 * fica em zero pixels até a primeira fábrica mandar o arquivo, exatamente como
 * `projetos-realizados.tsx` faz em `/quem-somos`. Sem markup vazio, sem título
 * órfão, sem "em breve", sem contagem prometida.
 *
 * ⚠️ **E É POR ISSO QUE ELA NÃO INVENTA UMA LINHA DE EXEMPLO.** A tentação de
 * desenhar três linhas cinzentas "para mostrar como vai ficar" é a mesma que
 * `/catalogos` já cometeu e corrigiu em 05/08/2026: três documentos anunciados
 * para zero uploads, um deles parecendo clicável e não sendo. Um botão morto na
 * home é pior do que na página de catálogos, porque a home é onde o arquiteto
 * decide se este site vale uma segunda visita.
 *
 * ⚠️ **A LINHA É A COMPARTILHADA, e isso não é economia — é a regra.** Peso e
 * edição são a promessa que a linha faz antes do clique, e promessa formatada em
 * dois lugares diverge: é assim que "24,0 MB" numa página vira "24MB" na outra.
 * `LinhaDeCatalogo` já serve `/catalogos` e a seção "Para levar" das páginas de
 * marca; esta é a terceira superfície e não reescreve nada.
 *
 * ⚠️ **A COLUNA DA FÁBRICA ENTRA AQUI**, porque a home atravessa as quatro. É a
 * mesma decisão de `/catalogos`, e o oposto da página de marca, onde a
 * atribuição é a página inteira.
 *
 * ⚠️ **O TETO É QUATRO LINHAS, E O RESTO É UM LINK.** A home não é o índice; ela
 * mostra que o índice existe e tem peso declarado. Sem teto, uma fábrica com seis
 * catálogos empurra as duas portas — que são a ação primária da página — para
 * baixo de uma tabela.
 */

/** Quantas linhas a home mostra antes de mandar para o índice. */
const TETO_DE_LINHAS = 4;

export async function CatalogosEmDestaque() {
  const representadas = await representadasDaPagina();
  const catalogos = catalogosDoSite(representadas);

  /* Seção anulável: sem arquivo em disco não há seção. Ver a nota acima. */
  if (catalogos.length === 0) return null;

  const mostrados = catalogos.slice(0, TETO_DE_LINHAS);
  const sobram = catalogos.length - mostrados.length;

  return (
    <section
      aria-labelledby="catalogos-home"
      className="border-t border-line px-5 py-20 md:px-8 md:py-28"
    >
      <div className="max-w-[46ch]">
        <h2 id="catalogos-home" className="text-h1 font-normal text-balance">
          Os catálogos, com o peso declarado antes do clique.
        </h2>
      </div>

      <ul className={`mt-10 border-t border-line md:mt-12 ${TETO_DA_LISTA}`}>
        {mostrados.map(({ catalogo, marca }) => (
          <LinhaDeCatalogo
            key={`${marca.slug}-${catalogo.titulo}`}
            catalogo={catalogo}
            marca={marca.nome}
          />
        ))}
      </ul>

      {/* ⚠️ O rótulo conta o que sobrou, em vez de dizer "ver todos": um número
          declara o custo do clique, que é a mesma disciplina do `PDF · 24,0 MB`
          na linha acima. Com nada sobrando, ele vira o convite simples — porque
          "e mais 0" é a contagem que não se escreve. */}
      <Link
        href="/catalogos"
        className="mono group mt-10 inline-flex items-center gap-3 uppercase text-ink"
      >
        {sobram > 0 ? `Ver os ${catalogos.length} catálogos` : "Ver os catálogos"}
        <Seta className="h-3 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
      </Link>
    </section>
  );
}
