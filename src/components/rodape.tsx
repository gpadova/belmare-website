import Link from "next/link";

import { MarcaVertical } from "@/components/marca-belmare";
import { REPRESENTADAS, paginaDaRepresentada } from "@/lib/representadas";
import { anosDeMercado, EMPRESA, whatsapp } from "@/lib/site";

/**
 * O rodapé é o verso da etiqueta: a face legal e técnica. Tudo em mono, tudo
 * verificável, numerais tabulares. Nenhuma novidade aqui — é onde o dado que
 * sustenta a voz da marca fica escrito por extenso.
 */
export function Rodape() {
  const { endereco } = EMPRESA;

  return (
    <footer className="bg-paper">
      <div className="grid gap-10 px-5 py-12 md:grid-cols-4 md:gap-8 md:px-8 md:py-16">
        <div>
          <MarcaVertical />
          <p className="text-support mt-6 text-graphite">
            Desde {EMPRESA.fundacao} · {anosDeMercado()} anos
          </p>
        </div>

        <div>
          <h2 className="mono uppercase text-ink">Contato</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {EMPRESA.telefones.map((tel) => (
              <li key={tel}>
                <a
                  href={`tel:+55${tel.replace(/\D/g, "")}`}
                  className="mono text-graphite transition-colors hover:text-ink"
                >
                  {tel}
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsapp("estava no rodapé")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-support text-graphite transition-colors hover:text-ink"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={EMPRESA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-support text-graphite transition-colors hover:text-ink"
              >
                Instagram
              </a>
            </li>
          </ul>

          <address className="text-support mt-6 text-graphite not-italic">
            {endereco.logradouro}
            <br />
            {endereco.bairro} · {endereco.cidade} · {endereco.uf}
            <br />
            {endereco.cep}
          </address>
        </div>

        <div>
          <h2 className="mono uppercase text-ink">Representadas</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {REPRESENTADAS.map((r) => (
              <li key={r.slug}>
                <Link
                  href={paginaDaRepresentada(r)}
                  className="text-support text-graphite transition-colors hover:text-ink"
                >
                  {r.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mono uppercase text-ink">Território</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {EMPRESA.territorio.map((uf) => (
              <li key={uf} className="text-support text-graphite">
                {uf}
              </li>
            ))}
          </ul>

          <p className="text-support mt-6 text-graphite">
            {EMPRESA.razaoSocial}
            <br />
            CNPJ {EMPRESA.cnpj}
          </p>

          <Link
            href="/politica-de-privacidade"
            className="text-support mt-6 inline-block text-graphite transition-colors hover:text-ink"
          >
            Política de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
