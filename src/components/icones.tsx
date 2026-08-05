/**
 * A seta, desenhada no traço do sistema: 1px, ponta reta, raio 0 — a mesma
 * espessura do fio que separa as faixas da etiqueta. Nada de glifo
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

/**
 * O ícone do WhatsApp — a segunda exceção ao "ícone só a seta" que o resto do
 * sistema conhecia até aqui, e por decisão explícita, não descuido.
 *
 * ⚠️ **É O GLIFO, NUNCA A MARCA.** Sem preenchimento e sem o verde oficial: o
 * traço é `currentColor` (tinta ou grafite, conforme quem chama), do mesmo
 * jeito que a seta. A Regra da Cromia Zero continua inteira — nenhum matiz
 * sai do logotipo da Belmare, este ícone incluído. Um balão verde preenchido
 * seria a marca de outra empresa dentro de uma interface que só tem cor num
 * lugar só, e não é este.
 *
 * ⚠️ **`strokeLinecap`/`strokeLinejoin` EM "ROUND", DIFERENTE DA SETA.** A
 * seta é reta de propósito; este glifo tem curva (o balão de conversa, o
 * gancho do telefone), e ponta reta numa curva vira polígono facetado — deixa
 * de ser reconhecível como o ícone que é. `vector-effect="non-scaling-stroke"`
 * mantém o traço em 1,5px de verdade em qualquer tamanho renderizado, mesma
 * garantia da seta.
 */
export function IconeWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      className={className}
    >
      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
    </svg>
  );
}
