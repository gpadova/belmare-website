import Link from "next/link";

import { FormularioDeLead } from "@/components/formulario-de-lead";
import { Seta } from "@/components/icones";
import { SecaoLivre } from "@/components/paginas/secao";
import { linkDeWhatsapp, type Empresa } from "@/lib/empresa";
import { ANCORA_DO_FORMULARIO, type Caminho } from "@/lib/paginas";

/**
 * O bloco de caminhos — a bifurcação de uma página livre.
 *
 * É o que faz `/contato` existir: "quero comprar" e "quero revender" são duas
 * economias opostas, e a home mantém a simetria das duas portas justamente
 * porque a segunda bifurca UMA camada abaixo, aqui (`components/portas.tsx`). E
 * é o que faz `/arquitetos` ser um hub de trabalho em vez de um texto sobre
 * arquitetos: catálogos, representadas e o canal direto, cada um com uma linha
 * dizendo o que há atrás.
 *
 * ⚠️ **A GRAMÁTICA É A DA LINHA DE DOCUMENTO, NÃO A DAS PORTAS DA HOME.** As
 * portas são campo fotográfico inteiro sob véu escuro — o elemento mais pesado
 * da home, e pesado de propósito, porque ali a escolha É a página. Aqui a
 * escolha vem depois de um argumento, e repetir o peso das portas dentro de
 * `/contato` faria a página inteira ler como a home de novo. Fio, título
 * sublinhado, apoio em grafite e seta na ponta: a mesma linha de `/catalogos`.
 *
 * ⚠️ **UM CAMINHO DE WHATSAPP SEM NÚMERO CADASTRADO NÃO VIRA LINHA MORTA — ELE
 * SOME.** Mesma regra de `AcaoDeFecho` e da linha de catálogo a pedir: um
 * `wa.me` para um número que não existe abre o aplicativo e diz que o contato
 * não existe, e quem descobre é o cliente que desiste. Se todos os caminhos do
 * bloco dependiam do número, o bloco inteiro some — menos página, nunca página
 * quebrada.
 *
 * ⚠️ **SÍNCRONO, E O CADASTRO ENTRA POR PARÂMETRO.** Ele buscava a empresa
 * sozinho até o live preview existir: um componente que lê o próprio dado não
 * pode ser redesenhado pelo cliente enquanto o operador arrasta um bloco. Quem
 * lê o cadastro uma vez é a rota (`components/paginas/rota-livre.tsx`), e todos
 * os blocos recebem o mesmo objeto — o que também economiza três leituras do
 * mesmo global numa página que use os três.
 */
export function BlocoCaminhos({
  titulo,
  itens,
  empresa,
  pagina,
}: {
  titulo?: string;
  itens: Caminho[];
  empresa: Empresa;
  /** O endereço desta página, gravado como origem do lead. Vem de cima porque
   *  quem sabe em que rota está é a rota, não o bloco. */
  pagina: string;
}) {
  const { whatsapp } = empresa;

  /* O destino de cada caminho é resolvido ANTES de desenhar, e o que não
     resolve sai da lista. Decidir isso dentro do `map` deixaria a lista com um
     item vazio no meio, e o fio dele continuaria desenhado. */
  const desenhaveis = itens
    .map((caminho) => ({
      caminho,
      href: enderecoDoCaminho(caminho, whatsapp),
    }))
    .filter((linha): linha is { caminho: Caminho; href: string } =>
      linha.href !== undefined,
    );

  if (desenhaveis.length === 0) return null;

  /* O formulário é desenhado UMA vez, depois da lista, mesmo que dois caminhos
     apontem para ele. Um formulário por linha daria dois campos com o mesmo
     `name` na mesma página e duas âncoras com o mesmo `id`. */
  const pedeFormulario = desenhaveis.some(
    ({ caminho }) => caminho.destino === "formulario",
  );

  return (
    <SecaoLivre titulo={titulo}>
      <ul className={`max-w-[52rem] border-t border-line ${titulo === undefined ? "" : "mt-8"}`}>
        {desenhaveis.map(({ caminho, href }) => {
          const externo = caminho.destino === "whatsapp";
          const ancora = caminho.destino === "formulario";

          const conteudo = (
            <>
              <span className="min-w-0">
                <span className="text-h3 block font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                  {caminho.rotulo}
                </span>
                {caminho.apoio !== undefined && (
                  <span className="text-support mt-2 block max-w-[52ch] text-pretty text-graphite">
                    {caminho.apoio}
                  </span>
                )}
                {/* Quem não enxerga a seta precisa ouvir para onde o link leva:
                    sair do site para o aplicativo é uma mudança de contexto que
                    o rótulo sozinho não anuncia. */}
                {externo && <span className="sr-only"> (abre o WhatsApp)</span>}
              {/* A mesma cortesia do aviso de WhatsApp, pelo motivo inverso:
                  aqui o link NÃO muda de página, e uma seta que não navega
                  confunde quem não vê a rolagem acontecer. */}
              {ancora && (
                <span className="sr-only"> (desce até o formulário nesta página)</span>
              )}
              </span>
              <Seta className="mt-1 h-3 w-8 shrink-0 self-start transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
            </>
          );

          const classe =
            "group flex items-baseline justify-between gap-6 py-5 transition-colors hover:bg-surface";

          return (
            <li key={`${caminho.rotulo}-${href}`} className="border-b border-line">
              {externo ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classe}
                >
                  {conteudo}
                </a>
              ) : ancora ? (
                /* Âncora na mesma página: `<a>` cru, não `<Link>`. O `Link` do
                   Next trata "#id" como navegação de rota e rola para o topo
                   antes de achar o alvo. */
                <a href={href} className={classe}>
                  {conteudo}
                </a>
              ) : (
                <Link href={href} className={classe}>
                  {conteudo}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {pedeFormulario && (
        <div id={ANCORA_DO_FORMULARIO} className="mt-16 scroll-mt-24">
          <FormularioDeLead origem={{ pagina }} />
        </div>
      )}
    </SecaoLivre>
  );
}

/**
 * Para onde um caminho leva, ou `undefined` quando ele não tem para onde levar.
 *
 * ⚠️ O `switch` é exaustivo de propósito, e o `satisfies never` no fim é o que
 * faz um quarto membro de `Caminho` virar erro de build em vez de um item que
 * some da página sem ninguém notar. Foi essa guarda que avisou onde mexer
 * quando o membro `formulario` entrou (PRA-126).
 */
function enderecoDoCaminho(
  caminho: Caminho,
  whatsapp: string | undefined,
): string | undefined {
  switch (caminho.destino) {
    case "rota":
      return caminho.href;
    case "whatsapp":
      return linkDeWhatsapp(whatsapp, caminho.contexto);
    case "formulario":
      /* Nunca some por dado ausente: o formulário mora na própria página e não
         depende de número, de rota nem de nada que possa não estar cadastrado. */
      return `#${ANCORA_DO_FORMULARIO}`;
    default:
      return caminho satisfies never;
  }
}
