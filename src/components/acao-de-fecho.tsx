import { Seta } from "@/components/icones";
import { whatsapp } from "@/lib/site";

/**
 * A ação de fecho — o mais próximo de um botão primário que este sistema tem, e
 * ainda assim é um fio, não um preenchimento.
 *
 * O peso vem de três coisas: largura total, corpo de h2, e o único fio em tinta
 * do sistema inteiro. Nada de canto, nada de sombra, nada de campo cheio.
 *
 * ⚠️ `contexto` não é enfeite: `whatsapp()` pré-preenche a mensagem, e quem
 * clica na página da Trisol chega dizendo de onde veio. Custo zero, e é a única
 * qualificação de lead que o site tem enquanto não há formulário.
 *
 * ⚠️ Todo lead passa pela Belmare. Nenhum e-mail de fábrica em lugar nenhum.
 */
export function AcaoDeFecho({
  rotulo = "Falar pelo WhatsApp",
  contexto,
  className,
}: {
  rotulo?: string;
  contexto: string;
  className?: string;
}) {
  return (
    <a
      href={whatsapp(contexto)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-6 border-y border-ink py-7 transition-colors hover:bg-surface ${className ?? ""}`}
    >
      <span className="text-h2 font-normal">{rotulo}</span>
      <Seta className="h-3 w-8 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
    </a>
  );
}
