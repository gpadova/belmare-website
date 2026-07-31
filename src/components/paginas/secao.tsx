/**
 * A seção de uma página livre — a espinha mínima que um bloco recebe.
 *
 * Herda o ritmo de `/quem-somos` e da página de marca: fio de 1px no topo,
 * mesmo respiro vertical, teto de 64rem na coluna de conteúdo e margem direita
 * aberta. É o que faz uma página montada no painel pertencer ao mesmo site que
 * as páginas desenhadas em código.
 *
 * ⚠️ **NÃO HÁ NÚMERO NA MARGEM, E ISSO É A DIFERENÇA QUE IMPORTA.** Os blocos de
 * `/quem-somos` são numerados porque a SEQUÊNCIA é o argumento daquela página —
 * ler fora de ordem é ler outra coisa, e o número diz isso. Numa página livre a
 * ordem é conveniência de quem montou, não argumento: numerá-la emprestaria ao
 * arranjo do operador uma autoridade de documento que ele não tem. A coluna de
 * 5rem some junto com o número, e o conteúdo assenta na margem da página.
 *
 * ⚠️ O título do bloco é `h2` sempre. O `h1` é da página inteira e é campo
 * próprio, no topo — dois `h1` numa rota é defeito de leitura assistiva e de
 * busca, e é exatamente o que um construtor de blocos produz quando cada bloco
 * escolhe o próprio nível.
 */
export function SecaoLivre({
  titulo,
  children,
}: {
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-24">
      <div className="max-w-[64rem] min-w-0">
        {titulo !== undefined && (
          <h2 className="text-h1 max-w-[22ch] font-normal text-balance">
            {titulo}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
