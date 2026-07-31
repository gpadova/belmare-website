import { descricaoDeImagem } from "@/lib/acervo";
import { texto } from "@/lib/campo-opcional";
import {
  porcentagemDaPrancha,
  type Chamada,
  type FotoDaPrancha,
  type PranchaAreaExterna,
} from "@/lib/prancha-area-externa";
import type {
  Imagen as ImagemGerada,
  Prancha as PranchaGerada,
  Representada as RepresentadaGerada,
} from "@/payload-types";

/**
 * A camada de tradução da prancha: o global do painel virando o que a página
 * desenha.
 *
 * ⚠️ **QUATRO NÚMEROS OU NENHUM.** O tipo gerado declara `rotuloX`, `rotuloY`,
 * `alvoX` e `alvoY` como números independentes, e o banco aceita uma linha com
 * três deles gravados (um rascunho salvo no meio da edição, por exemplo). O
 * domínio não: `Chamada` tem dois PONTOS, e um ponto sem os dois eixos não
 * existe. Uma chamada incompleta é DESCARTADA aqui — não completada com zero,
 * que é o canto superior esquerdo da fotografia e desenharia uma seta saindo da
 * moldura para lugar nenhum.
 *
 * ⚠️ **SEM DIMENSÃO GRAVADA NÃO HÁ PRANCHA.** A porcentagem só vale se a caixa
 * tiver o aspecto do arquivo (ver `lib/prancha-area-externa.ts`); sem `width` e
 * `height` a página teria que chutar um aspecto, e um aspecto chutado recorta a
 * fotografia por dentro da moldura — as chamadas saem todas de lugar de uma vez.
 * Devolver `undefined` faz a página desenhar a prancha de reserva, que ao menos
 * é coerente consigo mesma.
 *
 * ⚠️ **A CHAMADA GUARDA O `slug` DA REPRESENTADA, NÃO O NOME NEM A PARTE.** O
 * rótulo do desenho e o nome da legenda são lidos da representada publicada, na
 * hora de desenhar — corrigir "Marê Mobília" no cadastro tem que corrigir a
 * legenda da prancha junto, e uma cópia do nome aqui é como as duas passam a
 * discordar.
 */
export function pranchaDoPainel(
  doc: PranchaGerada,
): PranchaAreaExterna | undefined {
  const foto = fotoDoPainel(doc.foto);
  if (foto === undefined) return undefined;

  return { foto, chamadas: chamadasDoPainel(doc.chamadas) };
}

function fotoDoPainel(
  valor: number | ImagemGerada | null | undefined,
): FotoDaPrancha | undefined {
  // Profundidade 0: o upload voltou só como identificador e não há o que ler.
  if (!valor || typeof valor !== "object") return undefined;

  const src = texto(valor.url);
  const largura = valor.width;
  const altura = valor.height;

  if (src === undefined) return undefined;
  if (typeof largura !== "number" || typeof altura !== "number") return undefined;
  if (largura <= 0 || altura <= 0) return undefined;

  return {
    src,
    largura,
    altura,
    /* O `alt` é COMPOSTO, nunca lido do campo virtual — mesma razão de
       `representadas-traducao.ts#imagemDoPainel`: a regra da marcação de mock
       mora em `lib/acervo.ts`, onde é testada. E esta fotografia é o caso em
       que ela mais importa: a cena mostra uma área externa inteira resolvida, e
       sem a marcação um arquiteto a lê como obra entregue. */
    alt: descricaoDeImagem({
      descricao: valor.descricao ?? "",
      mock: valor.mock,
    }),
  };
}

function chamadasDoPainel(linhas: PranchaGerada["chamadas"]): Chamada[] {
  return (linhas ?? [])
    .map(chamadaDoPainel)
    .filter((chamada): chamada is Chamada => chamada !== undefined);
}

function chamadaDoPainel(
  linha: NonNullable<PranchaGerada["chamadas"]>[number],
): Chamada | undefined {
  const slug = slugDaRepresentada(linha.representada);
  if (slug === undefined) return undefined;

  const rotuloX = coordenada(linha.rotuloX);
  const rotuloY = coordenada(linha.rotuloY);
  const alvoX = coordenada(linha.alvoX);
  const alvoY = coordenada(linha.alvoY);

  if (
    rotuloX === undefined ||
    rotuloY === undefined ||
    alvoX === undefined ||
    alvoY === undefined
  ) {
    return undefined;
  }

  return {
    slug,
    rotulo: { x: rotuloX, y: rotuloY },
    alvo: { x: alvoX, y: alvoY },
  };
}

/**
 * ⚠️ Uma representada que voltou só como identificador (profundidade 0) é
 * tratada como ausente, e a chamada inteira cai. É a mesma leitura defensiva de
 * `imagemDoPainel`: o mapper nunca inventa e nunca lança.
 */
function slugDaRepresentada(
  valor: number | RepresentadaGerada | null | undefined,
): string | undefined {
  if (!valor || typeof valor !== "object") return undefined;
  return texto(valor.slug);
}

/**
 * Uma coordenada gravada, dentro da faixa.
 *
 * ⚠️ Devolve `undefined` para o que não é número — e é essa distinção que
 * separa "o operador não terminou de posicionar esta chamada" de "o operador
 * posicionou esta chamada na borda". `porcentagemDaPrancha` resolve não-finito
 * como 0 porque quem a chama no painel está arrastando um pino e precisa de um
 * número; aqui, 0 seria uma decisão que ninguém tomou.
 */
function coordenada(valor: number | null | undefined): number | undefined {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return undefined;
  return porcentagemDaPrancha(valor);
}
