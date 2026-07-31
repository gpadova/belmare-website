/**
 * A ficha — rótulo em mono à esquerda, dado à direita, fio entre as linhas.
 *
 * É o componente que faz a página parecer um registro em vez de um texto sobre
 * a empresa. O rótulo mede; o dado fala. A largura do rótulo é fixa para que a
 * coluna da direita alinhe entre linhas — sem esse alinhamento a ficha vira
 * lista, e lista não tem autoridade documental.
 */
export function Ficha({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dl className={`border-t border-line ${className ?? ""}`}>{children}</dl>
  );
}

export function FichaLinha({
  rotulo,
  children,
}: {
  rotulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:gap-8 sm:py-4">
      <dt className="mono uppercase shrink-0 pt-[0.15rem] text-graphite sm:w-36">
        {rotulo}
      </dt>
      <dd className="text-support min-w-0">{children}</dd>
    </div>
  );
}
