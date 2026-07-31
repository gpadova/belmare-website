/**
 * Uma seção da página de marca.
 *
 * Herda a espinha de `/quem-somos`: fio de 1px no topo, número em mono na
 * coluna de margem, conteúdo com teto de 64rem e a margem direita aberta. A
 * diferença é que aqui a numeração é CALCULADA — `secoesDaRepresentada()`
 * numera o que existe, e uma marca sem designers simplesmente não tem a seção,
 * em vez de reservar o número como faz o bloco de projetos em `/quem-somos`.
 *
 * ⚠️ `scroll-mt` não é detalhe de acabamento: são dois elementos fixos
 * empilhados — o cabeçalho e a faixa de índice — e sem esse recuo toda âncora
 * do sumário entrega o leitor com o próprio título escondido atrás da faixa que
 * ele acabou de clicar.
 *
 * ⚠️ O número é `aria-hidden`: quem navega por títulos não precisa ouvir "zero
 * dois" antes de cada um deles.
 */
export function SecaoDaMarca({
  id,
  numero,
  titulo,
  children,
}: {
  id: string;
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className="scroll-mt-36 border-t border-line px-5 pt-12 pb-14 md:scroll-mt-30 md:px-8 md:pt-16 md:pb-24"
    >
      <div className="grid gap-y-6 md:grid-cols-[5rem_minmax(0,64rem)] md:gap-x-8">
        <p aria-hidden="true" className="mono h-fit text-graphite">
          {numero}
        </p>
        <div className="min-w-0">
          <h2 id={`${id}-titulo`} className="text-h1 max-w-[22ch] font-normal text-balance">
            {titulo}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
