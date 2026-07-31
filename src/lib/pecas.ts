import type { Imagem } from "@/lib/acervo";
import { opcional, texto } from "@/lib/campo-opcional";
import { imagemDoPainel } from "@/lib/representadas-traducao";
import type { Peca as PecaGerada } from "@/payload-types";

/**
 * A peça em destaque — o tipo de domínio e o mapper que a lê do painel.
 *
 * ⚠️ **PENDE DE UMA REPRESENTADA SÓ, E NADA ATRAVESSA (decisão 10 da spec).**
 * Este tipo não carrega a marca junto de propósito: quem consulta
 * (`lib/pecas-consulta.ts`) já pergunta por UMA representada de cada vez, e é
 * essa restrição — não uma convenção lida de fora — que torna "peça de outra
 * marca aparecendo aqui" irrepresentável. Ver a nota completa em
 * `collections/pecas.ts`.
 *
 * ⚠️ `categoria` chega como texto, não como union: o vocabulário é dado do
 * painel (`Representada.vocabulario`), não um enum do código — travar o tipo
 * na lista de UMA fábrica hoje impediria a quinta representada de declarar a
 * própria categoria amanhã. A garantia "só categoria do vocabulário desta
 * marca" é aplicada na COLEÇÃO (`collections/pecas.ts`, validação assíncrona),
 * não no tipo — mesma divisão de trabalho que a decisão 5 descreve para
 * validação de editor versus segurança de tipo.
 */
export type Ambiente = "externo" | "interno";

export type Peca = {
  nome: string;
  categoria: string;
  /** Ausente só na leitura em profundidade errada — o campo é obrigatório no
   *  painel. Mesma cautela defensiva de `imagem`/`imagemLarga` em
   *  `lib/representadas.ts`. */
  foto?: Imagem;
  /** Só a GDA usa hoje; as outras marcas deixam ausente. */
  ambiente?: Ambiente;
  /** Legenda de texto livre — nunca filtro, nunca navegação, nunca parâmetro
   *  de URL. Ausente quando a fábrica não declarou. */
  materiais?: string;
};

export function pecaDoPainel(doc: PecaGerada): Peca {
  return {
    nome: doc.nome,
    categoria: doc.categoria,
    ...opcional("foto", imagemDoPainel(doc.foto)),
    ...opcional("ambiente", ambiente(doc.ambiente)),
    ...opcional("materiais", texto(doc.materiais)),
  };
}

function ambiente(
  valor: Ambiente | null | undefined,
): Ambiente | undefined {
  return valor ?? undefined;
}
