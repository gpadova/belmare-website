"use client";

import { useAllFormFields, useConfig, useForm } from "@payloadcms/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  PASSO,
  PASSO_LARGO,
  deslocarPonto,
  linhaDaChamada,
  numeroDaChamada,
  pontoNaCaixa,
  type Ponto,
} from "@/lib/prancha-area-externa";

/**
 * O campo de pinos arrastáveis da prancha — o único pedaço de painel desenhado
 * à mão neste projeto.
 *
 * ⚠️ **ELE NÃO GUARDA NADA.** É uma vista sobre o array `chamadas` do global
 * `Prancha`: lê os quatro números de cada linha do estado do formulário e
 * escreve de volta nos MESMOS caminhos (`chamadas.0.rotuloX`…). Os campos
 * numéricos continuam existindo logo abaixo, visíveis e digitáveis. Isso é
 * deliberado e não é redundância:
 *
 *   · **Arrastar é conforto, digitar é garantia.** Um campo que só responde a
 *     mouse tranca do lado de fora quem não usa mouse — e não há aqui um
 *     equivalente óbvio como "escreva o nome da cidade". Cada pino é um botão
 *     de verdade: chega por Tab, move com as setas, anuncia onde parou.
 *   · **O número visível é a prova.** O operador arrasta e VÊ a porcentagem
 *     mudar no campo abaixo. Sem isso, o campo pede fé em algo invisível, e
 *     "arrastei e não sei se pegou" é o começo de um telefonema.
 *
 * ⚠️ **A FOTOGRAFIA APARECE NO ASPECTO REAL DELA, e isso é requisito, não
 * capricho de apresentação.** A porcentagem é da CAIXA da imagem: se o painel
 * mostrasse a foto recortada num aspecto fixo, o operador arrastaria o pino
 * para cima do sofá numa moldura que a página não desenha, e publicaria uma
 * seta apontando para o lado. O que ele vê aqui tem que ser o que a página
 * desenha — daí o `aspectRatio` sair de `width`/`height` do arquivo, e o traço
 * da chamada sair da MESMA função de `lib` que o site usa.
 */

type Coordenadas = { rotulo: Ponto; alvo: Ponto };

type Fotografia = {
  /** ⚠️ A fotografia guarda de QUEM ela é. Sem isso, trocar o upload deixaria a
   *  imagem anterior na tela até a busca nova responder, e o operador
   *  arrastaria pinos sobre a fotografia errada por alguns quadros. */
  id: number | string;
  url: string;
  largura: number;
  altura: number;
  descricao: string;
};

/** Qual pino está sendo movido: a linha do array e qual dos dois pontos. */
type Alvo = { indice: number; ponto: "rotulo" | "alvo" };

const RAIZ = "chamadas";

/** Uma porcentagem como o painel a escreve em pt-BR — vírgula, uma casa. */
function comoTexto(valor: number): string {
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function numeroDoEstado(valor: unknown): number {
  const numero = typeof valor === "number" ? valor : Number(valor);
  return Number.isFinite(numero) ? numero : 0;
}

/** O identificador que um campo de relacionamento devolve — às vezes o número,
 *  às vezes o documento inteiro, dependendo de como o painel o carregou. */
function identidade(valor: unknown): number | string | undefined {
  if (typeof valor === "number" || typeof valor === "string") return valor;
  if (valor && typeof valor === "object" && "id" in valor) {
    const id = (valor as { id?: unknown }).id;
    if (typeof id === "number" || typeof id === "string") return id;
  }
  return undefined;
}

export function CampoDePinos() {
  const [campos, despachar] = useAllFormFields();
  const { setModified } = useForm();
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig();

  const caixaRef = useRef<HTMLDivElement | null>(null);
  const [arrastando, setArrastando] = useState<Alvo | undefined>(undefined);
  const [emFoco, setEmFoco] = useState<number | undefined>(undefined);
  const [aviso, setAviso] = useState("");
  const [carregada, setCarregada] = useState<Fotografia | undefined>(undefined);
  const [nomes, setNomes] = useState<Record<string, string>>({});

  const base = `${serverURL ?? ""}${api}`;

  /* Quantas chamadas existem. Contada pelos CAMINHOS do estado do formulário,
     e não por `rows`: os caminhos são o que este componente de fato lê e
     escreve, então contar por eles não pode discordar do que ele desenha. */
  const quantidade = useMemo(() => {
    const indices = Object.keys(campos)
      .map((chave) => new RegExp(`^${RAIZ}\\.(\\d+)\\.rotuloX$`).exec(chave))
      .filter((achado): achado is RegExpExecArray => achado !== null)
      .map((achado) => Number(achado[1]));

    return indices.length === 0 ? 0 : Math.max(...indices) + 1;
  }, [campos]);

  const coordenadas: Coordenadas[] = useMemo(
    () =>
      Array.from({ length: quantidade }, (_, indice) => ({
        rotulo: {
          x: numeroDoEstado(campos[`${RAIZ}.${indice}.rotuloX`]?.value),
          y: numeroDoEstado(campos[`${RAIZ}.${indice}.rotuloY`]?.value),
        },
        alvo: {
          x: numeroDoEstado(campos[`${RAIZ}.${indice}.alvoX`]?.value),
          y: numeroDoEstado(campos[`${RAIZ}.${indice}.alvoY`]?.value),
        },
      })),
    [campos, quantidade],
  );

  const idDaFoto = identidade(campos.foto?.value);

  /* As representadas escolhidas, para nomear cada pino em voz alta. O rótulo do
     DESENHO nunca sai daqui — ele é a `parte` da representada, composta pela
     página. Aqui é só para o operador (e o leitor de tela) saber qual pino é
     qual sem contar de cabeça. */
  const idsDasChamadas = useMemo(
    () =>
      Array.from({ length: quantidade }, (_, indice) =>
        identidade(campos[`${RAIZ}.${indice}.representada`]?.value),
      ),
    [campos, quantidade],
  );

  /* ⚠️ Derivada no render, não zerada por efeito: a fotografia só vale para o
     upload que está escolhido AGORA. Guardar "nenhuma" com um `setState` dentro
     do efeito seria uma renderização em cascata (e o compilador do React recusa
     — com razão): a mesma verdade sai de comparar o que foi carregado com o que
     o formulário tem. */
  const foto = carregada?.id === idDaFoto ? carregada : undefined;

  useEffect(() => {
    if (idDaFoto === undefined) return;

    let cancelado = false;

    fetch(`${base}/imagens/${idDaFoto}?depth=0`, { credentials: "include" })
      .then((resposta) => (resposta.ok ? resposta.json() : undefined))
      .then((doc) => {
        if (cancelado || !doc) return;
        if (typeof doc.url !== "string") return;
        if (typeof doc.width !== "number" || typeof doc.height !== "number") {
          return;
        }

        setCarregada({
          id: idDaFoto,
          url: doc.url,
          largura: doc.width,
          altura: doc.height,
          descricao: typeof doc.descricao === "string" ? doc.descricao : "",
        });
      })
      .catch(() => {
        /* Silêncio proposital: a fotografia não carregar não pode derrubar o
           formulário inteiro. O aviso abaixo já diz que não há o que arrastar,
           e os campos numéricos continuam lá. */
      });

    return () => {
      cancelado = true;
    };
  }, [base, idDaFoto]);

  useEffect(() => {
    const pendentes = idsDasChamadas.filter(
      (id) => id !== undefined && nomes[String(id)] === undefined,
    );
    if (pendentes.length === 0) return;

    let cancelado = false;

    Promise.all(
      pendentes.map((id) =>
        fetch(`${base}/representadas/${id}?depth=0`, {
          credentials: "include",
        })
          .then((resposta) => (resposta.ok ? resposta.json() : undefined))
          .then((doc) =>
            doc && typeof doc.nome === "string"
              ? ([String(id), doc.nome] as const)
              : undefined,
          )
          .catch(() => undefined),
      ),
    ).then((achados) => {
      if (cancelado) return;
      const encontrados = achados.filter(
        (achado): achado is readonly [string, string] => achado !== undefined,
      );
      if (encontrados.length === 0) return;
      setNomes((anteriores) => ({
        ...anteriores,
        ...Object.fromEntries(encontrados),
      }));
    });

    return () => {
      cancelado = true;
    };
  }, [base, idsDasChamadas, nomes]);

  /** Escreve os dois eixos de um ponto de volta no formulário.
   *
   *  ⚠️ `setModified(true)` não é detalhe: sem ele o botão de salvar continua
   *  desligado depois de arrastar, e o operador sai da tela convencido de que
   *  gravou. É o que `useField.setValue` faz por baixo — aqui é explícito
   *  porque o caminho escrito não é o deste campo, é o do array. */
  const escrever = useCallback(
    (indice: number, ponto: "rotulo" | "alvo", valor: Ponto) => {
      const prefixo = ponto === "rotulo" ? "rotulo" : "alvo";

      despachar({
        type: "UPDATE",
        path: `${RAIZ}.${indice}.${prefixo}X`,
        value: valor.x,
      });
      despachar({
        type: "UPDATE",
        path: `${RAIZ}.${indice}.${prefixo}Y`,
        value: valor.y,
      });

      setModified(true);
    },
    [despachar, setModified],
  );

  const nomeDaChamada = useCallback(
    (indice: number) => {
      const id = idsDasChamadas[indice];
      const nome = id === undefined ? undefined : nomes[String(id)];
      return nome ?? "representada ainda não escolhida";
    },
    [idsDasChamadas, nomes],
  );

  const descreverPino = useCallback(
    (indice: number, ponto: "rotulo" | "alvo", valor: Ponto) =>
      `Chamada ${numeroDaChamada(indice)}, ${nomeDaChamada(indice)} — ${
        ponto === "rotulo" ? "etiqueta" : "objeto"
      } a ${comoTexto(valor.x)}% da esquerda e ${comoTexto(valor.y)}% do topo`,
    [nomeDaChamada],
  );

  const aoMoverPonteiro = useCallback(
    (evento: React.PointerEvent<HTMLButtonElement>) => {
      if (arrastando === undefined) return;

      const caixa = caixaRef.current?.getBoundingClientRect();
      if (!caixa) return;

      const valor = pontoNaCaixa(
        { x: evento.clientX, y: evento.clientY },
        {
          esquerda: caixa.left,
          topo: caixa.top,
          largura: caixa.width,
          altura: caixa.height,
        },
      );

      escrever(arrastando.indice, arrastando.ponto, valor);
    },
    [arrastando, escrever],
  );

  const aoTeclar = useCallback(
    (
      evento: React.KeyboardEvent<HTMLButtonElement>,
      indice: number,
      ponto: "rotulo" | "alvo",
      atual: Ponto,
    ) => {
      const proximo = deslocarPonto(atual, {
        tecla: evento.key,
        largo: evento.shiftKey,
      });

      // Tecla que este campo não usa continua sendo do navegador — Tab sai do
      // pino, e a página rola com o que não for seta.
      if (proximo === undefined) return;

      evento.preventDefault();
      escrever(indice, ponto, proximo);
      setAviso(descreverPino(indice, ponto, proximo));
    },
    [descreverPino, escrever],
  );

  /** O arrasto termina FALANDO onde parou — o mesmo aviso que as setas dão.
   *
   *  ⚠️ Sem isto o caminho de mouse era o único mudo: o operador arrasta, vê a
   *  fotografia mexer e não recebe confirmação de que o número foi gravado. É o
   *  "arrastei e não sei se pegou" da nota do topo deste arquivo, e ele valia
   *  para quem enxerga também. O valor dito é o MESMO que o `aria-label` do
   *  botão declara nesta renderização — o aviso e o rótulo não têm como
   *  discordar. */
  const terminarArrasto = useCallback(
    (indice: number, ponto: "rotulo" | "alvo", valor: Ponto) => {
      if (arrastando === undefined) return;
      setArrastando(undefined);
      setAviso(descreverPino(indice, ponto, valor));
    },
    [arrastando, descreverPino],
  );

  /* Qual chamada está na mão do operador — a que está sendo arrastada, ou a que
     tem o foco. Existe por causa da fotografia de verdade, não da de teste: numa
     cena em que dois objetos ficam perto, os pinos viram marcas iguais
     empilhadas, e o operador arrasta uma sem saber de qual linha ela é. */
  const ativa = arrastando?.indice ?? emFoco;

  return (
    <div className="field-type prancha-pinos">
      <style>{ESTILO}</style>

      <div className="field-label">Prancha — arraste os pinos</div>

      <p className="prancha-pinos__ajuda">
        Cada chamada tem dois pinos: o <strong>quadrado numerado</strong> é onde
        a etiqueta pousa (área vazia — parede, deck livre) e o{" "}
        <strong>ponto redondo</strong> é onde a linha encosta no objeto.
        Arraste-os sobre a fotografia. Um pino clicado — ou alcançado com Tab —
        também anda com as setas: {comoTexto(PASSO)}% por toque,{" "}
        {comoTexto(PASSO_LARGO)}% com Shift. As posições aparecem em porcentagem
        nos campos de cada chamada, logo abaixo, e podem ser digitadas ali.
      </p>

      {foto === undefined ? (
        <p className="prancha-pinos__vazio">
          {idDaFoto === undefined
            ? "Escolha a fotografia acima para posicionar os pinos sobre ela."
            : "A fotografia escolhida ainda não tem dimensões lidas — salve e recarregue a página. Enquanto isso, as posições continuam editáveis em porcentagem nos campos de cada chamada."}
        </p>
      ) : (
        <>
          <div
            ref={caixaRef}
            className="prancha-pinos__caixa"
            style={{ aspectRatio: `${foto.largura} / ${foto.altura}` }}
          >
            {/* Sem `next/image`: dentro do painel o que importa é o arquivo
                exato, no aspecto exato, sem nenhuma camada de recorte ou
                redimensionamento entre o que o operador vê e o que a
                porcentagem significa. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foto.url}
              alt=""
              className="prancha-pinos__foto"
              draggable={false}
            />

            {/* A MESMA linha que a página desenha, do mesmo `lib`. Dois traços
                — papel por baixo, tinta por cima — porque um traço só sobre
                fotografia clara fica abaixo do contraste de 3:1 que a WCAG
                1.4.11 pede; é o que o componente do site já faz. */}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="prancha-pinos__linhas"
            >
              {coordenadas.map((chamada, indice) => {
                const traco = linhaDaChamada(chamada);
                /* O traço da chamada na mão engrossa — é o que diz QUAL das
                   linhas o pino debaixo do dedo pertence. O encamisamento de
                   papel cresce junto: se ficasse em 3, a orla de contraste
                   sumiria sob o traço de tinta e a linha realçada seria a única
                   ilegível sobre foto clara. */
                const naMao = indice === ativa;
                return (
                  <g key={indice} fill="none">
                    <path
                      d={traco}
                      stroke="#F5F3F0"
                      strokeWidth={naMao ? 5 : 3}
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={traco}
                      stroke="#17171A"
                      strokeWidth={naMao ? 3 : 1}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>

            {coordenadas.map((chamada, indice) =>
              (["rotulo", "alvo"] as const).map((ponto) => {
                const valor = chamada[ponto];

                return (
                  <button
                    key={`${indice}-${ponto}`}
                    type="button"
                    className={`prancha-pinos__pino prancha-pinos__pino--${ponto}`}
                    data-ativa={indice === ativa ? "true" : undefined}
                    style={{ left: `${valor.x}%`, top: `${valor.y}%` }}
                    aria-label={`${descreverPino(indice, ponto, valor)}. Use as setas do teclado para mover.`}
                    title={descreverPino(indice, ponto, valor)}
                    onPointerDown={(evento) => {
                      /* ⚠️ O `preventDefault` mata o mousedown de
                         compatibilidade — é ele que impede o arrasto de virar
                         seleção de texto no formulário e de acordar o arrasto
                         nativo do navegador. Fica. Mas o foco TAMBÉM é ação
                         padrão do mousedown, e ia junto: medido, o clique de
                         mouse deixava o foco no `body`. Consequência para o
                         operador, que é quem este campo existe para servir: as
                         setas não moviam nada e o aviso falado nunca falava,
                         até alguém descobrir sozinho que precisava chegar de
                         Tab. Mover o foco à mão devolve os dois sem tocar no
                         gesto — `setPointerCapture` abaixo continua sendo quem
                         segura o arrasto.

                         `preventScroll` porque o pino já está debaixo do
                         ponteiro, logo já visível: rolar aqui seria mover a
                         caixa medida no primeiro quadro do arrasto. */
                      evento.preventDefault();
                      evento.currentTarget.focus({ preventScroll: true });
                      evento.currentTarget.setPointerCapture(evento.pointerId);
                      setArrastando({ indice, ponto });
                    }}
                    onPointerMove={aoMoverPonteiro}
                    onPointerUp={() => terminarArrasto(indice, ponto, valor)}
                    onPointerCancel={() => setArrastando(undefined)}
                    onLostPointerCapture={() => setArrastando(undefined)}
                    onFocus={() => setEmFoco(indice)}
                    onBlur={() =>
                      setEmFoco((atual) => (atual === indice ? undefined : atual))
                    }
                    onKeyDown={(evento) =>
                      aoTeclar(evento, indice, ponto, valor)
                    }
                  >
                    {ponto === "rotulo" ? numeroDaChamada(indice) : ""}
                  </button>
                );
              }),
            )}
          </div>

          {quantidade === 0 && (
            <p className="prancha-pinos__vazio">
              Nenhuma chamada ainda. Acrescente uma abaixo e o pino aparece
              sobre a fotografia.
            </p>
          )}
        </>
      )}

      {/* O que o teclado acabou de fazer, dito em voz alta. Sem isto, mover um
          pino com as setas é silencioso para quem não vê a foto — e um campo
          que só confirma visualmente não é um caminho de teclado, é um atalho
          para quem já enxerga. */}
      <p role="status" aria-live="polite" className="prancha-pinos__aviso">
        {aviso}
      </p>
    </div>
  );
}

/* Estilo local, no próprio componente: são vinte linhas que só existem aqui, e
   um arquivo `.scss` a mais no painel custaria mais para achar do que para
   ler. As cores são as do site (papel, tinta, fio), porque o desenho que o
   operador está posicionando é o do site. */
const ESTILO = `
.prancha-pinos__ajuda,
.prancha-pinos__vazio {
  margin: .25rem 0 .75rem;
  max-width: 70ch;
  font-size: .85rem;
  line-height: 1.5;
  opacity: .8;
}
.prancha-pinos__caixa {
  position: relative;
  width: 100%;
  max-width: 46rem;
  background: #17171A;
  border: 1px solid var(--theme-elevation-150, #C9C6C0);
  user-select: none;
  touch-action: none;
}
.prancha-pinos__foto {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.prancha-pinos__linhas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.prancha-pinos__pino {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: grab;
  touch-action: none;
  font-family: var(--font-mono, monospace);
  font-size: .7rem;
  line-height: 1;
  color: #17171A;
  background: #F5F3F0;
  border: 1px solid #17171A;
}
.prancha-pinos__pino:active { cursor: grabbing; }
/* O anel de foco usa a variável do PRÓPRIO painel, não uma cor nova: assim ele
   é o mesmo anel dos outros campos do formulário, e continua legível quando o
   painel está no tema escuro. */
.prancha-pinos__pino:focus-visible {
  outline: 2px solid var(--theme-elevation-800, #17171A);
  outline-offset: 2px;
}
/* Os dois pinos da chamada na mão sobem na pilha. Sem isto, o pino que acabou
   de ser arrastado para cima de outro fica DEBAIXO dele — a ordem é a do DOM, e
   a do DOM é a da lista de chamadas —, e o segundo clique pega o vizinho. */
.prancha-pinos__pino[data-ativa="true"] { z-index: 1; }
.prancha-pinos__pino--rotulo {
  min-width: 1.75rem;
  height: 1.25rem;
  padding: 0 .3rem;
}
.prancha-pinos__pino--alvo {
  width: .9rem;
  height: .9rem;
  border-radius: 50%;
  background: #17171A;
  box-shadow: 0 0 0 2px #F5F3F0;
}
.prancha-pinos__aviso {
  margin: .5rem 0 0;
  font-size: .85rem;
  min-height: 1.2em;
  opacity: .8;
}
`;
