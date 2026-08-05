import Image from "next/image";

import { Secao } from "@/components/quem-somos/secao";
import { buscarProjetosPublicaveis } from "@/lib/projetos-consulta";
import { textosDeQuemSomos } from "@/lib/quem-somos-consulta";

/**
 * Projetos realizados — a seção anulável de `/quem-somos`, servida pelo painel
 * (PRA-121).
 *
 * ⚠️ **A SEÇÃO SÓ RENDERIZA COM TRÊS PROJETOS PUBLICÁVEIS OU MAIS.**
 * `buscarProjetosPublicaveis()` já aplica o portão de três — menos disso, a
 * lista vem vazia daqui, e é a forma honesta de "enviar oculta": sem markup
 * vazio, sem título órfão, sem "em breve", e sem a tentação de legendar uma
 * imagem de referência como obra entregue. A exclusão de fotografia mock
 * também já aconteceu antes de chegar aqui — ver `lib/projetos.ts#projetoDoPainel`.
 *
 * ⚠️ **O `numero` SAIU DO PARÂMETRO JUNTO COM A NUMERAÇÃO DA PÁGINA.** Esta
 * seção era a única cuja posição deslocava a seguinte: com projetos no ar o
 * fecho virava `06`, sem projetos ele era `05`, e a página carregava esse
 * cálculo de ordinal para dentro do componente. Sem número na margem
 * (`components/quem-somos/secao.tsx`), aparecer e desaparecer não custa nada a
 * ninguém — que é o que uma seção anulável deveria ter sido desde o começo.
 */
export async function ProjetosRealizados() {
  const projetos = await buscarProjetosPublicaveis();
  if (projetos.length === 0) return null;

  const { projetosTitulo, projetos: texto } = await textosDeQuemSomos();

  return (
    <Secao titulo={projetosTitulo}>
      {texto !== undefined && (
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          {texto}
        </p>
      )}

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
                /* Uma obra fotografada na horizontal entra num quadro 4/3 e
                   perde as laterais. O ponto focal que o operador clicou no
                   painel vem em `projeto.foto.posicao` e decide o que fica —
                   `undefined` quando ninguém clicou, e aí o corte é central. */
                style={projeto.foto.posicao ? { objectPosition: projeto.foto.posicao } : undefined}
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
    </Secao>
  );
}
