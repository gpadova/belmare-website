import Link from "next/link";

import { FormularioDeLead } from "@/components/formulario-de-lead";
import { IconeWhatsApp, Seta } from "@/components/icones";
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
 * ⚠️ **A GRAMÁTICA DA LISTA É A DA LINHA DE DOCUMENTO, NÃO A DAS PORTAS DA
 * HOME.** As portas são campo fotográfico inteiro sob véu escuro — o elemento
 * mais pesado da home, e pesado de propósito, porque ali a escolha É a
 * página. Aqui a escolha vem depois de um argumento, e repetir o peso das
 * portas dentro de `/contato` faria a página inteira ler como a home de novo.
 * Fio, título sublinhado, apoio em grafite e seta na ponta: a mesma linha de
 * `/catalogos`.
 *
 * ⚠️ **UM CAMINHO DE WHATSAPP SEM NÚMERO CADASTRADO NÃO VIRA LINHA MORTA — ELE
 * SOME.** Mesma regra de `AcaoDeFecho` e da linha de catálogo a pedir: um
 * `wa.me` para um número que não existe abre o aplicativo e diz que o contato
 * não existe, e quem descobre é o cliente que desiste. Se todos os caminhos do
 * bloco dependiam do número, o bloco inteiro some — menos página, nunca página
 * quebrada.
 *
 * ⚠️ **UM CAMINHO PARA FORMULÁRIO NÃO ENTRA NA LISTA — VIRA A SEÇÃO SEGUINTE.**
 * Era uma linha que levava a `#formulario`, já visível na mesma tela alguns
 * parágrafos abaixo: o clique não navegava para lugar nenhum, só rolava uns
 * pixels até um formulário sem heading nenhum ligando ele de volta a "Quero
 * revender" — e nada distinguia esse formulário do caminho vizinho ("Sou
 * arquiteto ou designer"), que não tem nada a ver com ele. A mesma gramática de
 * `PacoteCompleto` (`components/arquivos-3d/pacote-completo.tsx`) resolve
 * isso: o rótulo do caminho vira o `h2` que abre a seção seguinte — âncora, fio
 * no topo e formulário embaixo dele — em vez de se repetir como uma linha que
 * não leva a lugar nenhum.
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

  const links = desenhaveis.filter(({ caminho }) => caminho.destino !== "formulario");

  /* Só o primeiro conta, mesmo que dois caminhos apontem para "formulario": um
     segundo formulário na mesma página daria dois campos com o mesmo `name` e
     duas âncoras com o mesmo `id`. */
  const formulario = desenhaveis.find(({ caminho }) => caminho.destino === "formulario");

  return (
    <>
      {links.length > 0 && (
        <SecaoLivre titulo={titulo}>
          <ul className="max-w-[52rem] border-t border-line">
            {links.map(({ caminho, href }) => {
              const externo = caminho.destino === "whatsapp";

              const conteudo = (
                <>
                  <span className="min-w-0">
                    <span className="flex items-center gap-3">
                      {externo && (
                        <IconeWhatsApp className="h-5 w-5 shrink-0 text-graphite transition-colors group-hover:text-ink" />
                      )}
                      <span className="text-h3 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                        {caminho.rotulo}
                      </span>
                    </span>
                    {caminho.apoio !== undefined && (
                      <span className="text-support mt-2 block max-w-[52ch] text-pretty text-graphite">
                        {caminho.apoio}
                      </span>
                    )}
                    {/* Quem não enxerga a seta precisa ouvir para onde o link
                        leva: sair do site para o aplicativo é uma mudança de
                        contexto que o rótulo sozinho não anuncia. */}
                    {externo && <span className="sr-only"> (abre o WhatsApp)</span>}
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
                  ) : (
                    <Link href={href} className={classe}>
                      {conteudo}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </SecaoLivre>
      )}

      {formulario !== undefined && (
        /* A âncora vai na seção e o `aria-labelledby` aponta para o h2: dois
           `id` iguais na mesma página é HTML inválido, e o segundo deixa de
           ser alcançável por âncora e por leitor de tela ao mesmo tempo —
           mesma razão de `PacoteCompleto`. */
        <section
          aria-labelledby={`${ANCORA_DO_FORMULARIO}-titulo`}
          id={ANCORA_DO_FORMULARIO}
          className="scroll-mt-24 border-t border-line px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-24"
        >
          <div className="max-w-[64rem] min-w-0">
            <h2
              id={`${ANCORA_DO_FORMULARIO}-titulo`}
              className="text-h1 max-w-[22ch] font-normal text-balance"
            >
              {formulario.caminho.rotulo}
            </h2>

            {formulario.caminho.apoio !== undefined && (
              <p className="text-body mt-5 max-w-[52ch] text-pretty text-graphite">
                {formulario.caminho.apoio}
              </p>
            )}

            <div className="mt-10">
              <FormularioDeLead origem={{ pagina }} />
            </div>
          </div>
        </section>
      )}
    </>
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
         depende de número, de rota nem de nada que possa não estar cadastrado.
         O valor em si não vira `href` de link nenhum mais (ver acima) — só
         precisa ser um valor definido para o caminho sobreviver ao filtro de
         `desenhaveis`. */
      return `#${ANCORA_DO_FORMULARIO}`;
    default:
      return caminho satisfies never;
  }
}
