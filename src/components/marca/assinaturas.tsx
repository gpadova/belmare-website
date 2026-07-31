import { SecaoDaMarca } from "@/components/marca/secao";
import type { Representada } from "@/lib/representadas";

/**
 * Quem assina.
 *
 * O ativo editorial mais forte do portfólio: oito assinaturas na Marê, dois
 * nomes de peso na GDA, um designer interno na Bux. É o eixo que separa marca
 * de autor de fabricante genérico, e é exatamente o que o arquiteto valoriza —
 * ele defende a escolha para o cliente dele, e um nome ajuda a defender.
 *
 * ⚠️ **Nome e coleção, e nada além.** Sem retrato, sem bio, sem citação. Duas
 * razões, e as duas bastam sozinhas: são pessoas reais, e gerar o rosto de uma
 * pessoa real é falsificação, não ilustração; e a autorização da fábrica para
 * usar nome, bio e imagem dos designers não foi confirmada (P23). Nome próprio
 * publicado pela fábrica no site dela é fato público; o resto não é nosso.
 *
 * ⚠️ **Coleção só onde a atribuição é pública.** A Marê liga designer a coleção
 * no site dela, então a ligação sai aqui. A GDA publica os dois designers e
 * publica cinco coleções, mas não diz quem assinou o quê — e adivinhar por
 * afinidade de nome seria inventar uma ficha técnica. Os dois nomes saem sem
 * coleção, e as coleções dela são renderizadas por `vocabulario.tsx`, sem
 * atribuição, que é onde elas de fato pertencem.
 */
export function AssinaturasDaMarca({
  representada,
  numero,
}: {
  representada: Representada;
  numero: string;
}) {
  if (!representada.designers?.length) return null;

  return (
    <SecaoDaMarca id="assina" numero={numero} titulo="Quem assina.">
      <ul className="mt-8 border-t border-line md:mt-10">
        {representada.designers.map((designer) => (
          <li
            key={designer.nome}
            className="grid gap-x-8 gap-y-2 border-b border-line py-5 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]"
          >
            <p className="text-h3 font-normal">{designer.nome}</p>

            {/* O recuo assenta a coluna da direita na linha de base do nome:
                22px contra 14px na mesma linha da grade desalinham em 9px, e
                numa lista regrada o alinhamento é o argumento. É o mesmo gesto
                que `Ficha` faz no rótulo. */}
            <div className="min-w-0 md:pt-[0.3rem]">
              {/* ⚠️ Grotesca em caixa baixa, e não mono em versal. Nome de
                  coleção é nome próprio, não medida: a Regra da Divisão de
                  Trabalho manda mono para material, formato, contador, código,
                  ano, medida e sigla — nenhum dos sete. E a Regra da Caixa
                  Alta é explícita que dado longo fica em caixa baixa: as doze
                  coleções da Daniela Ferro em versal quebravam em duas linhas
                  de grito e destruíam a leitura da própria lista. */}
              {designer.colecoes?.length ? (
                <p className="text-support text-pretty text-graphite">
                  {designer.colecoes.join(" · ")}
                </p>
              ) : null}
              {designer.nota ? (
                <p className="text-support mt-2 text-pretty text-graphite">
                  {designer.nota}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </SecaoDaMarca>
  );
}
