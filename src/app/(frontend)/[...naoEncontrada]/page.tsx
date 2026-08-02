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
 * página inteira em volta. Não é detalhe: enquanto o menu prometia rotas que
 * ainda não existiam, esta foi a segunda página mais visitada do site. Desde
 * PRA-127 nenhum link interno cai aqui (`lib/paginas.test.ts` é a guarda), e o
 * que sobra é URL digitada errada e endereço antigo vindo de fora — que é
 * exatamente o que um 404 desenhado existe para atender.
 *
 * `/admin` e `/api` continuam com o painel: segmento fixo ganha de catch-all na
 * ordem de precedência do Next.
 */
export default function RotaInexistente() {
  notFound();
}
