import { Ficha, FichaLinha } from "@/components/ficha";
import { SecaoLivre } from "@/components/paginas/secao";
import {
  TERRITORIO,
  aberturaPorExtenso,
  linkDeTelefone,
  linkDeWhatsapp,
  type Empresa,
} from "@/lib/empresa";
import { emLista } from "@/lib/frase";

/**
 * A ficha da Belmare — **o bloco que existe para que ninguém redigite o
 * endereço.**
 *
 * ⚠️ **É O ÚNICO BLOCO SEM CONTEÚDO PRÓPRIO, E ESSA AUSÊNCIA É O ARGUMENTO.**
 * `/contato` precisa mostrar endereço, telefones, e-mail, território e CNPJ — e
 * os cinco já são campo do cadastro desde PRA-122, lidos pelo rodapé em toda
 * rota do site. Sem este bloco, a única saída do operador seria escrevê-los
 * dentro de um bloco de texto: duas cópias do mesmo telefone, e a segunda é a
 * que ninguém lembra de corrigir. O que ele escolhe aqui é SE a ficha aparece e
 * ONDE; o conteúdo é gerado do cadastro, sempre.
 *
 * ⚠️ **CADA LINHA SOME SOZINHA QUANDO O DADO NÃO EXISTE, e a ficha inteira some
 * quando nenhuma sobra.** Mesma regra do rodapé: o pior resultado de um cadastro
 * pela metade é menos ficha, nunca uma linha rotulada sobre o vazio. E nunca um
 * `wa.me` para um número que não existe.
 *
 * ⚠️ **NENHUM E-MAIL DE FÁBRICA ENTRA AQUI, NEM EM LUGAR NENHUM DESTE SITE.**
 * O único e-mail é o comercial da Belmare, do cadastro. Um representante que se
 * desintermedia do próprio funil está construindo o site do concorrente.
 *
 * ⚠️ **SÍNCRONO, E O CADASTRO ENTRA POR PARÂMETRO** — mesma razão de
 * `BlocoCaminhos`: o live preview redesenha a composição no cliente, e um
 * componente que busca o próprio dado não pode ser redesenhado ali. Quem lê é a
 * rota, uma vez.
 */
export function BlocoFicha({
  titulo,
  empresa,
}: {
  titulo?: string;
  empresa: Empresa;
}) {
  const { endereco } = empresa;

  const whatsapp = linkDeWhatsapp(empresa.whatsapp, "vim pela página de contato");
  const telefones = empresa.telefones ?? [];
  const abertura = aberturaPorExtenso(empresa.abertura);

  const enderecoEmLinhas = [
    endereco?.logradouro,
    [endereco?.bairro, endereco?.cidade, endereco?.uf]
      .filter((parte) => parte !== undefined)
      .join(" · "),
    endereco?.cep,
  ].filter((linha) => linha !== undefined && linha !== "");

  /* O que a ficha de fato tem para mostrar. Sem nenhuma linha, o bloco não é
     desenhado — um título e um fio sobre o vazio é o modo de falha que a seção
     anulável existe para não ter. */
  const temAlgo =
    enderecoEmLinhas.length > 0 ||
    telefones.length > 0 ||
    whatsapp !== undefined ||
    empresa.email !== undefined ||
    empresa.instagram !== undefined ||
    empresa.razaoSocial !== undefined ||
    empresa.cnpj !== undefined;

  if (!temAlgo) return null;

  return (
    <SecaoLivre titulo={titulo}>
      <Ficha className={`max-w-[52rem] ${titulo === undefined ? "" : "mt-8"}`}>
        {enderecoEmLinhas.length > 0 && (
          <FichaLinha rotulo="Endereço">
            <address className="not-italic">
              {enderecoEmLinhas.map((linha) => (
                <span key={linha} className="block">
                  {linha}
                </span>
              ))}
            </address>
          </FichaLinha>
        )}

        {telefones.length > 0 && (
          <FichaLinha rotulo="Telefones">
            <span className="flex flex-col gap-1">
              {telefones.map((telefone) => (
                <a
                  key={telefone}
                  href={linkDeTelefone(telefone)}
                  className="mono transition-colors hover:text-graphite"
                >
                  {telefone}
                </a>
              ))}
            </span>
          </FichaLinha>
        )}

        {whatsapp !== undefined && (
          <FichaLinha rotulo="WhatsApp">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-[3px] transition-colors hover:decoration-ink"
            >
              Abrir conversa
            </a>
          </FichaLinha>
        )}

        {empresa.email !== undefined && (
          <FichaLinha rotulo="E-mail">
            <a
              href={`mailto:${empresa.email}`}
              className="underline decoration-line underline-offset-[3px] transition-colors hover:decoration-ink"
            >
              {empresa.email}
            </a>
          </FichaLinha>
        )}

        {empresa.instagram !== undefined && (
          <FichaLinha rotulo="Instagram">
            <a
              href={empresa.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-[3px] transition-colors hover:decoration-ink"
            >
              {/* O rótulo não repete o endereço do perfil: ele é campo do
                  cadastro e pode ser trocado, e um "@nome" escrito aqui seria a
                  segunda cópia — a que continua nomeando o perfil antigo. */}
              Abrir perfil
            </a>
          </FichaLinha>
        )}

        {/* Gerado da malha do IBGE, como em toda superfície do site que nomeia
            os três estados — nunca um campo de texto que possa citar um quarto
            que a prancha de `/quem-somos` não sabe desenhar. */}
        <FichaLinha rotulo="Território">{emLista(TERRITORIO)}</FichaLinha>

        {empresa.razaoSocial !== undefined && (
          <FichaLinha rotulo="Razão social">
            {empresa.razaoSocial}
            {abertura !== undefined && (
              <span className="block text-graphite">Aberta em {abertura}</span>
            )}
          </FichaLinha>
        )}

        {empresa.cnpj !== undefined && (
          <FichaLinha rotulo="CNPJ">
            <span className="mono">{empresa.cnpj}</span>
          </FichaLinha>
        )}
      </Ficha>
    </SecaoLivre>
  );
}
