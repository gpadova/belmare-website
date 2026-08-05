import Image from "next/image";
import Link from "next/link";

import { Seta } from "@/components/icones";
import { comInicialMaiuscula, porExtenso } from "@/lib/frase";
import {
  chamadasDesenhadas,
  linhaDaChamada,
  numeroDaChamada,
} from "@/lib/prancha-area-externa";
import { pranchaDaPagina } from "@/lib/prancha-consulta";
import { paginaDaRepresentada } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * PRANCHA 02 — a área externa desmontada.
 *
 * `/quem-somos` desenha ONDE a Belmare opera. Esta desenha O QUE ela resolve.
 * Dois desenhos, a mesma gramática de fio, registro e rótulo em mono, dois
 * assuntos diferentes, os dois construídos sobre dado declarado.
 *
 * ⚠️ A moldura, o carimbo e a escala gráfica que faziam do mapa de
 * `/quem-somos` uma prancha completa saíram daquela página em 05/08/2026 —
 * eram desenho sobre o próprio desenho numa página institucional. Aqui a
 * moldura fica: esta é uma prancha DE VERDADE, com chamadas numeradas que
 * apontam para objetos de uma fotografia, e sem o quadro as chamadas ficam
 * soltas sobre a imagem.
 *
 * A rota existia com um problema: o site já mostrou as quatro marcas duas vezes
 * — a galeria fotográfica da home e a lista de quatro linhas de `/quem-somos`. Uma
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
 * `bg-paper px-1.5` que abre o contorno para a sigla do estado no mapa de
 * `/quem-somos`.
 * Escurecer a foto seria a solução da abertura da home, e é o gesto errado
 * aqui: numa prancha o desenho não se apaga para o rótulo caber.
 *
 * ⚠️ **A FOTOGRAFIA E AS CHAMADAS VÊM DO PAINEL A PARTIR DE PRA-123.** Eram uma
 * constante de acervo e quatro pares de porcentagens medidas à mão; hoje o
 * operador sobe a fotografia e arrasta os pinos (`globals/prancha.ts`). O que
 * este componente ganhou com isso, e não é cosmético: a moldura passou a tomar
 * o ASPECTO DO ARQUIVO em vez de um `aspect-16/9` cravado. Enquanto a foto era
 * fixa dava para conferir o aspecto à mão; com o operador subindo a dele, um
 * aspecto cravado recortaria a imagem por dentro da moldura e cada seta sairia
 * de lugar de uma vez só — silenciosamente.
 *
 * ⚠️ **CHAMADA SEM REPRESENTADA PUBLICADA NÃO É DESENHADA.** Antes, a legenda
 * pulava a linha e o número continuava sobre a foto: uma chave apontando para
 * uma legenda que não existe. Hoje o desenho e a legenda saem da MESMA lista
 * filtrada, e a numeração é a posição nela — três chamadas numeram 01–03.
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

export async function PranchaAreaExterna() {
  const [prancha, representadas] = await Promise.all([
    pranchaDaPagina(),
    representadasDaPagina(),
  ]);

  /* Desenho e legenda saem daqui, das duas listas cruzadas uma vez. Uma chamada
     cuja marca não está publicada some das duas — nunca de uma só. O cruzamento
     mora em `lib` para poder ser afirmado por teste com três e com cinco
     chamadas: é ele que decide o que a prancha desenha. */
  const chamadas = chamadasDesenhadas(prancha.chamadas, representadas);

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

            {/* ⚠️ O ASPECTO É O DO ARQUIVO, EM TODA LARGURA, e isso não é
                preferência de enquadramento: as chamadas estão em porcentagem
                DA CAIXA, e `object-cover` num aspecto diferente recorta a
                imagem por dentro dela. Um 3/2 no telefone cortaria 7,8% de cada
                lado e empurraria a chamada 01 para fora do sofá — a seta
                passaria a apontar para o deck vazio. A prancha não recorta.

                ⚠️ O número sai de `width`/`height` do arquivo (PRA-123), não de
                um `aspect-16/9` cravado: a fotografia agora é do operador, e
                cravar aqui o aspecto da foto ANTERIOR seria a mesma armadilha
                das coordenadas medidas à mão, só que uma camada acima. */}
            <div
              className="relative bg-ink"
              style={{
                aspectRatio: `${prancha.foto.largura} / ${prancha.foto.altura}`,
              }}
            >
              <Image
                src={prancha.foto.src}
                alt={prancha.foto.alt}
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
                {chamadas.map(({ chamada }, i) => {
                  /* ⚠️ O traço sai da MESMA função que o painel usa para
                     desenhar a pré-visualização (`lib/prancha-area-externa.ts`).
                     Duas cópias desta expressão é como o operador arrasta
                     olhando para um desenho e publica outro. */
                  const traco = linhaDaChamada(chamada);

                  /* ⚠️ A chave é a POSIÇÃO, não o slug: nada no painel impede
                     duas chamadas para a mesma fábrica (uma marca presente em
                     dois objetos da cena), e duas chaves iguais numa lista do
                     React é reconciliação errada — o traço de uma chamada
                     parado na coordenada da outra. */
                  return (
                    <g key={i} fill="none">
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
                {chamadas.map(({ chamada }, i) => (
                  <span
                    key={i}
                    className="mono absolute -translate-x-1/2 -translate-y-1/2 bg-paper px-1.5 py-0.5 text-ink"
                    style={{
                      left: `${chamada.rotulo.x}%`,
                      top: `${chamada.rotulo.y}%`,
                    }}
                  >
                    {numeroDaChamada(i)}
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
            Imagem de referência. Não é uma obra entregue pela Belmare, e
            nenhuma peça da cena é produto de catálogo das representadas. As
            chamadas mostram de que fábrica viria cada parte, e não modelos.
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

          {/* ⚠️ A contagem é GERADA das chamadas de fato desenhadas, não da
              palavra "quatro" digitada — a mesma regra de `lib/frase.ts` que
              PRA-122 aplicou nas outras cinco frases contadas do site, e que
              esta tinha escapado. Com o painel abrindo a prancha para três ou
              cinco chamadas, um "Quatro" cravado aqui passaria a discordar do
              desenho logo ao lado, em silêncio. */}
          <p className="text-body mt-5 max-w-[46ch] text-pretty text-graphite">
            {comInicialMaiuscula(porExtenso(chamadas.length))} fábricas montam
            uma área externa inteira. A prancha marca onde entra cada uma, e a
            legenda leva para a página da fábrica.
          </p>

          {/* h2, não h3: promover o título da página a h1 abriu um salto de
              nível — quem navega por rotor saía do h1 e caía em "Legenda" como
              neto, concluindo que uma seção intermediária tinha ficado de fora.
              É o mesmo papel de rótulo em mono que o h2 da seção de registros
              já cumpre.

              ⚠️ Sem chamada nenhuma, o título e a lista SOMEM — seção anulável.
              O painel recusa publicar uma prancha sem chamadas, mas a página
              não pode contar com isso: um rascunho, ou uma prancha cujas marcas
              foram todas despublicadas, chega aqui com a lista vazia, e um
              "Legenda" sobre nada é exatamente o título órfão que a regra
              existe para não ter. */}
          {chamadas.length > 0 && (
            <>
          <h2 className="mono uppercase mt-10 text-graphite">Legenda</h2>

          <ol className="mt-3 border-t border-line">
            {chamadas.map(({ representada }, i) => {
              return (
                <li key={i} className="border-b border-line">
                  <Link
                    href={paginaDaRepresentada(representada)}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-baseline gap-x-3 py-4 transition-colors hover:bg-surface"
                  >
                    <span className="mono text-graphite">
                      {numeroDaChamada(i)}
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
            </>
          )}

          {/* O carimbo do pé conta as REPRESENTADAS CADASTRADAS, não as
              chamadas desenhadas — e desde PRA-123 os dois números podem
              divergir. É deliberado: a linha está emparelhada com o território
              ("Sul do Brasil"), que é fato da empresa e não do desenho, e logo
              abaixo desta seção o índice de registros lista todas as marcas.
              Contar as chamadas aqui faria o carimbo dizer "três" três
              centímetros acima de uma lista de quatro. Quem conta o desenho é a
              legenda, que o leitor acabou de ler linha a linha. */}
          <p className="mono uppercase mt-4 text-graphite">
            {representadas.length} representadas · Sul do Brasil
          </p>
        </div>
      </div>
    </section>
  );
}
