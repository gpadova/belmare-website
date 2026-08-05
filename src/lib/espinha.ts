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
 *   · o h1 da home ("Representação comercial de móveis para área externa.")
 *     — **fixo**, e defendido em `components/abertura.tsx` contra quatro
 *     alternativas rejeitadas entre 30/07 e 05/08/2026. Mudá-lo é
 *     reposicionamento, e reposicionamento é conversa, não edição.
 *   · os títulos das seções de `/quem-somos` — **fixo**. Os rótulos numerados
 *     (`01`…`06`) não estão nesta lista porque deixaram de existir: a página
 *     foi refeita em 05/08/2026 e a numeração saiu junto com a história que ela
 *     ordenava. O que mantém os títulos em código não é mais a sequência, é a
 *     lista do que aquela página recusa publicar.
 *   · o nome e o apoio das duas portas — **fixo** por decisão 3 da spec.
 *   · o tempo de casa, a lista "A, B, C e D" de representadas e toda contagem
 *     em prosa ("as quatro fábricas") — **gerado**. Ver `lib/empresa.ts` e
 *     `lib/frase.ts`. A contagem saiu da abertura em 05/08/2026 e vive só no
 *     título da galeria; duas na mesma rolagem era redundância, não prova.
 *   · a legenda de imagem de referência — **gerada** da marcação de mock.
 *
 * ⚠️ **UMA FRASE É METADE FIXA E METADE CAMPO, E ISSO É DELIBERADO.** A seção
 * das fábricas de `/quem-somos` abre contando as representadas cadastradas; se
 * o parágrafo inteiro fosse campo, a quinta marca entraria pelo painel e a
 * frase três centímetros acima da lista continuaria dizendo "quatro". A
 * primeira frase é montada com o dado; o campo é o que vem depois dela, e o
 * rótulo e a ajuda dizem isso com todas as letras.
 *
 * A segunda frase assim — a que abria o parágrafo do nome com a razão social do
 * cadastro — saiu em 05/08/2026 junto com o bloco inteiro que comparava o nome
 * público anterior ao logotipo de hoje.
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

/** A prosa dentro de cada seção de `/quem-somos`. */
export type QuemSomos = {
  /** A apresentação. Continua o parágrafo gerado com o cadastro. */
  apresentacao?: string;
  /** O que a Belmare faz — abre a seção, antes da lista de quatro linhas. */
  atuacao?: string;
  /** As fábricas representadas. Continua a frase que conta as fábricas. */
  acervo?: string;
  /** O fecho, sob "Fale com a Belmare." */
  contato?: string;
};

export function homeDoPainel(doc: HomeGerada): Home {
  return { ...opcional("galeria", texto(doc.galeria)) };
}

export function quemSomosDoPainel(doc: QuemSomosGerada): QuemSomos {
  return {
    ...opcional("apresentacao", texto(doc.apresentacao)),
    ...opcional("atuacao", texto(doc.atuacao)),
    ...opcional("acervo", texto(doc.acervo)),
    ...opcional("contato", texto(doc.contato)),
  };
}
