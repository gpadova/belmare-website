import { Seta } from "@/components/icones";
import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";

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
 *
 * ⚠️ **SEM NÚMERO NO PAINEL, A AÇÃO INTEIRA NÃO É DESENHADA.** Um botão que é o
 * elemento mais pesado da página e leva a um `wa.me` inválido é a pior versão
 * possível deste componente: ele promete a ação principal e entrega um erro do
 * aplicativo. Menos página, nunca página quebrada.
 */
export async function AcaoDeFecho({
  rotulo = "Falar pelo WhatsApp",
  contexto,
  className,
}: {
  rotulo?: string;
  contexto: string;
  className?: string;
}) {
  const { whatsapp } = await buscarEmpresa();
  const link = linkDeWhatsapp(whatsapp, contexto);
  if (link === undefined) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-6 border-y border-ink py-7 transition-colors hover:bg-surface ${className ?? ""}`}
    >
      <span className="text-h2 font-normal">{rotulo}</span>
      <Seta className="h-3 w-8 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
    </a>
  );
}
