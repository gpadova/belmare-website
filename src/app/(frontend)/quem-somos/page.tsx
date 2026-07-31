import type { Metadata } from "next";

import { AcervoRepresentado } from "@/components/quem-somos/acervo-representado";
import { Atividades } from "@/components/quem-somos/atividades";
import { Interlocutor } from "@/components/quem-somos/interlocutor";
import { Nome } from "@/components/quem-somos/nome";
import { PranchaTerritorio } from "@/components/quem-somos/prancha-territorio";
import { ProjetosRealizados } from "@/components/quem-somos/projetos-realizados";
import { RegistroAbertura } from "@/components/quem-somos/registro-abertura";
import { aberturaPorExtenso } from "@/lib/empresa";
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
 * ⚠️ Gerada, porque a razão social, a data de abertura e a cidade da sede são
 * campo do painel desde PRA-122 — e esta descrição é justamente a transcrição
 * deles. Uma constante aqui seria uma quarta cópia dos mesmos fatos, a única
 * que ninguém vê ao revisar a página.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { razaoSocial, endereco, abertura } = await buscarEmpresa();

  const cidade = endereco?.cidade;
  const registro = [
    razaoSocial,
    aberturaPorExtenso(abertura) === undefined
      ? undefined
      : `aberta em ${aberturaPorExtenso(abertura)}`,
    cidade === undefined ? undefined : `em ${cidade}`,
  ]
    .filter((parte) => parte !== undefined)
    .join(", ");

  return {
    title: "Quem somos",
    description: `${registro === "" ? "" : `${registro}. `}Representação comercial de mobiliário de alto padrão para área externa no Paraná, em Santa Catarina e no Rio Grande do Sul.`,
  };
}

/**
 * `/quem-somos` — o arquivo.
 *
 * O segmento inteiro escreve "26 anos de tradição e excelência" sobre uma foto
 * de equipe. A Belmare não escreve nada: **ela abre o registro.** O lastro vem
 * de documento datado — e não de fotografia que a empresa ainda não tem.
 *
 * Isso resolve o problema estrutural da rota. `/quem-somos` era a página mais
 * dependente de material inexistente: sem as fotos de projetos entregues (P43)
 * ela vira texto institucional vazio. O acervo documental, ao contrário, existe
 * inteiro e é conferível — CNPJ, data de abertura, cinco CNAEs, nome público
 * anterior, endereço, território. Seis blocos construídos sobre isso ficam de
 * pé sozinhos, e a seção de projetos entra depois sem redesenhar nada.
 *
 * A sequência é o argumento, e ela vai do documento ao interlocutor:
 *
 *   01  o registro           o tempo, primeiro fato
 *   02  as atividades        evidência, não afirmação
 *   03  o nome anterior      o que dá conteúdo aos 26 anos
 *   04  PRANCHA 01           o território desenhado — o único gráfico
 *   05  o acervo             o que está sob esta representação
 *   ..  projetos entregues   construída, no ar em zero pixels (lib/projetos.ts)
 *   06  o interlocutor       a foto larga, a ficha de atendimento, a ação
 *
 * Ritmo: registro denso → prancha silenciosa → ficha densa → foto larga e fecho.
 *
 * ⚠️ O QUE NÃO ENTRA NESTA PÁGINA, e a lista é vinculante: foto de equipe,
 * missão/visão/valores, contador animando até 26, prosa em superlativo, e
 * qualquer obra, cliente, prêmio ou depoimento que não exista. O que não existe
 * fica ausente — não é preenchido.
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
THESIS: A empresa não afirma que é séria — abre o registro. Recusa o "sobre
nós" da categoria: foto de equipe, missão/visão/valores e contador animado.
OWN-WORLD: o mundo do site, inalterado. Papel #F5F3F0, tinta #17171A, fio
#C9C6C0, raio 0, sombra 0, cor 0. Aqui ele vira folha de arquivo: ficha de
rótulo em mono e dado na grotesca, número de bloco na margem, e um fio
abrindo cada bloco.
STORY: 1999, cinco CNAEs, o nome público anterior, três estados desenhados e
quatro fábricas em ledger. O visitante confere em vez de acreditar, e fala com
quem representa.
FIRST VIEWPORT: sem foto. Faixa de identificação em mono no topo; "1999" em
display; fio; h1 curto e um parágrafo. O LCP é tipográfico.
FORM: "o arquivo" — a folha de registro, não a página "sobre nós".
-->`;

export default async function QuemSomos() {
  /* A seção de projetos só vai ao ar com três projetos publicáveis ou mais
     (PRA-121, o portão de `lib/projetos.ts#projetosPublicaveis`, aplicado por
     `buscarProjetosPublicaveis`). Quando vai, ela assume o 06 e o interlocutor
     passa a 07 — a numeração é a do documento, não do arquivo. */
  const temProjetos = (await buscarProjetosPublicaveis()).length > 0;

  return (
    <>
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRATO_DE_DIRECAO }} />
      <RegistroAbertura />
      <Atividades />
      <Nome />
      <PranchaTerritorio />
      <AcervoRepresentado />
      <ProjetosRealizados numero="06" />
      <Interlocutor numero={temProjetos ? "07" : "06"} />
    </>
  );
}
