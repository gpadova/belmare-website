import { notFound } from "next/navigation";

/**
 * A rota que não existe, entregue ao 404 DO SITE.
 *
 * ⚠️ Isto existe por uma consequência de ter posto o painel do Payload na mesma
 * aplicação. O painel precisa da própria `<html>`, então o site desceu para o
 * grupo `(frontend)` e o painel para `(payload)`, e a aplicação passou a ter
 * dois layouts-raiz. Com dois, o Next não sabe qual deles vestir numa URL que
 * não casou com nada — e devolve a tela cinza padrão do framework, sem
 * cabeçalho e sem rodapé.
 *
 * Este catch-all traz a URL órfã para dentro do grupo do site antes de chamar
 * `notFound()`, e aí o 404 desenhado em `not-found.tsx` volta a aparecer com a
 * página inteira em volta. Não é detalhe: hoje TODO item do menu aponta para
 * uma rota que ainda não foi construída, então esta é a segunda página mais
 * visitada do site.
 *
 * `/admin` e `/api` continuam com o painel: segmento fixo ganha de catch-all na
 * ordem de precedência do Next.
 */
export default function RotaInexistente() {
  notFound();
}
