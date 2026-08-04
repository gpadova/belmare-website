import type { Metadata } from "next";

import { AcervoRepresentado } from "@/components/quem-somos/acervo-representado";
import { Interlocutor } from "@/components/quem-somos/interlocutor";
import { Nome } from "@/components/quem-somos/nome";
import { PranchaTerritorio } from "@/components/quem-somos/prancha-territorio";
import { ProjetosRealizados } from "@/components/quem-somos/projetos-realizados";
import { RegistroAbertura } from "@/components/quem-somos/registro-abertura";
import { anoDeFundacao } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import { buscarProjetosPublicaveis } from "@/lib/projetos-consulta";

/**
 * ⚠️ A página é estática, e `anosDeMercado()` é avaliado no build. Sem
 * revalidação, um build feito em março publica "26 anos" e continua publicando
 * "26 anos" depois de 22 de abril — a falha é silenciosa, anual, e cai
 * exatamente no número com que a página abre. Um dia de revalidação resolve
 * sem custo perceptível: o conteúdo desta rota muda por deploy, não por hora.
 */
export const revalidate = 86400;

/**
 * ⚠️ Gerada, porque o ano de abertura e a cidade da sede são campo do painel
 * desde PRA-122. Uma constante aqui seria uma terceira cópia dos mesmos fatos,
 * a única que ninguém vê ao revisar a página.
 *
 * ⚠️ A razão social saiu daqui junto com a faixa de identificação do bloco 01,
 * e pelo mesmo motivo: "Bello Mare Mercantil Ltda" na descrição do resultado de
 * busca gasta a única linha que o Google mostra com o nome que a empresa
 * deixou de usar.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { endereco, abertura } = await buscarEmpresa();

  const ano = anoDeFundacao(abertura);
  const cidade = endereco?.cidade;

  const origem = [
    ano === undefined ? undefined : `Desde ${ano}`,
    cidade === undefined ? undefined : `em ${cidade}`,
  ]
    .filter((parte) => parte !== undefined)
    .join(", ");

  return {
    title: "Quem somos",
    description: `${origem === "" ? "" : `${origem}. `}Representação comercial de mobiliário de alto padrão para área externa no Paraná, em Santa Catarina e no Rio Grande do Sul, sempre através de loja.`,
  };
}

/**
 * `/quem-somos` — a história, contada com o que é conferível.
 *
 * O segmento inteiro escreve "26 anos de tradição e excelência" sobre uma foto
 * de equipe. Esta página conta uma história em vez disso — mas uma história
 * feita só de fato datado: em 1999 a empresa se chamava outra coisa e vendia
 * móvel de jardim; hoje representa quatro fábricas em três estados, sempre
 * através de loja. O lastro vem do que existe, e não de fotografia que a
 * empresa ainda não tem.
 *
 * Isso resolve o problema estrutural da rota. `/quem-somos` era a página mais
 * dependente de material inexistente: sem as fotos de projetos entregues (P43)
 * ela vira texto institucional vazio. O arco do nome antigo até as quatro
 * fábricas, ao contrário, existe inteiro — e a seção de projetos entra depois
 * sem redesenhar nada.
 *
 * A sequência é o argumento, e ela vai do começo até o telefone:
 *
 *   01  o começo              1999, o catálogo curto, o ramo que não mudou
 *   02  o nome                Bello Mare virou Belmare; o ramo é o mesmo
 *   03  PRANCHA 01            o território desenhado — o único gráfico
 *   04  o acervo              as quatro fábricas de hoje, em ledger
 *   ..  projetos entregues    construída, no ar em zero pixels (lib/projetos.ts)
 *   05  o interlocutor        a foto larga, a ficha de atendimento, a ação
 *
 * Ritmo: abertura curta → nome → prancha silenciosa → ledger → foto larga e
 * fecho.
 *
 * ⚠️ **A TABELA DE CNAEs SAIU, E NÃO VOLTA.** Cinco códigos do cadastro
 * nacional — inclusive "consultoria em gestão empresarial" e "tapeçaria,
 * persianas e cortinas" — não dizem nada a um arquiteto e dizem a coisa errada
 * a um lojista: fazem uma representação de móvel de autor parecer um atacado
 * genérico. Pior, o P1 mandava publicar o código e proibia interpretá-lo, o que
 * deixava na página um bloco que ninguém podia explicar. Registro público se
 * confere pelo CNPJ, que está no rodapé; ele não é conteúdo de página de venda.
 * Pelo mesmo motivo saiu a faixa de identificação do bloco 01 — razão social,
 * CNPJ e "empresa de pequeno porte" no primeiro viewport de uma página que
 * precisa vender.
 *
 * ⚠️ O QUE NÃO ENTRA NESTA PÁGINA, e a lista é vinculante: foto de equipe,
 * missão/visão/valores, contador animando até 26, prosa em superlativo, e
 * qualquer obra, cliente, prêmio ou depoimento que não exista. O que não existe
 * fica ausente — não é preenchido. **Contar história não afrouxa esta lista:**
 * o arco só pode usar o que está em documento, e nenhuma frase daqui narra
 * intenção, valor ou sentimento de quem fundou a empresa.
 */
/* O contrato de direção desta rota. O do layout descreve o mundo do site
   inteiro; este descreve a decisão que é só desta página, e sai no HTML
   construído para poder ser auditado depois do build.

   ⚠️ Só decisão de design entra aqui. Chave de sorteio, índice e instrução de
   processo de estúdio saíram: descrevem como o trabalho foi conduzido, não como
   a página foi desenhada, e não têm o que fazer no HTML de um site de cliente.
   Esse rastro vive em `.impeccable/surfaces/src-app-quem-somos-page-tsx.md`,
   que é onde ele pode ser auditado sem ser publicado. */
const CONTRATO_DE_DIRECAO = `<!--
THESIS: A empresa não afirma que é séria — conta o que fez, com data. Recusa
o "sobre nós" da categoria (foto de equipe, missão/visão/valores, contador
animado) e recusa também o extremo oposto, o extrato de registro: CNAE, porte
e razão social em faixa não são história, são papelada.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0. Aqui ele vira folha de arquivo: rótulo em
mono e dado na grotesca, número de bloco na margem, e um fio abrindo cada
bloco.
STORY: 1999, móvel de jardim, um nome comprido. Hoje, quatro fábricas, três
estados e uma conversa só. Mesmo ramo, catálogo maior.
FIRST VIEWPORT: sem foto. "1999" em display, a cidade e o tempo de casa em
mono, fio, h1 curto e um parágrafo. O LCP é tipográfico.
FORM: a linha do tempo curta, não a folha de registro nem a página "sobre nós".
-->`;

export default async function QuemSomos() {
  /* A seção de projetos só vai ao ar com três projetos publicáveis ou mais
     (PRA-121, o portão de `lib/projetos.ts#projetosPublicaveis`, aplicado por
     `buscarProjetosPublicaveis`). Quando vai, ela assume o 05 e o interlocutor
     passa a 06 — a numeração é a da história, não do arquivo. */
  const temProjetos = (await buscarProjetosPublicaveis()).length > 0;

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />
      <RegistroAbertura />
      <Nome />
      <PranchaTerritorio />
      <AcervoRepresentado />
      <ProjetosRealizados numero="05" />
      <Interlocutor numero={temProjetos ? "06" : "05"} />
    </>
  );
}
