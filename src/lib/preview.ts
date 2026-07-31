import { ehRotaLivre, enderecoDaPaginaLivre } from "@/lib/paginas";

/**
 * A lógica pura por trás do preview de rascunho — decisão 8 da spec.
 *
 * ⚠️ **NADA AQUI FALA COM O PAYLOAD, COM O NEXT NEM LÊ `process.env`.** Este
 * arquivo recebe valores já resolvidos (o segredo, o token recebido, a
 * coleção e o endereço) e devolve string ou booleano — a mesma tática de
 * `lib/revalidacao.ts`, e pelo mesmo motivo: o par token-válido/endereço-de-
 * preview é exatamente o tipo de regra que se quebra em silêncio se só for
 * lembrada dentro da rota, e é ela que decide se um rascunho fica visível.
 * Quem lê `process.env.PREVIEW_SECRET` e chama `draftMode()` é a rota em
 * `app/(frontend)/preview/route.ts` — ela é chamadora fina desta função, não
 * o lugar onde a regra mora.
 *
 * ⚠️ **A ESPINHA FIXA PREVISUALIZA NA ROTA DE VERDADE, NUNCA NUM IFRAME.** O
 * operador está editando texto e trocando fotografia dentro de um layout que
 * não se move — abrir `/representadas/[marca]` sob o modo de rascunho do
 * Next já mostra tudo o que ele precisa ver. O live preview do Payload é
 * reservado às páginas livres: lá a composição muda enquanto se arrasta um
 * bloco, e ver isso acontecer é o ponto inteiro. Construir o iframe para a
 * espinha fixa seria pagar o componente caro onde ele não se paga —
 * decisão 8.
 *
 * ⚠️ **PRA-124 ACRESCENTOU `paginas` A ESTE ARQUIVO, E NÃO SUBSTITUIU NADA.**
 * O iframe do painel carrega A MESMA `/preview?...` que o botão "Visualizar"
 * abre numa aba — não existe um segundo caminho para ver rascunho, e o token
 * continua sendo conferido no mesmo lugar, uma vez. O que muda no iframe é do
 * lado do site: `components/paginas/atualiza-em-preview.tsx` pede uma
 * atualização da rota a cada mensagem do painel, e ele só é renderizado sob o
 * modo de rascunho.
 */

/**
 * O token bate com o segredo configurado?
 *
 * ⚠️ **FALHA FECHADA, NÃO ABERTA.** Sem `PREVIEW_SECRET` configurado no
 * ambiente, TODO pedido de preview é recusado — nunca o oposto. Um segredo
 * ausente tratado como "qualquer token serve" transformaria a ausência de
 * configuração em uma porta aberta para ler rascunho sem token nenhum, que é
 * exatamente o vazamento que este ticket existe para provar que não
 * acontece.
 */
export function tokenDePreviewValido(
  recebido: string | null,
  esperado: string | undefined,
): boolean {
  return Boolean(esperado) && recebido === esperado;
}

/** As coleções que hoje têm uma rota de preview. Uma coleção nova aqui é
 *  decisão de outro ticket, não um `default` silencioso. */
export type ColecaoComPreview = "representadas" | "paginas";

/**
 * O endereço da ROTA REAL que o preview abre, a partir da coleção e do
 * endereço do documento.
 *
 * ⚠️ `undefined` para qualquer coleção que a rota de preview não conhece ou
 * para um endereço vazio — a rota que chama esta função decide o que fazer
 * com a ausência (hoje, recusar com 404), e esta função nunca inventa um
 * destino.
 */
export function enderecoDePreview(
  colecao: string | null,
  slug: string | null,
): string | undefined {
  if (!slug || slug.trim() === "") return undefined;

  switch (colecao as ColecaoComPreview | null) {
    case "representadas":
      return `/representadas/${slug}`;
    /* ⚠️ **A ÚNICA COLEÇÃO CUJO ENDEREÇO É CONFERIDO CONTRA UMA LISTA.** O slug
       de uma representada é texto que o operador digitou e a rota
       `/representadas/[marca]` sabe devolver 404 para um endereço que não
       existe. Uma página livre não: `/qualquer-coisa` não é rota de página
       nenhuma, então um slug fora do registro abriria o preview num 404 e diria
       ao operador que a composição dele sumiu. `undefined` faz a rota de
       preview responder com a recusa escrita, que explica o que houve. */
    case "paginas":
      return ehRotaLivre(slug) ? enderecoDaPaginaLivre(slug) : undefined;
    default:
      return undefined;
  }
}

/**
 * A URL que o botão "Visualizar" do painel abre numa aba nova.
 *
 * ⚠️ Chamada de dentro de `admin.preview` de cada coleção — nunca lida daqui
 * para fora. O segredo entra como parâmetro (nunca lido de `process.env`
 * dentro deste arquivo, pela mesma razão de pureza do resto do módulo); quem
 * resolve a variável de ambiente é o config da coleção, que já é o lugar do
 * projeto onde credencial de ambiente é lida (ver as credenciais do R2 em
 * `payload.config.ts`).
 */
export function urlDoBotaoDePreview({
  colecao,
  slug,
  segredo,
}: {
  colecao: ColecaoComPreview;
  slug: string;
  segredo: string | undefined;
}): string {
  const parametros = new URLSearchParams({
    colecao,
    slug,
    token: segredo ?? "",
  });
  return `/preview?${parametros.toString()}`;
}
