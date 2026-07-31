import { RichText } from "@payloadcms/richtext-lexical/react";

import { SecaoLivre } from "@/components/paginas/secao";
import type { ConteudoRico } from "@/lib/paginas";

/**
 * O bloco de texto — o único lugar do site onde a prosa vem formatada pelo
 * operador em vez de composta pelo desenho.
 *
 * ⚠️ **A ESCALA TIPOGRÁFICA É A DO SITE, APLICADA POR CIMA DO QUE O EDITOR
 * PRODUZ.** O lexical devolve `<p>`, `<h2>`, `<ul>` e `<a>` sem classe nenhuma,
 * e o projeto zerou os padrões do navegador junto com o resto do CSS: sem estas
 * regras, um parágrafo sai em 16px do sistema e uma lista sai sem marcador. As
 * seletoras de descendente são o que mantém a política de privacidade na mesma
 * medida, no mesmo grafite e com o mesmo respiro que `/quem-somos` — em vez de
 * um segundo sistema tipográfico entrando pela porta do CMS.
 *
 * ⚠️ **É O BLOCO QUE A POLÍTICA DE PRIVACIDADE USA SOZINHO**, e é a razão de o
 * editor oferecer dois níveis de título e as duas listas: um documento jurídico
 * chega estruturado de quem o escreveu, e colar essa estrutura tem que
 * funcionar. A REDAÇÃO é de advogado e não é nossa — este ticket constrói a
 * página e a editabilidade dela.
 *
 * ⚠️ `disableContainer` tira o `<div>` que o `RichText` embrulharia sozinho: o
 * respiro e a medida são do wrapper abaixo, e duas caixas encaixadas cada uma
 * com margem própria é como o espaçamento de uma seção deixa de ser previsível.
 */
export function BlocoProsa({
  titulo,
  corpo,
}: {
  titulo?: string;
  corpo: ConteudoRico;
}) {
  return (
    <SecaoLivre titulo={titulo}>
      <div
        className={`text-body max-w-[68ch] text-pretty text-graphite ${titulo === undefined ? "" : "mt-6"} [&>*:first-child]:mt-0 [&_a]:text-ink [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-[3px] [&_a]:transition-colors hover:[&_a]:decoration-ink [&_h2]:text-h2 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-normal [&_h2]:text-balance [&_h2]:text-ink [&_h3]:text-h3 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-normal [&_h3]:text-ink [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6`}
      >
        <RichText data={corpo} disableContainer />
      </div>
    </SecaoLivre>
  );
}
