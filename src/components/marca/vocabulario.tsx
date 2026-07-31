import { SecaoDaMarca } from "@/components/marca/secao";
import type { Representada } from "@/lib/representadas";

/**
 * O vocabulário da fábrica — as palavras dela, não as nossas.
 *
 * É a decisão de 30/07/2026 virando interface: o filtro NUNCA sai da marca, e
 * por isso cada fábrica usa o próprio vocabulário sem precisar ser reconciliada
 * com as outras. Não é preciso casar "espreguiçadeira" da Marê com "chaise" da
 * Bux, nem esperar a Bux definir a taxonomia dela para publicar as outras três.
 * Ver `briefing/estrutura.md` §4.
 *
 * ⚠️ **NÃO HÁ FILTRO NESTA SEÇÃO, e a ausência é a decisão.** `estrutura.md`
 * §3.3 pede filtro de categoria dentro da marca — mas ele foi desenhado para a
 * grade de 12 a 20 PEÇAS, que ainda não existe (P46b). Aqui os conjuntos são de
 * 19, 12 e 5 itens, e um controle que reduz 5 a 2 é teatro: custa o primeiro
 * componente de controle de um sistema que hoje não tem nenhum, e a resposta
 * que ele daria já está na tela inteira. É o mesmo critério que tirou o
 * alternador de densidade da v1.
 *
 * Quando as peças chegarem, o filtro entra NELAS, e entra como link: `?grupo=`
 * em `searchParams`, Server Component intacto, zero JavaScript, navegável pelo
 * teclado por definição, e cada recorte virando URL indexável — que é a mesma
 * decisão de `estrutura.md` §8. Este sistema não tem botão: toda ação é link, e
 * um `<select>` aqui teria sido hábito, não escolha.
 *
 * ⚠️ Na GDA os dois grupos repetem as mesmas seis categorias. Não é defeito de
 * dado: a fábrica faz a mesma linha para externo e interno, e são os títulos
 * dos grupos que carregam a informação. Deduplicar apagaria justamente o que a
 * taxonomia dela diz.
 */
export function VocabularioDaMarca({
  representada,
  numero,
}: {
  representada: Representada;
  numero: string;
}) {
  const vocabulario = representada.vocabulario;
  const colecoes = representada.colecoes;
  /* Taxonomia OU coleções: as duas são vocabulário da fábrica, e exigir a
     primeira para publicar a segunda esconderia as coleções de qualquer marca
     que ainda não declarou taxonomia — a Bux, hoje (P30). */
  if (!vocabulario && !colecoes?.length) return null;

  const temEixo =
    Boolean(vocabulario?.eixo) && (vocabulario?.grupos.length ?? 0) > 1;

  return (
    <SecaoDaMarca
      id="vocabulario"
      numero={numero}
      titulo="O vocabulário da fábrica."
    >
      <p className="text-body mt-6 max-w-[60ch] text-pretty text-graphite">
        {vocabulario ? "As categorias" : "As coleções"} como a{" "}
        {representada.nome} as nomeia. O site não normaliza o vocabulário de
        nenhuma das representadas.
      </p>

      {/* As coleções, quando a fábrica publica os nomes. Elas ficam aqui e não
          em "quem assina" porque a GDA divulga as cinco sem dizer quem assinou
          qual — e adivinhar por afinidade seria inventar ficha técnica. Valem a
          linha porque é assim que o arquiteto COMPÕE: ele navega por tipo
          ("preciso de uma banqueta") e fecha por coleção ("quero tudo Campo
          Belo"). Na Marê as coleções já saem atribuídas, designer a designer. */}
      {colecoes?.length ? (
        <div className="mt-10 border-t border-line pt-5 md:mt-12">
          <h3 className="mono uppercase text-graphite">Coleções</h3>
          <p className="text-support mt-2 max-w-[60ch] text-pretty">
            {colecoes.join(" · ")}
          </p>
        </div>
      ) : null}

      <div className="mt-10 space-y-10 md:mt-12">
        {(vocabulario?.grupos ?? []).map((grupo) => (
          <div key={grupo.slug}>
            {temEixo ? (
              <h3 className="mono uppercase text-graphite">
                {vocabulario?.eixo} · {grupo.nome}
              </h3>
            ) : null}

            {/* Grade regrada de folha de amostrário: o fio de topo entra na
                primeira célula de CADA linha da grade, e por isso o seletor
                muda junto com a contagem de colunas. Sem isso, o fio superior
                aparece só na primeira célula e a tabela abre torta. */}
            <ul
              className={`grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 ${temEixo ? "mt-3" : ""}`}
            >
              {grupo.itens.map((item) => (
                <li
                  key={`${grupo.slug}-${item.nome}`}
                  className="border-b border-line py-3 first:border-t sm:[&:nth-child(2)]:border-t lg:[&:nth-child(3)]:border-t"
                >
                  <p className="text-support">{item.nome}</p>
                  {/* Caixa baixa: "Comercial, resiste a 80 km/h" é frase, e
                      frase inteira não é medida — vai na grotesca. Em versal
                      virava grito numa célula de 3cm. */}
                  {item.nota ? (
                    <p className="text-support mt-1 text-pretty text-graphite">
                      {item.nota}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SecaoDaMarca>
  );
}
