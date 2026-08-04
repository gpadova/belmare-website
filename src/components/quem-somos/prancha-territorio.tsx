import { Bloco } from "@/components/quem-somos/bloco";
import {
  ESTADOS,
  GRATICULA,
  PRANCHA,
  projetar,
  SEDE,
} from "@/lib/territorio";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { emLista, porExtenso } from "@/lib/frase";
import { TERRITORIO } from "@/lib/empresa";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * 03 — PRANCHA 01. O território.
 *
 * O único gráfico da página, e o momento que fica na cabeça de quem sai. Não é
 * um mapa ilustrado: é a malha oficial do IBGE reprojetada em Mercator e
 * traçada no mesmo fio de 1px que separa as seções deste site. Um representante
 * que desenha o próprio território numa prancha de arquitetura está falando com
 * arquiteto na língua dele.
 *
 * A regra que segura a honestidade do desenho: **a prancha nomeia estados, não
 * cidades.** Não há presença municipal confirmada em lugar nenhum, e um mapa
 * com pontos em Curitiba, Balneário e Porto Alegre seria invenção com cara de
 * dado. Só Florianópolis é marcada, porque é o endereço registrado da empresa.
 *
 * Três decisões de construção que não são detalhe:
 *
 * 1. **Geometria em SVG, texto em HTML.** Rótulo dentro do viewBox escala junto
 *    com o desenho — a prancha ficaria com mono de 22px no desktop e de 7px no
 *    telefone. Fora dele, a mono tem 11px em qualquer largura, que é o corpo
 *    que o sistema define para dado técnico.
 * 2. **A escala gráfica declara o paralelo.** Em Mercator a escala varia com a
 *    latitude; uma barra sem essa nota seria uma medida falsa numa página cujo
 *    argumento inteiro é que os dados são conferíveis. Ela é calculada aqui a
 *    partir da projeção, não medida no olho.
 * 3. **Sem movimento.** Nada de traço que se desenha ao rolar. O arquiteto
 *    volta muitas vezes, e a contenção da home vale aqui inteira.
 */

/* A folha: o desenho ocupa 0..1000 × 0..1334; o resto é margem, carimbo e
   escala. */
const FOLHA = { x: -110, y: -150, largura: 1220, altura: 1720 };
const MOLDURA = {
  x: FOLHA.x + 8,
  y: FOLHA.y + 8,
  largura: FOLHA.largura - 16,
  altura: FOLHA.altura - 16,
};
const CARIMBO_Y = 1470;

/* Escala gráfica. Um grau de longitude vale 111,32 km × cos(latitude); a barra
   é honesta no paralelo declarado e a nota diz qual é. */
const PARALELO_DA_ESCALA = 28;
const KM_POR_GRAU =
  111.32 * Math.cos((PARALELO_DA_ESCALA * Math.PI) / 180);
/* 400 km, e não 200: numa barra de 200 os três rótulos não cabem, e sem o
   rótulo do traço do meio o número da ponta cai em cima dele — o leitor vê um
   traço marcado "200" na metade e lê uma barra de 400. Em 400 km os três
   números assentam centrados no próprio traço, com folga, nas duas larguras. */
const ESCALA_KM = 400;
const ESCALA_LARGURA =
  (ESCALA_KM / KM_POR_GRAU) * PRANCHA.projecao.escala;
const ESCALA = { x: -70, y: 1400, largura: ESCALA_LARGURA };

/** Ponto da folha em porcentagem da caixa — para pousar rótulo em HTML. */
function emPorcento(x: number, y: number) {
  return {
    left: `${((x - FOLHA.x) / FOLHA.largura) * 100}%`,
    top: `${((y - FOLHA.y) / FOLHA.altura) * 100}%`,
  };
}

const sede = projetar(SEDE.lon, SEDE.lat);

/** O registro de prancha que marca a sede: círculo e cruz, no fio do sistema. */
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

/**
 * ⚠️ **O PARÁGRAFO DESTE BLOCO NÃO TEM CAMPO NO PAINEL, E É O ÚNICO DOS SEIS
 * ASSIM.** Ele nomeia os três estados, conta as representadas e nomeia a cidade
 * da sede — e as três coisas saem do mesmo dado que DESENHA a prancha ao lado
 * ou do cadastro da empresa. Um campo de texto aqui é como a prosa passa a
 * dizer "quatro estados" ao lado de um desenho com três, e a página passaria a
 * contradizer o único gráfico que ela tem.
 */
export async function PranchaTerritorio() {
  const representadas = await representadasDaPagina();
  const { endereco } = await buscarEmpresa();

  return (
    <Bloco numero="03">
      {/* No telefone a ordem é título → argumento → prancha → legenda: a
          prancha é o momento da página e não pode chegar depois de 500px de
          prosa que já fez o argumento. No desktop ela ocupa a coluna da
          direita inteira, com o texto e a legenda empilhados à esquerda. */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_30rem] md:grid-rows-[auto_auto] md:gap-x-12 lg:gap-x-16">
        <div className="order-1 md:col-start-1 md:row-start-1">
          <h2 className="text-h1 max-w-[18ch] font-normal text-balance">
            A Belmare atende {porExtenso(TERRITORIO.length, "m")} estados.
          </h2>
          <p className="text-body mt-6 max-w-[52ch] text-pretty text-graphite">
            As {porExtenso(representadas.length)} fábricas representadas atendem
            o mesmo território: {emLista(TERRITORIO)}. Não há divisão de região
            por marca.
            {endereco?.cidade !== undefined
              ? ` A sede fica em ${endereco.cidade}.`
              : ""}
          </p>
        </div>

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
                <span className="sr-only">Marca de sede na prancha</span>
              </dt>
              <dd className="text-support">
                {SEDE.cidade} · {SEDE.uf} — sede
              </dd>
            </div>
          </dl>

          {/* A regra do desenho, dita como fato e não como metodologia. A
              versão anterior explicava a decisão editorial ao leitor ("a
              prancha nomeia estados, não cidades") — a página falando da
              própria construção, que é metade do que fazia esta rota soar a
              robô. O fato que importa é que o atendimento não tem recorte
              municipal. */}
          <p className="text-support mt-6 max-w-[52ch] text-graphite">
            O atendimento cobre os {porExtenso(TERRITORIO.length, "m")} estados
            por inteiro. {SEDE.cidade} aparece no mapa porque é onde fica a
            sede.
          </p>
        </div>

        {/* A prancha. `figure` porque é uma figura de verdade, com legenda para
            quem não enxerga o desenho.

            Sem `mx-auto`: no telefone a prancha ocupa a coluna inteira e
            pendura na mesma margem esquerda de todo fio, rótulo e parágrafo
            da página. Numa página em que a grade É o argumento, o único
            gráfico centralizado seria a primeira coisa que um leitor atento
            veria — e a única coisa fora do lugar. */}
        <figure className="order-2 w-full md:col-start-2 md:row-span-2 md:row-start-1">
          <div className="relative">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox={`${FOLHA.x} ${FOLHA.y} ${FOLHA.largura} ${FOLHA.altura}`}
              className="block w-full"
            >
              {/* Moldura e carimbo — o fio, em cinza de divisor. */}
              <g
                stroke="var(--color-line)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                fill="none"
              >
                <rect
                  x={MOLDURA.x}
                  y={MOLDURA.y}
                  width={MOLDURA.largura}
                  height={MOLDURA.altura}
                />
                <path
                  d={`M${MOLDURA.x} ${CARIMBO_Y} H${MOLDURA.x + MOLDURA.largura}`}
                />

                {/* Graticula: meridianos e paralelos inteiros, de 2 em 2 graus.
                    Coordenada real, na mesma projeção do contorno. */}
                {GRATICULA.meridianos.map((lon) => {
                  const { x } = projetar(lon, 0);
                  return (
                    <path key={`m${lon}`} d={`M${x} 0 V${PRANCHA.altura}`} />
                  );
                })}
                {GRATICULA.paralelos.map((lat) => {
                  const { y } = projetar(0, lat);
                  return (
                    <path key={`p${lat}`} d={`M0 ${y} H${PRANCHA.largura}`} />
                  );
                })}

              </g>

              {/* A escala é instrumento, não moldura: sai do cinza de divisor e
                  vai para o grafite, senão o único aparelho de medida da
                  prancha some no mesmo peso da graticula que ele mede. */}
              <path
                stroke="var(--color-graphite)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                fill="none"
                d={`M${ESCALA.x} ${ESCALA.y - 9} V${ESCALA.y + 9} M${ESCALA.x} ${ESCALA.y} H${ESCALA.x + ESCALA.largura} M${ESCALA.x + ESCALA.largura / 2} ${ESCALA.y - 6} V${ESCALA.y + 6} M${ESCALA.x + ESCALA.largura} ${ESCALA.y - 9} V${ESCALA.y + 9}`}
              />

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
              </g>

              {/* A sede. */}
              <g
                stroke="var(--color-ink)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                fill="none"
              >
                <circle cx={sede.x} cy={sede.y} r={17} />
                <path
                  d={`M${sede.x} ${sede.y - 34} V${sede.y - 8} M${sede.x} ${sede.y + 8} V${sede.y + 34} M${sede.x - 34} ${sede.y} H${sede.x - 8} M${sede.x + 8} ${sede.y} H${sede.x + 34}`}
                />
              </g>
            </svg>

            {/* Rótulos em HTML: mono de 11px em qualquer largura de prancha.
                `whitespace-nowrap` não é detalhe — um `span` absoluto ancorado
                perto da margem direita tem largura disponível quase zero e
                quebra a palavra no meio do carimbo. */}
            <div aria-hidden="true" className="absolute inset-0 whitespace-nowrap">
              <span
                className="mono uppercase absolute text-graphite"
                style={emPorcento(MOLDURA.x + 26, MOLDURA.y + 22)}
              >
                Prancha 01
              </span>

              {/* `bg-paper` + folga lateral é o recorte da prancha: sem ele o
                  meridiano passa entre o P e o R de PR e no meio de
                  FLORIANÓPOLIS, e o foco do desenho vira a coisa mais suja da
                  folha. Toda prancha desenhada abre a linha para o rótulo. */}
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

              {/* No telefone a legenda ao lado já nomeia a sede, e o rótulo
                  colidiria com a sigla de SC. */}
              {/* Ancorado em −52, não em −26: o recorte de `px-1.5` avança
                  ~15 unidades à direita da âncora, e a −26 ele comia a ponta do
                  braço esquerdo da cruz, deixando o único registro da prancha
                  assimétrico. A −52 a borda do recorte cai fora da ponta. */}
              <span
                className="mono uppercase absolute hidden -translate-x-full -translate-y-1/2 bg-paper px-1.5 text-ink md:block"
                style={emPorcento(sede.x - 52, sede.y)}
              >
                {SEDE.cidade}
              </span>

              {/* Cada número centrado no seu próprio traço, inclusive o do
                  meio. A unidade acompanha só o último. */}
              {[0, 0.5, 1].map((f) => (
                <span
                  key={f}
                  className="mono absolute -translate-x-1/2 -translate-y-full pb-1 text-graphite"
                  style={emPorcento(
                    ESCALA.x + ESCALA.largura * f,
                    ESCALA.y - 9,
                  )}
                >
                  {ESCALA_KM * f}
                  {f === 1 ? " km" : ""}
                </span>
              ))}

              <span
                className="mono uppercase absolute -translate-y-1/2 text-graphite"
                style={emPorcento(
                  MOLDURA.x + 26,
                  (CARIMBO_Y + MOLDURA.y + MOLDURA.altura) / 2,
                )}
              >
                Território atendido
              </span>
              <span
                className="mono uppercase absolute -translate-x-full -translate-y-1/2 pr-[26px] text-graphite"
                style={emPorcento(
                  MOLDURA.x + MOLDURA.largura,
                  (CARIMBO_Y + MOLDURA.y + MOLDURA.altura) / 2,
                )}
              >
                Malha IBGE
              </span>
            </div>
          </div>

          <figcaption className="text-support mt-5 text-graphite">
            <span className="sr-only">
              Prancha do território atendido: contorno do Paraná, de Santa
              Catarina e do Rio Grande do Sul, com a sede marcada em
              Florianópolis.{" "}
            </span>
            Malha territorial do IBGE, projeção de Mercator. Escala gráfica
            válida no paralelo {PARALELO_DA_ESCALA}° S.
          </figcaption>
        </figure>
      </div>
    </Bloco>
  );
}
