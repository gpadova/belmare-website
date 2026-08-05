import type { Metadata } from "next";

import { Apresentacao } from "@/components/quem-somos/apresentacao";
import { Atuacao } from "@/components/quem-somos/atuacao";
import { Contato } from "@/components/quem-somos/contato";
import { FabricasRepresentadas } from "@/components/quem-somos/fabricas-representadas";
import { ProjetosRealizados } from "@/components/quem-somos/projetos-realizados";
import { Territorio } from "@/components/quem-somos/territorio";

/**
 * ⚠️ A página é estática, e `anosDeMercado()` é avaliado no build. Sem
 * revalidação, um build feito em março publica "26 anos" e continua publicando
 * "26 anos" depois de 22 de abril — a falha é silenciosa, anual, e cai dentro
 * do primeiro parágrafo. Um dia de revalidação resolve sem custo perceptível:
 * o conteúdo desta rota muda por deploy, não por hora.
 */
export const revalidate = 86400;

/**
 * ⚠️ A razão social fica fora da descrição de busca: "Bello Mare Mercantil
 * Ltda" gastaria a única linha que o Google mostra com o nome que a empresa
 * deixou de usar. Quem confere registro tem o CNPJ no rodapé.
 */
export function generateMetadata(): Metadata {
  return {
    title: "Quem somos",
    description:
      "A Belmare é uma representação comercial de mobiliário de alto padrão para área externa. Atende lojas e escritórios de arquitetura no Paraná, em Santa Catarina e no Rio Grande do Sul, sempre através de loja.",
  };
}

/**
 * `/quem-somos` — o que a empresa é, o que ela faz, o que ela representa e onde
 * atende.
 *
 * ⚠️ **A PÁGINA FOI REFEITA DO ZERO, E A DIREÇÃO ANTERIOR NÃO SE HERDA.** Ela
 * era um documento de arquivo: seis blocos numerados de `01` a `06`, com o ano
 * de fundação em display na primeira tela, um bloco inteiro sobre o nome que a
 * empresa usava antes, e o território numa prancha de arquitetura completa —
 * moldura, carimbo, graticula e escala gráfica. O desenho era coerente e o
 * argumento não: a página contava a biografia da empresa para um visitante que
 * veio fazer outra pergunta, e o que decide a conversa dele não estava escrito
 * em lugar nenhum — o que a Belmare faz por quem chega.
 *
 * A sequência de agora é a de uma página institucional comum, e é essa a
 * intenção:
 *
 *   · a apresentação      o que a empresa é, e há quanto tempo
 *   · o que ela faz       representação, especificação, pedido, pós-venda
 *   · as fábricas         as representadas de hoje, em lista de ficha
 *   · o território        os três estados, desenhados
 *   · projetos entregues  seção anulável, no ar a partir de três projetos
 *   · o contato           a foto larga, a ação e a ficha de atendimento
 *
 * A ordem ajuda a leitura, mas não é mais o argumento: nenhuma seção depende de
 * ter sido lida depois da anterior, e nenhuma delas some se a outra sumir.
 *
 * ⚠️ **NENHUM TEXTO DESTA ROTA MORA NESTE ARQUIVO, NEM NOS COMPONENTES.**
 * Título, parágrafo e etapa são campos do painel; a montagem — padrão de título
 * e troca de marcador — é de `lib/quem-somos-consulta.ts`. Os componentes daqui
 * recebem string pronta e não sabem que existe painel. Escrever uma frase nova
 * direto no JSX é recriar o problema que esta revisão desfez: texto que o dono
 * do negócio não consegue corrigir sem pedir deploy.
 *
 * ⚠️ **O QUE FICOU FORA DO PAINEL É ESTA ORDEM, E O MOTIVO NÃO É APEGO.** A
 * lista vinculante abaixo não sobrevive a um construtor de blocos: uma
 * biblioteca genérica oferece exatamente foto de equipe, missão/visão/valores e
 * contador animado, que é a lista item por item. Ver `collections/blocos.test.ts`.
 *
 * ⚠️ **O QUE NÃO ENTRA NESTA PÁGINA, e a lista é vinculante:** foto de equipe,
 * missão/visão/valores, contador animando até 26, prosa em superlativo, e
 * qualquer obra, cliente, prêmio ou depoimento que não exista. O que não existe
 * fica ausente — não é preenchido.
 *
 * ⚠️ **A TABELA DE CNAEs SAIU HÁ DUAS REVISÕES, E CONTINUA FORA.** Cinco
 * códigos do cadastro nacional — inclusive "consultoria em gestão empresarial"
 * e "tapeçaria, persianas e cortinas" — não dizem nada a um arquiteto e dizem a
 * coisa errada a um lojista. Registro público se confere pelo CNPJ, que está no
 * rodapé; ele não é conteúdo de página de venda. Pelo mesmo motivo não há faixa
 * de identificação com razão social e porte no topo.
 */
/* O contrato de direção desta rota. O do layout descreve o mundo do site
   inteiro; este descreve a decisão que é só desta página, e sai no HTML
   construído para poder ser auditado depois do build.

   ⚠️ Só decisão de design entra aqui. Chave de sorteio, índice e instrução de
   processo de estúdio ficam fora: descrevem como o trabalho foi conduzido, não
   como a página foi desenhada. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: Uma página institucional comum, e isso é a decisão. A empresa diz o
que é, o que faz, o que representa e onde atende — nessa ordem, em frases
inteiras. Recusa o "sobre nós" da categoria (foto de equipe, missão/visão/
valores, contador animado); recusa também a direção anterior desta rota, o
documento de arquivo, que abria com o ano de fundação em display e gastava a
segunda tela com a biografia da empresa. As duas erram do mesmo jeito: falam
da empresa em vez de falar com quem chegou.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0. Título na grotesca, rótulo de ficha em mono,
um fio de 1px abrindo cada seção.
FIRST VIEWPORT: sem foto e sem número solto. Um h1 que diz a quem a empresa
atende e onde, e um parágrafo que diz o que ela é e há quanto tempo. O LCP é
tipográfico.
FORM: a página institucional tradicional, com seções não numeradas. A
numeração saiu junto com a história que ela ordenava: nenhuma seção depende de
ter sido lida depois da anterior.
EDITÁVEL: todo título e todo parágrafo desta rota são campo do painel; o
tempo de casa e a contagem de fábricas entram na prosa por marcador e seguem
sendo contados a cada renderização. O que não se edita é esta ordem e o mapa.
-->`;

export default function QuemSomos() {
  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />
      <Apresentacao />
      <Atuacao />
      <FabricasRepresentadas />
      <Territorio />
      <ProjetosRealizados />
      <Contato />
    </>
  );
}
