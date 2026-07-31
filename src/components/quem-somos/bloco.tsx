/**
 * O bloco numerado — a espinha de `/quem-somos`.
 *
 * A página é lida como um registro: seis blocos, na ordem, com o número em mono
 * na margem e um fio de 1px abrindo cada um. A numeração não é ornamento de
 * seção — é a sequência do documento, e ela carrega informação: o tempo, o que
 * o registro diz, o nome, o território, o acervo, o interlocutor. Ler fora de
 * ordem é ler outra coisa.
 *
 * A coluna de conteúdo tem teto de 64rem e a margem direita fica aberta. Numa
 * tela de 1920px isso é o que separa uma página de arquivo de um texto esticado
 * de ponta a ponta — e mantém a medida do corpo dentro de 65–75 caracteres sem
 * centralizar nada.
 */
export function Bloco({
  numero,
  children,
  className,
}: {
  numero: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border-t border-line px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-24 ${className ?? ""}`}
    >
      <div className="grid gap-y-6 md:grid-cols-[5rem_minmax(0,64rem)] md:gap-x-8">
        {/* Escondido da leitura assistiva: quem navega por títulos não precisa
            ouvir "zero um" antes de cada um deles.

            Sem fio sob o número: ele caía 27px abaixo do primeiro fio de
            conteúdo do bloco, dois traços paralelos alinhados a nada. Numa
            página cuja identidade é o alinhamento, isso lia como pendência, e
            não como aba de arquivo. */}
        <p aria-hidden="true" className="mono h-fit text-graphite">
          {numero}
        </p>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
