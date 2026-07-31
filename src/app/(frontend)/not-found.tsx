import Link from "next/link";

import { Seta } from "@/components/icones";
import { NAVEGACAO, whatsapp } from "@/lib/site";

export const metadata = { title: "Página não encontrada" };

/**
 * As dez rotas do site ainda não existem — só a home foi construída. Este 404
 * é o que segura tudo que ainda vai ser feito, e ele é desenhado: quem clica no
 * catálogo hoje chega numa página do sistema, com a saída à mão, e não na tela
 * padrão do framework.
 */
export default function NaoEncontrada() {
  return (
    <div className="flex min-h-[60svh] flex-col justify-center px-5 py-16 md:px-8 md:py-24">
      <p className="mono uppercase text-graphite">Erro 404</p>
      <h1 className="text-h1 mt-4 max-w-[20ch] font-light">
        Esta página ainda não existe.
      </h1>
      <p className="text-body mt-6 max-w-[60ch] text-graphite">
        O site está sendo construído por partes. Enquanto a rota não entra no ar,
        o caminho mais curto é falar direto com quem representa.
      </p>

      <ul className="mt-10 flex flex-col gap-3">
        {NAVEGACAO.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="mono uppercase group inline-flex items-center gap-3 text-graphite transition-colors hover:text-ink"
            >
              {item.rotulo}
              <Seta className="h-3 w-8 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </li>
        ))}
        <li>
          <a
            href={whatsapp("cheguei numa página que ainda não existe")}
            target="_blank"
            rel="noopener noreferrer"
            className="mono uppercase group inline-flex items-center gap-3 text-ink"
          >
            Falar pelo WhatsApp
            <Seta className="h-3 w-8 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </li>
      </ul>
    </div>
  );
}
