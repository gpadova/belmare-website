/**
 * Uma seção de `/quem-somos`.
 *
 * Fio de 1px no topo, título, e a coluna de conteúdo com teto de 64rem com a
 * margem direita aberta — o mesmo ritmo das outras páginas do site.
 *
 * ⚠️ **NÃO HÁ NÚMERO NA MARGEM, E A NUMERAÇÃO NÃO VOLTA.** A página foi
 * desenhada como documento de arquivo: seis blocos numerados de `01` a `06`,
 * com o número em mono na coluna de margem, porque a SEQUÊNCIA era o argumento
 * — a rota ia do ano de fundação ao nome antigo, do nome antigo à prancha, e
 * ler fora de ordem era ler outra coisa. Esse argumento caiu junto com a
 * história que ele sustentava. Quem abre "Quem somos" quer quatro respostas —
 * o que a empresa é, o que ela faz, o que ela representa e onde atende — e
 * nenhuma delas depende de ser lida depois da anterior. Numerar seções que não
 * são sequência empresta autoridade de documento a um índice.
 */
export function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-24">
      <div className="max-w-[64rem] min-w-0">
        <h2 className="text-h1 max-w-[24ch] font-normal text-balance">
          {titulo}
        </h2>
        {children}
      </div>
    </section>
  );
}
