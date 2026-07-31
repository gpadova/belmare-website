import type { Imagem } from "@/lib/acervo";
import { lista, presente, texto } from "@/lib/campo-opcional";
import { imagemDoPainel } from "@/lib/representadas-traducao";
import type { Projeto as ProjetoGerado } from "@/payload-types";

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

/**
 * O documento do painel, na forma do domínio — PRA-121, o mapper de Projeto.
 *
 * ⚠️ **DEVOLVE `undefined` INTEIRO, NUNCA MEIO PROJETO.** Mesma disciplina de
 * `lib/arquivos3d.ts#arquivo3DDoPainel`: um projeto sem nenhuma representada
 * resolvida, sem fotografia resolvida, ou com a fotografia marcada como mock,
 * não é "um projeto incompleto" — é um projeto que não pode ser apresentado
 * como obra entregue, e a única forma honesta de expressar isso é a ausência
 * completa. `lib/projetos-consulta.ts` filtra os `undefined` antes de entregar
 * a lista ao portão de três (`projetosPublicaveis`, acima).
 *
 * ⚠️ **A EXCLUSÃO DE FOTO MOCK É A SEGUNDA CAMADA DA MESMA GARANTIA QUE
 * `collections/projetos.ts` JÁ VALIDA NA PUBLICAÇÃO.** A validação do campo
 * `foto` só dispara quando alguém EDITA o projeto; esta função recalcula a
 * regra a cada leitura, então também cobre o caso em que a Imagem citada foi
 * marcada como mock DEPOIS que o projeto já estava publicado, sem que ninguém
 * tenha tocado no projeto em si. Duas camadas, decisão 5 da spec: validação de
 * editor e segurança de tipo são dois trabalhos, os dois existem.
 */
export function projetoDoPainel(doc: ProjetoGerado): Projeto | undefined {
  const obra = texto(doc.obra);
  const cidade = texto(doc.cidade);
  const uf = texto(doc.uf);
  const creditoArquiteto = texto(doc.creditoArquiteto);
  const marcas = slugsDasMarcas(doc.marcas);
  const foto = fotoDeObraEntregue(doc.foto);

  if (
    obra === undefined ||
    cidade === undefined ||
    uf === undefined ||
    creditoArquiteto === undefined ||
    marcas === undefined ||
    foto === undefined ||
    typeof doc.ano !== "number"
  )
    return undefined;

  return { obra, cidade, uf, ano: doc.ano, marcas, foto, creditoArquiteto };
}

/**
 * Os slugs das representadas citadas — só as que vieram populadas (a consulta
 * pediu profundidade suficiente); um identificador solto é tratado como não
 * resolvido e cai fora, nunca vira slug inventado.
 */
function slugsDasMarcas(valor: ProjetoGerado["marcas"]): string[] | undefined {
  return lista(
    (valor ?? [])
      .map((item) => (typeof item === "object" ? texto(item.slug) : undefined))
      .filter(presente),
  );
}

/**
 * A fotografia da obra — ausente inteira quando a imagem está marcada como
 * mock no acervo. Ver a nota de `projetoDoPainel`: é aqui que a regra "mock
 * nunca é obra entregue" se recalcula toda vez que a página é lida, e não só
 * quando alguém salva o projeto.
 */
function fotoDeObraEntregue(valor: ProjetoGerado["foto"]): Imagem | undefined {
  if (!valor || typeof valor !== "object" || valor.mock === true) return undefined;
  return imagemDoPainel(valor);
}
