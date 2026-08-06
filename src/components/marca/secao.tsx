/**
 * Uma seção da página de marca.
 *
 * ⚠️ **O NÚMERO NA MARGEM E O TÍTULO DE 42px SAÍRAM JUNTOS — PRA-131, E É A
 * MUDANÇA QUE MAIS MEXEU NA LEITURA DESTA ROTA.** A seção herdava a espinha de
 * `/quem-somos`: fio no topo, `01` em mono na coluna de margem, `h2` no tamanho
 * de `h1` com teto de 22ch. Aquilo é a cadência certa para uma página que
 * carrega parágrafos — e esta não carrega nenhum. O que ela carrega são de três
 * a seis fatos por seção, e o aparato editorial ficou maior que a carga: na Bux,
 * quatro blocos numerados com título de 42px para transportar cerca de 320
 * caracteres de dado. Isso não lê como registro; lê como cerimônia, que é
 * exatamente o que o cliente chamou de "muito storytelling, pouca informação".
 *
 * A sequência também nunca informou nada. `01 02 03` só se justifica quando a
 * ordem é o conteúdo — numa prancha técnica, numa norma, num passo a passo.
 * Aqui ninguém precisa saber que a ficha técnica é a segunda, ainda mais numa
 * rota em que a numeração é calculada e a mesma seção é a terceira na Marê e a
 * segunda na Trisol.
 *
 * O que ficou no lugar é o cabeçalho de uma tabela de especificação: fio, rótulo
 * em mono e a contagem alinhada à direita — a mesma gramática da faixa de índice
 * e das listas de `/catalogos`, e a mesma que as referências do setor usam para
 * abrir uma seção de acervo (`SOFAS 78 Products`, `Design files 8`).
 *
 * ⚠️ `scroll-mt` não é detalhe de acabamento: são dois elementos fixos
 * empilhados — o cabeçalho e a faixa de índice — e sem esse recuo toda âncora
 * do sumário entrega o leitor com o próprio título escondido atrás da faixa que
 * ele acabou de clicar.
 */
export function SecaoDaMarca({
  id,
  titulo,
  contagem,
  children,
}: {
  id: string;
  titulo: string;
  /** A mesma contagem que a faixa de índice declara. Repetir não é redundância:
   *  quem chegou aqui rolando nunca leu a faixa, e quem chegou pela faixa
   *  confere que caiu no lugar certo. */
  contagem?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-36 border-t border-line px-5 pt-6 pb-12 md:scroll-mt-30 md:px-8 md:pt-8 md:pb-16"
    >
      <div className="max-w-[64rem]">
        {/* O título e a contagem na mesma linha de base, um em cada ponta —
            `items-baseline` e não `items-center`, porque duas caixas de mono do
            mesmo corpo centradas verticalmente ainda assentam desalinhadas
            quando uma delas está vazia. */}
        <div className="flex items-baseline justify-between gap-6">
          <h2 id={`${id}-titulo`} className="mono uppercase text-ink">
            {titulo}
          </h2>

          {contagem ? (
            <p className="mono uppercase shrink-0 text-graphite">{contagem}</p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}
