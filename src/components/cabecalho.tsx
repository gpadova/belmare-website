import Link from "next/link";

import { IconeWhatsApp } from "@/components/icones";
import { MarcaCompacta } from "@/components/marca-belmare";
import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { NAVEGACAO } from "@/lib/site";

/**
 * Quatro itens e o WhatsApp. `/arquitetos` fica fora — é destino da porta da
 * home, não item de navegação, e mantê-lo fora preserva o peso das portas.
 *
 * No mobile a navegação desce para uma segunda linha em vez de virar menu:
 * quatro itens não justificam esconder nada, e o arquiteto volta muitas vezes.
 *
 * ⚠️ Sem número cadastrado no painel, o WhatsApp do topo simplesmente não é
 * desenhado — o cabeçalho fica com marca e navegação. Ver a nota em
 * `lib/empresa.ts`: link morto é pior do que link nenhum.
 */
export async function Cabecalho() {
  const { whatsapp } = await buscarEmpresa();
  const link = linkDeWhatsapp(whatsapp);

  return (
    <header className="sticky top-0 z-20 bg-paper">
      <div className="flex h-14 items-center justify-between border-b border-line px-5 md:h-18 md:px-8">
        <Link href="/" aria-label="Belmare Representações, início" className="shrink-0">
          <MarcaCompacta />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAVEGACAO.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="mono uppercase text-graphite transition-colors hover:text-ink"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sem contexto de página: o cabeçalho é do layout e aparece em todas
            as rotas, então "estava na home" chegava marcado errado em todas
            menos uma. Marcação de origem só vale se estiver certa — a
            qualificação por página fica com os links dentro do conteúdo, que
            sabem onde estão. */}
        {link !== undefined && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mono uppercase shrink-0 flex items-center gap-2 text-ink md:border-l md:border-line md:pl-8"
          >
            <IconeWhatsApp className="h-4 w-4" />
            WhatsApp
          </a>
        )}
      </div>

      <nav aria-label="Principal" className="border-b border-line md:hidden">
        <ul className="sem-barra flex h-10 items-center gap-6 overflow-x-auto px-5">
          {NAVEGACAO.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="mono uppercase whitespace-nowrap text-graphite">
                {item.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
