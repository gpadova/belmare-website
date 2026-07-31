import Image from "next/image";

import { Bloco } from "@/components/quem-somos/bloco";
import { projetosPublicaveis } from "@/lib/projetos";

/**
 * Projetos realizados — construída inteira, no ar em zero pixels.
 *
 * A seção está pronta e não renderiza nada hoje: `projetosPublicaveis()` só
 * devolve conteúdo quando existirem três projetos reais e completos. É a forma
 * honesta de "enviar oculta" — sem markup vazio, sem título órfão, sem "em
 * breve", e sem a tentação de legendar uma imagem de referência como obra
 * entregue.
 *
 * Ela cabe entre 05 e 06 sem redesenhar nada, e a página em pé não tem buraco
 * sem ela: foi assim que esta direção sobreviveu ao P43.
 *
 * O dia em que os projetos chegarem, o trabalho é preencher `lib/projetos.ts`
 * — este arquivo não precisa mudar. Antes disso, conferir P47/P48/P49 (direito
 * de imagem, autorização do cliente, crédito do arquiteto).
 */
export function ProjetosRealizados({ numero }: { numero: string }) {
  const projetos = projetosPublicaveis();
  if (projetos.length === 0) return null;

  return (
    <Bloco numero={numero}>
      <h2 className="text-h1 max-w-[20ch] font-normal text-balance">
        Projetos entregues no Sul.
      </h2>
      <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
        Obras em que peças das representadas foram especificadas e instaladas.
        Cada uma com ano, cidade, as marcas envolvidas e o crédito de quem
        assinou o projeto.
      </p>

      <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {projetos.map((projeto) => (
          <li key={`${projeto.obra}-${projeto.ano}`}>
            <div className="relative aspect-4/3 overflow-hidden bg-ink">
              <Image
                src={projeto.foto.src}
                alt={projeto.foto.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <h3 className="text-h3 mt-5 font-normal">{projeto.obra}</h3>
            <p className="mono uppercase mt-3 text-graphite">
              {projeto.cidade} · {projeto.uf} · {projeto.ano}
            </p>
            <p className="text-support mt-3 text-graphite">
              {projeto.marcas.join(" · ")}
            </p>
            <p className="text-support mt-1 text-graphite">
              Projeto de {projeto.creditoArquiteto}
            </p>
          </li>
        ))}
      </ul>
    </Bloco>
  );
}
