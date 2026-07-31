import Image from "next/image";

import { Seta } from "@/components/icones";
import { Bloco } from "@/components/quem-somos/bloco";
import { Ficha, FichaLinha } from "@/components/ficha";
import { FECHO } from "@/lib/acervo";
import { EMPRESA, whatsapp } from "@/lib/site";

/**
 * 06 — O interlocutor. O fecho e a ação.
 *
 * Depois de cinco blocos de registro denso, a página respira: uma fotografia
 * larga, a única de toda a rota, e então a ficha de atendimento. O ritmo é o
 * argumento — registro, prancha, ledger, e enfim o lugar onde tudo isso serve
 * para alguma coisa.
 *
 * ⚠️ **Todo lead passa pela Belmare.** Nenhum e-mail de fábrica aparece aqui,
 * nem em lugar nenhum do site. Um representante que se desintermedia do próprio
 * funil está construindo o site do concorrente.
 *
 * ⚠️ A ficha NÃO repete o rodapé. Razão social, CNPJ e Instagram já estão lá, e
 * a identidade legal já abriu a página no bloco 01. Aqui fica só o que responde
 * "o que acontece se eu chamar": canal, telefone, sede, território e a regra de
 * canal de venda — que é a informação que protege o lojista e explica por que o
 * site não dá preço.
 *
 * ⚠️ O número do WhatsApp não é escrito em texto porque ainda está mockado
 * (P6b). O link vai por `whatsapp()`, que é a fonte única; os dois telefones
 * fixos, esses sim, são reais e verificados.
 *
 * ⚠️ O sócio não é nomeado enquanto ele não confirmar. "Quem representa"
 * sustenta o argumento sem colocar o nome de uma pessoa no ar sem autorização.
 */
export function Interlocutor({ numero }: { numero: string }) {
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
          Imagem de referência — não é obra entregue pela Belmare
        </figcaption>
      </figure>

      <Bloco numero={numero}>
        <h2 className="text-h1 max-w-[18ch] font-normal text-balance">
          Fale com quem representa.
        </h2>
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          Todo contato passa pela Belmare. O e-mail comercial das fábricas não
          está neste site: quem responde é quem representa, e é quem aciona a
          fábrica depois. Quatro marcas, um interlocutor — vale para a primeira
          pergunta e para a assistência três anos depois.
        </p>

        <a
          href={whatsapp("estava em quem somos")}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 flex items-center justify-between gap-6 border-y border-ink py-7 transition-colors hover:bg-surface md:mt-14"
        >
          <span className="text-h2 font-normal">Falar pelo WhatsApp</span>
          <Seta className="h-3 w-8 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
        </a>

        {/* Duas linhas, não quatro. Sede e território saíram: um está no rodapé
            150px abaixo, com CEP e tudo, e o outro é o assunto inteiro do bloco
            04. O que sobra responde "e se eu chamar?".

            O telefone fica, e sim, ele também está no rodapé. É deliberado:
            quem chega até aqui está agindo, e mandar essa pessoa rolar atrás de
            um número é atrito num fecho de contato. Rodapé é a face legal do
            site; esta ficha é a face do atendimento. Repetir dois números nesse
            par de papéis é o que rodapé serve para fazer. */}
        <Ficha className="mt-12 md:mt-16">
          <FichaLinha rotulo="Telefone">
            <span className="flex flex-wrap gap-x-4 gap-y-1">
              {EMPRESA.telefones.map((tel) => (
                <a
                  key={tel}
                  href={`tel:+55${tel.replace(/\D/g, "")}`}
                  className="mono text-ink transition-colors hover:text-graphite"
                >
                  {tel}
                </a>
              ))}
            </span>
          </FichaLinha>
          <FichaLinha rotulo="Canal de venda">
            Sempre através de loja. A Belmare não vende direto ao consumidor
            final — recebe o contato e indica a loja mais próxima, em{" "}
            {EMPRESA.territorio.join(", ").replace(/, ([^,]*)$/, " e $1")}.
          </FichaLinha>
        </Ficha>
      </Bloco>
    </>
  );
}
