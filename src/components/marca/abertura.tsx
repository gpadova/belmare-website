import Image from "next/image";

import {
  imagemLargaDaRepresentada,
  type Representada,
} from "@/lib/representadas";

/**
 * 01 — A identificação. A abertura da página de marca.
 *
 * Uma fotografia sangrando de ponta a ponta e, abaixo dela, o registro: faixa
 * de identificação em mono, o nome em display, a linha da marca e o fato
 * que a define. A foto carrega, a tipografia mede — é a mesma divisão de
 * trabalho da abertura da home, aplicada a uma fábrica só.
 *
 * ⚠️ **A legenda visível é obrigatória aqui, e não é excesso de zelo.** A
 * fotografia é gerada e cai imediatamente acima do nome da fábrica: nessa
 * posição, um arquiteto lê "peça da Marê", não "imagem de referência". `alt`
 * não resolve — ninguém que enxerga lê `alt`. É a mesma razão que obriga a
 * legenda da foto de fecho de `/quem-somos`, e as duas são as únicas legendas
 * visíveis de foto do site.
 *
 * ⚠️ A imagem é OUTRA que a da galeria da home, de propósito. Ver `acervo.ts`.
 */
export function AberturaDaMarca({
  representada,
  numero,
}: {
  representada: Representada;
  numero: string;
}) {
  const imagem = imagemLargaDaRepresentada(representada);

  return (
    <section id="identificacao" className="scroll-mt-36 md:scroll-mt-30">
      <figure>
        {/* ⚠️ 3/1 e não 21/9 a partir de `sm`. A 21/9 a foto pedia 612px de um
            1440 e, num notebook de 1440×800, a primeira tela inteira era uma
            fotografia genérica e a legenda do mock — com o nome da fábrica, que
            é o motivo da visita, abaixo da dobra. O comp aprovado dá à imagem
            cerca de um terço da tela; 3/1 devolve isso (480px) e ainda corta
            céu e deck em vez das laterais, preservando o assunto. */}
        <div className="relative aspect-3/2 w-full bg-ink sm:aspect-3/1">
          <Image
            src={imagem.src}
            alt={imagem.alt}
            fill
            priority
            sizes="100vw"
            style={imagem.posicao ? { objectPosition: imagem.posicao } : undefined}
            className="object-cover"
          />
        </div>
        {/* Grotesca em caixa baixa: 85 caracteres de frase em mono versal a
            11px é grito e destrói a leitura — e esta é a única linha que separa
            o site de apresentar imagem gerada como foto de produto. A
            declaração mais importante da página não pode ser o texto menos
            legível dela. */}
        <figcaption className="text-support px-5 pt-3 text-graphite md:px-8">
          Imagem de referência. Ela ilustra a linha da fábrica e não é uma peça
          do catálogo dela.
        </figcaption>
      </figure>

      <div className="px-5 pt-10 pb-14 md:px-8 md:pt-14 md:pb-24">
        <div className="grid gap-y-6 md:grid-cols-[5rem_minmax(0,64rem)] md:gap-x-8">
          <p aria-hidden="true" className="mono h-fit text-graphite">
            {numero}
          </p>

          <div className="min-w-0">
            {/* A faixa NÃO repete o nome da marca — ele vem em display na linha
                seguinte, e ler "TRISOL" logo acima de "Trisol" é o leitor
                gastando um segundo com nada. Ela carrega o que o nome não diz:
                de onde a fábrica é, e o território em que a Belmare a
                representa — igual para todas, sem recorte por marca.

                A Trisol não declara cidade em fonte nenhuma — só o DDD 48.
                "Origem não declarada" com todas as letras: preencher com
                "Florianópolis" porque o DDD bate seria inventar, e o leitor
                desta página é exatamente quem repara nisso. */}
            <p className="mono uppercase text-graphite">
              {representada.base ?? "Origem não declarada"} · Sul do Brasil
            </p>

            <h1 className="text-display mt-4 max-w-[14ch] font-normal text-balance">
              {representada.nome}
            </h1>

            <p className="text-body mt-6 max-w-[48ch] text-pretty">
              {representada.resolve}.
            </p>

            <p className="text-support mt-3 max-w-[56ch] text-pretty text-graphite">
              {representada.fato}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
