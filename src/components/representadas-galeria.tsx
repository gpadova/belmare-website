import Image from "next/image";
import Link from "next/link";

import {
  REPRESENTADAS,
  imagemDaRepresentada,
  paginaDaRepresentada,
} from "@/lib/representadas";

/**
 * As quatro representadas.
 *
 * Cada uma entra com produto, não com logotipo em grade — grade de logo é
 * diretório de fornecedor, e além disso não existe vetor autorizado das
 * fábricas. Os nomes são compostos no sistema da própria Belmare.
 *
 * ⚠️ As imagens ilustram o que cada marca RESOLVE; não são peças do catálogo
 * dela. Isso está dito em texto visível no pé da seção, não só no alt: um mock
 * que se passa por acervo real é o tipo de mentira que este projeto não comete.
 */
export function RepresentadasGaleria() {
  return (
    <section aria-labelledby="representadas" className="px-5 py-16 md:px-8 md:py-24">
      <div className="max-w-[46ch]">
        <h2 id="representadas" className="text-h1 font-normal">
          As quatro fábricas que a Belmare representa.
        </h2>
        <p className="text-body mt-4 text-graphite">
          Móvel de autor, estrutura, conforto e sombra. Juntas, resolvem uma área
          externa inteira — e há um único interlocutor para as quatro.
        </p>
      </div>

      <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        {REPRESENTADAS.map((r) => {
          const imagem = imagemDaRepresentada(r);

          return (
          <li key={r.slug}>
            <Link href={paginaDaRepresentada(r)} className="group block">
              {/* Retrato no desktop, paisagem no telefone: quatro retratos
                  empilhados em coluna única transformavam a seção num rolo
                  interminável. */}
              <div className="relative aspect-3/2 overflow-hidden bg-ink sm:aspect-4/5">
                <Image
                  src={imagem.src}
                  alt={imagem.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>

              <h3 className="text-h3 mt-5 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                {r.nome}
              </h3>
              <p className="text-support mt-2 text-graphite">Resolve {r.resolve}.</p>
              <p className="text-support mt-3 text-graphite">
                {r.base ? `${r.base} · ` : ""}
                {r.fato}
              </p>
            </Link>
          </li>
          );
        })}
      </ul>

      <p className="text-support mt-12 max-w-[68ch] text-graphite">
        Imagens de referência, para representar o que cada fábrica resolve. O
        acervo fotográfico das marcas entra na publicação.
      </p>
    </section>
  );
}
