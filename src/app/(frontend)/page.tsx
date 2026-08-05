import { Abertura } from "@/components/abertura";
import { CatalogosEmDestaque } from "@/components/catalogos-em-destaque";
import { FaixaRepresentacao } from "@/components/faixa-representacao";
import { Portas } from "@/components/portas";
import { RepresentadasGaleria } from "@/components/representadas-galeria";

/**
 * ⚠️ A abertura mostra o tempo de casa, e `anosDeMercado()` é avaliado no
 * build. Sem revalidação, um build feito antes de 22 de abril publica a
 * contagem antiga e continua publicando depois do aniversário — falha
 * silenciosa, anual, no primeiro número da primeira tela do site.
 */
export const revalidate = 86400;

/**
 * A home.
 *
 * ⚠️ **A CONTENÇÃO CAIU EM 05/08/2026, POR DECISÃO DO CLIENTE, E O QUE ELA
 * PROTEGIA CONTINUA DE PÉ.** Esta nota dizia: "a home é deliberadamente contida
 * — abertura, as quatro marcas, duas portas. Nada mais. Essa contenção é decisão
 * do cliente e deve ser defendida". O mesmo cliente liberou a sequência e
 * escolheu, item a item, o que entra: a faixa editorial e os catálogos. Não é a
 * regra sendo contornada por dentro; é ela sendo revogada por quem a fez.
 *
 * **O que a contenção protegia continua vinculante, e não depende dela:** sem
 * depoimento, sem newsletter, sem contador de números, sem carrossel automático,
 * sem faixa de logotipos soltos, sem preço. As duas seções que entraram são
 * feitas de fato verificável e de dado que o painel já tem — nenhuma delas
 * inventa conteúdo para preencher página, e uma delas renderiza zero pixels
 * hoje justamente por isso.
 *
 * A sequência:
 *
 *   Abertura              a fotografia ocupa a tela; o h1 diz o ramo
 *   Representadas         o trilho — o que cada fábrica faz
 *   Faixa editorial       o que uma representação faz, e por onde se compra
 *   Catálogos            (anulável — zero pixels enquanto não houver PDF)
 *   Portas                a ação primária: especifico / compro
 *
 * ⚠️ **O ARGUMENTO CENTRAL CONTINUA SEM SER AFIRMADO.** Que uma empresa só dá
 * conta da área externa inteira NÃO está escrito em lugar nenhum desta página.
 * Ele é feito por demonstração: a abertura diz que a empresa é uma representação
 * de móveis para área externa, o trilho mostra as quatro fábricas lado a lado, e
 * o visitante conclui sozinho que elas cobrem o mesmo terreno. Concluir é mais
 * forte do que ser informado.
 *
 * Já houve três tentativas de dizer isso de forma mais direta, e as três
 * caíram — a lista continua valendo, inclusive para as seções novas:
 *
 *   · como MECANISMO — uma bandeja de matérias atravessando as quatro marcas
 *     (30/07/2026). Dependia de um dado que as fábricas não têm (4 células
 *     de 32).
 *   · como SLOGAN — "Quatro fábricas. Um interlocutor." (30/07/2026). Jargão de
 *     dentro da empresa: conta o organograma para quem chegou procurando um
 *     móvel.
 *   · como PROMESSA — "A área externa inteira, para quem especifica e para quem
 *     revende." (05/08/2026). Dizia o resultado sem dizer o ramo, e um lojista
 *     lê a primeira tela para saber se é com ele.
 *
 * A quarta tentativa foi barrada dentro de `faixa-representacao.tsx`, e está
 * registrada lá: a seção nova quase reintroduziu o interlocutor único numa
 * oração subordinada.
 *
 * Ver `briefing/estrutura.md` §4 e `.impeccable/surfaces/src-app-frontend-page-tsx.md`.
 */
export default function Home() {
  return (
    <>
      <Abertura />
      <RepresentadasGaleria />
      <FaixaRepresentacao />
      <CatalogosEmDestaque />
      <Portas />
    </>
  );
}
