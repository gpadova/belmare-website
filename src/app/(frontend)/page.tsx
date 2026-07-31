import { Abertura } from "@/components/abertura";
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
 * A home é deliberadamente contida: abertura, as quatro marcas, duas portas.
 * Nada mais.
 *
 * Essa contenção é decisão do cliente e deve ser defendida — é o que separa
 * esta home de qualquer site de representante. Sem depoimento, sem newsletter,
 * sem contador de números, sem carrossel.
 *
 * O argumento que justifica a Belmare — uma empresa só dá conta da área externa
 * inteira — é feito aqui EM TEXTO, e por demonstração: a abertura nomeia as
 * peças, e a seção seguinte mostra qual fábrica resolve cada uma. O visitante
 * conclui sozinho, que é mais forte do que ser informado.
 *
 * Já houve duas tentativas de dizer isso de forma mais direta, e as duas caíram
 * em 30/07/2026:
 *
 *   · como MECANISMO — uma bandeja de matérias atravessando as quatro marcas.
 *     Dependia de um dado que as fábricas não têm (4 células de 32).
 *   · como SLOGAN — "Quatro fábricas. Um interlocutor." Jargão de dentro da
 *     empresa: conta o organograma para quem chegou procurando um móvel.
 *
 * Ver `briefing/estrutura.md` §4.
 */
export default function Home() {
  return (
    <>
      <Abertura />
      <RepresentadasGaleria />
      <Portas />
    </>
  );
}
