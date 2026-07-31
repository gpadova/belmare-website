import Link from "next/link";

import { Seta } from "@/components/icones";
import { linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { NAVEGACAO } from "@/lib/site";

export const metadata = { title: "Página não encontrada" };

/**
 * As dez rotas do site ainda não existem — só a home foi construída. Este 404
 * é o que segura tudo que ainda vai ser feito, e ele é desenhado: quem clica no
 * catálogo hoje chega numa página do sistema, com a saída à mão, e não na tela
 * padrão do framework.
 *
 * ⚠️ **ESTA ROTA É A PROVA DE QUE `TAG_SITE` É "O SITE INTEIRO" E NÃO "UMA
 * LISTA DE ROTAS".** Ela não aparece em nenhum menu, não tem
 * `generateStaticParams` e ninguém se lembra dela ao enumerar superfícies — e
 * ainda assim mostra o rodapé (que vem do layout) e o WhatsApp da empresa.
 * Trocar o número no painel tem que chegar aqui também, e chega porque a
 * etiqueta é uma só em vez de uma lista escrita à mão.
 */
export default async function NaoEncontrada() {
  const { whatsapp } = await buscarEmpresa();
  const link = linkDeWhatsapp(whatsapp, "cheguei numa página que ainda não existe");

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
        {link !== undefined && (
          <li>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mono uppercase group inline-flex items-center gap-3 text-ink"
            >
              Falar pelo WhatsApp
              <Seta className="h-3 w-8 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none" />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
