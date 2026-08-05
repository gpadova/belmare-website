import { anosDeMercado, TERRITORIO } from "@/lib/empresa";
import { buscarEmpresa } from "@/lib/empresa-consulta";
import type { EtapaDeAtuacao, QuemSomos } from "@/lib/espinha";
import { buscarQuemSomos } from "@/lib/espinha-consulta";
import { emLista, porExtenso } from "@/lib/frase";
import { preencher, type Valores } from "@/lib/marcadores";
import { representadasDaPagina } from "@/lib/representadas-consulta";

/**
 * O texto de `/quem-somos` pronto para a tela — títulos resolvidos, marcadores
 * trocados pelo dado de hoje.
 *
 * ⚠️ **É O ÚNICO LUGAR QUE SABE MONTAR O TEXTO DESTA ROTA, E ISSO É O PONTO.**
 * Cada seção antes buscava o próprio campo, contava a própria representada e
 * escrevia a própria oração de abertura — cinco componentes importando
 * `porExtenso` e cada um decidindo sozinho o que fazer com um campo em branco.
 * Era assim que a mesma contagem existia em cinco escritas, e é exatamente a
 * falha que `lib/frase.ts` já tinha sido criado para matar em outro canto do
 * site. Os componentes de agora recebem string pronta e não sabem que existe
 * painel, cadastro ou marcador.
 *
 * ⚠️ **TÍTULO CAI NO PADRÃO; PARÁGRAFO SOME.** As duas regras são diferentes de
 * propósito, e a diferença é acessibilidade, não gosto: um parágrafo a menos é
 * uma seção mais curta, e um `h2` em branco é um cabeçalho que o leitor de tela
 * anuncia sem nome, dentro de uma árvore de títulos que passa a ter um degrau
 * vazio. "O pior resultado de um campo em branco é menos página, nunca página
 * quebrada" (`CONTEXT.md`) — e é o `h2` vazio que seria a página quebrada.
 */

/**
 * O texto de fábrica de cada título, e a legenda da foto do fecho.
 *
 * ⚠️ **ISTO NÃO É "O TEXTO FIXO DA PÁGINA" DE VOLTA PELA PORTA DOS FUNDOS.**
 * Todo valor daqui é editável no painel e a edição vence sempre; o padrão só
 * responde à pergunta "o que a página mostra enquanto ninguém escreveu nada", e
 * a alternativa a ter resposta para ela é publicar cabeçalho vazio. Ele também
 * é o que o `defaultValue` do painel oferece a um global recém-criado — ver
 * `seed/semear-globais.ts`.
 */
export const PADRAO = {
  titulo: "A Belmare atende lojas e escritórios de arquitetura no Sul do país.",
  atuacaoTitulo: "O que a Belmare faz.",
  acervoTitulo: "As fábricas representadas.",
  territorioTitulo: "Onde a Belmare atende.",
  projetosTitulo: "Projetos entregues no Sul.",
  contatoTitulo: "Fale com a Belmare.",
  contatoLegenda: "Imagem de referência, não é obra entregue pela Belmare",
} as const;

/** O texto da rota, montado. Título é sempre string; parágrafo pode faltar. */
export type TextosDeQuemSomos = {
  titulo: string;
  apresentacao?: string;
  atuacaoTitulo: string;
  atuacao?: string;
  atuacaoLinhas: EtapaDeAtuacao[];
  acervoTitulo: string;
  acervo?: string;
  territorioTitulo: string;
  territorio?: string;
  projetosTitulo: string;
  projetos?: string;
  contatoTitulo: string;
  contato?: string;
  contatoLegenda: string;
};

/**
 * A montagem, sem banco no caminho — painel de um lado, dado do outro, texto
 * pronto na saída.
 *
 * Separada de `textosDeQuemSomos` pelo mesmo motivo de sempre neste projeto: é
 * o que deixa a regra do padrão e a regra do marcador serem afirmadas por teste
 * comum, sem subir Postgres para descobrir o que acontece com um título em
 * branco.
 */
export function montarTextos(painel: QuemSomos, valores: Valores): TextosDeQuemSomos {
  /* Uma etapa cujo texto perdeu um marcador cai inteira. Manter o rótulo
     desenharia a coluna da esquerda com o vão vazio ao lado — e uma lista de
     etapas com um buraco lê como etapa esquecida, não como dado faltando. */
  const etapas = (painel.atuacaoLinhas ?? []).flatMap((linha) => {
    const texto = preencher(linha.texto, valores);
    return texto === undefined ? [] : [{ rotulo: linha.rotulo, texto }];
  });

  return {
    titulo: painel.titulo ?? PADRAO.titulo,
    ...oculteSeVazio("apresentacao", preencher(painel.apresentacao, valores)),
    atuacaoTitulo: painel.atuacaoTitulo ?? PADRAO.atuacaoTitulo,
    ...oculteSeVazio("atuacao", preencher(painel.atuacao, valores)),
    atuacaoLinhas: etapas,
    acervoTitulo: painel.acervoTitulo ?? PADRAO.acervoTitulo,
    ...oculteSeVazio("acervo", preencher(painel.acervo, valores)),
    territorioTitulo: painel.territorioTitulo ?? PADRAO.territorioTitulo,
    ...oculteSeVazio("territorio", preencher(painel.territorio, valores)),
    projetosTitulo: painel.projetosTitulo ?? PADRAO.projetosTitulo,
    ...oculteSeVazio("projetos", preencher(painel.projetos, valores)),
    contatoTitulo: painel.contatoTitulo ?? PADRAO.contatoTitulo,
    ...oculteSeVazio("contato", preencher(painel.contato, valores)),
    contatoLegenda: painel.contatoLegenda ?? PADRAO.contatoLegenda,
  };
}

/* `opcional` de `campo-opcional.ts` com o nome que este arquivo usa — a chave
   só existe quando tem valor, para que `"apresentacao" in textos` continue
   significando o que parece significar. */
function oculteSeVazio<C extends string>(chave: C, valor: string | undefined) {
  return (valor === undefined ? {} : { [chave]: valor }) as { [K in C]?: string };
}

/**
 * Os valores de hoje, um por marcador.
 *
 * ⚠️ Acrescentar um marcador é acrescentar uma linha aqui e outra em
 * `MARCADORES` (`lib/marcadores.ts`) — nunca só uma das duas. Uma chave que
 * existe só na ajuda vira um marcador que o painel oferece e a página imprime
 * literal; uma que existe só aqui é um marcador secreto, que ninguém descobre
 * sem ler o código.
 */
export async function valoresDeHoje(): Promise<Valores> {
  const { abertura, endereco } = await buscarEmpresa();
  const representadas = await representadasDaPagina();
  const anos = anosDeMercado(abertura);

  return {
    anos: anos === undefined ? undefined : String(anos),
    fabricas: porExtenso(representadas.length),
    cidade: endereco?.cidade,
    estados: emLista(TERRITORIO),
    quantosEstados: porExtenso(TERRITORIO.length, "m"),
  };
}

/**
 * O texto da rota inteira, pronto.
 *
 * Cada seção chama esta função. As três leituras de baixo já passam por cache
 * de etiqueta (`lib/cache-do-painel.ts`), então seis chamadas na mesma
 * renderização são seis montagens de string e nenhuma consulta a mais.
 */
export async function textosDeQuemSomos(): Promise<TextosDeQuemSomos> {
  const painel = await buscarQuemSomos();
  const valores = await valoresDeHoje();

  return montarTextos(painel, valores);
}
