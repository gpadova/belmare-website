/**
 * As duas marcas do painel — o ícone da barra de navegação e o logotipo da tela
 * de login. Registradas em `payload.config.ts#admin.components.graphics`.
 *
 * ⚠️ **AS DUAS USAM O SÍMBOLO, E NÃO O LOCKUP COM A PALAVRA.** O painel tem tema
 * claro e tema escuro, e quem escolhe é o operador. A palavra dos lockups de
 * `public/marca/` está gravada na tinta do site (#17171A) dentro do próprio
 * arquivo — no tema escuro do painel ela sumiria no fundo. O símbolo não tem
 * esse problema: ele leva o disco de papel embutido atrás do azul (a mesma razão
 * do favicon; ver `components/marca-belmare.tsx`), então lê igual nos dois
 * temas, sem uma segunda versão do arquivo para manter.
 *
 * O nome da empresa continua dito no painel pelo `titleSuffix` do
 * `payload.config.ts` — a marca aqui não precisa repeti-lo.
 */

/* eslint-disable @next/next/no-img-element --
   Mesma razão de `components/marca-belmare.tsx`: `next/image` não tem o que
   otimizar num SVG estático da própria origem. */

/** O ícone — canto da barra de navegação do painel. */
export function MarcaIcone() {
  return (
    <img
      src="/marca/simbolo.svg"
      width={1720}
      height={1720}
      alt="Belmare"
      style={{ width: 26, height: 26, display: "block" }}
    />
  );
}

/** O logotipo — tela de login. */
export function MarcaLogo() {
  return (
    <img
      src="/marca/simbolo.svg"
      width={1720}
      height={1720}
      alt="Belmare Representações"
      style={{ width: 90, height: 90, display: "block" }}
    />
  );
}
