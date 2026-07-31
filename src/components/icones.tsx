/**
 * Um ícone só, desenhado no traço do sistema: 1px, ponta reta, raio 0 — a
 * mesma espessura do fio que separa as faixas da etiqueta. Nada de glifo
 * tipográfico fazendo papel de ícone.
 */
export function Seta({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 32 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      className={className}
    >
      <path d="M0 6 H31" />
      <path d="M25.5 0.5 L31 6 L25.5 11.5" />
    </svg>
  );
}
