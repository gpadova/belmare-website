import { IconeWhatsApp, Seta } from "@/components/icones";

/**
 * A faixa de ação — o mais próximo de um botão primário que este sistema tem, e
 * ainda assim é um fio, não um preenchimento.
 *
 * O peso vem de três coisas: largura total, corpo de h2, e o único fio em tinta
 * do sistema inteiro. Nada de canto, nada de sombra, nada de campo cheio.
 *
 * ⚠️ **MORA NUM ARQUIVO PRÓPRIO POR UMA RAZÃO DE FRONTEIRA, NÃO DE ORGANIZAÇÃO
 * — PRA-124.** Ela era parte de `components/acao-de-fecho.tsx`, que importa
 * `lib/empresa-consulta.ts` e, com ele, o Payload inteiro. As páginas livres
 * desenham a composição no cliente durante o live preview, e um único `import`
 * de um módulo de servidor no grafo do cliente arrasta a API local do Payload
 * para o navegador — o build quebra, e quebra numa mensagem que não menciona
 * esta linha. Este arquivo não importa nada além do ícone, e é isso que o
 * mantém desenhável dos dois lados.
 *
 * ⚠️ **SEM LINK, A FAIXA INTEIRA NÃO É DESENHADA.** Um elemento que é o mais
 * pesado da página e leva a um `wa.me` inválido é a pior versão possível deste
 * componente: ele promete a ação principal e entrega um erro do aplicativo.
 * Menos página, nunca página quebrada.
 */
export function FaixaDeAcao({
  rotulo = "Falar pelo WhatsApp",
  link,
  className,
}: {
  rotulo?: string;
  /** `undefined` quando não há número cadastrado. Ver a nota acima. */
  link: string | undefined;
  className?: string;
}) {
  if (link === undefined) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-6 border-y border-ink py-7 transition-colors hover:bg-surface ${className ?? ""}`}
    >
      <span className="flex items-center gap-4 min-w-0">
        <IconeWhatsApp className="h-6 w-6 shrink-0" />
        <span className="text-h2 font-normal">{rotulo}</span>
      </span>
      <Seta className="h-3 w-8 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
    </a>
  );
}
