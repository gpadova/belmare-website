import { anosDeMercado } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { buscarQuemSomos } from "@/lib/espinha-consulta";
import { porExtenso } from "@/lib/frase";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * A apresentação — a primeira tela de `/quem-somos`.
 *
 * Ela responde, em duas frases, a pergunta que traz alguém a esta página: o
 * que é a Belmare. Uma representação comercial de mobiliário para área
 * externa, que vende através de loja, com sede em Florianópolis e atuação no
 * Sul. É o que um lojista precisa saber para decidir se conversa, e o que um
 * arquiteto precisa saber para decidir se especifica.
 *
 * ⚠️ **O ANO DE FUNDAÇÃO NÃO É MAIS UM ELEMENTO DE DESENHO.** A página abria
 * com `1999` em display, sozinho, acima de "Florianópolis · 27 anos" em mono —
 * quatro dígitos ocupando a primeira tela inteira antes de o visitante saber o
 * que a empresa faz. Um ano solto não traz ninguém: ele só vira lastro depois
 * que a frase à qual ele pertence já foi lida. Por isso o tempo de casa entrou
 * aqui como oração, uma vez, e o ano cru saiu da tela.
 *
 * ⚠️ **O TEMPO DE CASA CONTINUA SENDO CONTADO, NUNCA DIGITADO,** e não existe
 * campo para ele em lugar nenhum do painel. `anosDeMercado` conta com dia e
 * mês a partir da data de abertura cadastrada; a diferença simples de anos erra
 * por um durante quatro meses todo ano.
 *
 * ⚠️ **O QUE NÃO ENTRA NESTA PÁGINA, e a lista continua vinculante:** foto de
 * equipe, missão/visão/valores, contador animando até 26, prosa em superlativo,
 * e qualquer obra, cliente, prêmio ou depoimento que não exista. O que não
 * existe fica ausente — não é preenchido.
 *
 * ⚠️ **A HISTÓRIA DA MUDANÇA DE NOME SAIU DA ROTA, E NÃO VOLTA.** Um bloco
 * inteiro mostrava o nome público anterior ("Bello Mare — Móveis para Jardim,
 * Ombrellones, Móveis de Design e Tapetes") ao lado do logotipo de hoje, como
 * prova de continuidade. Ele provava a coisa errada para as duas pessoas que
 * leem esta página: contava ao arquiteto que a empresa vendia móvel de jardim
 * e tapete, e gastava a segunda tela de uma página de venda com um assunto
 * interno. Quem se chamava o quê em 1999 não decide nenhuma conversa comercial.
 */
export async function Apresentacao() {
  const { abertura, endereco } = await buscarEmpresa();
  const representadas = await representadasDaPagina();
  const { apresentacao } = await buscarQuemSomos();

  const anos = anosDeMercado(abertura);
  const quantas = porExtenso(representadas.length);
  const cidade = endereco?.cidade;

  return (
    <section className="px-5 pt-12 pb-14 md:px-8 md:pt-20 md:pb-24">
      <div className="max-w-[64rem] min-w-0">
        {/* ⚠️ **NÃO REPETE O H1 DA HOME.** A home abre com "Representação
            comercial de mobiliário de área externa." — a categoria, para quem
            cai de busca sem saber o que a empresa é. Repeti-la aqui gastaria a
            primeira linha da página com o que o visitante acabou de ler duas
            rolagens atrás. Esta nomeia as duas pessoas que compram e o
            território, que é o passo seguinte da mesma conversa.

            ⚠️ E não conta fábricas: "Quatro fábricas. Um interlocutor." foi
            rejeitado na home em 30/07/2026 por descrever o ORGANOGRAMA da
            Belmare para quem não veio saber como ela se organiza. A contagem
            entra no parágrafo, onde é dado, e não no título, onde seria a
            empresa se descrevendo por dentro. */}
        <h1 className="text-h1 max-w-[24ch] font-normal text-balance">
          A Belmare atende lojas e escritórios de arquitetura no Sul do país.
        </h1>

        {/* Gerada inteira: a contagem sai das representadas publicadas, a
            cidade e o tempo de casa saem do cadastro. Nenhuma palavra desta
            frase é digitada em lugar nenhum, e a quinta fábrica a corrige
            sozinha.

            ⚠️ Duas orações com sujeito e verbo, e não uma frase com a sede e o
            tempo de casa pendurados em aposto no fim ("…do Sul do país, de
            Florianópolis, há 27 anos"). Aposto empilhado é a voz de legenda de
            catálogo; um site brasileiro escreve a segunda informação numa
            segunda frase. */}
        <p className="text-body mt-6 max-w-[64ch] text-pretty text-graphite">
          A empresa representa {quantas} fábricas brasileiras de mobiliário para
          área externa.
          {cidade !== undefined && ` A sede fica em ${cidade}.`}
          {anos !== undefined &&
            ` A Belmare trabalha nesse ramo há ${anos} anos.`}
        </p>

        {apresentacao !== undefined && (
          <p className="text-body mt-5 max-w-[64ch] text-pretty text-graphite">
            {apresentacao}
          </p>
        )}
      </div>
    </section>
  );
}
