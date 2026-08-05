import Image from "next/image";
import Link from "next/link";

import { Seta } from "@/components/icones";
import { IMAGEM_DA_PORTA } from "@/lib/acervo";

/**
 * As duas portas.
 *
 * São a ação primária da página e por isso o elemento mais pesado dela: dois
 * campos de igual peso, não um botão e um link. A promessa precisa ser
 * cumprida — o que está atrás de cada uma é realmente diferente.
 *
 * A segunda porta junta consumidor e lojista, que têm economias opostas. Ela
 * bifurca no clique, uma camada abaixo, em `/contato`: isso mantém a home
 * enxuta e a simetria "eu especifico / eu compro" intacta.
 */

const PORTAS = [
  {
    href: "/arquitetos",
    rotulo: "Sou arquiteto ou designer",
    apoio:
      "Catálogos, arquivos 3D e cartas de acabamento das representadas. O que não estiver aqui, a Belmare pergunta à fábrica.",
    imagem: IMAGEM_DA_PORTA.arquitetos,
  },
  {
    href: "/contato",
    rotulo: "Quero comprar ou revender",
    apoio:
      "A Belmare indica a loja mais próxima de você. Se você tem uma loja, é por aqui que manda a proposta de revenda.",
    imagem: IMAGEM_DA_PORTA.contato,
  },
] as const;

export function Portas() {
  return (
    <section aria-labelledby="portas" className="border-t border-line">
      <h2 id="portas" className="sr-only">
        Por onde entrar
      </h2>
      <div className="grid md:grid-cols-2">
        {PORTAS.map((porta, i) => (
          <Link
            key={porta.href}
            href={porta.href}
            /* ⚠️ **AS PORTAS CRESCERAM COM A TROCA DE MUNDO — 05/08/2026.** Elas
               são a ação primária da página e já eram o elemento mais pesado
               dela; o que mudou é o que está acima. Com a abertura ocupando a
               tela inteira, um trilho de cartões e uma faixa editorial antes
               delas, 26rem no telefone e 32rem no desktop
               passaram a ler como rodapé de página, e não como a escolha que a
               home inteira existe para oferecer. A altura acompanha a página. */
            className={`group relative flex min-h-[30rem] flex-col justify-end overflow-hidden bg-ink p-6 md:min-h-[38rem] md:p-14 ${
              i === 0 ? "border-b border-line md:border-r md:border-b-0" : ""
            }`}
          >
            <Image
              src={porta.imagem.src}
              alt={porta.imagem.alt}
              aria-hidden="true"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/15"
            />

            <div className="relative">
              <span className="text-h1 block max-w-[16ch] font-normal text-white">
                {porta.rotulo}
              </span>
              {/* ⚠️ **O PISO DE TRÊS LINHAS ALINHA OS DOIS RÓTULOS, e é por
                  isso que ele existe.** As duas portas ancoram o conteúdo no pé
                  do campo (`justify-end`), e os textos de apoio têm tamanhos
                  diferentes — três linhas em 1440px na porta do arquiteto,
                  duas na de quem compra. Ancorados por baixo, isso empurra os
                  dois títulos para alturas diferentes, e dois campos de peso
                  declaradamente igual com os títulos desalinhados leem como
                  erro de montagem. A correção NÃO foi encurtar a copy: ela é
                  fixa por decisão 3 da spec, e a simetria "eu especifico / eu
                  compro" é o argumento das portas. Reservar a altura do texto
                  mais alto resolve sem tocar em nenhuma das duas frases. */}
              <span className="text-body mt-4 block max-w-[44ch] text-white/85 md:min-h-[3lh]">
                {porta.apoio}
              </span>
              <Seta className="mt-8 h-3 w-8 text-white transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
