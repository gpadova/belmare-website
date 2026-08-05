import { Seta } from "@/components/icones";
import type { Arquivo3D } from "@/lib/arquivos3d";
import { pesoEmMB } from "@/lib/representadas";

/**
 * A grade da linha de arquivo 3D — exportada porque o cabeçalho de colunas de
 * `/arquivos-3d` tem que assentar exatamente sobre ela.
 *
 * ⚠️ **É A GRADE DA LINHA DE CATÁLOGO, ESCRITA DE NOVO E NÃO IMPORTADA — e a
 * duplicação é deliberada, não descuido.** As duas listas partilham a
 * GRAMÁTICA (fábrica, nome, medida em mono, seta na ponta) e é isso que
 * `components/linha-de-catalogo.tsx` promete quando diz que "`/arquivos-3d`
 * herda esta mesma gramática". O que elas não partilham é a **largura da coluna
 * da medida**: um catálogo declara `PDF · 24,0 MB · 2026` num campo de 13rem
 * porque a edição cabe ali, e um arquivo 3D declara `SKP · 8,4 MB` e para, em
 * 10rem. A saída "certa" — importar `GRADE_DA_LINHA` — acopla a largura de uma
 * coluna que existe por causa do ano de um catálogo à lista que não tem ano
 * nenhum, e a primeira vez que alguém apertar uma das duas a outra se mexe sem
 * motivo.
 *
 * ⚠️ **A COLUNA DA FÁBRICA ENTROU EM 05/08/2026, e é ela que sustenta a lista
 * plana.** Enquanto a página agrupava, a atribuição vinha do `<h2>` acima do
 * bloco; sem grupo, "Cadeira Zuri" precisa dizer de quem é **em toda linha**, e
 * é o que a primeira coluna faz. Mesma largura de `/catalogos` (11rem) porque é
 * o mesmo dado — nome de fábrica — e duas listas irmãs com a coluna da marca em
 * larguras diferentes leem como duas tabelas de projetos diferentes.
 */
export const GRADE_DO_ARQUIVO =
  "grid grid-cols-[minmax(0,1fr)_2rem] gap-x-4 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,10rem)_2rem] md:gap-x-8";

/**
 * O teto da lista.
 *
 * ⚠️ Sem ele a linha abre centenas de pixels de vão entre o nome e a medida em
 * 1440px, e a tabela lê como quebrada. Subiu de 52rem para 64rem junto com a
 * coluna da fábrica, e passou a ser o mesmo número de
 * `components/linha-de-catalogo.tsx#TETO_DA_LISTA` — não por simetria, mas
 * porque agora são quatro colunas do mesmo tipo nos dois lugares, e um teto
 * menor aqui espremeria o nome da peça enquanto o título do catálogo ao lado
 * respira.
 */
export const TETO_DA_BIBLIOTECA = "max-w-[64rem]";

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
export function LinhaDeArquivo3D({
  arquivo,
  marca,
}: {
  arquivo: Arquivo3D;
  /** O nome da fábrica. **Obrigatório**, ao contrário do da linha de catálogo:
   *  aquela linha também serve a seção "Para levar" da página da própria marca,
   *  onde a atribuição é a página inteira e repeti-la é ruído. Esta só existe em
   *  `/arquivos-3d`, que atravessa as quatro fábricas sempre — um parâmetro
   *  opcional aqui seria um ramo que nenhuma tela alcança. */
  marca: string;
}) {
  return (
    <li className="border-b border-line">
      <a
        href={arquivo.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className={`group ${GRADE_DO_ARQUIVO} items-baseline gap-y-1 py-5 transition-colors hover:bg-surface`}
      >
        {/* ⚠️ **A FÁBRICA VEM PRIMEIRO NO DOM E SEGUNDA NA TELA DO TELEFONE, e
            as duas coisas são de propósito** — a colocação é copiada de
            `components/linha-de-catalogo.tsx` porque o argumento é o mesmo. Em
            leitura linear "Trisol, Cadeira Zuri, SKP 8,4 MB" é a ordem que
            responde à pergunta de quem está aqui. No telefone, onde a linha
            empilha, é o NOME DA PEÇA que precisa ficar em cima: é sobre ele que
            a seta se alinha, e uma seta centrada num rótulo de onze pixels lê
            como se apontasse para a fábrica em vez de para o arquivo. */}
        <span className="text-support col-start-1 row-start-2 text-graphite md:row-start-1">
          {marca}
        </span>

        <span className="text-h3 col-start-1 row-start-1 font-normal underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink md:col-start-2">
          {arquivo.nome}
        </span>

        {/* No telefone a linha empilha e a medida cai colada no nome. O respiro
            extra só existe abaixo de `md`, onde a coluna some.

            ⚠️ Sem `block`, pela mesma medida da linha de catálogo: a caixa de
            bloco alinha pela última linha do próprio conteúdo, e a medida
            assentava três pixels abaixo da linha de base do nome ao lado. Numa
            tabela de uma linha por arquivo, três pixels de desalinho entre duas
            colunas é o que faz a coluna parecer torta. */}
        <span className="mono col-start-1 row-start-3 mt-1 uppercase text-graphite md:col-start-3 md:row-start-1 md:mt-0">
          {arquivo.formato} · {pesoEmMB(arquivo.mb)} MB
        </span>

        <Seta className="col-start-2 row-start-1 h-3 w-8 self-center text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none md:col-start-4" />

        {/* Quem não vê a seta precisa ouvir que o gesto sai do site com um
            arquivo — a mesma cortesia da linha de catálogo. */}
        <span className="sr-only">(baixa o arquivo)</span>
      </a>
    </li>
  );
}
