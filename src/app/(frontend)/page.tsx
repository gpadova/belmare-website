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
 * inteira — NÃO é afirmado em lugar nenhum desta página. Ele é feito por
 * demonstração, na sequência: a abertura diz que a empresa é uma representação
 * de móveis para área externa, a seção seguinte mostra as quatro fábricas
 * lado a lado, e o visitante conclui sozinho que elas cobrem o mesmo terreno.
 * Concluir é mais forte do que ser informado.
 *
 * Já houve três tentativas de dizer isso de forma mais direta, e as três
 * caíram:
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
