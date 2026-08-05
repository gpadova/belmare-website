import { textosDeQuemSomos } from "@/lib/quem-somos-consulta";

/**
 * A apresentação — a primeira tela de `/quem-somos`.
 *
 * Um título e um parágrafo. Ela responde a pergunta que traz alguém a esta
 * página: o que é a Belmare, há quanto tempo, para quem e por onde se compra. É
 * o que um lojista precisa saber para decidir se conversa, e o que um arquiteto
 * precisa saber para decidir se especifica.
 *
 * ⚠️ **ERAM DOIS PARÁGRAFOS, E O DE CIMA ERA MONTADO PELO SITE.** O primeiro
 * saía do cadastro ("A empresa representa quatro fábricas… A sede fica em
 * Florianópolis. A Belmare trabalha nesse ramo há 27 anos."), o segundo era o
 * campo do painel, e a emenda dos dois era três frases curtas de sujeito
 * repetido antes de a página dizer qualquer coisa útil. Os dois viraram um só,
 * escrito por inteiro no painel, com o dado entrando por marcador. A abertura
 * ficou mais curta e passou a ser editável na mesma mudança.
 *
 * ⚠️ **O ANO DE FUNDAÇÃO NÃO É UM ELEMENTO DE DESENHO, E NÃO VOLTA A SER.** A
 * página abria com `1999` em display, sozinho, acima de "Florianópolis · 27
 * anos" em mono — quatro dígitos ocupando a primeira tela inteira antes de o
 * visitante saber o que a empresa faz. Um ano solto não traz ninguém: ele só
 * vira lastro depois que a frase à qual ele pertence já foi lida. O tempo de
 * casa entra como oração dentro do parágrafo, e o ano cru não aparece.
 *
 * ⚠️ **O TEMPO DE CASA CONTINUA SENDO CONTADO, NUNCA DIGITADO,** e não existe
 * campo para ele em lugar nenhum do painel. O operador escreve `{anos}` e
 * `anosDeMercado` conta com dia e mês a partir da data de abertura cadastrada;
 * a diferença simples de anos erra por um durante quatro meses todo ano.
 *
 * ⚠️ **O QUE NÃO ENTRA NESTA PÁGINA, e a lista continua vinculante:** foto de
 * equipe, missão/visão/valores, contador animado, prosa em superlativo, e
 * qualquer obra, cliente, prêmio ou depoimento que não exista. O que não existe
 * fica ausente — não é preenchido.
 */
export async function Apresentacao() {
  const { titulo, apresentacao } = await textosDeQuemSomos();

  return (
    <section className="px-5 pt-12 pb-14 md:px-8 md:pt-20 md:pb-24">
      <div className="max-w-[64rem] min-w-0">
        {/* ⚠️ **NÃO REPETE O H1 DA HOME**, e a ajuda do campo diz isso ao
            operador. A home abre com "Representação comercial de mobiliário de
            área externa." — a categoria, para quem cai de busca sem saber o que
            a empresa é. Repeti-la aqui gastaria a primeira linha da página com
            o que o visitante acabou de ler duas rolagens atrás. */}
        <h1 className="text-h1 max-w-[24ch] font-normal text-balance">{titulo}</h1>

        {apresentacao !== undefined && (
          <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
            {apresentacao}
          </p>
        )}
      </div>
    </section>
  );
}
