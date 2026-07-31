/**
 * A hachura do logotipo.
 *
 * É a faixa que separa o wordmark do descritor no lockup da Belmare — um
 * desenho fixo, sempre o mesmo, em qualquer página e qualquer escala.
 *
 * ⚠️ Ela NÃO sai do logotipo. Não vira padrão de fundo, não vira textura de
 * seção, não representa material e não tem irmãs. Este arquivo substitui o
 * antigo sistema de oito matérias em vetor, cancelado em 30/07/2026 junto com
 * o eixo transversal de material — ver `briefing/estrutura.md` §4 e
 * `briefing/marca.md` §5. Se alguma tela pedir "a textura daquele contexto",
 * a resposta é não: a identidade vem de tipografia, grade e fotografia.
 */

const TINTA = "#17171a";

export const ID_HACHURA = "mat-hachura";

/**
 * Renderizado uma vez no layout. Fica fora do fluxo sem `display: none`, que em
 * alguns navegadores invalida o padrão referenciado.
 */
export function DefinicaoDeHachura() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <pattern
          id={ID_HACHURA}
          patternUnits="userSpaceOnUse"
          width={5}
          height={5}
        >
          <path
            d="M-1 4 L4 -1 M0 5 L5 0 M1 6 L6 1"
            stroke={TINTA}
            strokeWidth={0.9}
            fill="none"
          />
        </pattern>
      </defs>
    </svg>
  );
}

/**
 * A faixa.
 *
 * Sem viewBox de propósito: com `patternUnits="userSpaceOnUse"`, unidade de
 * usuário sem viewBox é pixel de CSS, então o ladrilho sai na densidade em que
 * foi desenhado. Um viewBox esticado por `preserveAspectRatio` esmaga o
 * ladrilho a fração de pixel e a faixa vira borrão cinza.
 */
export function FaixaDeHachura({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className={className}>
      <rect width="100%" height="100%" fill={`url(#${ID_HACHURA})`} />
    </svg>
  );
}
