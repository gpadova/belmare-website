import Image from "next/image";

import { Ficha, FichaLinha } from "@/components/ficha";
import { Seta } from "@/components/icones";
import { Secao } from "@/components/quem-somos/secao";
import { FECHO } from "@/lib/acervo";
import { linkDeTelefone, linkDeWhatsapp } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { buscarQuemSomos } from "@/lib/espinha-consulta";

/**
 * O fecho de `/quem-somos` — a fotografia e a ação.
 *
 * Depois de quatro seções de texto e uma lista, a página respira: uma
 * fotografia larga, a única de toda a rota, e então a ficha de atendimento.
 *
 * ⚠️ **Todo lead passa pela Belmare.** Nenhum e-mail de fábrica aparece aqui,
 * nem em lugar nenhum do site. Um representante que se desintermedia do próprio
 * funil está construindo o site do concorrente.
 *
 * ⚠️ A ficha NÃO repete o rodapé. Razão social, CNPJ, endereço e Instagram já
 * estão lá. Aqui fica só o que responde "o que acontece se eu chamar": o canal,
 * o telefone e a regra de canal de venda — que é a informação que protege o
 * lojista e explica por que o site não dá preço.
 *
 * ⚠️ O número do WhatsApp não é escrito em texto: o link vai por
 * `linkDeWhatsapp`, e o número em si é campo do painel. Sem número cadastrado,
 * a ação inteira não é desenhada, e a ficha continua de pé com os telefones.
 * Link morto é pior do que link nenhum.
 *
 * ⚠️ O sócio não é nomeado enquanto ele não confirmar. O parágrafo sustenta o
 * argumento — uma pessoa responde pelas marcas todas — sem colocar o nome de
 * alguém no ar sem autorização.
 */
export async function Contato() {
  const empresa = await buscarEmpresa();
  const { contato } = await buscarQuemSomos();

  const whatsapp = linkDeWhatsapp(empresa.whatsapp, "estava em quem somos");
  const telefones = empresa.telefones ?? [];

  return (
    <>
      <figure className="border-t border-line">
        <div className="relative aspect-16/9 w-full bg-ink sm:aspect-21/9">
          <Image
            src={FECHO.src}
            alt={FECHO.alt}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* A única legenda visível de foto no site inteiro, e ela existe por
            causa da posição: esta imagem cai no vão que a seção de projetos
            deixa vazio, e sem legenda um arquiteto lê obra entregue. */}
        <figcaption className="mono uppercase px-5 pt-3 text-graphite md:px-8">
          Imagem de referência, não é obra entregue pela Belmare
        </figcaption>
      </figure>

      <Secao titulo="Fale com a Belmare.">
        {contato !== undefined && (
          <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
            {contato}
          </p>
        )}

        {whatsapp !== undefined && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 flex items-center justify-between gap-6 border-y border-ink py-7 transition-colors hover:bg-surface md:mt-14"
          >
            <span className="text-h2 font-normal">Falar pelo WhatsApp</span>
            <Seta className="h-3 w-8 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
          </a>
        )}

        {/* Duas linhas, não quatro. Sede e território saíram: um está no rodapé
            150px abaixo, com CEP e tudo, e o outro é uma seção inteira desta
            página. O que sobra responde "e se eu chamar?".

            O telefone fica, e sim, ele também está no rodapé. É deliberado:
            quem chega até aqui está agindo, e mandar essa pessoa rolar atrás de
            um número é atrito num fecho de contato. Rodapé é a face legal do
            site; esta ficha é a face do atendimento. */}
        <Ficha className="mt-12 md:mt-16">
          {telefones.length > 0 && (
            <FichaLinha rotulo="Telefone">
              <span className="flex flex-wrap gap-x-4 gap-y-1">
                {telefones.map((tel) => (
                  <a
                    key={tel}
                    href={linkDeTelefone(tel)}
                    className="mono text-ink transition-colors hover:text-graphite"
                  >
                    {tel}
                  </a>
                ))}
              </span>
            </FichaLinha>
          )}
          {/* ⚠️ AQUI HAVIA UMA LINHA "Como comprar", E ELA SAIU EM 05/08/2026,
              A PEDIDO DO CLIENTE. Dizia: "A venda é sempre feita por uma loja.
              A Belmare recebe o contato e indica a loja mais próxima dentro do
              território atendido."

              Ela já tinha sido reescrita uma vez, de "A Belmare não vende
              direto ao consumidor final" para a forma positiva acima — e o
              problema sobreviveu à reescrita, porque não era o tom. **É uma
              ficha de contato explicando o funcionamento de uma representação
              comercial para um leitor que já trabalha com uma.** Lojista e
              escritório de arquitetura sabem que representada não fatura no
              varejo; escrever isso na última linha da página é gastar a linha
              mais lida com o que ninguém veio perguntar.

              O caminho continua desenhado onde ele é ação e não aviso: as duas
              portas da home (`components/portas.tsx`) e a página de contato,
              que manda o comprador para o WhatsApp e o lojista para a proposta
              de revenda. Não devolva esta linha à ficha. */}
        </Ficha>
      </Secao>
    </>
  );
}
