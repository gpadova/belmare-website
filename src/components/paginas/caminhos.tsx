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
 * ⚠️ **O BLOCO TEM DOIS DESENHOS, E QUEM ESCOLHE É A PRESENÇA DO FORMULÁRIO.**
 *
 *   sem formulário   uma seção livre com a lista — `/arquitetos`, e é o que
 *                    este bloco sempre foi
 *   com formulário   UMA banda de duas colunas, aberta por fio em tinta —
 *                    hoje só `/contato`
 *
 * A segunda entrou em 06/08/2026, por decisão do cliente: o formulário de
 * proposta é o ativo comercial de `/contato` e chegava como a terceira banda de
 * uma pilha, a 1170px do topo numa tela de 900. Ele estava depois de um bloco de
 * texto, depois de uma lista de duas linhas, e sozinho num poço de 570px de
 * largura no meio de uma página de 1440. **Nada nele era pequeno; o que era
 * pequeno era o lugar dele.**
 *
 * ⚠️ **A LISTA E O FORMULÁRIO ERAM DUAS SEÇÕES EMPILHADAS, E VIRARAM DUAS
 * COLUNAS DA MESMA.** Não é rearranjo: é o bloco passando a desenhar o que ele
 * significa. Um bloco de caminhos é uma bifurcação, e uma bifurcação desenhada
 * como duas bandas em sequência lê como duas seções que não têm relação. Lado a
 * lado, as três saídas de `/contato` aparecem juntas na mesma tela, que é o
 * único lugar onde alguém compara escolhas.
 *
 * ⚠️ **O FORMULÁRIO FICA NA COLUNA DA MARGEM, E ISSO DECIDE AS DUAS LARGURAS DE
 * UMA VEZ.** A Regra da Margem Única reserva a margem esquerda para o que a
 * página tem de mais pesado, e no telefone a ordem do markup É a ordem da
 * leitura — então a coluna da margem é também a que aparece primeiro quando as
 * duas empilham. **Nenhum `order-*` entra aqui**: quando a correção de uma ordem
 * de empilhamento exige um, quase sempre a coluna é que estava errada
 * (`DESIGN.md → Layout`). Quem quer comprar não perde nada com isso: o balão de
 * WhatsApp é fixo em toda rota e nunca sai da tela.
 *
 * ⚠️ **O TÍTULO DO BLOCO RECUA PARA MONO QUANDO HÁ FORMULÁRIO.** Duas display de
 * 42px lado a lado seriam duas colunas dizendo que têm o mesmo peso, e elas não
 * têm — uma leva a uma conversa que começa em um toque, a outra é o único lugar
 * do site que pede dado pessoal. A mono versal em tinta é a gramática que o
 * sistema já usa para rotular uma coluna sem disputar com a fala
 * (`DESIGN.md → Cabeçalho de seção`); é o mesmo campo do painel, com o peso que
 * o contexto pede.
 *
 * ⚠️ **A BANDA ABRE EM FIO DE TINTA, E ELE É O QUARTO DO SISTEMA.** Os outros
 * três são a faixa de ação, o envio do formulário e o balão fixo — os três
 * elementos que carregam mais peso do que um divisor, sem virar preenchimento.
 * O fio é da BANDA COM FORMULÁRIO, não do bloco de caminhos: em `/arquitetos` a
 * lista continua abrindo no fio de 1px em `{colors.line}` como qualquer seção,
 * porque ali ela é uma das três e não a página inteira. Fio em tinta em toda
 * seção seria fio em tinta em nenhuma.
 *
 * ⚠️ **A GRAMÁTICA DA LINHA É A DA LINHA DE DOCUMENTO, NÃO A DAS PORTAS DA
 * HOME.** As portas são campo fotográfico inteiro sob véu escuro — o elemento
 * mais pesado da home, e pesado de propósito, porque ali a escolha É a
 * página. Aqui a escolha vem ao lado de um formulário, e repetir o peso das
 * portas dentro de `/contato` faria a página inteira ler como a home de novo.
 * Fio, título sublinhado, apoio em grafite e seta na ponta: a mesma linha de
 * `/catalogos`.
 *
 * ⚠️ **UM CAMINHO DE WHATSAPP SEM NÚMERO CADASTRADO NÃO VIRA LINHA MORTA — ELE
 * SOME.** Mesma regra de `AcaoDeFecho` e da linha de catálogo a pedir: um
 * `wa.me` para um número que não existe abre o aplicativo e diz que o contato
 * não existe, e quem descobre é o cliente que desiste. Se todos os caminhos do
 * bloco dependiam do número, o bloco inteiro some — menos página, nunca página
 * quebrada. Com formulário no bloco, some a coluna da lista e a banda continua:
 * o formulário não depende de dado cadastrado nenhum.
 *
 * ⚠️ **UM CAMINHO PARA FORMULÁRIO NÃO ENTRA NA LISTA.** Era uma linha que levava
 * a `#formulario`, já visível na mesma tela alguns parágrafos abaixo: o clique
 * não navegava para lugar nenhum, só rolava uns pixels até um formulário sem
 * heading nenhum ligando ele de volta a "Quero revender" — e nada distinguia
 * esse formulário do caminho vizinho ("Sou arquiteto ou designer"), que não tem
 * nada a ver com ele. O rótulo do caminho é o `h2` que abre a coluna dele, e a
 * âncora continua existindo para quem chega por link direto.
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
    .filter((linha): linha is Linha => linha.href !== undefined);

  if (desenhaveis.length === 0) return null;

  const links = desenhaveis.filter(({ caminho }) => caminho.destino !== "formulario");

  /* Só o primeiro conta, mesmo que dois caminhos apontem para "formulario": um
     segundo formulário na mesma página daria dois campos com o mesmo `name` e
     duas âncoras com o mesmo `id`. */
  const formulario = desenhaveis.find(({ caminho }) => caminho.destino === "formulario");

  /* Sem formulário, o bloco é o que sempre foi: uma seção livre com a lista. É
     o desenho de `/arquitetos`, e ele não muda. */
  if (formulario === undefined) {
    return (
      <SecaoLivre titulo={titulo}>
        <ListaDeCaminhos linhas={links} className="max-w-[52rem]" />
      </SecaoLivre>
    );
  }

  /* A âncora vai na seção e o `aria-labelledby` aponta para o h2: dois `id`
     iguais na mesma página é HTML inválido, e o segundo deixa de ser alcançável
     por âncora e por leitor de tela ao mesmo tempo. */
  const idDoFormulario = `${ANCORA_DO_FORMULARIO}-titulo`;
  const idDaLista = `${ANCORA_DO_FORMULARIO}-caminhos`;

  return (
    <div className="border-t border-ink px-5 pt-12 pb-14 md:px-8 md:pt-16 md:pb-24">
      {/* Teto de 64rem na banda inteira, e não por coluna: o teto é da coluna de
          conteúdo da página, e duas colunas dentro dele continuam obedecendo a
          margem direita aberta. `gap-y` só existe enquanto elas empilham. */}
      <div className="grid max-w-[64rem] gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
        <section
          id={ANCORA_DO_FORMULARIO}
          aria-labelledby={idDoFormulario}
          className="min-w-0 scroll-mt-24"
        >
          <h2
            id={idDoFormulario}
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
        </section>

        {links.length > 0 && (
          <section
            aria-labelledby={titulo === undefined ? undefined : idDaLista}
            className="min-w-0"
          >
            {titulo !== undefined && (
              /* Continua `h2` — o nível é do documento, o tamanho é do desenho.
                 Rebaixar para `h3` faria a lista parecer subordinada ao
                 formulário na leitura assistiva, e ela não é: são caminhos
                 irmãos, com pesos visuais diferentes. */
              <h2 id={idDaLista} className="mono uppercase text-ink">
                {titulo}
              </h2>
            )}
            <ListaDeCaminhos
              linhas={links}
              className={titulo === undefined ? "" : "mt-5"}
            />
          </section>
        )}
      </div>
    </div>
  );
}

/** Um caminho já resolvido: o que o painel escreveu, e para onde ele leva. */
type Linha = { caminho: Caminho; href: string };

/**
 * A lista regrada de caminhos — a mesma nos dois desenhos do bloco.
 *
 * ⚠️ Ela é UMA função porque os dois desenhos precisam da mesma linha, e duas
 * cópias da mesma linha é como o `hover` de uma delas para de acompanhar a
 * outra. O que varia entre eles é a caixa, não o item.
 */
function ListaDeCaminhos({
  linhas,
  className,
}: {
  linhas: Linha[];
  className: string;
}) {
  return (
    <ul className={`border-t border-line ${className}`}>
      {linhas.map(({ caminho, href }) => {
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
              {/* Quem não enxerga a seta precisa ouvir para onde o link leva:
                  sair do site para o aplicativo é uma mudança de contexto que o
                  rótulo sozinho não anuncia. */}
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
