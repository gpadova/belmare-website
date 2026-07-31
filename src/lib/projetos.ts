import type { Imagem } from "@/lib/acervo";

/**
 * Projetos realizados — construído, e propositalmente sem conteúdo.
 *
 * ⚠️ ESTE ARQUIVO ESTÁ VAZIO DE PROPÓSITO. Não preencher com exemplo, com
 * "obra em Jurerê" nem com foto de ambiente legendada como projeto entregue.
 * Foto de referência não é obra: seria a única mentira grave que este site
 * poderia contar, e é a que o público desta página — arquiteto — detecta
 * primeiro. Ver P43 em `PRODUCT.md` › Evidence on Hand.
 *
 * A seção existe inteira em `components/quem-somos/projetos-realizados.tsx` e
 * entra no ar sozinha no dia em que houver três projetos reais com **todos** os
 * campos abaixo preenchidos. Até lá ela não renderiza nada — nem markup vazio,
 * nem título órfão, nem "em breve".
 *
 * Por que três e não um: dois projetos leem como exceção, e a página em pé não
 * depende deles. `/quem-somos` foi desenhada para não ter buraco sem esta seção
 * — o lastro está no registro, no território e no acervo representado.
 *
 * Antes de publicar, confirmar P47/P48/P49: direito de uso da foto, autorização
 * do cliente final e crédito do arquiteto. Projeto residencial de alto padrão
 * costuma ter cláusula de confidencialidade, e o crédito do arquiteto não é
 * gentileza — é o que faz o multiplicador voltar.
 */

export type Projeto = {
  /** Como a obra é nomeada publicamente. Sem endereço. */
  obra: string;
  cidade: string;
  uf: string;
  ano: number;
  /** Slugs de `representadas.ts`. O que de fato foi especificado ali. */
  marcas: string[];
  foto: Imagem;
  /** Escritório ou profissional responsável. Obrigatório: crédito não é opcional. */
  creditoArquiteto: string;
};

export const PROJETOS: Projeto[] = [];

/** Abaixo disto a seção não vai ao ar. */
export const MINIMO_PARA_PUBLICAR = 3;

/**
 * As publicáveis a partir da lista informada — por padrão, `PROJETOS`.
 *
 * ⚠️ O parâmetro existe só para o teste exercitar o portão de
 * `MINIMO_PARA_PUBLICAR` sem depender de `PROJETOS` deixar de estar vazio.
 * Todo call site do site continua chamando sem argumento e lendo o array
 * real — a assinatura aceita uma lista opcional, não muda o que o site faz.
 */
export function projetosPublicaveis(projetos: Projeto[] = PROJETOS): Projeto[] {
  return projetos.length >= MINIMO_PARA_PUBLICAR ? projetos : [];
}
