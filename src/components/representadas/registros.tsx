import Image from "next/image";
import Link from "next/link";

import { Seta } from "@/components/icones";
import { Logotipo } from "@/components/logotipo";
import {
  imagemDaRepresentada,
  paginaDaRepresentada,
} from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * Os registros — uma entrada por representada, na ordem da prancha.
 *
 * A legenda da prancha atribui a parte à fábrica em duas palavras; aqui a
 * fábrica ganha origem e o fato que a define, e continua sendo o mesmo destino.
 * Dois caminhos para o mesmo lugar não é redundância: um é a chave do desenho,
 * o outro é a ficha.
 *
 * ⚠️ Miniatura pequena e deitada, deliberadamente. A galeria da home mostra as
 * quatro em retrato grande porque lá elas são o argumento; repetir aquele
 * tamanho aqui faria a rota inteira ler como a home outra vez, uma tela abaixo.
 *
 * ⚠️ Duas colunas, não quatro. P18 segue aberto — não se sabe se o portfólio
 * cresce — e uma grade de quatro quebra com três ou cinco. Em duas, qualquer N
 * fecha.
 */
export async function RegistrosDasRepresentadas() {
  const representadas = await representadasDaPagina();

  /* Mesma regra da galeria da home, e pela mesma razão: com duas colunas lado a
     lado, uma linha que abre com marca ao lado de outra que abre com o número
     desalinha as duas fichas inteiras. A faixa é decidida uma vez, para a
     seção. Ver `representadas-galeria.tsx`. */
  const temFaixaDeMarca = representadas.some((r) => r.logotipo !== undefined);

  return (
    <section
      aria-labelledby="registros"
      className="border-t border-line px-5 py-14 md:px-8 md:py-20"
    >
      {/* ⚠️ Tinta, e não grafite: o rótulo em mono ENCABEÇA esta seção, e o
          sistema reserva o grafite para quem LEGENDA outra coisa — o "01 · a
          sombra" de cada ficha abaixo, o rótulo de ficha, a medida. Ela era
          grafite até 06/08/2026, quando a auditoria a pôs ao lado de
          `marca/secao.tsx` e do rodapé e viu que era a única encabeçando em
          cor de legenda. Ver `DESIGN.md → Cabeçalho de seção`. */}
      <h2 id="registros" className="mono uppercase text-ink">
        As representadas
      </h2>

      <ul className="mt-6 grid border-t border-line md:grid-cols-2 md:gap-x-8 lg:gap-x-12">
        {representadas.map((r, i) => {
          const imagem = imagemDaRepresentada(r);

          return (
            <li key={r.slug} className="border-b border-line">
              <Link
                href={paginaDaRepresentada(r)}
                className="group flex items-start gap-5 py-6 transition-colors hover:bg-surface"
              >
                <div className="relative aspect-4/3 w-24 shrink-0 overflow-hidden bg-ink sm:w-32">
                  <Image
                    src={imagem.src}
                    alt={imagem.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 8rem, 6rem"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  {/* A marca entra por cima do número, e não no lugar da
                      miniatura: a coluna da esquerda é fotografia nas quatro
                      linhas, e trocá-la por marca em algumas faria a lista
                      alternar entre dois tipos de objeto na mesma coluna. Aqui
                      ela abre a ficha, que é a mesma gramática do cartão da
                      home — marca em cima, assunto embaixo. Menor que lá: nesta
                      rota a marca identifica uma linha de lista, não encabeça
                      um cartão. */}
                  {temFaixaDeMarca && (
                    <div className="mb-2 flex h-7 items-end">
                      {r.logotipo && (
                        <Logotipo
                          src={r.logotipo}
                          className="max-h-7 max-w-[7rem]"
                        />
                      )}
                    </div>
                  )}
                  <p className="mono uppercase text-graphite">
                    {String(i + 1).padStart(2, "0")} · {r.parte}
                  </p>
                  <h3 className="text-h3 mt-1 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                    {r.nome}
                  </h3>
                  <p className="text-support mt-2 text-graphite">
                    {/* A Trisol não declara cidade em fonte nenhuma — só o DDD
                        48. "Não declarada" com todas as letras, e não um
                        travessão que o leitor confunde com erro de digitação. */}
                    {r.base ?? "Origem não declarada"}
                  </p>
                  <p className="text-support mt-1 max-w-[42ch] text-pretty text-graphite">
                    {r.fato}
                  </p>
                </div>

                <Seta className="mt-1 h-3 w-8 shrink-0 self-center text-graphite transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-ink motion-reduce:transition-none" />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ⚠️ A legenda da prancha, 350px acima, diz "nenhuma peça DO QUADRO" — e
          o escopo dela é o desenho, não estas miniaturas. Uma poltrona de corda
          encostada em "Marê Mobília · Cambé · PR" é lida como peça da Marê, que
          é exatamente a leitura que a abertura da marca e a prancha julgaram
          grave o bastante para legendar. Deixar o meio do caminho sem
          tratamento seria proteger as duas pontas e mentir no miolo. */}
      <p className="text-support mt-10 max-w-[68ch] text-pretty text-graphite">
        Imagens de referência, para mostrar a linha de cada fábrica. Não são
        peças do catálogo delas. As fotografias das marcas entram no lugar
        delas assim que chegarem.
      </p>
    </section>
  );
}
