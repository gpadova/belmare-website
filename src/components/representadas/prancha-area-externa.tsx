import Image from "next/image";
import Link from "next/link";

import { Seta } from "@/components/icones";
import { PRANCHA_AREA_EXTERNA } from "@/lib/acervo";
import { CHAMADAS } from "@/lib/prancha-area-externa";
import {
  REPRESENTADAS,
  paginaDaRepresentada,
  representadaPorSlug,
} from "@/lib/representadas";

/**
 * PRANCHA 02 — a área externa desmontada.
 *
 * `/quem-somos` desenhou ONDE a Belmare opera. Esta desenha O QUE ela resolve.
 * Duas pranchas, a mesma gramática de moldura, registro e rótulo em mono, dois
 * assuntos diferentes, as duas construídas sobre dado declarado. É série, não
 * gesto avulso.
 *
 * A rota existia com um problema: o site já mostrou as quatro marcas duas vezes
 * — a galeria fotográfica da home e o ledger de quatro linhas do bloco 05. Uma
 * terceira lista das mesmas quatro não tem por que existir. O que nenhuma das
 * duas fez é mostrar que as quatro, juntas, cobrem uma área externa inteira, e
 * onde cada uma entra. É o que esta prancha faz, e por demonstração: o desenho
 * identifica as partes, a legenda atribui, e o visitante conclui sozinho.
 *
 * ⚠️ **A chamada nomeia a parte; a legenda nomeia a fábrica.** Está detalhado
 * em `lib/prancha-area-externa.ts` e é a linha que separa esta página de uma
 * mentira: a fotografia é gerada, e uma seta escrita "Trisol" apontando para um
 * ombrelone gerado afirma que aquilo é um produto da Trisol.
 *
 * ⚠️ **Sem véu.** A legibilidade do rótulo vem do recorte em papel — o mesmo
 * `bg-paper px-1.5` que abre a graticula para a sigla do estado na PRANCHA 01.
 * Escurecer a foto seria a solução da abertura da home, e é o gesto errado
 * aqui: numa prancha o desenho não se apaga para o rótulo caber.
 */

/** Registro de canto: a cruz de esquadro de toda folha desenhada, no fio. */
function Registro({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      className={className}
    >
      <path d="M6 0 V12 M0 6 H12" />
    </svg>
  );
}

export function PranchaAreaExterna() {
  return (
    <section
      aria-labelledby="prancha-02"
      className="px-5 pt-10 pb-14 md:px-8 md:pt-14 md:pb-24"
    >
      {/* Prancha à esquerda, título e legenda à direita, separados pelo fio de
          altura total. No telefone empilha: desenho primeiro, legenda depois —
          uma legenda que chega antes do desenho não é legenda. */}
      <div className="grid gap-y-10 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-x-8 lg:gap-x-12">
        <figure className="min-w-0">
          <div className="relative border border-line p-2">
            <Registro className="absolute -top-1.5 -left-1.5 h-3 w-3 text-line" />
            <Registro className="absolute -top-1.5 -right-1.5 h-3 w-3 text-line" />
            <Registro className="absolute -bottom-1.5 -left-1.5 h-3 w-3 text-line" />
            <Registro className="absolute -right-1.5 -bottom-1.5 h-3 w-3 text-line" />

            {/* ⚠️ 16/9 EM TODA LARGURA, igual ao aspecto do arquivo, e isso não
                é preferência de enquadramento: as chamadas estão em
                porcentagem DA CAIXA, e `object-cover` num aspecto diferente
                recorta a imagem por dentro dela. Um 3/2 no telefone corta 7,8%
                de cada lado e empurra a chamada 01 para fora do sofá — a seta
                passa a apontar para o deck vazio. A prancha não recorta. */}
            <div className="relative aspect-16/9 bg-ink">
              <Image
                src={PRANCHA_AREA_EXTERNA.src}
                alt={PRANCHA_AREA_EXTERNA.alt}
                fill
                priority
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />

              {/* Linhas de chamada. `preserveAspectRatio="none"` faz a
                  porcentagem valer direto nos dois eixos; o traço não distorce
                  junto porque `non-scaling-stroke` o mantém em 1px em qualquer
                  largura — a mesma espessura do fio que fecha a moldura.

                  ⚠️ CADA LINHA É TRAÇADA DUAS VEZES: um encamisamento de 3px em
                  papel por baixo, e o traço de 1px em tinta por cima. Não é
                  efeito — é como chama-se um objeto numa prancha impressa sobre
                  meio-tom, e aqui é requisito de acessibilidade. Uma linha só,
                  em papel, media entre 1,09:1 e 1,9:1 contra esta fotografia
                  clara: abaixo dos 3:1 que a WCAG 1.4.11 pede para objeto
                  gráfico necessário à compreensão, e a meta declarada do
                  projeto é AA. Sem isso, os quatro números flutuam sobre a foto
                  e a legenda vira promessa em vez de chave. */}
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                {CHAMADAS.map((chamada) => {
                  const traco = `M${chamada.rotulo.x} ${chamada.rotulo.y} L${chamada.alvo.x} ${chamada.alvo.y}`;

                  return (
                    <g key={chamada.slug} fill="none">
                      <path
                        d={traco}
                        stroke="var(--color-paper)"
                        strokeWidth={3}
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={traco}
                        stroke="var(--color-ink)"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Os números são decorativos para a leitura assistiva: a legenda
                  abaixo é a alternativa textual da prancha e diz o mesmo em
                  ordem. Ouvir "zero um" solto sobre uma foto não informa nada. */}
              <div aria-hidden="true" className="absolute inset-0">
                {CHAMADAS.map((chamada, i) => (
                  <span
                    key={chamada.slug}
                    className="mono absolute -translate-x-1/2 -translate-y-1/2 bg-paper px-1.5 py-0.5 text-ink"
                    style={{
                      left: `${chamada.rotulo.x}%`,
                      top: `${chamada.rotulo.y}%`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>

            {/* O carimbo, no rodapé da moldura: toda prancha declara o que é. */}
            <p className="mono uppercase mt-2 flex justify-between gap-4 text-graphite">
              <span>Prancha 02 · Área externa</span>
              <span>Belmare</span>
            </p>
          </div>

          {/* Legenda visível, e não só `alt`. A cena mostra uma área externa
              inteira resolvida, logo abaixo de um título que fala em fábricas —
              um arquiteto rolando a página lê aquilo como obra entregue com
              peças das quatro marcas. É a única mentira grave que esta rota
              poderia contar, e quem enxerga não lê `alt`. */}
          <figcaption className="text-support mt-5 max-w-[68ch] text-graphite">
            Imagem de referência. Não é obra entregue, e nenhuma peça do quadro é
            produto de catálogo das representadas — as chamadas identificam o
            que cada fábrica resolve na cena, não modelos.
          </figcaption>
        </figure>

        {/* A coluna da legenda pendura no fio, como a coluna de conteúdo pendura
            na margem. Abaixo de `md` o fio some: dois blocos empilhados já se
            separam pela ordem, e um fio horizontal ali leria como divisor de
            seção, que é outra coisa. */}
        <div className="min-w-0 md:border-l md:border-line md:pl-8 lg:pl-12">
          <p className="mono uppercase text-graphite">Prancha 02 · Área externa</p>

          {/* ⚠️ O título nomeia os quatro objetos e NÃO afirma que eles
              particionam o espaço. "Cada parte da área externa tem uma fábrica"
              prometia uma regra que o desenho não consegue ensinar: móvel e
              estofado são dois recortes do mesmo objeto, e um leitor que precisa
              de um sofá não deduziria da prancha se vai à Marê ou à Bux. Nomear
              os quatro é verdade e põe objeto na cabeça de quem lê; declarar
              partição não era nem uma coisa nem outra. */}
          <h1 id="prancha-02" className="text-h1 mt-4 max-w-[16ch] font-normal text-balance">
            O móvel, a estrutura, o estofado e a sombra.
          </h1>

          <p className="text-body mt-5 max-w-[46ch] text-pretty text-graphite">
            Quatro fábricas para uma área externa. A prancha identifica cada uma
            na cena; a legenda diz quem resolve, e leva à página dela.
          </p>

          {/* h2, não h3: promover o título da página a h1 abriu um salto de
              nível — quem navega por rotor saía do h1 e caía em "Legenda" como
              neto, concluindo que uma seção intermediária tinha ficado de fora.
              É o mesmo papel de rótulo em mono que o h2 da seção de registros
              já cumpre. */}
          <h2 className="mono uppercase mt-10 text-graphite">Legenda</h2>

          <ol className="mt-3 border-t border-line">
            {CHAMADAS.map((chamada, i) => {
              const representada = representadaPorSlug(chamada.slug);
              if (!representada) return null;

              return (
                <li key={chamada.slug} className="border-b border-line">
                  <Link
                    href={paginaDaRepresentada(representada)}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-baseline gap-x-3 py-4 transition-colors hover:bg-surface"
                  >
                    <span className="mono text-graphite">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="mono uppercase block text-graphite">
                        {representada.parte}
                      </span>
                      <span className="text-h3 mt-1 block font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                        {representada.nome}
                      </span>
                    </span>
                    <Seta className="h-3 w-8 self-center text-graphite transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-ink motion-reduce:transition-none" />
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* A prancha aceita N marcas porque a chave é a parte, não a fábrica.
              O contador sai do array, nunca do literal "quatro". */}
          <p className="mono uppercase mt-4 text-graphite">
            {REPRESENTADAS.length} representadas · Sul do Brasil
          </p>
        </div>
      </div>
    </section>
  );
}
