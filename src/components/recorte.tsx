/**
 * Um recorte — a opção de filtro, em `/catalogos` e em `/arquivos-3d`, o mesmo
 * componente.
 *
 * ⚠️ **É COMPARTILHADO PELA MESMA RAZÃO QUE `components/linha-de-catalogo.tsx`
 * É.** As duas rotas são índices de arquivo e a promessa do site é que um
 * arquiteto que aprendeu a ler uma não reaprenda nada na outra. O controle
 * carrega uma CONTAGEM, que é dado — e dado desenhado em dois lugares diverge
 * na primeira vez que alguém apertar um dos dois. Nasceu privado dentro de
 * `catalogos/lista-de-catalogos.tsx` e saiu de lá quando a segunda lista
 * apareceu, antes de existir a segunda cópia.
 *
 * ⚠️ **NÃO É "BOTÃO", NO SENTIDO QUE O `DESIGN.md` RECUSA.** É `<button>` porque
 * é um controle e o teclado precisa alcançá-lo, mas não tem preenchimento, raio
 * nem sombra: o estado ativo é tinta mais um fio de 1px embaixo, e o inativo é
 * grafite. A Regra do Link fala de AÇÃO — o que navega, envia ou baixa é link. O
 * que muda o que já está na tela sem sair dela não é ação, e um `<a href="#">`
 * aqui mentiria para o leitor de tela sobre um destino que não existe.
 *
 * ⚠️ **RÓTULO EM GROTESCA CAIXA BAIXA, CONTAGEM EM MONO.** A Regra da Caixa Alta
 * cita "nome de fábrica" pelo nome, e mono versal no rótulo repetiria a violação
 * que `/catalogos` já cometeu uma vez. A contagem ao lado é medida, e medida é
 * mono — as duas caixas convivem dentro do mesmo controle porque são duas
 * classes de texto diferentes. Uma sigla de formato ("SKP") entra como rótulo em
 * caixa baixa **do jeito que chegou**: quem escolhe a caixa dela é quem chama,
 * porque só lá se sabe se a string é sigla ou nome próprio.
 *
 * ⚠️ **NÃO LEVA `"use client"`, e não precisa.** Ele é importado por componentes
 * que já têm a diretiva, e é assim que entra no grafo do cliente — a mesma
 * fronteira de `components/linha-de-catalogo.tsx`. Não importa nada além de si
 * mesmo, então não há como arrastar o Payload para o navegador por aqui.
 */
export function Recorte({
  rotulo,
  quantidade,
  ativo,
  aoEscolher,
}: {
  rotulo: string;
  quantidade: number;
  ativo: boolean;
  aoEscolher: () => void;
}) {
  return (
    <button
      type="button"
      onClick={aoEscolher}
      aria-pressed={ativo}
      className={`group flex shrink-0 items-baseline gap-2 border-b py-1 transition-colors ${
        ativo
          ? "border-ink text-ink"
          : "border-transparent text-graphite hover:text-ink"
      }`}
    >
      <span>{rotulo}</span>
      <span className="mono text-graphite">{quantidade}</span>
    </button>
  );
}

/**
 * A fila de recortes de um eixo — o rótulo do eixo e as opções dele.
 *
 * ⚠️ **ROLA NA HORIZONTAL NO TELEFONE EM VEZ DE QUEBRAR EM DUAS ALTURAS DE
 * LINHA.** Com seis fábricas, um filtro que embrulha empurra a lista inteira
 * para baixo da dobra na tela onde ela mais importa. Os `-mx-5 px-5` são o que
 * faz a bandeja sangrar até a margem da página: sem eles a última opção encosta
 * num corte a 1,25rem da borda e lê como se a fila acabasse ali.
 *
 * ⚠️ **O EIXO SEMPRE TEM NOME; O NOME NEM SEMPRE É VISÍVEL — e são duas decisões
 * separadas de propósito.** O `aria-label` não é opcional: uma fila de botões
 * sem nome é, para quem navega por controles, um punhado de palavras soltas em
 * qualquer uma das duas rotas. Já o rótulo na tela só se paga onde há mais de um
 * eixo: `/catalogos` filtra por uma coisa e a fila logo abaixo de um h1 chamado
 * "catálogos" se explica sozinha, enquanto `/arquivos-3d` tem dois eixos, e duas
 * fileiras de palavras sem rótulo o leitor teria que classificar no olho.
 */
export function FilaDeRecortes({
  eixo,
  comRotulo = false,
  children,
}: {
  eixo: string;
  comRotulo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="md:grid md:grid-cols-[minmax(0,6rem)_minmax(0,1fr)] md:items-baseline md:gap-x-4">
      {comRotulo && (
        /* Rótulo de campo: mono versal é exatamente a classe de string que a
           Regra da Caixa Alta reserva para versal. `aria-hidden` porque o
           `aria-label` do grupo abaixo já diz a mesma coisa — sem isso o leitor
           de tela ouve "Fábrica, Filtrar por Fábrica". */
        <p aria-hidden className="mono mb-2 uppercase text-graphite md:mb-0">
          {eixo}
        </p>
      )}

      <div
        role="group"
        aria-label={`Filtrar por ${eixo.toLocaleLowerCase("pt-BR")}`}
        className={`barra-fio -mx-5 flex gap-x-6 overflow-x-auto px-5 pb-3 md:mx-0 md:flex-wrap md:gap-y-3 md:overflow-visible md:px-0 ${
          comRotulo ? "md:col-start-2" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
