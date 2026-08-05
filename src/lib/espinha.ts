import { lista, opcional, presente, texto } from "@/lib/campo-opcional";
import type { Home as HomeGerada, QuemSomos as QuemSomosGerada } from "@/payload-types";

/**
 * A prosa editável dentro da **espinha fixa** — os globais `Home` e
 * `QuemSomos`, traduzidos para o domínio.
 *
 * ⚠️ **O QUE ESTES DOIS GLOBAIS TÊM É PEQUENO DE PROPÓSITO, E A LISTA DO QUE
 * FICOU DE FORA VALE MAIS DO QUE A DO QUE ENTROU.** Um global é exatamente onde
 * uma pessoa bem-intencionada põe tudo, e a decisão 2 da spec trata número de
 * campo como custo. Ficaram fora, e a classificação completa está em
 * `docs/classificacao-de-texto.md`:
 *
 *   · o h1 da home ("Representação comercial de móveis para área externa.")
 *     — **fixo**, e defendido em `components/abertura.tsx` contra quatro
 *     alternativas rejeitadas entre 30/07 e 05/08/2026. Mudá-lo é
 *     reposicionamento, e reposicionamento é conversa, não edição.
 *   · o nome e o apoio das duas portas — **fixo** por decisão 3 da spec.
 *   · a legenda de imagem de referência da home — **gerada** da marcação de
 *     mock. A de `/quem-somos` virou campo, porque lá a foto é a única da rota
 *     e cai no vão onde um arquiteto espera obra entregue.
 *
 * ⚠️ **`/QUEM-SOMOS` SAIU DESSA LISTA INTEIRA EM 05/08/2026.** Os títulos das
 * seções eram fixos e três parágrafos eram metade fixos — o site montava a
 * primeira oração contando o dado e o campo era o que vinha depois dela. O
 * argumento era bom (a quinta fábrica não pode encontrar a página dizendo
 * "quatro") e a forma era ruim: quem editava via meia frase no painel, e trocar
 * o próprio título da página dependia de deploy. `lib/marcadores.ts` resolve os
 * dois lados — a frase inteira é campo, e `{fabricas}`, `{anos}`, `{cidade}` e
 * `{estados}` continuam sendo contados a cada renderização. A montagem final,
 * com padrão de título e troca de marcador, mora em `lib/quem-somos-consulta.ts`.
 *
 * ⚠️ **TODO CAMPO É OPCIONAL — SEÇÃO ANULÁVEL.** Campo em branco faz o
 * parágrafo sumir, nunca renderizar vazio: "o pior resultado de um campo em
 * branco é menos página, nunca página quebrada" (`CONTEXT.md`). Título é a
 * exceção, e ela está explicada em `lib/quem-somos-consulta.ts`: um `h2` vazio
 * não é menos página, é página quebrada.
 */

/** Os vãos editáveis da home. */
export type Home = {
  /** O parágrafo sob o título da galeria das marcas. */
  galeria?: string;
};

/** Uma etapa da lista de "O que a Belmare faz". */
export type EtapaDeAtuacao = {
  rotulo: string;
  texto: string;
};

/**
 * O texto de `/quem-somos` como o painel o gravou — ainda cru.
 *
 * ⚠️ **NADA AQUI ESTÁ PRONTO PARA IR À TELA.** Os marcadores continuam escritos
 * (`"São {anos} anos de atuação…"`) e os títulos em branco continuam ausentes,
 * em vez de já terem caído no padrão. A montagem é de
 * `lib/quem-somos-consulta.ts`, e a separação é a mesma de toda camada de
 * tradução do projeto: aqui só se afirma o que o operador digitou.
 */
export type QuemSomos = {
  /** O h1 da página. */
  titulo?: string;
  /** O parágrafo sob o h1. */
  apresentacao?: string;
  atuacaoTitulo?: string;
  /** O que a Belmare faz — abre a seção, antes da lista de etapas. */
  atuacao?: string;
  /** As etapas do trabalho, na ordem em que o painel as ordenou. */
  atuacaoLinhas?: EtapaDeAtuacao[];
  acervoTitulo?: string;
  /** O parágrafo acima da lista de fábricas. */
  acervo?: string;
  territorioTitulo?: string;
  /** O parágrafo ao lado do mapa. */
  territorio?: string;
  projetosTitulo?: string;
  /** O parágrafo acima das fotos de obra. */
  projetos?: string;
  contatoTitulo?: string;
  /** O fecho. */
  contato?: string;
  /** A legenda da fotografia larga do fecho. */
  contatoLegenda?: string;
};

export function homeDoPainel(doc: HomeGerada): Home {
  return { ...opcional("galeria", texto(doc.galeria)) };
}

/**
 * Uma etapa só entra com rótulo E texto.
 *
 * Os dois campos são `required` no painel, então a linha meio preenchida não
 * nasce por lá — mas ela nasce de um rascunho salvo antes de o campo virar
 * obrigatório, e uma etapa sem texto desenha um rótulo com o vão vazio ao lado.
 */
function etapa(linha: NonNullable<QuemSomosGerada["atuacaoLinhas"]>[number]): EtapaDeAtuacao | undefined {
  const rotulo = texto(linha.rotulo);
  const conteudo = texto(linha.texto);

  return rotulo === undefined || conteudo === undefined
    ? undefined
    : { rotulo, texto: conteudo };
}

export function quemSomosDoPainel(doc: QuemSomosGerada): QuemSomos {
  const etapas = (doc.atuacaoLinhas ?? []).map(etapa).filter(presente);

  return {
    ...opcional("titulo", texto(doc.titulo)),
    ...opcional("apresentacao", texto(doc.apresentacao)),
    ...opcional("atuacaoTitulo", texto(doc.atuacaoTitulo)),
    ...opcional("atuacao", texto(doc.atuacao)),
    ...opcional("atuacaoLinhas", lista(etapas)),
    ...opcional("acervoTitulo", texto(doc.acervoTitulo)),
    ...opcional("acervo", texto(doc.acervo)),
    ...opcional("territorioTitulo", texto(doc.territorioTitulo)),
    ...opcional("territorio", texto(doc.territorio)),
    ...opcional("projetosTitulo", texto(doc.projetosTitulo)),
    ...opcional("projetos", texto(doc.projetos)),
    ...opcional("contatoTitulo", texto(doc.contatoTitulo)),
    ...opcional("contato", texto(doc.contato)),
    ...opcional("contatoLegenda", texto(doc.contatoLegenda)),
  };
}
