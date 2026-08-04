import { opcional, texto } from "@/lib/campo-opcional";
import type { Home as HomeGerada, QuemSomos as QuemSomosGerada } from "@/payload-types";

/**
 * A prosa editável dentro da **espinha fixa** — os globais `Home` e
 * `QuemSomos`, traduzidos para o domínio.
 *
 * ⚠️ **O QUE ESTES DOIS GLOBAIS TÊM É PEQUENO DE PROPÓSITO, E A LISTA DO QUE
 * FICOU DE FORA VALE MAIS DO QUE A DO QUE ENTROU.** Um global é exatamente onde
 * uma pessoa bem-intencionada põe tudo, e a decisão 2 da spec trata número de
 * campo como custo. Ficaram fora, e a classificação completa está em
 * `docs/classificacao-de-texto.md`:
 *
 *   · o h1 da home ("A área externa inteira, para quem especifica e para quem
 *     revende.") — **fixo**, e defendido em `components/abertura.tsx` contra
 *     três alternativas rejeitadas entre 30/07 e 04/08/2026. Mudá-lo é
 *     reposicionamento, e reposicionamento é conversa, não edição.
 *   · os rótulos numerados de `/quem-somos` (01…05) e os títulos de cada bloco
 *     — **fixo**: a sequência É o argumento da página, e ler fora de ordem é
 *     ler outra coisa.
 *   · o nome e o apoio das duas portas — **fixo** por decisão 3 da spec.
 *   · o tempo de casa, a lista "A, B, C e D" de representadas e toda contagem
 *     em prosa ("as quatro fábricas") — **gerado**. Ver `lib/empresa.ts` e
 *     `lib/frase.ts`.
 *   · a legenda de imagem de referência — **gerada** da marcação de mock.
 *
 * ⚠️ **DUAS FRASES SÃO METADE FIXA E METADE CAMPO, E ISSO É DELIBERADO.** O
 * parágrafo do bloco 02 abre com a razão social do cadastro e o do bloco 04
 * abre com a contagem de fábricas; se os dois fossem um campo de texto inteiro,
 * o operador poderia trocar a razão social num lugar do painel e deixar a prosa
 * nomeando a antiga, ou a quinta marca entraria e a página continuaria dizendo
 * "quatro". A primeira frase é montada com o dado; o campo é o que vem depois
 * dela. O rótulo e a ajuda de cada campo dizem isso com todas as letras.
 *
 * ⚠️ **TODO CAMPO É OPCIONAL — SEÇÃO ANULÁVEL.** Campo em branco faz o
 * parágrafo sumir, nunca renderizar vazio: "o pior resultado de um campo em
 * branco é menos página, nunca página quebrada" (`CONTEXT.md`).
 */

/** Os vãos editáveis da home. */
export type Home = {
  /** O parágrafo sob o título da galeria das marcas. */
  galeria?: string;
};

/** A prosa dentro de cada bloco numerado de `/quem-somos`. */
export type QuemSomos = {
  /** 01 — o começo. */
  registro?: string;
  /** 02 — o nome anterior. Continua a frase que nomeia a razão social. */
  nome?: string;
  /** 04 — o acervo representado. Continua a frase que conta as fábricas. */
  acervo?: string;
  /** 05/06 — o interlocutor. */
  interlocutor?: string;
};

export function homeDoPainel(doc: HomeGerada): Home {
  return { ...opcional("galeria", texto(doc.galeria)) };
}

export function quemSomosDoPainel(doc: QuemSomosGerada): QuemSomos {
  return {
    ...opcional("registro", texto(doc.registro)),
    ...opcional("nome", texto(doc.nome)),
    ...opcional("acervo", texto(doc.acervo)),
    ...opcional("interlocutor", texto(doc.interlocutor)),
  };
}
