import Link from "next/link";

import { Seta } from "@/components/icones";
import { GRADE_DA_LINHA_SEM_MARCA } from "@/components/linha-de-catalogo";
import { SecaoDaMarca } from "@/components/marca/secao";
import type { Arquivo3D } from "@/lib/arquivos3d";
import { pesoEmMB } from "@/lib/representadas";

/**
 * Os blocos 3D desta fábrica.
 *
 * ⚠️ **SEÇÃO NOVA EM PRA-131, E ELA LIGA UMA CONSULTA QUE JÁ EXISTIA.**
 * `buscarArquivos3DDaRepresentada` está pronta, testada e escopada por marca
 * desde PRA-120, e nenhuma rota a chamava: quem lia sobre a Trisol e queria o
 * bloco dela tinha que sair para `/arquivos-3d` e recortar a lista de volta até
 * a Trisol. O arquiteto precisa desenhar HOJE — mandá-lo procurar noutra tela o
 * arquivo da fábrica cuja página ele já está lendo é atrito que não paga nada.
 *
 * ⚠️ **SEÇÃO PRÓPRIA, SEPARADA DO CATÁLOGO, E A SEPARAÇÃO É O PONTO.** São dois
 * trabalhos diferentes: um PDF se lê para decidir, um bloco se baixa para
 * desenhar. As referências verificadas em 05/08/2026 nomeiam os downloads pelo
 * trabalho que fazem — a Gandía Blasco lista `Data sheet`, `Cleaning and
 * maintenance`, `Fabrics` e `3D(CAD)` como coisas distintas, e o Architonic
 * separa `PDF` de `3D & BIM` em abas.
 *
 * ⚠️ **`/arquivos-3d` NÃO FOI TOCADA E NÃO É DUPLICADA AQUI.** Aquela rota
 * atravessa as quatro fábricas e filtra por marca e por formato; esta é a vista
 * de UMA, sem filtro e sem coluna de fábrica, porque a página inteira já é dela.
 * O peso sai da mesma função (`pesoEmMB`) e a linha herda a mesma grade
 * exportada, para que "8,4 MB" numa tela não vire "8.4MB" na outra.
 *
 * ⚠️ **FORMATO E PESO ANTES DO CLIQUE, GARANTIDOS PELO TIPO.** Não existe como
 * montar um `Arquivo3D` sem os dois — `lib/arquivos3d.ts` devolve `undefined`
 * inteiro em vez de um objeto pela metade —, então não existe estado de painel em
 * que esta lista desenhe um download mudo.
 *
 * ⚠️ **SEM CADASTRO.** O download é direto. O único arquivo do site atrás de
 * formulário é o pacote completo das quatro fábricas, em `/arquivos-3d`, e a
 * razão é econômica: a GDA já está na Casoca, gratuita e sem cadastro — pedir os
 * dados de um arquiteto em troca de um bloco que ele baixa do outro lado em dez
 * segundos não captura o lead, doa o lead.
 */
export function Arquivos3DDaMarca({
  arquivos,
  contagem,
}: {
  arquivos: Arquivo3D[];
  contagem?: string;
}) {
  if (arquivos.length === 0) return null;

  return (
    <SecaoDaMarca id="arquivos-3d" titulo="Arquivos 3D" contagem={contagem}>
      <ul className="mt-6 max-w-[64rem] border-t border-line md:mt-8">
        {arquivos.map((arquivo, i) => (
          <li
            /* Índice na chave: a mesma peça costuma existir em dois formatos —
               "Cadeira Zuri" em SKP e em DWG são duas linhas com o mesmo nome. */
            key={`${arquivo.nome}-${i}`}
            className="border-b border-line"
          >
            {/* ⚠️ **`download` SOZINHO NÃO BASTA, e por isso o `target` também
                está aqui.** O atributo é ignorado em URL de outra origem, e o
                arquivo mora no bucket por decisão de infraestrutura. Sem
                `target`, o clique navegaria para o visualizador do navegador e
                levaria o visitante para fora da página. Medido em
                `components/linha-de-catalogo.tsx`, não suposto aqui. */}
            <a
              href={arquivo.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={`group ${GRADE_DA_LINHA_SEM_MARCA} items-baseline gap-y-1 py-5 transition-colors hover:bg-surface`}
            >
              <span className="text-h3 col-start-1 row-start-1 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                {arquivo.nome}
              </span>

              {/* No telefone a linha empilha e a medida cai colada no nome. O
                  respiro extra só existe abaixo de `md`, onde a coluna some.

                  ⚠️ Sem `block`: a caixa de bloco alinha pela última linha do
                  próprio conteúdo, e a medida assentava três pixels abaixo da
                  linha de base do nome ao lado. Numa tabela de uma linha por
                  arquivo, três pixels de desalinho é o que faz a coluna parecer
                  torta. */}
              <span className="mono col-start-1 row-start-2 mt-1 uppercase text-graphite md:col-start-2 md:row-start-1 md:mt-0">
                {arquivo.formato} · {pesoEmMB(arquivo.mb)} MB
              </span>

              <Seta className="col-start-2 row-start-1 h-3 w-8 self-center text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none md:col-start-3" />

              {/* Quem não vê a seta precisa ouvir que o gesto sai do site com um
                  arquivo — a mesma cortesia da linha de catálogo. */}
              <span className="sr-only">(baixa o arquivo)</span>
            </a>
          </li>
        ))}
      </ul>

      <Link
        href="/arquivos-3d"
        className="mono uppercase group mt-8 inline-flex items-center gap-3 text-ink md:mt-10"
      >
        Ver a biblioteca das quatro fábricas
        <Seta className="h-3 w-8 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
      </Link>
    </SecaoDaMarca>
  );
}
