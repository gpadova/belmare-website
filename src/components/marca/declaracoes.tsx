import { Ficha, FichaLinha } from "@/components/ficha";
import { SecaoDaMarca } from "@/components/marca/secao";
import type { Representada } from "@/lib/representadas";

/**
 * O que a fábrica declara.
 *
 * ⚠️ **Nas palavras dela, e só o que ela publica.** Nada aqui é reescrito para
 * soar melhor, e nada é completado por simetria. A GDA declara matéria, polo,
 * prazo e ambiente; a Trisol declara a linha técnica inteira; a Marê declara
 * posicionamento e contagem de coleções, e é só isso que ela declara. Uma
 * quinta linha inventada na Marê para igualar a Trisol destruiria a única coisa
 * que dá autoridade a esta seção: o leitor poder conferir cada valor na fonte.
 *
 * ⚠️ Os limites da Trisol saem como FAIXA — "de 30 a 80 km/h, conforme o
 * modelo" — porque é assim que a fábrica publica. Quebrar a faixa em número por
 * modelo daria uma tabela muito mais bonita e completamente inventada: só o Pub
 * tem número atribuído em fonte pública.
 *
 * ⚠️ Fica de fora o que é aproximação ("cerca de 20 anos" da GDA) e o que é
 * termo comercial de terceiro — exclusividade, território por marca, condição.
 * O segundo leitor silencioso desta página é uma fábrica.
 */
export function DeclaracoesDaMarca({
  representada,
  numero,
}: {
  representada: Representada;
  numero: string;
}) {
  if (!representada.declaracoes?.length) return null;

  return (
    <SecaoDaMarca
      id="declara"
      numero={numero}
      titulo="O que a fábrica informa."
    >
      <Ficha className="mt-8 md:mt-10">
        {representada.declaracoes.map((declaracao) => (
          <FichaLinha key={declaracao.rotulo} rotulo={declaracao.rotulo}>
            {declaracao.valor}
          </FichaLinha>
        ))}
      </Ficha>

      <p className="text-support mt-6 max-w-[60ch] text-pretty text-graphite">
        Dados publicados pela própria fábrica. As medidas, os acabamentos e a
        ficha cotada estão no catálogo dela.
      </p>
    </SecaoDaMarca>
  );
}
