import Link from "next/link";

import { MarcaVertical } from "@/components/marca-belmare";
import {
  anoDeFundacao,
  anosDeMercado,
  linkDeTelefone,
  linkDeWhatsapp,
  TERRITORIO,
} from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { paginaDaRepresentada } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * O rodapé é o verso da etiqueta: a face legal e técnica. Tudo em mono, tudo
 * verificável, numerais tabulares. Nenhuma novidade aqui — é onde o dado que
 * sustenta a voz da marca fica escrito por extenso.
 *
 * ⚠️ **ESTE COMPONENTE É A RAZÃO DE `TAG_SITE` EXISTIR.** Ele mora no layout,
 * logo sai em TODA rota do site — inclusive a 404 —, e mostra a identidade da
 * empresa inteira. Não há "as seis rotas onde o rodapé aparece": quando o
 * operador troca o número de WhatsApp, a mudança já É o site inteiro, e é por
 * isso que `lib/revalidacao.ts` deriva uma etiqueta só para `Empresa`.
 *
 * ⚠️ **CADA BLOCO SOME SOZINHO QUANDO O DADO NÃO EXISTE.** O global pode estar
 * vazio (banco novo) ou pela metade (o operador ainda não preencheu os canais):
 * o pior resultado de um campo em branco é menos rodapé, nunca rodapé quebrado
 * — e nunca um `wa.me` para um número que não existe.
 */
export async function Rodape() {
  const empresa = await buscarEmpresa();
  const representadas = await representadasDaPagina();

  const { endereco } = empresa;
  const fundacao = anoDeFundacao(empresa.abertura);
  const anos = anosDeMercado(empresa.abertura);
  const whatsapp = linkDeWhatsapp(empresa.whatsapp, "estava no rodapé");

  return (
    <footer className="bg-paper">
      <div className="grid gap-10 px-5 py-12 md:grid-cols-4 md:gap-8 md:px-8 md:py-16">
        <div>
          <MarcaVertical />
          {fundacao !== undefined && anos !== undefined && (
            <p className="text-support mt-6 text-graphite">
              Desde {fundacao} · {anos} anos
            </p>
          )}
        </div>

        <div>
          <h2 className="mono uppercase text-ink">Contato</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {(empresa.telefones ?? []).map((tel) => (
              <li key={tel}>
                <a
                  href={linkDeTelefone(tel)}
                  className="mono text-graphite transition-colors hover:text-ink"
                >
                  {tel}
                </a>
              </li>
            ))}
            {/* ⚠️ Sem número no painel, NÃO se desenha o link. Um `wa.me` para
                um número inválido abre o aplicativo, diz que o contato não
                existe, e quem descobre é o cliente que desiste. */}
            {whatsapp !== undefined && (
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-support text-graphite transition-colors hover:text-ink"
                >
                  WhatsApp
                </a>
              </li>
            )}
            {empresa.email !== undefined && (
              <li>
                <a
                  href={`mailto:${empresa.email}`}
                  className="text-support text-graphite transition-colors hover:text-ink"
                >
                  {empresa.email}
                </a>
              </li>
            )}
            {empresa.instagram !== undefined && (
              <li>
                <a
                  href={empresa.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-support text-graphite transition-colors hover:text-ink"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>

          {endereco !== undefined && (
            <address className="text-support mt-6 text-graphite not-italic">
              {endereco.logradouro}
              {endereco.logradouro !== undefined && <br />}
              {[endereco.bairro, endereco.cidade, endereco.uf]
                .filter((parte) => parte !== undefined)
                .join(" · ")}
              {endereco.cep !== undefined && (
                <>
                  <br />
                  {endereco.cep}
                </>
              )}
            </address>
          )}
        </div>

        <div>
          <h2 className="mono uppercase text-ink">Representadas</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {representadas.map((r) => (
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
            {TERRITORIO.map((uf) => (
              <li key={uf} className="text-support text-graphite">
                {uf}
              </li>
            ))}
          </ul>

          {empresa.razaoSocial !== undefined && (
            <p className="text-support mt-6 text-graphite">
              {empresa.razaoSocial}
              {empresa.cnpj !== undefined && (
                <>
                  <br />
                  CNPJ {empresa.cnpj}
                </>
              )}
            </p>
          )}

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
