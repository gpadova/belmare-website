import { lista, opcional, presente, texto } from "@/lib/campo-opcional";
import {
  blocosPublicaveis,
  ehDestinoInterno,
  ehRotaLivre,
  type Bloco,
  type Caminho,
  type ConteudoRico,
  type PaginaLivre,
} from "@/lib/paginas";
import type { Pagina as PaginaGerada } from "@/payload-types";

/**
 * O documento como o painel o grava — reexportado daqui, e só daqui.
 *
 * ⚠️ **É O QUE MANTÉM A REGRA "COMPONENTE NÃO IMPORTA `payload-types`" DE PÉ COM
 * LIVE PREVIEW NO MEIO.** O hook de preview entrega o documento cru do
 * formulário, e o componente que o recebe precisa de um nome para essa forma.
 * Esse nome sai do MAPPER — o único arquivo do par que tem licença para conhecer
 * o tipo gerado — e não do arquivo gerado direto. Ver a nota em
 * `payload.config.ts` sobre por que a camada de tradução existe.
 */
export type DocumentoDePagina = PaginaGerada;

/**
 * A camada de tradução das páginas livres: o documento do painel virando a
 * composição que a rota desenha.
 *
 * ⚠️ **O TIPO GERADO PELO PAYLOAD NÃO CONSEGUE DIZER O QUE ESTA PÁGINA
 * PRECISA.** Ele declara `slug` como uma união de três strings (bom), mas
 * declara `composicao` como um array de blocos cujos campos condicionais são
 * TODOS opcionais — um caminho pode ter `destino: "rota"` e `rota` vazio, ou
 * `destino: "whatsapp"` e `contexto` nulo, porque a condição que os torna
 * obrigatórios vive na validação do painel (UX de editor) e não no esquema. O
 * domínio de `lib/paginas.ts` é uma união DISCRIMINADA: um caminho de rota tem
 * `href`, um de WhatsApp tem `contexto`, e nenhum dos dois pode ter os dois nem
 * nenhum. É esta função que atravessa a distância entre as duas formas, e é a
 * mesma divisão de trabalho da decisão 5 — o painel recusa, o tipo torna
 * irrepresentável.
 *
 * ⚠️ **PELA METADE É DESCARTADO, NUNCA COMPLETADO.** Um caminho que perdeu o
 * destino sai da lista; um bloco de caminhos que ficou sem nenhum caminho sai
 * da composição. Nada é preenchido com um valor plausível — a alternativa
 * (apontar um caminho sem rota para a home, por exemplo) é o site inventando
 * navegação que ninguém pediu.
 *
 * ⚠️ **RASCUNHO PODE ESTAR PELA METADE DE PROPÓSITO**, e é justamente por isso
 * que este mapper precisa aguentar cada campo ausente: sob live preview, ele
 * roda a cada tecla digitada, sobre um documento que o operador está montando
 * agora. Um mapper que lançasse com `destino` ainda não escolhido derrubaria o
 * iframe no primeiro clique em "adicionar bloco".
 */
export function paginaDoPainel(doc: PaginaGerada): PaginaLivre | undefined {
  /* Endereço fora do registro de rotas: não há página onde desenhar isso. Só
     acontece se uma rota for retirada do código com um documento ainda apontando
     para ela — e nesse dia o certo é a composição desaparecer, não renderizar
     numa URL que não existe. */
  if (!ehRotaLivre(doc.slug)) return undefined;

  const titulo = texto(doc.titulo);
  if (titulo === undefined) return undefined;

  return {
    slug: doc.slug,
    titulo,
    ...opcional("resumo", texto(doc.resumo)),
    composicao: blocosPublicaveis(blocosDoPainel(doc.composicao)),
  };
}

function blocosDoPainel(linhas: PaginaGerada["composicao"]): Bloco[] {
  return (linhas ?? []).map(blocoDoPainel).filter(presente);
}

function blocoDoPainel(linha: NonNullable<PaginaGerada["composicao"]>[number]): Bloco | undefined {
  switch (linha.blockType) {
    case "prosa": {
      const corpo = conteudoRico(linha.corpo);
      return corpo === undefined
        ? undefined
        : { tipo: "prosa", ...opcional("titulo", texto(linha.titulo)), corpo };
    }
    case "caminhos": {
      const itens = lista((linha.itens ?? []).map(caminhoDoPainel).filter(presente));
      return itens === undefined
        ? undefined
        : { tipo: "caminhos", ...opcional("titulo", texto(linha.titulo)), itens };
    }
    case "ficha":
      return { tipo: "ficha", ...opcional("titulo", texto(linha.titulo)) };
    case "fecho": {
      /* O contexto é o que faz a mensagem do WhatsApp chegar dizendo de onde
         veio. Sem ele o bloco não é desenhado: uma faixa que é o elemento mais
         pesado da página e abre uma conversa em branco não é a ação de fecho
         deste site, é um botão. */
      const contexto = texto(linha.contexto);
      return contexto === undefined
        ? undefined
        : { tipo: "fecho", ...opcional("rotulo", texto(linha.rotulo)), contexto };
    }
    default:
      return undefined;
  }
}

function caminhoDoPainel(
  linha: NonNullable<
    Extract<
      NonNullable<PaginaGerada["composicao"]>[number],
      { blockType: "caminhos" }
    >["itens"]
  >[number],
): Caminho | undefined {
  const rotulo = texto(linha.rotulo);
  if (rotulo === undefined) return undefined;

  const apoio = opcional("apoio", texto(linha.apoio));

  /* ⚠️ `switch` exaustivo, como `enderecoDoCaminho` em
     `components/paginas/caminhos.tsx` — o `satisfies never` do `default` é o
     que faz um quarto destino virar erro de build aqui também, e não só do
     lado do desenho. Antes de PRA-126 isto era um `if`/`else` que tratava
     "não é whatsapp" como sinônimo de "é rota"; o terceiro destino expôs que
     essa suposição não escala, e o `switch` é o que a substitui. */
  switch (linha.destino) {
    case "whatsapp": {
      const contexto = texto(linha.contexto);
      return contexto === undefined
        ? undefined
        : { destino: "whatsapp", rotulo, ...apoio, contexto };
    }
    /* O formulário não tem campo nenhum para completar: os campos dele são
       fixos em `lib/lead.ts` e o rótulo já foi lido acima. Por isso este
       caminho nunca é descartado por dado ausente — diferente dos outros
       dois, não há dado que possa faltar. */
    case "formulario":
      return { destino: "formulario", rotulo, ...apoio };
    case "rota": {
      /* ⚠️ `ehDestinoInterno` e não um `as`: o valor gravado é uma string do
         banco, e uma rota retirada do código deixa documentos gravados
         apontando para ela. Nesse dia o caminho some da página — nunca vira
         link para 404. */
      const href = linha.rota;
      return ehDestinoInterno(href)
        ? { destino: "rota", rotulo, ...apoio, href }
        : undefined;
    }
    default:
      return linha.destino satisfies never;
  }
}

/**
 * O corpo de um bloco de texto, quando ele tem alguma coisa dentro.
 *
 * ⚠️ **UM EDITOR VAZIO NÃO É `null` — É UM PARÁGRAFO VAZIO.** O lexical grava a
 * raiz com um nó de parágrafo sem filhos assim que o campo é tocado, então
 * "campo em branco" chega aqui como uma árvore com um nó dentro. Confiar em
 * `corpo == null` deixaria passar um bloco que desenha um fio horizontal e um
 * vão — o oposto de seção anulável. Quem decide se há conteúdo é
 * `blocosPublicaveis`, sobre a contagem de filhos da raiz; esta função só
 * confere que a forma é a esperada.
 */
function conteudoRico(valor: unknown): ConteudoRico | undefined {
  if (!valor || typeof valor !== "object") return undefined;

  const raiz = (valor as { root?: unknown }).root;
  if (!raiz || typeof raiz !== "object") return undefined;
  if (!Array.isArray((raiz as { children?: unknown }).children)) return undefined;

  return valor as ConteudoRico;
}
