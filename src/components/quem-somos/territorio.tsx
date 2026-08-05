import { Secao } from "@/components/quem-somos/secao";
import { textosDeQuemSomos } from "@/lib/quem-somos-consulta";
import { ESTADOS, PRANCHA, projetar, SEDE } from "@/lib/territorio";

/**
 * Onde a Belmare atende.
 *
 * O contorno dos três estados é a malha oficial do IBGE reprojetada em
 * Mercator (`lib/territorio.ts`), traçada no mesmo fio de 1px que separa as
 * seções do site. Continua sendo dado, e não ilustração: mexer no desenho é
 * regerar a partir da fonte, nunca editar coordenada à mão.
 *
 * ⚠️ **O APARATO DE PRANCHA DE ARQUITETURA SAIU, E O MAPA FICOU.** O desenho
 * vinha dentro de uma folha técnica completa — moldura, carimbo, graticula de
 * dois em dois graus, escala gráfica calculada com o paralelo declarado, e os
 * rótulos "PRANCHA 01" e "MALHA IBGE" nos cantos. Era desenho sobre o próprio
 * desenho: nada daquilo respondia a pergunta que traz alguém a esta seção, que
 * é se a Belmare atende a cidade de quem está lendo. O que responde são os três
 * contornos, as três siglas e a marca da sede. Uma escala em quilômetros numa
 * página institucional é a empresa exibindo o método em vez de dar a resposta.
 *
 * ⚠️ **O MAPA NOMEIA ESTADOS, NÃO CIDADES.** Não há presença municipal
 * confirmada em documento nenhum, e pontos em Curitiba, Balneário e Porto
 * Alegre seriam invenção com cara de dado. Só Florianópolis é marcada, porque é
 * o endereço registrado da empresa.
 *
 * ⚠️ **SEM MOVIMENTO.** Nada de traço que se desenha ao rolar. O arquiteto
 * volta muitas vezes, e a contenção do resto do site vale aqui inteira.
 *
 * ⚠️ **GEOMETRIA EM SVG, TEXTO EM HTML.** Rótulo dentro do `viewBox` escala
 * junto com o desenho — as siglas ficariam com 22px no desktop e 7px no
 * telefone. Fora dele, a mono tem 11px em qualquer largura.
 *
 * ⚠️ **O PARÁGRAFO É CAMPO, MAS O TERRITÓRIO CONTINUA SAINDO DA MALHA.** Este
 * texto era o único da rota sem campo nenhum, e o argumento estava certo: ele
 * nomeia os três estados, conta as representadas e nomeia a cidade da sede, e
 * as três coisas saem do mesmo dado que DESENHA o mapa ao lado. Um textarea
 * livre é como a prosa passa a dizer "quatro estados" ao lado de um desenho com
 * três. O que destravou a edição foi o marcador: quem escreve usa `{estados}` e
 * `{quantosEstados}`, e a lista continua vindo de `lib/territorio.ts`. Expandir
 * território continua sendo regerar a malha — nenhum campo do painel desenha
 * um quarto contorno.
 */

/* A folha é o desenho mais uma folga de 20 unidades: sem o carimbo e sem a
   escala, a margem que sobrava embaixo era vão, não composição. A folga existe
   só para os braços da cruz da sede não encostarem na borda do quadro. */
const FOLGA = 20;
const FOLHA = {
  x: -FOLGA,
  y: -FOLGA,
  largura: PRANCHA.largura + FOLGA * 2,
  altura: PRANCHA.altura + FOLGA * 2,
};

/** Ponto da folha em porcentagem da caixa — para pousar rótulo em HTML. */
function emPorcento(x: number, y: number) {
  return {
    left: `${((x - FOLHA.x) / FOLHA.largura) * 100}%`,
    top: `${((y - FOLHA.y) / FOLHA.altura) * 100}%`,
  };
}

const sede = projetar(SEDE.lon, SEDE.lat);

/** A marca da sede: círculo e cruz, no fio do sistema. */
function MarcaDeSede({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 0 V4 M12 20 V24 M0 12 H4 M20 12 H24" />
    </svg>
  );
}

export async function Territorio() {
  const { territorioTitulo, territorio } = await textosDeQuemSomos();

  return (
    <Secao titulo={territorioTitulo}>
      {/* No telefone a ordem é título → texto → mapa → legenda. No desktop o
          mapa ocupa a coluna da direita inteira, com o texto e a lista
          empilhados à esquerda. */}
      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1fr)_26rem] md:grid-rows-[auto_auto] md:gap-x-12 lg:gap-x-16">
        {territorio !== undefined && (
          <div className="order-1 md:col-start-1 md:row-start-1">
            <p className="text-body max-w-[52ch] text-pretty text-graphite">
              {territorio}
            </p>
          </div>
        )}

        <div className="order-3 md:col-start-1 md:row-start-2">
          <dl className="border-t border-line">
            {ESTADOS.map((estado) => (
              <div
                key={estado.uf}
                className="flex items-baseline gap-6 border-b border-line py-3"
              >
                <dt className="mono uppercase w-8 shrink-0 text-graphite">
                  {estado.uf}
                </dt>
                <dd className="text-support">{estado.nome}</dd>
              </div>
            ))}
            <div className="flex items-baseline gap-6 border-b border-line py-3">
              <dt className="w-8 shrink-0 pt-[0.15rem] text-graphite">
                <MarcaDeSede className="h-4 w-4" />
                <span className="sr-only">Marca de sede no mapa</span>
              </dt>
              <dd className="text-support">
                {SEDE.cidade} · {SEDE.uf} · sede
              </dd>
            </div>
          </dl>
        </div>

        {/* Sem `mx-auto`: no telefone o mapa ocupa a coluna inteira e pendura na
            mesma margem esquerda de todo fio, rótulo e parágrafo da página. */}
        <figure className="order-2 w-full md:col-start-2 md:row-span-2 md:row-start-1">
          <div className="relative">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox={`${FOLHA.x} ${FOLHA.y} ${FOLHA.largura} ${FOLHA.altura}`}
              className="block w-full"
            >
              {/* Os três estados, no fio de 1px do sistema. As fronteiras
                  compartilhadas coincidem vértice a vértice: traçar os três
                  contornos fechados não engrossa a divisa. */}
              <g
                stroke="var(--color-ink)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                fill="none"
              >
                {ESTADOS.map((estado) => (
                  <path key={estado.uf} d={estado.d} />
                ))}

                <circle cx={sede.x} cy={sede.y} r={17} />
                <path
                  d={`M${sede.x} ${sede.y - 34} V${sede.y - 8} M${sede.x} ${sede.y + 8} V${sede.y + 34} M${sede.x - 34} ${sede.y} H${sede.x - 8} M${sede.x + 8} ${sede.y} H${sede.x + 34}`}
                />
              </g>
            </svg>

            {/* Rótulos em HTML: mono de 11px em qualquer largura de mapa.
                `whitespace-nowrap` não é detalhe — um `span` absoluto ancorado
                perto da margem direita tem largura disponível quase zero e
                quebra a palavra no meio do desenho. */}
            <div aria-hidden="true" className="absolute inset-0 whitespace-nowrap">
              {/* `bg-paper` + folga lateral abre a linha para o rótulo, que é o
                  que toda carta desenhada faz: sem isso a sigla assenta em cima
                  do próprio contorno. */}
              {ESTADOS.map((estado) => (
                <span
                  key={estado.uf}
                  className="mono uppercase absolute -translate-x-1/2 -translate-y-1/2 bg-paper px-1.5 text-ink"
                  style={emPorcento(
                    (estado.sigla.x / 100) * PRANCHA.largura,
                    (estado.sigla.y / 100) * PRANCHA.altura,
                  )}
                >
                  {estado.uf}
                </span>
              ))}

              {/* No telefone a lista ao lado já nomeia a sede, e o rótulo
                  colidiria com a sigla de SC.

                  Ancorado em −52, não em −26: o recorte de `px-1.5` avança ~15
                  unidades à direita da âncora, e a −26 ele comia a ponta do
                  braço esquerdo da cruz. */}
              <span
                className="mono uppercase absolute hidden -translate-x-full -translate-y-1/2 bg-paper px-1.5 text-ink md:block"
                style={emPorcento(sede.x - 52, sede.y)}
              >
                {SEDE.cidade}
              </span>
            </div>
          </div>

          {/* A legenda visível saiu junto com a escala: ela declarava a
              projeção e o paralelo, que é nota de prancha, não informação de
              página institucional. A descrição para quem não enxerga o desenho
              fica, porque o mapa carrega informação que o texto ao lado não
              repete inteira. */}
          <figcaption className="sr-only">
            Mapa do território atendido: contorno do Paraná, de Santa Catarina e
            do Rio Grande do Sul, com a sede marcada em {SEDE.cidade}.
          </figcaption>
        </figure>
      </div>
    </Secao>
  );
}
