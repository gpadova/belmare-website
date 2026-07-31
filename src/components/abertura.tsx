import Image from "next/image";

import { ABERTURA } from "@/lib/acervo";
import { REPRESENTADAS } from "@/lib/representadas";
import { anosDeMercado, EMPRESA } from "@/lib/site";

/**
 * A abertura.
 *
 * Duas correções de rumo estão embutidas aqui e não devem ser desfeitas.
 *
 * 1. A FOTO CARREGA A PÁGINA. Ela sangra na tela inteira e o texto vive sobre
 *    ela. Nada de painel regrado, nada de campo de textura: num site de
 *    mobiliário o herói é a peça, e a interface some para deixá-la falar.
 *    É também o que sobrou de pé quando o sistema de textura caiu — a direção
 *    editorial não precisava dele, e a foto ficou maior sem ele.
 *
 * 2. O TÍTULO NOMEIA AS PEÇAS. Ele já foi "Quatro fábricas. Um interlocutor." e
 *    isso foi rejeitado em 30/07/2026, com razão: é jargão de dentro da empresa.
 *    Contar fábricas e contar interlocutores descreve o ORGANOGRAMA da Belmare,
 *    e quem chega não veio saber como ela se organiza. É abstrato — não dá
 *    imagem, não dá objeto, não responde nada.
 *
 *    O arquiteto chega procurando a peça que resolve um vão. Então a primeira
 *    linha entrega objetos: sofá, mesa, espreguiçadeira, ombrelone. É a coisa
 *    menos abstrata que cabe num título, cumpre "dado antes de adjetivo" logo
 *    na abertura, e as quatro palavras cobrem por acaso — e por verdade — o que
 *    cada uma das quatro representadas resolve.
 *
 *    ⚠️ O título também NÃO é a categoria pura ("Móveis para área externa"):
 *    isso descreve uma fábrica, e a Belmare é representação. Quem faz esse
 *    trabalho é a linha de apoio, nomeando as marcas, o território e o tempo
 *    de casa — onde o fato cabe sem virar slogan.
 */
export function Abertura() {
  /** "A, B, C e D" — a conjunção antes do último item, como se escreve. */
  const lista = (itens: readonly string[]) =>
    itens.length < 2
      ? (itens[0] ?? "")
      : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

  const nomeadas = lista(REPRESENTADAS.map((r) => r.nome));
  const territorio = lista(EMPRESA.territorio);

  return (
    <section
      aria-labelledby="promessa"
      className="relative flex h-[calc(100svh-9rem)] min-h-[30rem] flex-col justify-end overflow-hidden bg-ink md:h-[calc(100svh-4.5rem)]"
    >
      <Image
        src={ABERTURA.src}
        alt={ABERTURA.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[38%_50%] md:object-center"
      />

      {/* Véu de legibilidade, não ornamento: sem ele o texto claro cai sobre o
          deck iluminado em parte das telas. Ele escurece só o pé da imagem. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/70 via-black/30 to-transparent"
      />

      <div className="relative px-5 pb-10 md:px-8 md:pb-14">
        <h1
          id="promessa"
          className="text-display max-w-[18ch] font-normal text-balance text-white"
        >
          Sofá, mesa, espreguiçadeira e ombrelone.
        </h1>
        <p className="text-body mt-5 max-w-[62ch] text-pretty text-white/85">
          A área externa inteira, de quatro fábricas brasileiras de alto padrão.
          A Belmare representa {nomeadas} no {territorio}, há {anosDeMercado()}{" "}
          anos.
        </p>
      </div>
    </section>
  );
}
