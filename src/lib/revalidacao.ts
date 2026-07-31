/**
 * A derivação pura das etiquetas de cache — decisão 7 da spec, ISR sob demanda.
 *
 * ⚠️ **ESTE ARQUIVO NÃO FALA COM O PAYLOAD NEM COM O NEXT.** Ele recebe o
 * evento — qual coleção mudou, qual documento — e devolve a lista de
 * etiquetas a invalidar. Nada mais: sem `getPayload`, sem `unstable_cache`,
 * sem `revalidateTag`. É essa ausência que permite testar o fan-out de seis
 * rotas chamando a função com um objeto comum, sem subir servidor nem simular
 * cache nenhum — quem lê o Payload e quem chama `revalidateTag` mora em
 * `lib/representadas-consulta.ts` e em `collections/representadas.ts`, e os
 * dois são só CHAMADORES desta função. Inlinear a derivação num desses dois
 * lugares era a alternativa mais simples e a errada: o fan-out voltaria a ser
 * uma lista lembrada de cabeça, e é exatamente essa lista que este arquivo
 * existe para não deixar ninguém escrever à mão de novo.
 *
 * ⚠️ **UMA REPRESENTADA APARECE EM SEIS LUGARES**, e a lista abaixo é a
 * conferida contra o que o código de fato renderiza hoje — não a suposta:
 *
 *   1. a home            `RepresentadasGaleria` — a galeria das marcas
 *   2. `/quem-somos`       `AcervoRepresentado`, bloco 05 — o ledger
 *   3. `/representadas`    `PranchaAreaExterna` + `RegistrosDasRepresentadas`
 *   4. a própria página   `/representadas/[marca]`
 *   5. `/catalogos`        `documentosDeCatalogo` — vista sobre o mesmo dado,
 *                          nunca uma segunda árvore (ver `lib/representadas.ts`)
 *   6. o rodapé            `Rodape`, no layout — portanto em TODA rota do
 *                          site, inclusive a 404
 *
 * Hoje só a própria página lê o painel (`representadas-consulta.ts`); as
 * outras cinco ainda leem o array `REPRESENTADAS` escrito à mão — a migração
 * é PRA-119. As cinco etiquetas de lista já existem aqui porque a única leitura
 * de painel que existe é tagueada com todas elas: no dia em que cada uma
 * dessas cinco passar a consultar o painel, a etiqueta já está certa e ninguém
 * precisa lembrar de acrescentá-la.
 *
 * A identidade da empresa é o segundo caso da decisão 7: ela mora no rodapé e,
 * por natureza, em qualquer canto do site — não há "seis rotas" quando a
 * mudança já É o site inteiro, então ela deriva uma etiqueta só.
 */

/** A galeria da home (`components/representadas-galeria.tsx`). */
export const TAG_HOME = "home";

/** O ledger de `/quem-somos`, bloco 05 (`components/quem-somos/acervo-representado.tsx`). */
export const TAG_QUEM_SOMOS = "quem-somos";

/** A prancha e os registros de `/representadas`
 *  (`components/representadas/prancha-area-externa.tsx` e `registros.tsx`). */
export const TAG_REPRESENTADAS = "representadas";

/** O índice de documentos de `/catalogos` (`lib/representadas.ts#documentosDeCatalogo`). */
export const TAG_CATALOGOS = "catalogos";

/** O rodapé (`components/rodape.tsx`) — no layout, portanto em toda rota do
 *  site, inclusive `not-found`. */
export const TAG_RODAPE = "rodape";

/** A identidade da empresa — WhatsApp, e-mail, endereço, território. Está no
 *  rodapé e potencialmente em qualquer página, então a mudança é sempre o
 *  site inteiro, nunca uma lista de rotas para enumerar. */
export const TAG_SITE = "site";

/**
 * A própria página da marca — uma etiqueta POR marca, nunca uma só para
 * todas. Editar a Trisol não pode invalidar a página estática da Bux, que não
 * mudou.
 */
export function tagDaRepresentada(slug: string): string {
  return `representada:${slug}`;
}

/** O que mudou no painel — a entrada da derivação. */
export type MudancaNoPainel =
  | { colecao: "representadas"; slug: string }
  | { colecao: "empresa" };

/**
 * Coleção e documento entram, a lista de etiquetas sai — literalmente a frase
 * da decisão 7. Sem esta função, o fan-out de seis rotas é uma lista escrita à
 * mão dentro de um hook, e uma lista escrita à mão é exatamente o tipo de
 * defeito silencioso que este projeto já se recusou a repetir uma vez (ver o
 * comentário sobre etiquetas em `representadas-consulta.ts`, antes desta
 * função existir).
 *
 * ⚠️ O `switch` é exaustivo de propósito, e o `default` com `satisfies never`
 * é o que torna uma coleção nova sem caso aqui um erro de build — não um
 * silêncio em produção.
 */
export function tagsDaMudanca(mudanca: MudancaNoPainel): string[] {
  switch (mudanca.colecao) {
    case "representadas":
      return [
        TAG_HOME,
        TAG_QUEM_SOMOS,
        TAG_REPRESENTADAS,
        TAG_CATALOGOS,
        TAG_RODAPE,
        tagDaRepresentada(mudanca.slug),
      ];
    case "empresa":
      return [TAG_SITE];
    default:
      return mudanca satisfies never;
  }
}
