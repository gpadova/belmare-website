import Link from "next/link";

import { Seta } from "@/components/icones";
import { Secao } from "@/components/quem-somos/secao";
import { buscarQuemSomos } from "@/lib/espinha-consulta";
import { porExtenso } from "@/lib/frase";
import { paginaDaRepresentada } from "@/lib/representadas";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * As fábricas representadas.
 *
 * Uma lista de ficha, não a grade de marcas da home. Lá as quatro entram com
 * fotografia, porque a home vende o conjunto; aqui elas entram como linhas —
 * nome, origem, linha — porque a pergunta deste ponto da página é outra: o que,
 * exatamente, a Belmare põe na mesa de quem compra.
 *
 * ⚠️ **A TERCEIRA CÉLULA É A LINHA DA FÁBRICA, SEM VERBO NA FRENTE.** Ela já
 * escreveu "Resolve o móvel de autor", "Resolve a estrutura", "Resolve o
 * conforto", "Resolve a sombra" — quatro vezes o mesmo verbo, descendo a
 * página, cada um seguido de um substantivo abstrato. Uma lista de
 * representadas com essa forma para de ser lista e vira manifesto. Uma linha de
 * fábrica ("Ombrelones laterais e centrais") é dado; um benefício ("a sombra")
 * é interpretação da Belmare sobre o produto de terceiro.
 *
 * ⚠️ A Trisol não declara cidade em fonte nenhuma (só o DDD 48). A célula diz
 * "não declarada", com todas as letras, em vez de um travessão que o leitor
 * confunde com erro de digitação. Preencher o campo com "Florianópolis" porque
 * o DDD bate seria inventar — e o leitor desta página é exatamente quem repara
 * nisso.
 *
 * ⚠️ NENHUMA FRASE AQUI DESCREVE O CONTRATO DAS FÁBRICAS. Uma versão anterior
 * dizia "nenhuma vende para o Sul sem passar por aqui" — exclusividade é termo
 * comercial de terceiro, não está em documento nenhum que este projeto tenha, e
 * o segundo leitor silencioso desta página é o diretor comercial de uma quinta
 * fábrica.
 *
 * ⚠️ **A CONTAGEM É CONTADA, NÃO DIGITADA.** A primeira frase abre uma lista
 * que mostra as marcas logo abaixo dela; se ela fosse texto livre, a quinta
 * representada entraria na lista e a frase três centímetros acima continuaria
 * dizendo quatro. O campo do painel é o que vem DEPOIS dessa primeira frase.
 */
export async function FabricasRepresentadas() {
  const representadas = await representadasDaPagina();
  const { acervo } = await buscarQuemSomos();

  const quantas = porExtenso(representadas.length);

  return (
    <Secao titulo="As fábricas representadas.">
      <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
        São {quantas} fábricas brasileiras. {acervo}
      </p>

      <ul className="mt-10 border-t border-line md:mt-14">
        {representadas.map((r) => (
          <li key={r.slug} className="border-b border-line">
            <Link
              href={paginaDaRepresentada(r)}
              className="group grid grid-cols-[minmax(0,1fr)_2rem] items-baseline gap-x-4 gap-y-2 py-5 transition-colors hover:bg-surface md:grid-cols-[minmax(0,18rem)_minmax(0,10rem)_minmax(0,1fr)_2rem] md:gap-x-8"
            >
              <span className="text-h3 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                {r.nome}
              </span>
              <span className="mono uppercase col-start-1 text-graphite md:col-start-2">
                {r.base ?? "Não declarada"}
              </span>
              <span className="text-support col-start-1 text-graphite md:col-start-3">
                {r.resolve}
              </span>
              <Seta className="col-start-2 row-start-1 h-3 w-8 self-center text-graphite transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-ink motion-reduce:transition-none md:col-start-4" />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/representadas"
        className="mono uppercase group mt-10 inline-flex items-center gap-3 text-ink md:mt-12"
      >
        Ver as {quantas} representadas
        <Seta className="h-3 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
      </Link>
    </Secao>
  );
}
