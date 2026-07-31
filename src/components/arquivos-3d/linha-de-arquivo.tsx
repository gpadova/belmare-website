import { Seta } from "@/components/icones";
import type { Arquivo3D } from "@/lib/arquivos3d";
import { pesoEmMB } from "@/lib/representadas";

/**
 * A grade da linha de arquivo 3D — exportada porque o cabeçalho de colunas de
 * `/arquivos-3d` tem que assentar exatamente sobre ela.
 *
 * ⚠️ **É A GRADE DA LINHA DE CATÁLOGO, ESCRITA DE NOVO E NÃO IMPORTADA — e a
 * duplicação é deliberada, não descuido.** As duas listas partilham a
 * GRAMÁTICA (título à esquerda, medida em mono à direita, seta na ponta) e é
 * isso que `components/linha-de-catalogo.tsx` promete quando diz que
 * "`/arquivos-3d` herda esta mesma gramática". O que elas não partilham é a
 * coluna do meio: um catálogo declara `PDF · 24,0 MB · 2026` num campo largo
 * porque a edição cabe ali, e um arquivo 3D declara `SKP · 8,4 MB` e para. A
 * saída "certa" — importar `GRADE_DA_LINHA` — acopla a largura de uma coluna
 * que existe por causa do ano de um catálogo à lista que não tem ano nenhum, e
 * a primeira vez que alguém apertar uma das duas a outra se mexe sem motivo.
 */
export const GRADE_DO_ARQUIVO =
  "grid grid-cols-[minmax(0,1fr)_2rem] gap-x-4 md:grid-cols-[minmax(0,1fr)_minmax(0,10rem)_2rem] md:gap-x-8";

/** O mesmo teto de `components/linha-de-catalogo.tsx`, e pelo mesmo motivo: sem
 *  ele a linha abre centenas de pixels de vão entre o nome e a medida em
 *  1440px, e a lista lê como tabela quebrada. */
export const TETO_DA_BIBLIOTECA = "max-w-[52rem]";

/**
 * Uma linha da biblioteca 3D — **e ela baixa direto, sem formulário nenhum.**
 *
 * ⚠️ **NÃO GATEAR ESTA LINHA É A DECISÃO INTEIRA DE PRA-127, E ELA REVERTE A
 * RECOMENDAÇÃO DO BRIEFING.** `briefing/audiencias.md` (P11) sugere cadastro
 * para baixar 3D, e três parágrafos abaixo registra o fato que derruba a
 * própria sugestão: a **Casoca** é gratuita, dominante no Brasil e **já
 * distribui a GDA**. Um formulário na frente de um arquivo que a Casoca entrega
 * sem pedir nada não captura o lead — **doa** o lead: a pessoa fecha a aba,
 * baixa do outro lado, e o que fica na memória dela é que o site da Belmare
 * cobra pedágio. O cadastro migrou inteiro para o pacote completo
 * (`components/arquivos-3d/pacote-completo.tsx`), que é a única coisa que a
 * Casoca estruturalmente não tem.
 *
 * É também o que o princípio 5 do `PRODUCT.md` já dizia por escrito antes deste
 * ticket: "ficha aberta sem cadastro, arquivo com formato e peso declarados
 * antes do clique, e nada que encante na primeira visita e irrite na décima".
 * Um arquiteto abre esta página muitas vezes por ano. Um formulário por
 * download é precisamente o que irrita na décima.
 *
 * ⚠️ **`SKP · 8,4 MB` VEM ANTES DO LINK, E O TIPO É QUEM GARANTE.** Não existe
 * como montar um `Arquivo3D` sem formato e sem peso (`lib/arquivos3d.ts`) —
 * então não existe estado de painel em que esta linha desenhe um download mudo.
 * É o mesmo respeito que o catálogo promete a quem está em obra com sinal ruim:
 * dá para decidir não tocar.
 *
 * ⚠️ **ABRE EM ABA NOVA, COM `download`.** Mesma razão de
 * `components/linha-de-catalogo.tsx`, medida lá e não suposta aqui: `download`
 * é IGNORADO em URL de outra origem, e `url` é endereço de bucket por decisão
 * de infraestrutura. Sem `target`, o clique navegaria para fora da página em
 * vez de baixar. O atributo fica porque volta a valer no dia em que o arquivo
 * for servido da mesma origem.
 */
export function LinhaDeArquivo3D({ arquivo }: { arquivo: Arquivo3D }) {
  return (
    <li className="border-b border-line">
      <a
        href={arquivo.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className={`group ${GRADE_DO_ARQUIVO} items-baseline gap-y-2 py-5 transition-colors hover:bg-surface`}
      >
        <span className="text-h3 col-start-1 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
          {arquivo.nome}
        </span>

        {/* No telefone a linha empilha e a medida cai colada no nome. O respiro
            extra só existe abaixo de `md`, onde a coluna some. */}
        <span className="mono col-start-1 mt-1 block uppercase text-graphite md:col-start-2 md:mt-0">
          {arquivo.formato} · {pesoEmMB(arquivo.mb)} MB
        </span>

        <Seta className="col-start-2 row-start-1 h-3 w-8 self-center text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none md:col-start-3" />

        {/* Quem não vê a seta precisa ouvir que o gesto sai do site com um
            arquivo — a mesma cortesia da linha de catálogo. */}
        <span className="sr-only">(baixa o arquivo)</span>
      </a>
    </li>
  );
}
