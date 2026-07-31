import { FaixaDeHachura } from "@/components/hachura";

/**
 * O logotipo.
 *
 * Um desenho fixo, sempre o mesmo. A versão anterior era uma marca-sistema —
 * sem símbolo fixo, com a faixa vestindo a matéria de cada contexto. Caiu em
 * 30/07/2026: a regra dependia de saber a matéria de cada página, e o acervo
 * das fábricas só tem esse dado em 4 de 32 casos. Identidade generativa que não
 * sabe o que vestir na maioria das telas é buraco, não sistema.
 *
 * Os três elementos — wordmark, faixa, descritor — dividem exatamente a mesma
 * largura. É o que segura o lockup: sem o alinhamento, vira três coisas
 * empilhadas.
 *
 * ⚠️ A faixa vai em posição absoluta dentro de um trilho de altura fixa. Um SVG
 * no fluxo tem largura intrínseca de 300px e passa a mandar na largura do
 * lockup inteiro, esticando a faixa muito além do wordmark. Fora do fluxo, quem
 * define a largura é a palavra — que é a regra.
 */

function Trilho({
  altura,
  children,
}: {
  altura: string;
  children: React.ReactNode;
}) {
  return (
    <span className="relative block w-full" style={{ height: altura }}>
      {children}
    </span>
  );
}

/** Versão compacta — topo do site. Wordmark e faixa fina, sem descritor. */
export function MarcaCompacta() {
  return (
    <span className="inline-block w-fit">
      <span className="block text-[1.375rem] leading-none font-medium tracking-[-0.045em] sm:text-[1.5rem]">
        BELMARE
      </span>
      <span className="mt-[0.3em] block">
        <Trilho altura="0.4em">
          <FaixaDeHachura className="absolute inset-0 h-full w-full" />
        </Trilho>
      </span>
      <span className="sr-only">Representações</span>
    </span>
  );
}

/** Versão vertical — principal. Wordmark, faixa, descritor. */
export function MarcaVertical({ className }: { className?: string }) {
  const descritor = "REPRESENTAÇÕES".split("");

  return (
    <span className={`inline-block w-fit ${className ?? ""}`}>
      <span className="block text-[2.25rem] leading-none font-medium tracking-[-0.045em]">
        BELMARE
      </span>
      <span className="mt-[0.3em] block">
        <Trilho altura="0.55em">
          <FaixaDeHachura className="absolute inset-0 h-full w-full" />
        </Trilho>
      </span>
      {/* O descritor é distribuído até as duas pontas, não centralizado: em mono
          e na largura exata do wordmark ele lê como classificação técnica, e é
          assim que "Representações" deixa de diminuir a marca. */}
      {/* `role="img"` junto do rótulo: em `span` genérico o `aria-label` não é
          exposto de forma confiável, e com cada letra escondida o descritor
          seria anunciado como nada. */}
      <span
        role="img"
        aria-label="Representações"
        className="mono mt-[0.34em] flex w-full justify-between text-ink"
      >
        {descritor.map((letra, i) => (
          <span key={`${letra}-${i}`} aria-hidden="true">
            {letra}
          </span>
        ))}
      </span>
    </span>
  );
}
