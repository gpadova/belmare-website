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
 * de fundação em display na primeira tela, um bloco inteiro comparando o nome
 * público anterior ao logotipo de hoje, e o território numa prancha de
 * arquitetura completa — moldura, carimbo, graticula e escala gráfica com o
 * paralelo declarado. O desenho era coerente e o argumento não: a página
 * contava uma história (o começo, o nome, o território, o acervo) para um
 * visitante que veio fazer outra pergunta, e gastava as duas primeiras telas
 * com assunto interno — em que ano a empresa abriu, como ela se chamava antes.
 * Nada disso decide uma conversa comercial, e o que decide não estava escrito
 * em lugar nenhum: o que a Belmare faz por quem chega.
 *
 * A sequência de agora é a de uma página institucional comum, e é essa a
 * intenção:
 *
 *   · a apresentação      o que a empresa é, em duas frases
 *   · o que ela faz       representação, especificação, pedido, pós-venda
 *   · as fábricas         as representadas de hoje, em lista de ficha
 *   · o território        os três estados, desenhados
 *   · projetos entregues  seção anulável, no ar a partir de três projetos
 *   · o contato           a foto larga, a ação e a ficha de atendimento
 *
 * A ordem ajuda a leitura, mas não é mais o argumento: nenhuma seção depende de
 * ter sido lida depois da anterior, e nenhuma delas some se a outra sumir.
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
documento de arquivo, que abria com o ano de fundação em display, comparava o
nome público antigo ao logotipo de hoje e desenhava o território numa prancha
técnica com carimbo e escala gráfica. As duas erram do mesmo jeito: falam da
empresa em vez de falar com quem chegou.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0. Título na grotesca, rótulo de ficha em mono,
um fio de 1px abrindo cada seção.
FIRST VIEWPORT: sem foto e sem número solto. Um h1 que diz o ramo, um
parágrafo gerado com a contagem de fábricas, a sede e o tempo de casa, e o
parágrafo do painel. O LCP é tipográfico.
FORM: a página institucional tradicional, com seções não numeradas. A
numeração saiu junto com a história que ela ordenava: nenhuma seção depende de
ter sido lida depois da anterior.
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
