import { unstable_cache } from "next/cache";

import { foraDeRequisicao } from "@/lib/fora-de-requisicao";

/**
 * `unstable_cache`, tolerante a correr fora de uma requisição do Next.
 *
 * ⚠️ Nasceu em `lib/representadas-consulta.ts`; mora aqui a partir de PRA-120
 * porque as consultas de Peça, Arquivo3D e Acabamento precisam da MESMA
 * tolerância — nenhuma delas tem nada de específico de Representada. A API
 * local do Payload é chamada de dois mundos: das rotas do site, dentro do
 * processo do Next — onde o cache com etiqueta existe e vale a pena — e do
 * teste de integração e de scripts de linha de comando, fora de qualquer
 * requisição, onde o Next nem chega a instanciar o cache incremental.
 * `unstable_cache` lança `Invariant: incrementalCache missing` antes mesmo de
 * chamar a função nesse segundo mundo, e a resposta certa ali é a leitura
 * direta: teste e script querem o dado fresco de qualquer jeito, nunca uma
 * entrada de cache que sobrevive entre execuções. Isto não é mock de nada — é
 * o mesmo `unstable_cache` de verdade, com uma saída para o único caso em que
 * ele não tem onde guardar a resposta.
 */
export async function comCache<T>(
  ler: () => Promise<T>,
  chave: string[],
  tags: string[],
): Promise<T> {
  try {
    return await unstable_cache(ler, chave, { tags })();
  } catch (erro) {
    // Só o invariante de fora-de-requisição vira leitura direta. Um erro do
    // banco vindo de `ler` sobe: engoli-lo aqui chamaria `ler` de novo, o que
    // dobra a carga e esconde a causa atrás de uma segunda falha idêntica.
    if (!foraDeRequisicao(erro)) throw erro;
    return ler();
  }
}
